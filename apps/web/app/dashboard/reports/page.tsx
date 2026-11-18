'use client';

import React from 'react';
import { BarChart3, Download, TrendingUp, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ReportsPage() {
  const handleExport = (type: string) => {
    alert(`Generating and downloading ${type} report (CSV/PDF)...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Collection Reports & Financial Exports</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Download date-filtered settlement summaries and bank reconciliation statements.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Monthly Collection Statement</h3>
          <p className="text-xs text-slate-500">Full breakdown of all paid, overdue, and pending fee instalments for the current month.</p>
          <button
            onClick={() => handleExport('Monthly Statement')}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" /> Download PDF Statement
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Payment Gateway Reconciliation</h3>
          <p className="text-xs text-slate-500">Order-by-order settlement matching UPI AutoPay debits directly against your bank credit entries.</p>
          <button
            onClick={() => handleExport('Reconciliation CSV')}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" /> Export Bank Reconciliation (CSV)
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Customer Dues & Overdue Ledger</h3>
          <p className="text-xs text-slate-500">List of all active customer accounts with unpaid instalments, grace periods, and phone numbers.</p>
          <button
            onClick={() => handleExport('Overdue Ledger')}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" /> Export Overdue Dues (Excel)
          </button>
        </div>
      </div>
    </div>
  );
}
