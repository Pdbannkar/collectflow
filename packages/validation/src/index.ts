import { z } from 'zod';

const indianPhone = z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number (10 digits, starts 6-9)');

export const SendOtpSchema = z.object({
  phone: indianPhone,
  purpose: z.enum(['login', 'register', 'verify']),
});

export const VerifyOtpSchema = z.object({
  phone: indianPhone,
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
  purpose: z.enum(['login', 'register', 'verify']),
});

export const BusinessRegistrationSchema = z.object({
  name: z.string().min(2, 'Business name too short').max(200),
  category: z.enum(['SCHOOL','TUITION','MESS','MOBILE_SHOP','ELECTRONICS','MEMBERSHIP','LENDING','OTHER']),
  ownerName: z.string().min(2).max(100),
  phone: indianPhone,
  email: z.string().email('Invalid email address'),
  address: z.string().min(5).max(500),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  pinCode: z.string().regex(/^\d{6}$/, 'PIN code must be 6 digits'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format').optional(),
  gstin: z.string().optional(),
  businessType: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().max(1000).optional(),
});

export const CustomerSchema = z.object({
  fullName: z.string().min(2, 'Name too short').max(200),
  phone: indianPhone,
  email: z.string().email().optional().or(z.literal('')),
  referenceId: z.string().max(100).optional(),
  address: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
});

export const PaymentPlanSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  name: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  totalAmount: z.number().positive('Total amount must be positive'),
  instalmentAmount: z.number().positive('Instalment amount must be positive'),
  frequency: z.enum(['ONE_TIME','DAILY','WEEKLY','FORTNIGHTLY','MONTHLY','QUARTERLY','HALF_YEARLY','ANNUALLY','CUSTOM']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  numberOfInstalments: z.number().int().positive().optional(),
  dueDayOfMonth: z.number().int().min(1).max(28).optional(),
  gracePeriodDays: z.number().int().min(0).max(30).default(0),
  paymentMethod: z.enum(['UPI_AUTOPAY','ENACH','PAYMENT_LINK','UPI_ONE_TIME','MANUAL']),
  requiresMandate: z.boolean().default(false),
  notes: z.string().max(1000).optional(),
});

export type SendOtpDto = z.infer<typeof SendOtpSchema>;
export type VerifyOtpDto = z.infer<typeof VerifyOtpSchema>;
export type BusinessRegistrationDto = z.infer<typeof BusinessRegistrationSchema>;
export type CustomerDto = z.infer<typeof CustomerSchema>;
export type PaymentPlanDto = z.infer<typeof PaymentPlanSchema>;
