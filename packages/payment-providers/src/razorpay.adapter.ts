import axios from 'axios';
import { createHmac, timingSafeEqual } from 'crypto';
import {
  PaymentProvider, CustomerInput, CustomerOutput,
  MandateInput, MandateOutput, PaymentInput, PaymentOutput,
  WebhookVerificationInput, RefundInput, RefundOutput, WebhookEvent,
} from './types';

/**
 * Razorpay Payment Adapter
 * Docs: https://razorpay.com/docs/
 */
export class RazorpayAdapter implements PaymentProvider {
  readonly name = 'RAZORPAY';
  readonly isSandbox: boolean;
  private readonly baseUrl = 'https://api.razorpay.com/v1';
  private readonly keyId: string;
  private readonly keySecret: string;

  constructor(config: { keyId: string; keySecret: string; sandbox?: boolean }) {
    this.keyId = config.keyId;
    this.keySecret = config.keySecret;
    this.isSandbox = config.sandbox !== false;
  }

  private authHeader() {
    const token = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');
    return { Authorization: `Basic ${token}`, 'Content-Type': 'application/json' };
  }

  async createCustomer(input: CustomerInput): Promise<CustomerOutput> {
    if (!this.keyId) return { providerId: `rz_cust_sandbox_${input.externalId}`, raw: { simulated: true } };
    const r = await axios.post(`${this.baseUrl}/customers`, { name: input.name, email: input.email || '', contact: input.phone }, { headers: this.authHeader() });
    return { providerId: r.data.id, raw: r.data };
  }

  async createMandate(input: MandateInput): Promise<MandateOutput> {
    if (!this.keyId) return { mandateId: `rz_sub_sandbox_${Date.now()}`, authUrl: 'https://rzp.io/mock', status: 'created', raw: { simulated: true } };
    const r = await axios.post(`${this.baseUrl}/subscriptions`, {
      customer_notify: 1, quantity: 1, total_count: 999,
      start_at: Math.floor(new Date(input.startDate).getTime() / 1000),
      notify_info: { notify_url: input.notifyUrl },
    }, { headers: this.authHeader() });
    return { mandateId: r.data.id, authUrl: r.data.short_url, status: r.data.status, raw: r.data };
  }

  async getMandateStatus(mandateId: string): Promise<MandateOutput> {
    if (!this.keyId) return { mandateId, status: 'active', raw: { simulated: true } };
    const r = await axios.get(`${this.baseUrl}/subscriptions/${mandateId}`, { headers: this.authHeader() });
    return { mandateId: r.data.id, status: r.data.status, raw: r.data };
  }

  async cancelMandate(mandateId: string): Promise<{ success: boolean }> {
    if (!this.keyId) return { success: true };
    await axios.post(`${this.baseUrl}/subscriptions/${mandateId}/cancel`, {}, { headers: this.authHeader() });
    return { success: true };
  }

  async createPayment(input: PaymentInput): Promise<PaymentOutput> {
    if (!this.keyId) return { paymentId: `rz_pay_sandbox_${input.orderId}`, status: 'PENDING', amount: input.amount, currency: input.currency, raw: { simulated: true } };
    const r = await axios.post(`${this.baseUrl}/orders`, { amount: input.amount, currency: input.currency, receipt: input.orderId }, { headers: this.authHeader() });
    return { paymentId: r.data.id, status: 'PENDING', amount: input.amount, currency: input.currency, raw: r.data };
  }

  async collectRecurringPayment(input: PaymentInput): Promise<PaymentOutput> {
    return this.createPayment(input);
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentOutput> {
    if (!this.keyId) return { paymentId, status: 'UNKNOWN', amount: 0, currency: 'INR', raw: { simulated: true } };
    const r = await axios.get(`${this.baseUrl}/payments/${paymentId}`, { headers: this.authHeader() });
    const status = r.data.status === 'captured' ? 'SUCCESS' : r.data.status === 'failed' ? 'FAILED' : 'PENDING';
    return { paymentId: r.data.id, status, amount: r.data.amount, currency: r.data.currency, raw: r.data };
  }

  async refundPayment(input: RefundInput): Promise<RefundOutput> {
    if (!this.keyId) return { refundId: input.refundId, status: 'PENDING', raw: { simulated: true } };
    const r = await axios.post(`${this.baseUrl}/payments/${input.paymentId}/refund`, { amount: input.amount }, { headers: this.authHeader() });
    return { refundId: r.data.id, status: 'PENDING', raw: r.data };
  }

  verifyWebhook(input: WebhookVerificationInput): boolean {
    const signature = input.headers['x-razorpay-signature'];
    if (!signature) return false;
    const body = typeof input.rawBody === 'string' ? input.rawBody : input.rawBody.toString();
    const expected = createHmac('sha256', input.secret).update(body).digest('hex');
    try { return timingSafeEqual(Buffer.from(signature), Buffer.from(expected)); } catch { return false; }
  }

  parseWebhookEvent(body: Record<string, unknown>): WebhookEvent {
    const payload = (body.payload as Record<string, unknown>) || {};
    const paymentEntity = ((payload.payment as Record<string, unknown>)?.entity as Record<string, unknown>) || {};
    return {
      type: (body.event as string) || 'unknown',
      entityId: (paymentEntity.id as string) || '',
      status: (paymentEntity.status as string) || 'unknown',
      raw: body,
    };
  }
}
