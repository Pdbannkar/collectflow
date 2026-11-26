'use client';

import React, { useMemo, useState } from 'react';
import { CheckCircle2, ChevronDown, RefreshCw, ShieldCheck } from 'lucide-react';
import {
  useStore, Frequency, PayMethod, FREQ_LABEL, FREQ_UNIT, addPeriods, toISODate, nextDue, dueLabel, planBalance,
} from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { validatePanFormat, verifyPanAutomatically } from '@/lib/pan-verification';
import { Sheet, Field, Pills, PrimaryButton, inputCls } from './ui';

export function GlobalSheets() {
  const { sheet } = useStore();
  if (!sheet) return null;
  if (sheet.type === 'customer') return <CustomerSheet />;
  if (sheet.type === 'plan') return <PlanSheet key={sheet.customerId ?? 'new'} customerId={sheet.customerId} />;
  return <CollectSheet key={`${sheet.customerId}-${sheet.planId}`} customerId={sheet.customerId} planId={sheet.planId} />;
}

// ─── Add customer: name + phone, everything else optional ───────────────
function CustomerSheet() {
  const { addCustomer, closeSheet, openSheet } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [refId, setRefId] = useState('');
  const [email, setEmail] = useState('');
  const [pan, setPan] = useState('');
  const [panState, setPanState] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');
  const [panMsg, setPanMsg] = useState('');
  const [saved, setSaved] = useState<{ id: string; name: string } | null>(null);

  const valid = name.trim().length > 1 && phone.length === 10;

  const checkPan = async () => {
    const clean = pan.trim().toUpperCase();
    const fmt = validatePanFormat(clean);
    if (!fmt.valid) {
      setPanState('error');
      setPanMsg(fmt.error || 'PAN should look like ABCDE1234F');
      return;
    }
    setPanState('checking');
    try {
      const r = await verifyPanAutomatically(clean, name);
      if (r.valid) {
        setPanState('ok');
        setPanMsg(r.registeredName ? `Verified: ${r.registeredName}` : 'Verified');
        if (!name && r.registeredName) setName(r.registeredName);
      } else {
        setPanState('error');
        setPanMsg('Could not verify this PAN.');
      }
    } catch {
      setPanState('error');
      setPanMsg('Verification is not responding. You can save without it.');
    }
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const c = addCustomer({
      name: name.trim(),
      phone,
      refId: refId.trim() || undefined,
      email: email.trim() || undefined,
      pan: pan.trim().toUpperCase() || undefined,
      panVerified: panState === 'ok',
    });
    setSaved({ id: c.id, name: c.name });
  };

  if (saved) {
    return (
      <Sheet title="Customer added" onClose={closeSheet}>
        <div className="text-center space-y-5">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
          <div>
            <p className="text-lg font-bold text-slate-900">{saved.name} is saved</p>
            <p className="text-sm text-slate-500 mt-1">Next, choose how much they pay and how often.</p>
          </div>
          <PrimaryButton onClick={() => openSheet({ type: 'plan', customerId: saved.id })}>
            Set up a payment plan
          </PrimaryButton>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => openSheet({ type: 'collect', customerId: saved.id })} className="py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Collect one-time
            </button>
            <button onClick={closeSheet} className="py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Done
            </button>
          </div>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet title="Add customer" subtitle="Only name and mobile number are needed." onClose={closeSheet}>
      <form onSubmit={save} className="space-y-4">
        <Field label="Full name">
          <input autoFocus className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sumanth Patel" />
        </Field>
        <Field label="Mobile number" hint="Reminders and receipts go here on WhatsApp.">
          <div className="flex items-stretch rounded-xl border border-slate-300 overflow-hidden focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100">
            <span className="px-3.5 flex items-center bg-slate-50 text-slate-600 font-semibold border-r border-slate-200">+91</span>
            <input
              type="tel"
              inputMode="numeric"
              className="w-full px-3.5 py-3 text-base focus:outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="98765 43210"
            />
          </div>
        </Field>

        <button type="button" onClick={() => setShowMore(!showMore)} className="flex items-center gap-1 text-sm font-semibold text-brand-700">
          <ChevronDown className={`w-4 h-4 transition-transform ${showMore ? 'rotate-180' : ''}`} />
          {showMore ? 'Hide extra details' : 'Add extra details (optional)'}
        </button>

        {showMore && (
          <div className="space-y-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="grid grid-cols-2 gap-3">
              <Field label="ID / Roll no.">
                <input className={inputCls} value={refId} onChange={(e) => setRefId(e.target.value)} placeholder="STU-09" />
              </Field>
              <Field label="Email">
                <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@gmail.com" />
              </Field>
            </div>
            <Field label="PAN card">
              <div className="flex gap-2">
                <input
                  className={`${inputCls} font-mono uppercase tracking-wider`}
                  maxLength={10}
                  value={pan}
                  onChange={(e) => {
                    setPan(e.target.value.toUpperCase());
                    setPanState('idle');
                  }}
                  placeholder="ABCDE1234F"
                />
                <button
                  type="button"
                  onClick={checkPan}
                  disabled={pan.length !== 10 || panState === 'checking'}
                  className="px-4 rounded-xl bg-slate-900 text-white text-sm font-semibold disabled:opacity-40 inline-flex items-center gap-1.5"
                >
                  {panState === 'checking' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  Verify
                </button>
              </div>
              {panState === 'ok' && <p className="text-sm text-emerald-700 mt-1.5 font-medium">✓ {panMsg}</p>}
              {panState === 'error' && <p className="text-sm text-rose-600 mt-1.5">{panMsg}</p>}
            </Field>
          </div>
        )}

        <PrimaryButton type="submit" disabled={!valid}>Save customer</PrimaryButton>
      </form>
    </Sheet>
  );
}

// ─── New payment plan with a live plain-language summary ────────────────
const PRESETS = ['Monthly Fee', 'Tuition', 'EMI', 'Membership', 'Tiffin / Mess'];

function PlanSheet({ customerId }: { customerId?: string }) {
  const { customers, addPlan, closeSheet, openSheet } = useStore();
  const [cust, setCust] = useState(customerId ?? '');
  const [name, setName] = useState('Monthly Fee');
  const [amount, setAmount] = useState('');
  const [freq, setFreq] = useState<Frequency>('MONTHLY');
  const [count, setCount] = useState(12);
  const [start, setStart] = useState(() => toISODate(new Date()));
  const [autopay, setAutopay] = useState(true);

  const amt = Number(amount) || 0;
  const valid = !!cust && amt > 0 && count > 0 && name.trim().length > 0;
  const lastDate = useMemo(() => addPeriods(start, freq, count - 1), [start, freq, count]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    addPlan({ customerId: cust, name: name.trim(), amount: amt, frequency: freq, count, startDate: start, autopay });
    closeSheet();
  };

  if (customers.length === 0) {
    return (
      <Sheet title="New payment plan" onClose={closeSheet}>
        <p className="text-sm text-slate-600 mb-4">Add a customer first, then you can set up their plan.</p>
        <PrimaryButton onClick={() => openSheet({ type: 'customer' })}>Add customer</PrimaryButton>
      </Sheet>
    );
  }

  return (
    <Sheet title="New payment plan" subtitle="Decide who pays, how much, and how often." onClose={closeSheet}>
      <form onSubmit={save} className="space-y-5">
        <Field label="Customer">
          <select className={inputCls} value={cust} onChange={(e) => setCust(e.target.value)}>
            <option value="" disabled>Choose a customer…</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name} · {c.phone}</option>
            ))}
          </select>
          <button type="button" onClick={() => openSheet({ type: 'customer' })} className="text-sm font-semibold text-brand-700 mt-1.5">
            + New customer
          </button>
        </Field>

        <Field label="What is it for?">
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {PRESETS.map((p) => (
              <button type="button" key={p} onClick={() => setName(p)} className={`px-3 py-1 rounded-full text-xs font-semibold ${name === p ? 'bg-brand-100 text-brand-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {p}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Amount each time">
          <div className="flex items-stretch rounded-xl border border-slate-300 overflow-hidden focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100">
            <span className="px-3.5 flex items-center bg-slate-50 text-slate-600 font-bold border-r border-slate-200">₹</span>
            <input type="number" inputMode="numeric" min={1} className="w-full px-3.5 py-3 text-lg font-bold focus:outline-none" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="2000" />
          </div>
        </Field>

        <Field label="How often?">
          <Pills
            value={freq}
            onChange={setFreq}
            options={(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY'] as Frequency[]).map((f) => ({ value: f, label: FREQ_LABEL[f] }))}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="How many times?">
            <div className="flex items-center rounded-xl border border-slate-300 overflow-hidden">
              <button type="button" onClick={() => setCount(Math.max(1, count - 1))} className="px-4 py-3 text-lg font-bold text-slate-600 hover:bg-slate-50">−</button>
              <input type="number" min={1} className="w-full text-center text-base font-bold py-3 focus:outline-none" value={count} onChange={(e) => setCount(Math.max(1, Number(e.target.value) || 1))} />
              <button type="button" onClick={() => setCount(count + 1)} className="px-4 py-3 text-lg font-bold text-slate-600 hover:bg-slate-50">+</button>
            </div>
          </Field>
          <Field label="First payment on">
            <input type="date" className={inputCls} value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
        </div>

        <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" checked={autopay} onChange={(e) => setAutopay(e.target.checked)} className="mt-0.5 w-5 h-5 accent-brand-600" />
          <span>
            <span className="block text-sm font-semibold text-slate-900">Collect automatically (UPI AutoPay)</span>
            <span className="block text-xs text-slate-500 mt-0.5">We send the customer a one-time approval link on WhatsApp. After that, money is taken on each due date.</span>
          </span>
        </label>

        {amt > 0 && (
          <div className="p-4 rounded-2xl bg-brand-50 text-brand-900 text-sm leading-relaxed">
            <strong>{formatCurrency(amt)}</strong> every {FREQ_UNIT[freq]}, {count} {count === 1 ? 'time' : 'times'} ={' '}
            <strong>{formatCurrency(amt * count)}</strong> total.
            <br />
            From {formatDate(start)} to {formatDate(lastDate)}.
          </div>
        )}

        <PrimaryButton type="submit" disabled={!valid}>
          {autopay ? 'Create plan & send link' : 'Create plan'}
        </PrimaryButton>
      </form>
    </Sheet>
  );
}

// ─── Collect / record a payment (cash, UPI, bank) ───────────────────────
function CollectSheet({ customerId, planId }: { customerId?: string; planId?: string }) {
  const { customers, plans, recordPayment, closeSheet, openSheet } = useStore();
  const [cust, setCust] = useState(customerId ?? '');
  const custPlans = plans.filter((p) => p.customerId === cust && p.paidCount < p.count);
  const [plan, setPlan] = useState<string>(planId ?? custPlans[0]?.id ?? '');
  const selectedPlan = plans.find((p) => p.id === plan);
  const [amount, setAmount] = useState(selectedPlan ? String(selectedPlan.amount) : '');
  const [method, setMethod] = useState<PayMethod>('Cash');

  const pickCustomer = (id: string) => {
    setCust(id);
    const first = plans.find((p) => p.customerId === id && p.paidCount < p.count);
    setPlan(first?.id ?? '');
    setAmount(first ? String(first.amount) : '');
  };

  const pickPlan = (id: string) => {
    setPlan(id);
    const p = plans.find((x) => x.id === id);
    if (p) setAmount(String(p.amount));
  };

  const amt = Number(amount) || 0;
  const valid = !!cust && amt > 0;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    recordPayment({ customerId: cust, planId: plan || undefined, amount: amt, method });
    closeSheet();
  };

  return (
    <Sheet title="Collect payment" subtitle="Record money you received. A receipt is sent automatically." onClose={closeSheet}>
      <form onSubmit={save} className="space-y-5">
        <Field label="From">
          <select autoFocus={!customerId} className={inputCls} value={cust} onChange={(e) => pickCustomer(e.target.value)}>
            <option value="" disabled>Choose a customer…</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name} · {c.phone}</option>
            ))}
          </select>
          <button type="button" onClick={() => openSheet({ type: 'customer' })} className="text-sm font-semibold text-brand-700 mt-1.5">
            + New customer
          </button>
        </Field>

        {cust && custPlans.length > 0 && (
          <Field label="For">
            <div className="space-y-2">
              {custPlans.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => pickPlan(p.id)}
                  className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between ${plan === p.id ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-100' : 'border-slate-300 hover:bg-slate-50'}`}
                >
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">{p.name}</span>
                    <span className="block text-xs text-slate-500">{dueLabel(nextDue(p))} · {formatCurrency(planBalance(p))} left</span>
                  </span>
                  <span className="text-sm font-bold text-slate-900">{formatCurrency(p.amount)}</span>
                </button>
              ))}
              <button type="button" onClick={() => setPlan('')} className={`w-full text-left p-3.5 rounded-xl border text-sm font-semibold ${plan === '' ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-100' : 'border-slate-300 hover:bg-slate-50'} text-slate-700`}>
                Something else (one-time)
              </button>
            </div>
          </Field>
        )}

        <Field label="Amount received">
          <div className="flex items-stretch rounded-xl border border-slate-300 overflow-hidden focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100">
            <span className="px-3.5 flex items-center bg-slate-50 text-slate-600 font-bold border-r border-slate-200">₹</span>
            <input type="number" inputMode="numeric" min={1} className="w-full px-3.5 py-3 text-2xl font-extrabold focus:outline-none" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
          </div>
        </Field>

        <Field label="Paid by">
          <Pills
            value={method}
            onChange={setMethod}
            options={[
              { value: 'Cash', label: 'Cash' },
              { value: 'UPI', label: 'UPI / QR' },
              { value: 'Bank Transfer', label: 'Bank transfer' },
            ]}
          />
        </Field>

        <PrimaryButton type="submit" disabled={!valid}>
          {amt > 0 ? `Save ${formatCurrency(amt)}` : 'Save payment'}
        </PrimaryButton>
      </form>
    </Sheet>
  );
}
