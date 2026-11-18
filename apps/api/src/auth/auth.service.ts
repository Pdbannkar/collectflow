import {
  Injectable, UnauthorizedException, BadRequestException, Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { OtpService } from './otp.service';
import { SendOtpDto, VerifyOtpDto } from './dto/auth.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private cfg: ConfigService,
    private otpSvc: OtpService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    const { phone, purpose } = dto;

    // Rate limit: max 3 OTPs per minute
    const recent = await this.prisma.otpToken.count({
      where: { phone, purpose, createdAt: { gte: new Date(Date.now() - 60000) } },
    });
    if (recent >= 3) throw new BadRequestException('Too many OTP requests. Wait 1 minute.');

    // Invalidate old OTPs
    await this.prisma.otpToken.updateMany({
      where: { phone, purpose, verified: false },
      data: { expiresAt: new Date() },
    });

    const otp = this.otpSvc.generateOtp();
    const expiresAt = new Date(Date.now() + this.cfg.get<number>('OTP_EXPIRES_MINUTES', 10) * 60000);
    const user = await this.prisma.user.findUnique({ where: { phone } });

    await this.prisma.otpToken.create({ data: { phone, otp, purpose, expiresAt, userId: user?.id } });
    await this.otpSvc.sendOtp(phone, otp);

    this.logger.log(`OTP sent [${purpose}] to ${phone.slice(0,6)}XXXX`);
    return {
      message: 'OTP sent successfully',
      expiresIn: this.cfg.get<number>('OTP_EXPIRES_MINUTES', 10) * 60,
      ...(this.cfg.get('NODE_ENV') === 'development' ? { otp } : {}),
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { phone, otp, purpose } = dto;

    const record = await this.prisma.otpToken.findFirst({
      where: { phone, purpose, verified: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!record) throw new UnauthorizedException('OTP expired or not found. Request a new one.');

    const maxAttempts = this.cfg.get<number>('OTP_MAX_ATTEMPTS', 5);
    if (record.attempts >= maxAttempts) {
      await this.prisma.otpToken.update({ where: { id: record.id }, data: { expiresAt: new Date() } });
      throw new UnauthorizedException('Too many failed attempts. Request a new OTP.');
    }

    await this.prisma.otpToken.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } });
    if (record.otp !== otp) throw new UnauthorizedException('Invalid OTP.');

    await this.prisma.otpToken.update({ where: { id: record.id }, data: { verified: true } });

    let user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user && purpose === 'register') {
      user = await this.prisma.user.create({ data: { phone, role: 'BUSINESS_OWNER' } });
    } else if (!user) {
      throw new UnauthorizedException('User not found. Please register first.');
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const membership = await this.prisma.businessMember.findFirst({
      where: { userId: user.id, isActive: true },
      include: { business: { select: { id: true, name: true, status: true } } },
    });

    const tokens = await this.generateTokens(user, membership?.businessId);
    return {
      user: {
        id: user.id, phone: user.phone, email: user.email,
        name: user.name, role: user.role,
        businessId: membership?.businessId || null,
        business: membership?.business || null,
      },
      ...tokens,
    };
  }

  private async generateTokens(user: any, businessId?: string | null) {
    const payload = { sub: user.id, phone: user.phone, role: user.role, businessId: businessId || null };
    const accessToken = this.jwt.sign(payload);
    const refreshToken = uuidv4();
    await this.prisma.refreshToken.create({
      data: { userId: user.id, token: refreshToken, expiresAt: new Date(Date.now() + 30 * 864e5) },
    });
    return { accessToken, refreshToken };
  }

  async refreshToken(token: string) {
    const rec = await this.prisma.refreshToken.findUnique({ where: { token }, include: { user: true } });
    if (!rec || rec.expiresAt < new Date()) throw new UnauthorizedException('Invalid or expired refresh token.');
    const membership = await this.prisma.businessMember.findFirst({ where: { userId: rec.user.id, isActive: true } });
    return this.generateTokens(rec.user, membership?.businessId);
  }

  async logout(userId: string, refreshToken: string) {
    if (refreshToken) await this.prisma.refreshToken.deleteMany({ where: { userId, token: refreshToken } });
    return { message: 'Logged out successfully' };
  }

  async validateUser(payload: any) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) return null;
    return { id: user.id, phone: user.phone, email: user.email, name: user.name, role: user.role, businessId: payload.businessId };
  }
}
