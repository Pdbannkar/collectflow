'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Users, CreditCard, Clock, ArrowUpRight,
  AlertTriangle, CheckCircle2, RefreshCw, Download, Plus,
  FileText, Smartphone, Send, Search, Filter
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function DashboardOverviewPage() {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'SUCCESS' | 'PENDING' | 'FAILED'>('ALL');
  const [reminderToast, setReminderToast] = useState<string>('');

  const metrics = {
    todayCollection: 48500,
    todayCount: 14,
    monthCollection: 384000,
    monthCount: 112,
    totalOutstanding: 112000,
    activeCustomers: 142,
    activePlans: 148,
    upcomingNext7Days: 64500,
  };

  const recentTransactions = [
    { id: 'TXN-9081', customer: 'Aarav Sharma', plan: 'Class 8 Annual Tuition', amount: 3500, method: 'UPI AutoPay', status: 'SUCCESS', date: '2026-11-18 10:24 AM' },
    { id: 'TXN-9082', customer: 'Kavita Deshmukh', plan: 'Class 9 Bus & Lab Fee', amount: 4200, method: 'UPI AutoPay', status: 'SUCCESS', date: '2026-11-18 09:15 AM' },
    { id: 'TXN-9083', customer: 'Sunil Verma', plan: 'Class 10 Term Fee', amount: 8000, method: 'Payment Link', status: 'PENDING', date: '2026-11-18 08:30 AM' },
    { id: 'TXN-9084', customer: 'Pooja Iyer', plan: 'Quarterly Activity Fee', amount: 2500, method: 'UPI AutoPay', status: 'SUCCESS', date: '2026-11-17 06:12 PM' },
    { id: 'TXN-9085', customer: 'Nitin Gadkari', plan: 'Transportation Monthly', amount: 1800, method: 'eNACH Mandate', status: 'FAILED', date: '2026-11-17 03:40 PM', error: 'Insufficient Bank Balance' },
  ];

  const upcomingDueSchedule = [
    { customer: 'Mohit Rao', plan: 'Class 7 Monthly', amount: 3200, dueDate: '2026-11-20', status: 'Mandate Queued' },
    { customer: 'Deepika S.', plan: 'Class 9 Tuition', amount: 4000, dueDate: '2026-11-21', status: 'WhatsApp Link Sent' },
    { customer: 'Rohan Mehra', plan: 'Term 2 Fee', amount: 6500, dueDate: '2026-11-22', status: 'Mandate Queued' },
  ];

  const handleSendReminder = (customer: string) => {
    setReminderToast(`WhatsApp payment reminder & receipt link sent to ${customer}!`);
    setTimeout(() => setReminderToast(''), 4000);
  };

  const filteredTxns = recentTransactions.filter((tx) => {
    if (activeFilter === 'ALL') return true;
    return tx.status === activeFilter;
  });

  return (
    <div className="space-y-8">
      
      {/* Toast Notification */}
      {reminderToast && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white font-medium text-xs shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{reminderToast}</span>
          </div>
          <button onClick={() => setReminderToast('')} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* Top Welcome & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Collection Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time fee tracking, upcoming UPI AutoPay debits, and verified settlements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/customers"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold shadow-sm transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            Add Customer
          </Link>
          <Link
            href="/dashboard/plans"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white bg-brand-600 hover:bg-brand-700 text-xs font-bold shadow-md shadow-brand-600/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            New Payment Plan
          </Link>
        </div>
      </div>

      {/* ─── 4 CORE METRIC CARDS ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Today */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Collections</span>
            <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            {formatCurrency(metrics.todayCollection)}
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <span>✓ {metrics.todayCount} payments settled</span>
          </div>
        </div>

        {/* Card 2: This Month */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">This Month's Total</span>
            <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            {formatCurrency(metrics.monthCollection)}
          </div>
          <div className="text-[11px] font-semibold text-brand-600">
            {metrics.monthCount} recurring instalments
          </div>
        </div>

        {/* Card 3: Total Outstanding */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Outstanding</span>
            <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            {formatCurrency(metrics.totalOutstanding)}
          </div>
          <div className="text-[11px] font-semibold text-slate-500">
            Across 18 customer accounts
          </div>
        </div>

        {/* Card 4: Upcoming in 7 Days */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming in 7 Days</span>
            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            {formatCurrency(metrics.upcomingNext7Days)}
          </div>
          <div className="text-[11px] font-semibold text-indigo-600">
            AutoPay Mandates Queued
          </div>
        </div>

      </div>

      {/* ─── SPLIT SECTION: RECENT TRANSACTIONS & UPCOMING SCHEDULE ─── */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Transactions Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Collections</h3>
                <p className="text-xs text-slate-500">Verified live payment attempts and AutoPay debits.</p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setActiveFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveFilter('SUCCESS')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'SUCCESS' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}
                >
                  Success
                </button>
                <button
                  onClick={() => setActiveFilter('PENDING')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'PENDING' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-500'}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveFilter('FAILED')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'FAILED' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-500'}`}
                >
                  Failed
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-5">Customer & Plan</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTxns.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-900">{tx.customer}</div>
                        <div className="text-[11px] text-slate-500">{tx.plan}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {tx.method}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          tx.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {tx.status}
                        </span>
                        {tx.error && (
                          <span className="block text-[10px] text-rose-500 mt-0.5">{tx.error}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {tx.status === 'SUCCESS' ? (
                          <button
                            onClick={() => alert(`Printing verified receipt for ${tx.id}...`)}
                            className="text-brand-600 hover:text-brand-800 font-bold hover:underline"
                          >
                            Receipt
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSendReminder(tx.customer)}
                            className="text-emerald-600 hover:text-emerald-800 font-bold hover:underline"
                          >
                            Send Nudge
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 text-center bg-slate-50/50">
            <Link href="/dashboard/payments" className="text-xs font-bold text-brand-600 hover:underline inline-flex items-center gap-1">
              View Full Transaction Ledger <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right: Upcoming AutoPay Debits */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Next AutoPay Debits</h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Queued
              </span>
            </div>

            <div className="space-y-3">
              {upcomingDueSchedule.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>{item.customer}</span>
                    <span className="text-brand-600">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{item.plan}</span>
                    <span className="font-semibold text-slate-700">{formatDate(item.dueDate)}</span>
                  </div>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-emerald-600">{item.status}</span>
                    <button
                      type="button"
                      onClick={() => handleSendReminder(item.customer)}
                      className="text-[10px] font-bold text-slate-600 hover:text-brand-600 flex items-center gap-1"
                    >
                      <Send className="w-2.5 h-2.5" /> WhatsApp Alert
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard/plans"
              className="w-full inline-block text-center text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl transition-colors"
            >
              Manage All Payment Plans
            </Link>
          </div>

          {/* Quick Help Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-brand-900 to-indigo-950 text-white space-y-3 shadow-lg">
            <h4 className="text-xs font-extrabold tracking-wider uppercase text-brand-300">UPI AutoPay Status</h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              Recurring payments are debited between 4:00 AM – 8:00 AM on scheduled due dates via NPCI rails.
            </p>
            <div className="pt-1">
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/30 inline-block">
                ✓ Gateway Webhooks Healthy
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
