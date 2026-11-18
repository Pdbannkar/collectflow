import axios from 'axios';
import { createHmac, timingSafeEqual } from 'crypto';
import {
  PaymentProvider, CustomerInput, CustomerOutput,
  MandateInput, MandateOutput, PaymentInput, PaymentOutput,
  WebhookVerificationInput, RefundInput, RefundOutput, WebhookEvent,
} from './types';

/**
 * Cashfree Payment Adapter
 * Docs: https://www.cashfree.com/recurring-payment/
 * SANDBOX mode by default — live mode requires admin approval + merchant onboarding.
 */
export class CashfreeAdapter implements PaymentProvider {
  readonly name = 'CASHFREE';
  readonly isSandbox: boolean;
  private readonly baseUrl: string;
  private readonly appId: string;
  private readonly secretKey: string;

  constructor(config: { appId: string; secretKey: string; sandbox?: boolean }) {
    this.appId = config.appId;
    this.secretKey = config.secretKey;
    this.isSandbox = config.sandbox !== false;
    this.baseUrl = this.isSandbox
      ? 'https://sandbox.cashfree.com'
      : 'https://api.cashfree.com';
  }

  private headers() {
    return {
      'x-client-id': this.appId,
      'x-client-secret': this.secretKey,
      'x-api-version': '2023-08-01',
      'Content-Type': 'application/json',
    };
  }

  private sandboxSim<T>(result: T): T {
    return result;
  }

  async createCustomer(input: CustomerInput): Promise<CustomerOutput> {
    if (!this.appId) {
      return this.sandboxSim({ providerId: `SANDBOX_CUST_${input.externalId}`, raw: { simulated: true } });
    }
    const r = await axios.post(`${this.baseUrl}/pg/customers`, {
      customer_id: input.externalId, customer_name: input.name,
      customer_email: input.email || '', customer_phone: input.phone,
    }, { headers: this.headers() });
    return { providerId: r.data.customer_id, raw: r.data };
  }

  async createMandate(input: MandateInput): Promise<MandateOutput> {
    if (!this.appId) {
      return this.sandboxSim({
        mandateId: `SANDBOX_MANDATE_${Date.now()}`,
        authUrl: 'https://sandbox.cashfree.com/mock-auth',
        status: 'PENDING', raw: { simulated: true },
      });
    }
    const r = await axios.post(`${this.baseUrl}/pg/subscriptions`, {
      subscription_id: `SUB_${Date.now()}`, customer_id: input.customerId,
      authorization_amount: input.maxAmount / 100,
      return_url: input.redirectUrl, notify_url: input.notifyUrl,
    }, { headers: this.headers() });
    return { mandateId: r.data.subscription_id, authUrl: r.data.auth_link, status: r.data.status, raw: r.data };
  }

  async getMandateStatus(mandateId: string): Promise<MandateOutput> {
    if (!this.appId) return this.sandboxSim({ mandateId, status: 'ACTIVE', raw: { simulated: true } });
    const r = await axios.get(`${this.baseUrl}/pg/subscriptions/${mandateId}`, { headers: this.headers() });
    return { mandateId: r.data.subscription_id, status: r.data.status, raw: r.data };
  }

  async cancelMandate(mandateId: string): Promise<{ success: boolean }> {
    if (!this.appId) return { success: true };
    await axios.post(`${this.baseUrl}/pg/subscriptions/${mandateId}/cancel`, {}, { headers: this.headers() });
    return { success: true };
  }

  async createPayment(input: PaymentInput): Promise<PaymentOutput> {
    if (!this.appId) {
      return this.sandboxSim({ paymentId: `SANDBOX_PAY_${input.orderId}`, status: 'PENDING', amount: input.amount, currency: input.currency, raw: { simulated: true } });
    }
    const r = await axios.post(`${this.baseUrl}/pg/orders`, {
      order_id: input.orderId, order_amount: input.amount / 100,
      order_currency: input.currency,
      order_meta: { notify_url: input.notifyUrl, return_url: input.redirectUrl },
    }, { headers: this.headers() });
    return { paymentId: r.data.cf_order_id, status: 'PENDING', amount: input.amount, currency: input.currency, raw: r.data };
  }

  async collectRecurringPayment(input: PaymentInput): Promise<PaymentOutput> {
    if (!this.appId) {
      return this.sandboxSim({ paymentId: `SANDBOX_REC_${input.orderId}`, status: 'PENDING', amount: input.amount, currency: input.currency, raw: { simulated: true } });
    }
    const r = await axios.post(`${this.baseUrl}/pg/subscriptions/${input.mandateId}/payments`, {
      payment_id: input.orderId, payment_amount: input.amount / 100,
    }, { headers: this.headers() });
    return { paymentId: r.data.payment_id, status: 'PENDING', amount: input.amount, currency: input.currency, raw: r.data };
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentOutput> {
    if (!this.appId) return this.sandboxSim({ paymentId, status: 'UNKNOWN', amount: 0, currency: 'INR', raw: { simulated: true } });
    const r = await axios.get(`${this.baseUrl}/pg/payments/${paymentId}`, { headers: this.headers() });
    const status = r.data.payment_status === 'SUCCESS' ? 'SUCCESS' : r.data.payment_status === 'FAILED' ? 'FAILED' : r.data.payment_status === 'PENDING' ? 'PENDING' : 'UNKNOWN';
    return { paymentId: r.data.cf_payment_id, status, amount: r.data.payment_amount * 100, currency: r.data.payment_currency, raw: r.data };
  }

  async refundPayment(input: RefundInput): Promise<RefundOutput> {
    if (!this.appId) return this.sandboxSim({ refundId: input.refundId, status: 'PENDING', raw: { simulated: true } });
    const r = await axios.post(`${this.baseUrl}/pg/payments/${input.paymentId}/refunds`, {
      refund_id: input.refundId, refund_amount: input.amount / 100, refund_note: input.reason,
    }, { headers: this.headers() });
    return { refundId: r.data.refund_id, status: r.data.refund_status === 'SUCCESS' ? 'SUCCESS' : 'PENDING', raw: r.data };
  }

  verifyWebhook(input: WebhookVerificationInput): boolean {
    const { headers, rawBody, secret } = input;
    const timestamp = headers['x-webhook-timestamp'];
    const signature = headers['x-webhook-signature'];
    if (!timestamp || !signature) return false;
    const body = typeof rawBody === 'string' ? rawBody : rawBody.toString();
    const expected = createHmac('sha256', secret).update(`${timestamp}${body}`).digest('base64');
    try { return timingSafeEqual(Buffer.from(signature), Buffer.from(expected)); } catch { return false; }
  }

  parseWebhookEvent(body: Record<string, unknown>): WebhookEvent {
    const data = (body.data as Record<string, unknown>) || {};
    const payment = (data.payment as Record<string, unknown>) || {};
    const subscription = (data.subscription as Record<string, unknown>) || {};
    return {
      type: (body.type as string) || 'UNKNOWN',
      entityId: (payment.cf_payment_id as string) || (subscription.subscription_id as string) || '',
      status: (payment.payment_status as string) || (subscription.status as string) || 'UNKNOWN',
      raw: body,
    };
  }
}
