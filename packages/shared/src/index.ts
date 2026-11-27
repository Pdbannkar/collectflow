// CollectFlow — Shared Types, Enums and Constants

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  BUSINESS_OWNER = 'BUSINESS_OWNER',
  BUSINESS_STAFF = 'BUSINESS_STAFF',
  CUSTOMER = 'CUSTOMER',
}

export enum BusinessStatus {
  PENDING = 'PENDING',
  DOCUMENTS_REQUIRED = 'DOCUMENTS_REQUIRED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export enum BusinessCategory {
  SCHOOL = 'SCHOOL',
  TUITION = 'TUITION',
  MESS = 'MESS',
  RENT = 'RENT',
  MOBILE_SHOP = 'MOBILE_SHOP',
  ELECTRONICS = 'ELECTRONICS',
  MEMBERSHIP = 'MEMBERSHIP',
  LENDING = 'LENDING',
  OTHER = 'OTHER',
}

export enum PaymentFrequency {
  ONE_TIME = 'ONE_TIME',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  FORTNIGHTLY = 'FORTNIGHTLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  HALF_YEARLY = 'HALF_YEARLY',
  ANNUALLY = 'ANNUALLY',
  CUSTOM = 'CUSTOM',
}

export enum PaymentPlanStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  INITIATED = 'INITIATED',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  UNKNOWN = 'UNKNOWN',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  REVERSED = 'REVERSED',
}

export enum MandateStatus {
  PENDING = 'PENDING',
  AUTHORISATION_REQUESTED = 'AUTHORISATION_REQUESTED',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  REVOKED = 'REVOKED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
}

export enum PaymentMethod {
  UPI_AUTOPAY = 'UPI_AUTOPAY',
  ENACH = 'ENACH',
  PAYMENT_LINK = 'PAYMENT_LINK',
  UPI_ONE_TIME = 'UPI_ONE_TIME',
  MANUAL = 'MANUAL',
}

export enum GatewayProvider {
  CASHFREE = 'CASHFREE',
  RAZORPAY = 'RAZORPAY',
  PAYU = 'PAYU',
  MANUAL = 'MANUAL',
}

export enum NotificationChannel {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
  PUSH = 'PUSH',
}

export const BUSINESS_CATEGORY_LABELS: Record<BusinessCategory, string> = {
  [BusinessCategory.SCHOOL]: 'School / Educational Institution',
  [BusinessCategory.TUITION]: 'Tuition / Coaching Institute',
  [BusinessCategory.MESS]: 'Mess / Tiffin Service',
  [BusinessCategory.MOBILE_SHOP]: 'Mobile Shop',
  [BusinessCategory.ELECTRONICS]: 'Electronics Shop',
  [BusinessCategory.MEMBERSHIP]: 'Membership / Club',
  [BusinessCategory.LENDING]: 'Lending / Finance (Regulated)',
  [BusinessCategory.OTHER]: 'Other Business',
};

export const PAYMENT_FREQUENCY_LABELS: Record<PaymentFrequency, string> = {
  [PaymentFrequency.ONE_TIME]: 'One-time',
  [PaymentFrequency.DAILY]: 'Daily',
  [PaymentFrequency.WEEKLY]: 'Weekly',
  [PaymentFrequency.FORTNIGHTLY]: 'Fortnightly (Every 2 weeks)',
  [PaymentFrequency.MONTHLY]: 'Monthly',
  [PaymentFrequency.QUARTERLY]: 'Quarterly',
  [PaymentFrequency.HALF_YEARLY]: 'Half-Yearly',
  [PaymentFrequency.ANNUALLY]: 'Annually',
  [PaymentFrequency.CUSTOM]: 'Custom Schedule',
};

// Payment frequency support per provider — true = auto-debit supported
export const PROVIDER_FREQUENCY_SUPPORT: Record<GatewayProvider, Partial<Record<PaymentFrequency, boolean>>> = {
  [GatewayProvider.CASHFREE]: {
    [PaymentFrequency.MONTHLY]: true,
    [PaymentFrequency.QUARTERLY]: true,
    [PaymentFrequency.HALF_YEARLY]: true,
    [PaymentFrequency.ANNUALLY]: true,
    [PaymentFrequency.ONE_TIME]: true,
    [PaymentFrequency.WEEKLY]: false,
    [PaymentFrequency.FORTNIGHTLY]: false,
    [PaymentFrequency.DAILY]: false,
  },
  [GatewayProvider.RAZORPAY]: {
    [PaymentFrequency.MONTHLY]: true,
    [PaymentFrequency.QUARTERLY]: true,
    [PaymentFrequency.HALF_YEARLY]: true,
    [PaymentFrequency.ANNUALLY]: true,
    [PaymentFrequency.ONE_TIME]: true,
    [PaymentFrequency.WEEKLY]: true,
    [PaymentFrequency.FORTNIGHTLY]: false,
    [PaymentFrequency.DAILY]: false,
  },
  [GatewayProvider.PAYU]: {
    [PaymentFrequency.MONTHLY]: true,
    [PaymentFrequency.QUARTERLY]: true,
    [PaymentFrequency.HALF_YEARLY]: true,
    [PaymentFrequency.ANNUALLY]: true,
    [PaymentFrequency.ONE_TIME]: true,
  },
  [GatewayProvider.MANUAL]: {
    [PaymentFrequency.ONE_TIME]: true,
    [PaymentFrequency.DAILY]: true,
    [PaymentFrequency.WEEKLY]: true,
    [PaymentFrequency.FORTNIGHTLY]: true,
    [PaymentFrequency.MONTHLY]: true,
    [PaymentFrequency.QUARTERLY]: true,
    [PaymentFrequency.HALF_YEARLY]: true,
    [PaymentFrequency.ANNUALLY]: true,
    [PaymentFrequency.CUSTOM]: true,
  },
};

export const API_VERSION = 'v1';
export const API_PREFIX = '/api/v1';
