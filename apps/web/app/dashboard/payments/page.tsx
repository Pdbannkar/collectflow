'use client';

import React, { useState } from 'react';
import { Download, Plus, Receipt, Search, Send } from 'lucide-react';
import { useStore, PayStatus } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { Avatar, Card, EmptyState, PageHeader, Pills, StatusBadge } from '@/components/ui';

type Filter = 'ALL' | PayStatus;

export default function PaymentsPage() {
  const { payments, plans, customerById, openSheet, remind, showToast } = useStore();
  const [filter, setFilter] = useState<Filter>('ALL');
  const [q, setQ] = useState('');

  const term = q.trim().toLowerCase();
  const shown = payments.filter((p) => {
    if (filter !== 'ALL' && p.status !== filter) return false;
    if (!term) return true;
    const c = customerById(p.customerId);
    return (c?.name ?? '').toLowerCase().includes(term) || (c?.phone ?? '').includes(term);
  });
  const n = (s: PayStatus) => payments.filter((p) => p.status === s).length;

  const exportCsv = () => {
    const rows = [['Date', 'Customer', 'Mobile', 'For', 'Amount', 'Method', 'Status']];
    shown.forEach((p) => {
      const c = customerById(p.customerId);
      rows.push([
        new Date(p.date).toLocaleString('en-IN'),
        c?.name ?? '',
        c?.phone ?? '',
        plans.find((x) => x.id === p.planId)?.name ?? 'One-time',
        String(p.amount),
        p.method,
        p.status,
      ]);
    });
    const csv = rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Payments"
        subtitle="Every payment you have received or are waiting for."
        action={
          <div className="flex gap-2">
            <button onClick={exportCsv} title="Download CSV" className="p-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
              <Download className="w-5 h-5" />
            </button>
            <button onClick={() => openSheet({ type: 'collect' })} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-sm">
              <Plus className="w-4 h-4" /> Collect
            </button>
          </div>
        }
      />

      <div className="space-y-3">
        <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3.5 focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100">
          <Search className="w-5 h-5 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or mobile" className="w-full py-3 text-base focus:outline-none bg-transparent" />
        </div>
        <Pills
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'ALL', label: 'All' },
            { value: 'SUCCESS', label: `Paid (${n('SUCCESS')})` },
            { value: 'PENDING', label: `Waiting (${n('PENDING')})` },
            { value: 'FAILED', label: `Failed (${n('FAILED')})` },
          ]}
        />
      </div>

      <Card className="overflow-hidden">
        {shown.length === 0 ? (
          <EmptyState icon={<Receipt className="w-6 h-6" />} title="No payments" text="Payments you collect will show up here." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {shown.map((p) => {
              const c = customerById(p.customerId);
              const plan = plans.find((x) => x.id === p.planId);
              return (
                <li key={p.id} className="flex items-center gap-3 px-4 sm:px-5 py-4">
                  <Avatar name={c?.name ?? '?'} />
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold text-slate-900 truncate">{c?.name ?? 'Unknown'}</div>
                    <div className="text-sm text-slate-500 truncate">
                      {plan?.name ?? 'One-time'} · {p.method} ·{' '}
                      {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                    {p.reason && <div className="text-xs text-rose-600 mt-0.5">{p.reason}</div>}
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-base font-bold text-slate-900">{formatCurrency(p.amount)}</div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="hidden sm:block w-28 text-right">
                    {p.status === 'SUCCESS' ? (
                      <button onClick={() => showToast(`Receipt sent to ${c?.name} on WhatsApp.`)} className="text-sm font-semibold text-brand-700 hover:underline">
                        Send receipt
                      </button>
                    ) : (
                      <button onClick={() => remind(p.customerId)} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
                        <Send className="w-3.5 h-3.5" /> Remind
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
