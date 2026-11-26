'use client';

import React, { useState } from 'react';
import { CalendarClock, Pause, Play, Plus, Zap } from 'lucide-react';
import { useStore, nextDue, daysUntil, dueLabel, FREQ_LABEL } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { Card, EmptyState, PageHeader, Pills } from '@/components/ui';

type Filter = 'ACTIVE' | 'PAUSED' | 'DONE';

export default function PlansPage() {
  const { plans, customerById, openSheet, togglePlan, showToast } = useStore();
  const [filter, setFilter] = useState<Filter>('ACTIVE');

  const isDone = (p: (typeof plans)[number]) => p.paidCount >= p.count;
  const shown = plans.filter((p) =>
    filter === 'DONE' ? isDone(p) : !isDone(p) && p.status === filter,
  );
  const count = (f: Filter) => plans.filter((p) => (f === 'DONE' ? isDone(p) : !isDone(p) && p.status === f)).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Payment plans"
        subtitle="Who pays how much, and how often."
        action={
          <button onClick={() => openSheet({ type: 'plan' })} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-sm">
            <Plus className="w-4 h-4" /> New plan
          </button>
        }
      />

      <Pills
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'ACTIVE', label: `Running (${count('ACTIVE')})` },
          { value: 'PAUSED', label: `Paused (${count('PAUSED')})` },
          { value: 'DONE', label: `Completed (${count('DONE')})` },
        ]}
      />

      {shown.length === 0 ? (
        <Card>
          <EmptyState
            icon={<CalendarClock className="w-6 h-6" />}
            title="Nothing here"
            text={filter === 'ACTIVE' ? 'Create a plan to start collecting regularly.' : 'No plans in this list.'}
            action={
              filter === 'ACTIVE' && (
                <button onClick={() => openSheet({ type: 'plan' })} className="px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-bold">
                  New plan
                </button>
              )
            }
          />
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {shown.map((plan) => {
            const c = customerById(plan.customerId);
            const due = nextDue(plan);
            const late = !!due && daysUntil(due) < 0;
            const pct = Math.round((plan.paidCount / plan.count) * 100);
            const done = isDone(plan);
            return (
              <Card key={plan.id} className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-base font-bold text-slate-900 truncate">{c?.name ?? 'Unknown'}</div>
                    <div className="text-sm text-slate-500">{plan.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-slate-900">{formatCurrency(plan.amount)}</div>
                    <div className="text-xs text-slate-500">{FREQ_LABEL[plan.frequency]}</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold text-slate-700">
                      {plan.paidCount} of {plan.count} paid
                    </span>
                    <span className={`font-medium ${done ? 'text-emerald-600' : late ? 'text-rose-600' : 'text-slate-500'}`}>
                      {plan.status === 'PAUSED' && !done ? 'Paused' : dueLabel(due)}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${done ? 'bg-emerald-500' : 'bg-brand-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold mr-auto whitespace-nowrap ${plan.autopay ? 'text-emerald-700' : 'text-slate-500'}`}>
                    <Zap className="w-3.5 h-3.5" />
                    {plan.autopay ? 'AutoPay on' : 'Manual'}
                  </span>
                  {!done && (
                    <>
                      <button
                        onClick={() => {
                          togglePlan(plan.id);
                          showToast(plan.status === 'ACTIVE' ? 'Plan paused.' : 'Plan resumed.');
                        }}
                        title={plan.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                      >
                        {plan.status === 'ACTIVE' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      {plan.autopay && (
                        <button
                          onClick={() => showToast(`AutoPay link sent again to ${c?.name}.`)}
                          className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                        >
                          Resend link
                        </button>
                      )}
                      <button
                        onClick={() => openSheet({ type: 'collect', customerId: plan.customerId, planId: plan.id })}
                        className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold"
                      >
                        Collect
                      </button>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
