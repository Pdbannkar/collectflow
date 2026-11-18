'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, RefreshCw, CheckCircle2, Download, Clock,
  CreditCard, Calendar, User, Phone, Building, ArrowLeft,
  AlertCircle, HelpCircle, Check, ArrowRight
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function CustomerPortalPage() {
  const [user, setUser] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<'plans' | 'history' | 'support'>('plans');
  const [paidToast, setPaidToast] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('collectflow_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser({ phone: '9811122233', name: 'Aarav Sharma (Parent: Sunita Sharma)' });
      }
    }
  }, []);

  // Demo active plan for the customer
  const activePlan = {
    planName: 'Class 8 Annual Tuition & Transport Fee',
    institutionName: 'Sunrise Public School',
    totalAmount: 42000,
    paidAmount: 24500,
    instalmentAmount: 3500,
    remainingInstalments: 5,
    totalInstalments: 12,
    nextDueDate: '2026-12-10',
    mandateStatus: 'ACTIVE',
    mandateMethod: 'UPI AutoPay (Google Pay)',
    mandateId: 'MND_UPI_88291039',
  };

  const paymentHistory = [
    { id: 'TXN_10928', date: '2026-11-10', amount: 3500, method: 'UPI AutoPay', status: 'SUCCESS', receiptNo: 'RCP-2026-0812' },
    { id: 'TXN_10842', date: '2026-10-10', amount: 3500, method: 'UPI AutoPay', status: 'SUCCESS', receiptNo: 'RCP-2026-0701' },
    { id: 'TXN_10761', date: '2026-09-10', amount: 3500, method: 'UPI AutoPay', status: 'SUCCESS', receiptNo: 'RCP-2026-0599' },
    { id: 'TXN_10650', date: '2026-08-10', amount: 3500, method: 'Manual Record', status: 'SUCCESS', receiptNo: 'RCP-2026-0482' },
  ];

  const handleSimulatePayment = () => {
    setPaidToast('Payment of ₹3,500 successfully authorized via UPI AutoPay! Receipt generated.');
    setTimeout(() => setPaidToast(''), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16">
      
      {/* ─── CUSTOMER PORTAL HEADER ─── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
              CF
            </Link>
            <div>
              <span className="text-base font-extrabold text-slate-950">Customer Fee Portal</span>
              <span className="block text-[11px] text-slate-500 font-medium">CollectFlow Secure Access</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-slate-900 block">{user?.name || 'Aarav Sharma'}</span>
              <span className="text-[11px] text-slate-500 block font-mono">+91 {user?.phone || '9811122233'}</span>
            </div>
            <Link
              href="/login"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        {/* Toast Alert */}
        {paidToast && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center justify-between text-sm font-semibold animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{paidToast}</span>
            </div>
            <button onClick={() => setPaidToast('')} className="text-white/80 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Institution Identity Card */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-brand-500/30 text-brand-200 border border-brand-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Assigned Business Institution
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {activePlan.institutionName}
            </h1>
            <p className="text-sm text-slate-200">
              Fee Collection Account: <strong>{activePlan.planName}</strong>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 text-sm font-bold text-slate-600 gap-6">
          <button
            onClick={() => setSelectedTab('plans')}
            className={`pb-3 transition-colors flex items-center gap-1.5 ${
              selectedTab === 'plans'
                ? 'border-b-2 border-brand-600 text-brand-600'
                : 'hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Active Payment Plan
          </button>
          <button
            onClick={() => setSelectedTab('history')}
            className={`pb-3 transition-colors flex items-center gap-1.5 ${
              selectedTab === 'history'
                ? 'border-b-2 border-brand-600 text-brand-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            Payment History & Receipts
          </button>
        </div>

        {/* ─── TAB 1: ACTIVE PAYMENT PLAN ─── */}
        {selectedTab === 'plans' && (
          <div className="space-y-6">
            
            {/* Next Due Date Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Instalment</span>
                  <div className="text-3xl font-extrabold text-slate-950 mt-1">
                    {formatCurrency(activePlan.instalmentAmount)}
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mandate Active • Auto-debits on {formatDate(activePlan.nextDueDate)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  className="inline-flex items-center justify-center gap-2 text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white px-6 py-3.5 rounded-xl shadow-md shadow-brand-600/25 transition-all text-center"
                >
                  Pay Next Instalment Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
                  <span>Paid so far: {formatCurrency(activePlan.paidAmount)}</span>
                  <span>Total Plan: {formatCurrency(activePlan.totalAmount)}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${(activePlan.paidAmount / activePlan.totalAmount) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-medium">
                  <span>7 Instalments Paid</span>
                  <span>{activePlan.remainingInstalments} Remaining</span>
                </div>
              </div>

              {/* AutoPay Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Mandate Type:</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{activePlan.mandateMethod}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Mandate Reference ID:</span>
                  <span className="font-mono text-slate-700 block mt-0.5">{activePlan.mandateId}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ─── TAB 2: PAYMENT HISTORY & RECEIPTS ─── */}
        {selectedTab === 'history' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Verified Payment Receipts</h3>
              <p className="text-xs text-slate-500 mt-0.5">Download your official fee receipts for tax and reimbursement records.</p>
            </div>

            <div className="divide-y divide-slate-100">
              {paymentHistory.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(item.amount)} Paid</p>
                      <p className="text-xs text-slate-500">{formatDate(item.date)} • {item.method}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400 hidden sm:inline">{item.receiptNo}</span>
                    <button
                      type="button"
                      onClick={() => alert(`Downloading verified PDF receipt for ${item.receiptNo}...`)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Security Footer */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Secured by CollectFlow • Direct Settlement with Verified Merchant Account</span>
      </div>
    </div>
  );
}
