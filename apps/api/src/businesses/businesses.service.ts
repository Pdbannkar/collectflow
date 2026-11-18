import { Injectable, NotFoundException, ForbiddenException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class BusinessesService {
  private readonly logger = new Logger(BusinessesService.name);

  constructor(private prisma: PrismaService) {}

  async register(data: any, ownerId: string) {
    const existing = await this.prisma.business.findFirst({ where: { ownerId } });
    if (existing) throw new ConflictException('You already have a registered business.');

    const baseSlug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const slugExists = await this.prisma.business.findUnique({ where: { slug: baseSlug } });
    const slug = slugExists ? `${baseSlug}-${Date.now()}` : baseSlug;

    const business = await this.prisma.business.create({
      data: {
        name: data.name, slug, category: data.category,
        ownerId, phone: data.phone, email: data.email,
        address: data.address, city: data.city, state: data.state,
        pinCode: data.pinCode, pan: data.pan, gstin: data.gstin,
        businessType: data.businessType, website: data.website,
        description: data.description, status: 'PENDING',
      },
    });

    await this.prisma.businessMember.create({
      data: { businessId: business.id, userId: ownerId, role: 'OWNER' },
    });

    const freePlan = await this.prisma.subscriptionPlan.findFirst({ where: { tier: 'FREE_TRIAL' } });
    if (freePlan) {
      const trialEnd = new Date(Date.now() + freePlan.trialDays * 864e5);
      await this.prisma.businessSubscription.create({
        data: {
          businessId: business.id, planId: freePlan.id, status: 'TRIAL',
          billingCycle: 'MONTHLY', currentPeriodStart: new Date(),
          currentPeriodEnd: trialEnd, trialEndsAt: trialEnd,
        },
      });
    }

    this.logger.log(`Business registered: ${business.name} (${business.id})`);
    return business;
  }

  async getByOwnerId(ownerId: string) {
    return this.prisma.business.findFirst({
      where: { ownerId },
      include: { subscription: { include: { plan: true } }, members: { where: { isActive: true } } },
    });
  }

  async getById(id: string, user: any) {
    const biz = await this.prisma.business.findUnique({
      where: { id },
      include: { subscription: { include: { plan: true } } },
    });
    if (!biz) throw new NotFoundException('Business not found.');
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN' && user.businessId !== id) {
      throw new ForbiddenException('Access denied.');
    }
    return biz;
  }

  async update(id: string, data: any, user: any) {
    await this.getById(id, user);
    return this.prisma.business.update({
      where: { id },
      data: {
        name: data.name, phone: data.phone, email: data.email,
        address: data.address, city: data.city, state: data.state,
        pinCode: data.pinCode, website: data.website,
        description: data.description, gstin: data.gstin,
      },
    });
  }

  async getDashboardMetrics(businessId: string, user: any) {
    await this.getById(businessId, user);

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayTx, monthTx, totalCustomers, activeCustomers, activePlans, pendingSchedules, failedPayments] = await Promise.all([
      this.prisma.transaction.aggregate({ where: { businessId, status: 'SUCCESS', recordedAt: { gte: today } }, _sum: { amount: true }, _count: true }),
      this.prisma.transaction.aggregate({ where: { businessId, status: 'SUCCESS', recordedAt: { gte: monthStart } }, _sum: { amount: true }, _count: true }),
      this.prisma.customer.count({ where: { businessId } }),
      this.prisma.customer.count({ where: { businessId, status: 'ACTIVE' } }),
      this.prisma.paymentPlan.count({ where: { businessId, status: 'ACTIVE' } }),
      this.prisma.paymentSchedule.count({ where: { businessId, status: { in: ['PENDING', 'DUE', 'OVERDUE'] } } }),
      this.prisma.paymentAttempt.count({ where: { businessId, status: 'FAILED', createdAt: { gte: monthStart } } }),
    ]);

    return {
      today: { collections: Number(todayTx._sum.amount || 0), count: todayTx._count },
      month: { collections: Number(monthTx._sum.amount || 0), count: monthTx._count },
      customers: { total: totalCustomers, active: activeCustomers },
      plans: { active: activePlans },
      schedules: { pending: pendingSchedules },
      payments: { failed: failedPayments },
    };
  }
}
