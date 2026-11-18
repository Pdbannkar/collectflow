'use client';

import React, { useState } from 'react';
import {
  Users, Plus, Search, Phone, Mail, MapPin, CheckCircle2,
  AlertCircle, FileText, Download, MoreHorizontal, ArrowRight
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    fullName: '',
    phone: '',
    email: '',
    referenceId: '',
    address: '',
    notes: '',
  });

  const [customers, setCustomers] = useState([
    { id: 'CUST-001', fullName: 'Aarav Sharma', phone: '9811122233', email: 'sharma.parent@gmail.com', referenceId: 'STU-2024-081', status: 'ACTIVE', plansCount: 1, totalPaid: 24500, outstanding: 17500 },
    { id: 'CUST-002', fullName: 'Kavita Deshmukh', phone: '9822334455', email: 'kavita.d@outlook.com', referenceId: 'STU-2024-092', status: 'ACTIVE', plansCount: 1, totalPaid: 33600, outstanding: 8400 },
    { id: 'CUST-003', fullName: 'Sunil Verma', phone: '9833445566', email: 'verma.co@yahoo.com', referenceId: 'STU-2024-114', status: 'ACTIVE', plansCount: 2, totalPaid: 45000, outstanding: 15000 },
    { id: 'CUST-004', fullName: 'Pooja Iyer', phone: '9844556677', email: 'pooja.iyer@gmail.com', referenceId: 'STU-2024-150', status: 'ACTIVE', plansCount: 1, totalPaid: 15000, outstanding: 0 },
    { id: 'CUST-005', fullName: 'Nitin Gadkari', phone: '9855667788', email: 'nitin.g@gmail.com', referenceId: 'STU-2024-188', status: 'INACTIVE', plansCount: 1, totalPaid: 9000, outstanding: 5400 },
  ]);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.fullName || !newCustomer.phone) return;

    const added = {
      id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
      fullName: newCustomer.fullName,
      phone: newCustomer.phone.replace(/\D/g, ''),
      email: newCustomer.email || '',
      referenceId: newCustomer.referenceId || `REF-${Date.now().toString().slice(-4)}`,
      status: 'ACTIVE',
      plansCount: 0,
      totalPaid: 0,
      outstanding: 0,
    };

    setCustomers([added, ...customers]);
    setShowAddModal(false);
    setNewCustomer({ fullName: '', phone: '', email: '', referenceId: '', address: '', notes: '' });
  };

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.referenceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer & Payer Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student parents, subscribers, and instalment buyers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white bg-brand-600 hover:bg-brand-700 text-xs font-bold shadow-md shadow-brand-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Customer
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by customer name, 10-digit mobile number, or roll/reference ID..."
          className="w-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="text-xs text-slate-400 hover:text-slate-600">
            Clear
          </button>
        )}
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5">Customer Name & ID</th>
                <th className="py-3.5 px-4">Contact (Phone / Email)</th>
                <th className="py-3.5 px-4">Active Plans</th>
                <th className="py-3.5 px-4">Paid Total</th>
                <th className="py-3.5 px-4">Outstanding</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-bold text-slate-900 text-sm">{c.fullName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{c.referenceId}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-800 font-mono">+91 {c.phone}</div>
                    <div className="text-[11px] text-slate-400">{c.email || '—'}</div>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-700">
                    {c.plansCount} {c.plansCount === 1 ? 'Plan' : 'Plans'}
                  </td>
                  <td className="py-4 px-4 font-bold text-emerald-600">
                    {formatCurrency(c.totalPaid)}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {formatCurrency(c.outstanding)}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      c.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => alert(`View details & assigned plans for ${c.fullName}`)}
                      className="text-xs font-bold text-brand-600 hover:text-brand-800 hover:underline"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add New Customer</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCustomer.fullName}
                  onChange={(e) => setNewCustomer({ ...newCustomer, fullName: e.target.value })}
                  placeholder="e.g. Sumanth Patel"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-brand-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number (For WhatsApp / SMS alerts) *
                </label>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden focus-within:border-brand-600">
                  <span className="px-3 py-2.5 bg-slate-50 text-slate-600 font-bold border-r border-slate-200">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full px-3 py-2.5 text-sm focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Customer / Roll ID
                  </label>
                  <input
                    type="text"
                    value={newCustomer.referenceId}
                    onChange={(e) => setNewCustomer({ ...newCustomer, referenceId: e.target.value })}
                    placeholder="e.g. STU-2026-09"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-brand-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    placeholder="customer@gmail.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-brand-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
