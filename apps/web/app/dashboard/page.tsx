'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, CalendarClock, Check, IndianRupee, Send, UserPlus, CalendarPlus } from 'lucide-react';
import { useStore, nextDue, daysUntil, dueLabel, startOfToday } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { Avatar, Card, StatusBadge } from '@/components/ui';

export default function HomePage() {
  const { customers, plans, payments, customerById, openSheet, remind } = useStore();

  const stats = useMemo(() => {
    const today = startOfToday();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const paid = payments.filter((p) => p.status === 'SUCCESS');
    const sum = (list: typeof paid) => list.reduce((s, p) => s + p.amount, 0);
    const todayList = paid.filter((p) => new Date(p.date) >= today);
    const monthList = paid.filter((p) => new Date(p.date) >= monthStart);

    const open = plans
      .filter((p) => p.status === 'ACTIVE')
      .map((p) => ({ plan: p, due: nextDue(p) }))
      .filter((x): x is { plan: typeof x.plan; due: Date } => !!x.due);

    const late = open.filter((x) => daysUntil(x.due) < 0).sort((a, b) => a.due.getTime() - b.due.getTime());
    const dueSoon = open
      .filter((x) => daysUntil(x.due) >= 0 && daysUntil(x.due) <= 7)
      .sort((a, b) => a.due.getTime() - b.due.getTime());

    return {
      today: sum(todayList),
      todayCount: todayList.length,
      month: sum(monthList),
      monthCount: monthList.length,
      late,
      lateTotal: late.reduce((s, x) => s + x.plan.amount, 0),
      dueSoon,
      dueSoonTotal: dueSoon.reduce((s, x) => s + x.plan.amount, 0),
    };
  }, [plans, payments]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const isNew = customers.length === 0 || plans.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{greeting} 👋</h2>
        <p className="text-sm text-slate-500 mt-1">
          {stats.late.length > 0
            ? `${stats.late.length} ${stats.late.length === 1 ? 'payment is' : 'payments are'} late. Start with those below.`
            : 'Everything is on time. Nice work!'}
        </p>
      </div>

      {/* Getting started */}
      {isNew && (
        <Card className="p-5 space-y-3">
          <h3 className="text-base font-bold text-slate-900">Get started in 3 steps</h3>
          {[
            { done: customers.length > 0, label: 'Add your first customer', icon: UserPlus, onClick: () => openSheet({ type: 'customer' }) },
            { done: plans.length > 0, label: 'Set up how much they pay and how often', icon: CalendarPlus, onClick: () => openSheet({ type: 'plan' }) },
            { done: payments.length > 0, label: 'Collect your first payment', icon: IndianRupee, onClick: () => openSheet({ type: 'collect' }) },
          ].map((s, i) => (
            <button key={i} onClick={s.onClick} disabled={s.done} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-left disabled:opacity-60">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s.done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {s.done ? <Check className="w-4 h-4" /> : i + 1}
              </span>
              <span className="flex-1 text-sm font-semibold text-slate-800">{s.label}</span>
              {!s.done && <ArrowRight className="w-4 h-4 text-slate-400" />}
            </button>
          ))}
        </Card>
      )}

      {/* Key numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Stat label="Received today" value={formatCurrency(stats.today)} note={`${stats.todayCount} payments`} tone="emerald" />
        <Stat label="This month" value={formatCurrency(stats.month)} note={`${stats.monthCount} payments`} tone="brand" />
        <Stat label="Late" value={formatCurrency(stats.lateTotal)} note={`${stats.late.length} customers`} tone="rose" />
        <Stat label="Due in 7 days" value={formatCurrency(stats.dueSoonTotal)} note={`${stats.dueSoon.length} customers`} tone="amber" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Late */}
        <Card className="overflow-hidden">
          <SectionHead icon={<AlertTriangle className="w-5 h-5 text-rose-500" />} title="Late payments" count={stats.late.length} />
          {stats.late.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-slate-500">No one is late. 🎉</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stats.late.map(({ plan, due }) => {
                const c = customerById(plan.customerId);
                if (!c) return null;
                return (
                  <DueRow
                    key={plan.id}
                    name={c.name}
                    detail={`${plan.name} · ${dueLabel(due)}`}
                    detailCls="text-rose-600"
                    amount={plan.amount}
                    onRemind={() => remind(c.id)}
                    onCollect={() => openSheet({ type: 'collect', customerId: c.id, planId: plan.id })}
                  />
                );
              })}
            </ul>
          )}
        </Card>

        {/* Coming up */}
        <Card className="overflow-hidden">
          <SectionHead icon={<CalendarClock className="w-5 h-5 text-amber-500" />} title="Coming up this week" count={stats.dueSoon.length} />
          {stats.dueSoon.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-slate-500">Nothing due in the next 7 days.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stats.dueSoon.map(({ plan, due }) => {
                const c = customerById(plan.customerId);
                if (!c) return null;
                return (
                  <DueRow
                    key={plan.id}
                    name={c.name}
                    detail={`${plan.name} · ${dueLabel(due)}${plan.autopay ? ' · AutoPay' : ''}`}
                    amount={plan.amount}
                    onRemind={plan.autopay ? undefined : () => remind(c.id)}
                    onCollect={() => openSheet({ type: 'collect', customerId: c.id, planId: plan.id })}
                  />
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {/* Recent */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-base font-bold text-slate-900">Recent payments</h3>
          <Link href="/dashboard/payments" className="text-sm font-semibold text-brand-700 inline-flex items-center gap-1">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ul className="divide-y divide-slate-100">
          {payments.slice(0, 5).map((p) => {
            const c = customerById(p.customerId);
            return (
              <li key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar name={c?.name ?? '?'} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">{c?.name}</div>
                  <div className="text-xs text-slate-500">
                    {p.method} · {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900">{formatCurrency(p.amount)}</div>
                  <StatusBadge status={p.status} />
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

const TONES = {
  emerald: 'text-emerald-600',
  brand: 'text-brand-600',
  rose: 'text-rose-600',
  amber: 'text-amber-600',
};

function Stat({ label, value, note, tone }: { label: string; value: string; note: string; tone: keyof typeof TONES }) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{value}</div>
      <div className={`text-xs font-semibold mt-1 ${TONES[tone]}`}>{note}</div>
    </Card>
  );
}

function SectionHead({ icon, title, count }: { icon: React.ReactNode; title: string; count: number }) {
  return (
    <div className="flex items-center gap-2 px-5 pt-5 pb-3">
      {icon}
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <span className="ml-auto text-xs font-bold text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">{count}</span>
    </div>
  );
}

function DueRow({
  name, detail, detailCls = 'text-slate-500', amount, onRemind, onCollect,
}: {
  name: string; detail: string; detailCls?: string; amount: number; onRemind?: () => void; onCollect: () => void;
}) {
  return (
    <li className="flex items-center gap-3 px-5 py-3.5">
      <Avatar name={name} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-slate-900 truncate">{name}</div>
        <div className={`text-xs truncate ${detailCls}`}>{detail}</div>
      </div>
      <div className="text-sm font-bold text-slate-900 hidden sm:block">{formatCurrency(amount)}</div>
      {onRemind && (
        <button onClick={onRemind} title="Send WhatsApp reminder" className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">
          <Send className="w-4 h-4" />
        </button>
      )}
      <button onClick={onCollect} className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold">
        Collect
      </button>
    </li>
  );
}
