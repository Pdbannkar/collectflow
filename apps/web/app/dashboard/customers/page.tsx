'use client';

import React, { useMemo, useState } from 'react';
import { Phone, Plus, Search, Send, ShieldCheck, Users } from 'lucide-react';
import { useStore, nextDue, daysUntil, dueLabel, planBalance } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { Avatar, Card, EmptyState, PageHeader, Pills } from '@/components/ui';

type Filter = 'ALL' | 'LATE' | 'NO_PLAN';

export default function CustomersPage() {
  const { customers, plans, openSheet, remind } = useStore();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('ALL');

  const rows = useMemo(() => {
    return customers.map((c) => {
      const own = plans.filter((p) => p.customerId === c.id);
      const balance = own.reduce((s, p) => s + planBalance(p), 0);
      const dues = own
        .filter((p) => p.status === 'ACTIVE')
        .map(nextDue)
        .filter((d): d is Date => !!d)
        .sort((a, b) => a.getTime() - b.getTime());
      const next = dues[0] ?? null;
      return { c, planCount: own.length, balance, next, late: !!next && daysUntil(next) < 0 };
    });
  }, [customers, plans]);

  const term = q.trim().toLowerCase();
  const shown = rows.filter(({ c, late, planCount }) => {
    if (filter === 'LATE' && !late) return false;
    if (filter === 'NO_PLAN' && planCount > 0) return false;
    if (!term) return true;
    return c.name.toLowerCase().includes(term) || c.phone.includes(term) || (c.refId ?? '').toLowerCase().includes(term);
  });

  const lateCount = rows.filter((r) => r.late).length;
  const noPlanCount = rows.filter((r) => r.planCount === 0).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} people`}
        action={
          <button onClick={() => openSheet({ type: 'customer' })} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-sm">
            <Plus className="w-4 h-4" /> Add
          </button>
        }
      />

      <div className="space-y-3">
        <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3.5 focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100">
          <Search className="w-5 h-5 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, mobile or ID" className="w-full py-3 text-base focus:outline-none bg-transparent" />
        </div>
        <Pills
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'ALL', label: 'All' },
            { value: 'LATE', label: `Late (${lateCount})` },
            { value: 'NO_PLAN', label: `No plan (${noPlanCount})` },
          ]}
        />
      </div>

      <Card className="overflow-hidden">
        {shown.length === 0 ? (
          <EmptyState
            icon={<Users className="w-6 h-6" />}
            title={customers.length === 0 ? 'No customers yet' : 'No matches'}
            text={customers.length === 0 ? 'Add the people who pay you. You only need a name and mobile number.' : 'Try a different name or number.'}
            action={
              customers.length === 0 && (
                <button onClick={() => openSheet({ type: 'customer' })} className="px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-bold">
                  Add customer
                </button>
              )
            }
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {shown.map(({ c, planCount, balance, next, late }) => (
              <li key={c.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 px-4 sm:px-5 py-4">
                <Avatar name={c.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-semibold text-slate-900 truncate">{c.name}</span>
                    {c.panVerified && <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" aria-label="PAN verified" />}
                  </div>
                  <div className="text-sm text-slate-500">
                    +91 {c.phone}
                    {c.refId && <span className="text-slate-400"> · {c.refId}</span>}
                  </div>
                </div>

                <div className="text-right min-w-[7rem] hidden sm:block">
                  {planCount === 0 ? (
                    <span className="text-sm text-slate-400">No plan yet</span>
                  ) : (
                    <>
                      <div className="text-sm font-bold text-slate-900">{formatCurrency(balance)} left</div>
                      <div className={`text-xs font-medium ${late ? 'text-rose-600' : 'text-slate-500'}`}>{dueLabel(next)}</div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto pl-[3.25rem] sm:pl-0">
                  {planCount > 0 && (
                    <span className={`sm:hidden text-xs font-medium mr-auto ${late ? 'text-rose-600' : 'text-slate-500'}`}>
                      {formatCurrency(balance)} left · {dueLabel(next)}
                    </span>
                  )}
                  <a href={`tel:+91${c.phone}`} title="Call" className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">
                    <Phone className="w-4 h-4" />
                  </a>
                  <button onClick={() => remind(c.id)} title="WhatsApp reminder" className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">
                    <Send className="w-4 h-4" />
                  </button>
                  {planCount === 0 ? (
                    <button onClick={() => openSheet({ type: 'plan', customerId: c.id })} className="px-3.5 py-2 rounded-xl border border-brand-600 text-brand-700 text-sm font-semibold hover:bg-brand-50">
                      + Plan
                    </button>
                  ) : (
                    <button onClick={() => openSheet({ type: 'collect', customerId: c.id })} className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold">
                      Collect
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
