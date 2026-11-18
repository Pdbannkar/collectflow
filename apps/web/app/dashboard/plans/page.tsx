'use client';

import React, { useState } from 'react';
import {
  CreditCard, Plus, CheckCircle2, Clock, PauseCircle,
  PlayCircle, XCircle, ArrowRight, RefreshCw, Send, FileText
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function PaymentPlansPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [plans, setPlans] = useState([
    {
      id: 'PLAN-101',
      name: 'Class 8 Annual Tuition',
      customer: 'Aarav Sharma',
      phone: '9811122233',
      totalAmount: 42000,
      instalmentAmount: 3500,
      frequency: 'MONTHLY',
      paidAmount: 24500,
      status: 'ACTIVE',
      mandateStatus: 'ACTIVE',
      nextDue: '2026-12-10',
    },
    {
      id: 'PLAN-102',
      name: 'Class 9 Bus & Laboratory Fee',
      customer: 'Kavita Deshmukh',
      phone: '9822334455',
      totalAmount: 42000,
      instalmentAmount: 4200,
      frequency: 'MONTHLY',
      paidAmount: 33600,
      status: 'ACTIVE',
      mandateStatus: 'ACTIVE',
      nextDue: '2026-12-10',
    },
    {
      id: 'PLAN-103',
      name: 'Term 2 Tuition Fee',
      customer: 'Sunil Verma',
      phone: '9833445566',
      totalAmount: 24000,
      instalmentAmount: 8000,
      frequency: 'QUARTERLY',
      paidAmount: 16000,
      status: 'ACTIVE',
      mandateStatus: 'PENDING_AUTH',
      nextDue: '2026-11-25',
    },
    {
      id: 'PLAN-104',
      name: 'Smartphone 6-Month 0% EMI',
      customer: 'Nitin Gadkari',
      phone: '9855667788',
      totalAmount: 14400,
      instalmentAmount: 2400,
      frequency: 'MONTHLY',
      paidAmount: 9000,
      status: 'PAUSED',
      mandateStatus: 'FAILED',
      nextDue: '2026-11-17',
    },
  ]);

  const [newPlan, setNewPlan] = useState({
    name: '',
    customer: 'Aarav Sharma',
    totalAmount: '12000',
    instalmentAmount: '2000',
    frequency: 'MONTHLY',
    startDate: '2026-12-01',
    requiresMandate: true,
  });

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `PLAN-${Date.now().toString().slice(-3)}`,
      name: newPlan.name,
      customer: newPlan.customer,
      phone: '9811122233',
      totalAmount: Number(newPlan.totalAmount),
      instalmentAmount: Number(newPlan.instalmentAmount),
      frequency: newPlan.frequency,
      paidAmount: 0,
      status: 'ACTIVE',
      mandateStatus: newPlan.requiresMandate ? 'PENDING_AUTH' : 'NOT_REQUIRED',
      nextDue: newPlan.startDate,
    };

    setPlans([created, ...plans]);
    setShowCreateModal(false);
    setToastMsg(`Plan "${newPlan.name}" created! AutoPay authorization link sent.`);
    setTimeout(() => setToastMsg(''), 4500);
  };

  const handleToggleStatus = (id: string, current: string) => {
    const nextStatus = current === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    setPlans(plans.map((p) => (p.id === id ? { ...p, status: nextStatus } : p)));
    setToastMsg(`Plan status updated to ${nextStatus}.`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white font-medium text-xs shadow-lg flex items-center justify-between">
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg('')} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recurring Payment Plans</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Set up fee schedules, course instalments, and AutoPay debit rules.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white bg-brand-600 hover:bg-brand-700 text-xs font-bold shadow-md shadow-brand-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Plan
        </button>
      </div>

      {/* Plans List */}
      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => {
          const progress = Math.round((plan.paidAmount / plan.totalAmount) * 100);
          return (
            <div key={plan.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
              
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">{plan.id}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{plan.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Customer: <strong className="text-slate-800">{plan.customer}</strong>
                  </p>
                </div>

                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  plan.status === 'ACTIVE'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {plan.status}
                </span>
              </div>

              {/* Amount Breakdown */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Instalment Amount:</span>
                  <span className="text-base font-extrabold text-brand-700 mt-0.5 block">
                    {formatCurrency(plan.instalmentAmount)}
                  </span>
                  <span className="text-[10px] text-slate-500">{plan.frequency} cycle</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Total Plan Value:</span>
                  <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                    {formatCurrency(plan.totalAmount)}
                  </span>
                  <span className="text-[10px] text-slate-500">Next due: {formatDate(plan.nextDue)}</span>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1.5">
                  <span>Paid: {formatCurrency(plan.paidAmount)}</span>
                  <span>{progress}% Completed</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* AutoPay Status & Action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${plan.mandateStatus === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  Mandate: {plan.mandateStatus}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(plan.id, plan.status)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    {plan.status === 'ACTIVE' ? 'Pause Plan' : 'Resume Plan'}
                  </button>
                  <button
                    onClick={() => alert(`WhatsApp AutoPay link resent to ${plan.customer}`)}
                    className="text-xs font-bold text-brand-600 hover:text-brand-800 px-2 py-1.5 hover:underline"
                  >
                    Resend Link
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Create New Payment Plan</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Plan Name *
                </label>
                <input
                  type="text"
                  required
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  placeholder="e.g. Class 10 Term Tuition Fee"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-brand-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Customer *
                </label>
                <select
                  value={newPlan.customer}
                  onChange={(e) => setNewPlan({ ...newPlan, customer: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-brand-600 focus:outline-none bg-white font-medium"
                >
                  <option value="Aarav Sharma">Aarav Sharma (STU-2024-081)</option>
                  <option value="Kavita Deshmukh">Kavita Deshmukh (STU-2024-092)</option>
                  <option value="Sunil Verma">Sunil Verma (STU-2024-114)</option>
                  <option value="Pooja Iyer">Pooja Iyer (STU-2024-150)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Instalment Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newPlan.instalmentAmount}
                    onChange={(e) => setNewPlan({ ...newPlan, instalmentAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-brand-600 focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Total Plan Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newPlan.totalAmount}
                    onChange={(e) => setNewPlan({ ...newPlan, totalAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-brand-600 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Frequency *
                  </label>
                  <select
                    value={newPlan.frequency}
                    onChange={(e) => setNewPlan({ ...newPlan, frequency: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-brand-600 focus:outline-none bg-white font-medium"
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="DAILY">Daily</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    First Debit Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newPlan.startDate}
                    onChange={(e) => setNewPlan({ ...newPlan, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-brand-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="reqMandate"
                  checked={newPlan.requiresMandate}
                  onChange={(e) => setNewPlan({ ...newPlan, requiresMandate: e.target.checked })}
                  className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                />
                <label htmlFor="reqMandate" className="font-semibold text-slate-700">
                  Send UPI AutoPay Mandate Authorization link to customer WhatsApp
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md"
                >
                  Create Plan & Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
