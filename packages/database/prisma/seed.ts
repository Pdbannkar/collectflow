import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding CollectFlow demo data...');

  // --- Subscription Plans ---
  const freePlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'plan-free' },
    update: {},
    create: {
      id: 'plan-free', name: 'Free Trial', tier: 'FREE_TRIAL',
      monthlyPrice: 0, annualPrice: 0,
      maxCustomers: 50, maxPlans: 10, maxStaff: 1, trialDays: 30,
      features: { reports: false, bulkImport: false, whatsapp: false },
    },
  });

  await prisma.subscriptionPlan.upsert({
    where: { id: 'plan-basic' },
    update: {},
    create: {
      id: 'plan-basic', name: 'Basic', tier: 'BASIC',
      monthlyPrice: 999, annualPrice: 9990,
      maxCustomers: 500, maxPlans: 100, maxStaff: 3, trialDays: 0,
      features: { reports: true, bulkImport: true, whatsapp: false },
    },
  });

  await prisma.subscriptionPlan.upsert({
    where: { id: 'plan-pro' },
    update: {},
    create: {
      id: 'plan-pro', name: 'Professional', tier: 'PROFESSIONAL',
      monthlyPrice: 2499, annualPrice: 24990,
      maxCustomers: null, maxPlans: null, maxStaff: 10, trialDays: 0,
      features: { reports: true, bulkImport: true, whatsapp: true, api: true },
    },
  });

  await prisma.subscriptionPlan.upsert({
    where: { id: 'plan-enterprise' },
    update: {},
    create: {
      id: 'plan-enterprise', name: 'Enterprise', tier: 'ENTERPRISE',
      monthlyPrice: 7999, annualPrice: 79990,
      maxCustomers: null, maxPlans: null, maxStaff: 50, trialDays: 0,
      features: { reports: true, bulkImport: true, whatsapp: true, api: true, dedicatedSupport: true },
    },
  });

  // --- Super Admin ---
  await prisma.user.upsert({
    where: { phone: '9999999999' },
    update: {},
    create: { phone: '9999999999', email: 'admin@collectflow.in', name: 'Super Admin', role: 'SUPER_ADMIN' },
  });

  // --- Demo Businesses ---
  const demoBiz = [
    { id: 'biz-school', name: 'Sunrise School', slug: 'sunrise-school', category: 'SCHOOL' as const, phone: '9800000001', email: 'admin@sunriseschool.in', city: 'Pune', state: 'Maharashtra' },
    { id: 'biz-tuition', name: 'Bright Future Tuition', slug: 'bright-future-tuition', category: 'TUITION' as const, phone: '9800000002', email: 'info@brightfuture.in', city: 'Bangalore', state: 'Karnataka' },
    { id: 'biz-mess', name: 'Fresh Mess', slug: 'fresh-mess', category: 'MESS' as const, phone: '9800000003', email: 'orders@freshmess.in', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'biz-mobile', name: 'Smart Mobile Store', slug: 'smart-mobile-store', category: 'MOBILE_SHOP' as const, phone: '9800000004', email: 'sales@smartmobile.in', city: 'Delhi', state: 'Delhi' },
    { id: 'biz-electronics', name: 'City Electronics', slug: 'city-electronics', category: 'ELECTRONICS' as const, phone: '9800000005', email: 'info@cityelectronics.in', city: 'Chennai', state: 'Tamil Nadu' },
  ];

  for (const biz of demoBiz) {
    const owner = await prisma.user.upsert({
      where: { phone: biz.phone },
      update: {},
      create: { phone: biz.phone, email: biz.email, name: `${biz.name} Owner`, role: 'BUSINESS_OWNER' },
    });

    await prisma.business.upsert({
      where: { id: biz.id },
      update: {},
      create: {
        id: biz.id, name: `[DEMO] ${biz.name}`, slug: biz.slug,
        category: biz.category, ownerId: owner.id,
        phone: biz.phone, email: biz.email,
        address: '123 Main Street', city: biz.city, state: biz.state,
        pinCode: '400001', status: 'APPROVED',
      },
    });

    await prisma.businessMember.upsert({
      where: { businessId_userId: { businessId: biz.id, userId: owner.id } },
      update: {},
      create: { businessId: biz.id, userId: owner.id, role: 'OWNER' },
    });

    const now = new Date();
    const trialEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    await prisma.businessSubscription.upsert({
      where: { businessId: biz.id },
      update: {},
      create: {
        businessId: biz.id, planId: freePlan.id, status: 'TRIAL',
        billingCycle: 'MONTHLY', currentPeriodStart: now,
        currentPeriodEnd: trialEnd, trialEndsAt: trialEnd,
      },
    });
  }

  // --- Gateway Configs ---
  await prisma.gatewayConfig.upsert({
    where: { provider: 'CASHFREE' },
    update: {},
    create: { provider: 'CASHFREE', isEnabled: true, config: { sandboxMode: true, note: 'Set CASHFREE_APP_ID and CASHFREE_SECRET_KEY in .env to activate' } },
  });

  await prisma.gatewayConfig.upsert({
    where: { provider: 'RAZORPAY' },
    update: {},
    create: { provider: 'RAZORPAY', isEnabled: true, config: { sandboxMode: true, note: 'Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env to activate' } },
  });

  // --- Admin Settings ---
  const settings = [
    { key: 'platform.name', value: 'CollectFlow' },
    { key: 'platform.supportEmail', value: 'support@collectflow.in' },
    { key: 'platform.maintenanceMode', value: false },
    { key: 'otp.expiryMinutes', value: 10 },
    { key: 'otp.maxAttempts', value: 5 },
    { key: 'payment.maxRetryAttempts', value: 3 },
    { key: 'payment.retryDelayHours', value: 24 },
  ];

  for (const s of settings) {
    await prisma.adminSetting.upsert({
      where: { key: s.key },
      update: {},
      create: { key: s.key, value: s.value },
    });
  }

  console.log('Demo data seeded!');
  console.log('Super Admin login: phone=9999999999 (OTP shown in dev console)');
  demoBiz.forEach(b => console.log(`  Business: ${b.name} — phone: ${b.phone}`));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
