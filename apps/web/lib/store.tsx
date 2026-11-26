'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────
export type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
export type PayMethod = 'Cash' | 'UPI' | 'Bank Transfer' | 'UPI AutoPay' | 'Payment Link';
export type PayStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  refId?: string;
  email?: string;
  pan?: string;
  panVerified?: boolean;
}

export interface Plan {
  id: string;
  customerId: string;
  name: string;
  amount: number; // per instalment
  frequency: Frequency;
  count: number; // number of instalments
  paidCount: number;
  startDate: string; // yyyy-mm-dd
  status: 'ACTIVE' | 'PAUSED';
  autopay: boolean;
}

export interface Payment {
  id: string;
  customerId: string;
  planId?: string;
  amount: number;
  method: PayMethod;
  status: PayStatus;
  date: string; // ISO
  reason?: string;
}

export type Sheet =
  | { type: 'customer' }
  | { type: 'plan'; customerId?: string }
  | { type: 'collect'; customerId?: string; planId?: string }
  | null;

// ─── Helpers ────────────────────────────────────────────────────────────
export const FREQ_LABEL: Record<Frequency, string> = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  QUARTERLY: 'Every 3 months',
};

export const FREQ_UNIT: Record<Frequency, string> = {
  DAILY: 'day',
  WEEKLY: 'week',
  MONTHLY: 'month',
  QUARTERLY: '3 months',
};

export function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addPeriods(start: string, freq: Frequency, n: number): Date {
  const d = new Date(start + 'T00:00:00');
  if (freq === 'DAILY') d.setDate(d.getDate() + n);
  if (freq === 'WEEKLY') d.setDate(d.getDate() + 7 * n);
  if (freq === 'MONTHLY') d.setMonth(d.getMonth() + n);
  if (freq === 'QUARTERLY') d.setMonth(d.getMonth() + 3 * n);
  return d;
}

export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Next unpaid due date, or null when the plan is fully paid. */
export function nextDue(plan: Plan): Date | null {
  if (plan.paidCount >= plan.count) return null;
  return addPeriods(plan.startDate, plan.frequency, plan.paidCount);
}

export function daysUntil(d: Date) {
  return Math.round((d.getTime() - startOfToday().getTime()) / 86_400_000);
}

export function dueLabel(d: Date | null) {
  if (!d) return 'Fully paid';
  const n = daysUntil(d);
  if (n < -1) return `${-n} days late`;
  if (n === -1) return '1 day late';
  if (n === 0) return 'Due today';
  if (n === 1) return 'Due tomorrow';
  return `Due in ${n} days`;
}

export function planBalance(plan: Plan) {
  return Math.max(0, (plan.count - plan.paidCount) * plan.amount);
}

// ─── Seed data (relative to today so the demo always looks current) ─────
function seed() {
  const today = startOfToday();
  const shift = (days: number, hours = 10) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    d.setHours(hours, 15);
    return d;
  };
  // start date such that the next due (after `paid` instalments) lands `offset` days from today
  const startFor = (freq: Frequency, paid: number, offset: number) => {
    const target = shift(offset);
    const d = new Date(target);
    if (freq === 'MONTHLY') d.setMonth(d.getMonth() - paid);
    if (freq === 'QUARTERLY') d.setMonth(d.getMonth() - 3 * paid);
    if (freq === 'WEEKLY') d.setDate(d.getDate() - 7 * paid);
    if (freq === 'DAILY') d.setDate(d.getDate() - paid);
    return toISODate(d);
  };

  const customers: Customer[] = [
    { id: 'C1', name: 'Aarav Sharma', phone: '9811122233', refId: 'STU-081', pan: 'ABCPS1234A', panVerified: true },
    { id: 'C2', name: 'Kavita Deshmukh', phone: '9822334455', refId: 'STU-092' },
    { id: 'C3', name: 'Sunil Verma', phone: '9833445566', refId: 'STU-114' },
    { id: 'C4', name: 'Pooja Iyer', phone: '9844556677', refId: 'STU-150' },
    { id: 'C5', name: 'Nitin Gadkari', phone: '9855667788', refId: 'STU-188' },
    { id: 'C6', name: 'Mohit Rao', phone: '9866778899', refId: 'STU-201' },
  ];

  const plans: Plan[] = [
    { id: 'P1', customerId: 'C1', name: 'Monthly Tuition', amount: 3500, frequency: 'MONTHLY', count: 12, paidCount: 7, startDate: startFor('MONTHLY', 7, 13), status: 'ACTIVE', autopay: true },
    { id: 'P2', customerId: 'C2', name: 'Bus & Lab Fee', amount: 4200, frequency: 'MONTHLY', count: 10, paidCount: 8, startDate: startFor('MONTHLY', 8, 3), status: 'ACTIVE', autopay: true },
    { id: 'P3', customerId: 'C3', name: 'Term Fee', amount: 8000, frequency: 'QUARTERLY', count: 3, paidCount: 2, startDate: startFor('QUARTERLY', 2, -2), status: 'ACTIVE', autopay: false },
    { id: 'P4', customerId: 'C4', name: 'Activity Fee', amount: 2500, frequency: 'QUARTERLY', count: 4, paidCount: 4, startDate: startFor('QUARTERLY', 4, 0), status: 'ACTIVE', autopay: true },
    { id: 'P5', customerId: 'C5', name: 'Phone EMI', amount: 2400, frequency: 'MONTHLY', count: 6, paidCount: 3, startDate: startFor('MONTHLY', 3, -10), status: 'ACTIVE', autopay: true },
    { id: 'P6', customerId: 'C6', name: 'Monthly Fee', amount: 3200, frequency: 'MONTHLY', count: 12, paidCount: 4, startDate: startFor('MONTHLY', 4, 0), status: 'ACTIVE', autopay: false },
  ];

  const payments: Payment[] = [
    { id: 'T1', customerId: 'C1', planId: 'P1', amount: 3500, method: 'UPI AutoPay', status: 'SUCCESS', date: shift(0, 9).toISOString() },
    { id: 'T2', customerId: 'C2', planId: 'P2', amount: 4200, method: 'UPI AutoPay', status: 'SUCCESS', date: shift(0, 8).toISOString() },
    { id: 'T3', customerId: 'C3', planId: 'P3', amount: 8000, method: 'Payment Link', status: 'PENDING', date: shift(-1, 16).toISOString() },
    { id: 'T4', customerId: 'C4', planId: 'P4', amount: 2500, method: 'Cash', status: 'SUCCESS', date: shift(-2, 18).toISOString() },
    { id: 'T5', customerId: 'C5', planId: 'P5', amount: 2400, method: 'UPI AutoPay', status: 'FAILED', date: shift(-10, 5).toISOString(), reason: 'Not enough balance' },
    { id: 'T6', customerId: 'C6', planId: 'P6', amount: 3200, method: 'UPI', status: 'SUCCESS', date: shift(-12, 11).toISOString() },
  ];

  return { customers, plans, payments };
}

// ─── Store ──────────────────────────────────────────────────────────────
interface StoreValue {
  customers: Customer[];
  plans: Plan[];
  payments: Payment[];
  customerById: (id: string) => Customer | undefined;
  addCustomer: (c: Omit<Customer, 'id'>) => Customer;
  addPlan: (p: Omit<Plan, 'id' | 'paidCount' | 'status'>) => Plan;
  togglePlan: (id: string) => void;
  recordPayment: (p: { customerId: string; planId?: string; amount: number; method: PayMethod }) => void;
  remind: (customerId: string) => void;
  sheet: Sheet;
  openSheet: (s: Sheet) => void;
  closeSheet: () => void;
  toast: string;
  showToast: (msg: string) => void;
  resetDemo: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);
const STORAGE_KEY = 'collectflow_demo_v2';
const uid = (prefix: string) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(seed);
  const [loaded, setLoaded] = useState(false);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, loaded]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? '' : t)), 3500);
  }, []);

  const value = useMemo<StoreValue>(() => {
    const customerById = (id: string) => data.customers.find((c) => c.id === id);
    return {
      ...data,
      customerById,
      addCustomer: (c) => {
        const created = { ...c, id: uid('C') };
        setData((d) => ({ ...d, customers: [created, ...d.customers] }));
        return created;
      },
      addPlan: (p) => {
        const created: Plan = { ...p, id: uid('P'), paidCount: 0, status: 'ACTIVE' };
        setData((d) => ({ ...d, plans: [created, ...d.plans] }));
        const name = customerById(p.customerId)?.name ?? 'customer';
        showToast(p.autopay ? `Plan created. AutoPay link sent to ${name} on WhatsApp.` : `Plan created for ${name}.`);
        return created;
      },
      togglePlan: (id) => {
        setData((d) => ({
          ...d,
          plans: d.plans.map((p) => (p.id === id ? { ...p, status: p.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : p)),
        }));
      },
      recordPayment: ({ customerId, planId, amount, method }) => {
        const payment: Payment = { id: uid('T'), customerId, planId, amount, method, status: 'SUCCESS', date: new Date().toISOString() };
        setData((d) => ({
          ...d,
          payments: [payment, ...d.payments],
          plans: d.plans.map((p) =>
            p.id === planId ? { ...p, paidCount: Math.min(p.count, p.paidCount + Math.max(1, Math.round(amount / p.amount))) } : p,
          ),
        }));
        showToast(`₹${amount.toLocaleString('en-IN')} received from ${customerById(customerId)?.name ?? 'customer'}. Receipt sent.`);
      },
      remind: (customerId) => {
        showToast(`Reminder sent to ${customerById(customerId)?.name ?? 'customer'} on WhatsApp.`);
      },
      sheet,
      openSheet: setSheet,
      closeSheet: () => setSheet(null),
      toast,
      showToast,
      resetDemo: () => {
        setData(seed());
        showToast('Demo data reset.');
      },
    };
  }, [data, sheet, toast, showToast]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
