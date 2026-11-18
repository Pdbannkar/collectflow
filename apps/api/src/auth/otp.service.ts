import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  constructor(private cfg: ConfigService) {}

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(phone: string, otp: string): Promise<void> {
    if (this.cfg.get('NODE_ENV') === 'development' || this.cfg.get('SMS_PROVIDER') === 'console') {
      this.logger.log(`[DEV OTP] ${phone} → ${otp}`);
      return;
    }
    // Production: add MSG91 / Twilio integration here using cfg values
    this.logger.warn('SMS provider not configured — OTP not sent');
  }
}
