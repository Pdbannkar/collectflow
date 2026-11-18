// CollectFlow Payment Provider Interface
// Every payment gateway adapter must implement this interface.

export interface CustomerInput {
  externalId: string;
  name: string;
  email?: string;
  phone: string;
}

export interface CustomerOutput {
  providerId: string;
  raw: Record<string, unknown>;
}

export interface MandateInput {
  customerId: string;
  maxAmount: number; // in paise
  frequency: string;
  startDate: string;
  endDate?: string;
  description?: string;
  redirectUrl: string;
  notifyUrl: string;
}

export interface MandateOutput {
  mandateId: string;
  authUrl?: string;
  status: string;
  raw: Record<string, unknown>;
}

export interface PaymentInput {
  amount: number; // in paise
  currency: string;
  mandateId?: string;
  customerId?: string;
  orderId: string; // idempotency key
  description: string;
  notifyUrl: string;
  redirectUrl?: string;
}

export interface PaymentOutput {
  paymentId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'UNKNOWN';
  amount: number;
  currency: string;
  raw: Record<string, unknown>;
}

export interface WebhookVerificationInput {
  headers: Record<string, string>;
  rawBody: Buffer | string;
  secret: string;
}

export interface RefundInput {
  paymentId: string;
  amount: number;
  reason: string;
  refundId: string;
}

export interface RefundOutput {
  refundId: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  raw: Record<string, unknown>;
}

export interface WebhookEvent {
  type: string;
  entityId: string;
  status: string;
  raw: Record<string, unknown>;
}

// Every payment gateway adapter must implement this interface
export interface PaymentProvider {
  readonly name: string;
  readonly isSandbox: boolean;

  createCustomer(input: CustomerInput): Promise<CustomerOutput>;
  createMandate(input: MandateInput): Promise<MandateOutput>;
  getMandateStatus(mandateId: string): Promise<MandateOutput>;
  cancelMandate(mandateId: string): Promise<{ success: boolean }>;
  createPayment(input: PaymentInput): Promise<PaymentOutput>;
  collectRecurringPayment(input: PaymentInput): Promise<PaymentOutput>;
  getPaymentStatus(paymentId: string): Promise<PaymentOutput>;
  refundPayment(input: RefundInput): Promise<RefundOutput>;
  verifyWebhook(input: WebhookVerificationInput): boolean;
  parseWebhookEvent(body: Record<string, unknown>): WebhookEvent;
}
