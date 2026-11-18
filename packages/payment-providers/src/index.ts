export * from './types';
export * from './cashfree.adapter';
export * from './razorpay.adapter';

import { PaymentProvider } from './types';
import { CashfreeAdapter } from './cashfree.adapter';
import { RazorpayAdapter } from './razorpay.adapter';

export type ProviderName = 'CASHFREE' | 'RAZORPAY' | 'PAYU' | 'MANUAL';

export function createPaymentProvider(
  name: ProviderName,
  config: Record<string, string | boolean>,
): PaymentProvider {
  switch (name) {
    case 'CASHFREE':
      return new CashfreeAdapter({
        appId: config.appId as string || '',
        secretKey: config.secretKey as string || '',
        sandbox: config.sandbox !== false,
      });
    case 'RAZORPAY':
      return new RazorpayAdapter({
        keyId: config.keyId as string || '',
        keySecret: config.keySecret as string || '',
        sandbox: config.sandbox !== false,
      });
    default:
      throw new Error(`Provider "${name}" not yet implemented. Use MANUAL for manual payment recording.`);
  }
}
