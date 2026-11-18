'use client';

import React, { useState } from 'react';
import {
  Receipt, Search, Download, CheckCircle2, Clock,
  AlertCircle, Filter, ArrowUpRight
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function PaymentsPage() {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const transactions = [
    { id: 'TXN-9081', customer: 'Aarav Sharma', plan: 'Class 8 Annual Tuition', amount: 3500, method: 'UPI AutoPay (GPay)', status: 'SUCCESS', date: '18 Nov 2026, 10:24 AM', receiptNo: 'RCP-2026-0812' },
    { id: 'TXN-9082', customer: 'Kavita Deshmukh', plan: 'Class 9 Bus & Lab Fee', amount: 4200, method: 'UPI AutoPay (PhonePe)', status: 'SUCCESS', date: '18 Nov 2026, 09:15 AM', receiptNo: 'RCP-2026-0811' },
    { id: 'TXN-9083', customer: 'Sunil Verma', plan: 'Class 10 Term Fee', amount: 8000, method: 'Payment Link', status: 'PENDING', date: '18 Nov 2026, 08:30 AM', receiptNo: '—' },
    { id: 'TXN-9084', customer: 'Pooja Iyer', plan: 'Quarterly Activity Fee', amount: 2500, method: 'UPI AutoPay (Paytm)', status: 'SUCCESS', date: '17 Nov 2026, 06:12 PM', receiptNo: 'RCP-2026-0810' },
    { id: 'TXN-9085', customer: 'Nitin Gadkari', plan: 'Transportation Monthly', amount: 1800, method: 'eNACH Mandate', status: 'FAILED', date: '17 Nov 2026, 03:40 PM', receiptNo: '—', reason: 'Insufficient funds' },
    { id: 'TXN-9079', customer: 'Rohit Kumar', plan: '6-Month Device EMI', amount: 2150, method: 'eNACH Mandate', status: 'SUCCESS', date: '16 Nov 2026, 04:30 AM', receiptNo: 'RCP-2026-0809' },
    { id: 'TXN-9078', customer: 'Deepika S.', plan: 'Class 9 Monthly', amount: 4000, method: 'Manual Cash Record', status: 'SUCCESS', date: '15 Nov 2026, 11:10 AM', receiptNo: 'RCP-2026-0808' },
  ];

  const filtered = transactions.filter((tx) => {
    const matchesStatus = filterStatus === 'ALL' || tx.status === filterStatus;
    const matchesSearch =
      tx.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.receiptNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Financial Transactions Ledger</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-grade history of all incoming fee debits, payment links, and receipts.
          </p>
        </div>

        <button
          onClick={() => alert('Downloading official CSV transaction export...')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer, txn ID, receipt..."
            className="w-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold w-full sm:w-auto justify-end">
          {['ALL', 'SUCCESS', 'PENDING', 'FAILED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5">Txn ID & Date</th>
                <th className="py-3.5 px-4">Customer & Plan</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment Rail</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-bold text-slate-900 font-mono text-xs">{tx.id}</div>
                    <div className="text-[11px] text-slate-400">{tx.date}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">{tx.customer}</div>
                    <div className="text-[11px] text-slate-500">{tx.plan}</div>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900 text-sm">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="py-4 px-4 text-slate-700 font-medium">
                    {tx.method}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      tx.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {tx.status}
                    </span>
                    {tx.reason && (
                      <span className="block text-[10px] text-rose-500 mt-0.5">{tx.reason}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {tx.status === 'SUCCESS' ? (
                      <button
                        onClick={() => alert(`Downloading ${tx.receiptNo}...`)}
                        className="text-xs font-bold text-brand-600 hover:text-brand-800 hover:underline"
                      >
                        {tx.receiptNo}
                      </button>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
