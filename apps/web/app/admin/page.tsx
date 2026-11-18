'use client';

import React, { useState } from 'react';
import {
  Building2, Users, CheckCircle2, XCircle, Clock,
  AlertTriangle, ShieldCheck, Search, Filter
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function SuperAdminPage() {
  const [businesses, setBusinesses] = useState([
    { id: 'BIZ-01', name: 'Sunrise Public School', category: 'SCHOOL', owner: 'Rajesh Sharma', phone: '9800000001', city: 'Pune', status: 'APPROVED', gatewayStatus: 'ONBOARDED', plansCount: 148, totalVolume: 384000 },
    { id: 'BIZ-02', name: 'Bright Future Tuition', category: 'TUITION', owner: 'Sanjay Verma', phone: '9800000002', city: 'Bangalore', status: 'APPROVED', gatewayStatus: 'ONBOARDED', plansCount: 85, totalVolume: 180000 },
    { id: 'BIZ-03', name: 'Fresh Mess & Tiffin', category: 'MESS', owner: 'Prakash Rao', phone: '9800000003', city: 'Mumbai', status: 'UNDER_REVIEW', gatewayStatus: 'PENDING_DOCS', plansCount: 30, totalVolume: 75000 },
    { id: 'BIZ-04', name: 'Smart Mobile Store', category: 'MOBILE_SHOP', owner: 'Amit Patel', phone: '9800000004', city: 'Delhi', status: 'APPROVED', gatewayStatus: 'ONBOARDED', plansCount: 42, totalVolume: 125000 },
    { id: 'BIZ-05', name: 'City Electronics Hub', category: 'ELECTRONICS', owner: 'Vikas Gupta', phone: '9800000005', city: 'Chennai', status: 'PENDING', gatewayStatus: 'NOT_SUBMITTED', plansCount: 0, totalVolume: 0 },
  ]);

  const [toast, setToast] = useState('');

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setBusinesses(
      businesses.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    setToast(`Business ${id} status updated to ${newStatus}.`);
    setTimeout(() => setToast(''), 3500);
  };

  return (
    <div className="space-y-8">
      
      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-xl flex items-center justify-between">
          <span>{toast}</span>
          <button onClick={() => setToast('')}>✕</button>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Registered Businesses & Compliance</h2>
        <p className="text-xs text-slate-400 mt-1">
          Review business KYC status, gateway merchant approvals, and compliance verification.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Businesses</span>
          <div className="text-2xl font-extrabold text-white">5</div>
          <span className="text-[11px] text-emerald-400">4 Active Onboarded</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Pending Review</span>
          <div className="text-2xl font-extrabold text-amber-400">2</div>
          <span className="text-[11px] text-slate-400">1 Document required</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Monthly Volume</span>
          <div className="text-2xl font-extrabold text-white">₹7,64,000</div>
          <span className="text-[11px] text-slate-400">Direct merchant settlements</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Active Mandates</span>
          <div className="text-2xl font-extrabold text-brand-400">305</div>
          <span className="text-[11px] text-emerald-400">UPI AutoPay / eNACH</span>
        </div>
      </div>

      {/* Businesses Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Merchant Onboarding Directory</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Business & Category</th>
                <th className="py-3.5 px-4">Owner & City</th>
                <th className="py-3.5 px-4">Platform Status</th>
                <th className="py-3.5 px-4">Gateway Onboarding</th>
                <th className="py-3.5 px-4">Volume</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {businesses.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-bold text-white text-sm">{b.name}</div>
                    <div className="text-[11px] text-amber-400/80 font-mono">{b.category}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-slate-200">{b.owner}</div>
                    <div className="text-[11px] text-slate-500">{b.city} • +91 {b.phone}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      b.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      b.status === 'UNDER_REVIEW' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-[11px] text-slate-300">
                    {b.gatewayStatus}
                  </td>
                  <td className="py-4 px-4 font-bold text-white">
                    {formatCurrency(b.totalVolume)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {b.status === 'APPROVED' ? (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'SUSPENDED')}
                        className="text-xs font-bold text-rose-400 hover:underline"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'APPROVED')}
                        className="text-xs font-bold text-emerald-400 hover:underline"
                      >
                        Approve Merchant
                      </button>
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
