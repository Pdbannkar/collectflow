'use client';

import React, { useState } from 'react';
import {
  Users, Plus, Search, Phone, Mail, MapPin, CheckCircle2,
  AlertCircle, FileText, Download, MoreHorizontal, ArrowRight,
  ShieldCheck, RefreshCw, Sparkles, Check
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { validatePanFormat, verifyPanAutomatically, PanVerificationResult } from '@/lib/pan-verification';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // PAN Verification State in Modal
  const [panInput, setPanInput] = useState('');
  const [isVerifyingPan, setIsVerifyingPan] = useState(false);
  const [panResult, setPanResult] = useState<PanVerificationResult | null>(null);
  const [panError, setPanError] = useState('');

  const [newCustomer, setNewCustomer] = useState({
    fullName: '',
    phone: '',
    email: '',
    referenceId: '',
    address: '',
    notes: '',
  });

  const [customers, setCustomers] = useState([
    {
      id: 'CUST-001',
      fullName: 'Aarav Sharma',
      phone: '9811122233',
      email: 'sharma.parent@gmail.com',
      referenceId: 'STU-2024-081',
      status: 'ACTIVE',
      plansCount: 1,
      totalPaid: 24500,
      outstanding: 17500,
      pan: 'ABCPS1234A',
      panVerified: true,
      entityType: 'Individual / Person',
    },
    {
      id: 'CUST-002',
      fullName: 'Kavita Deshmukh',
      phone: '9822334455',
      email: 'kavita.d@outlook.com',
      referenceId: 'STU-2024-092',
      status: 'ACTIVE',
      plansCount: 1,
      totalPaid: 33600,
      outstanding: 8400,
      pan: 'BKDPK9821K',
      panVerified: true,
      entityType: 'Individual / Person',
    },
    {
      id: 'CUST-003',
      fullName: 'Sunil Verma',
      phone: '9833445566',
      email: 'verma.co@yahoo.com',
      referenceId: 'STU-2024-114',
      status: 'ACTIVE',
      plansCount: 2,
      totalPaid: 45000,
      outstanding: 15000,
      pan: '',
      panVerified: false,
    },
    {
      id: 'CUST-004',
      fullName: 'Pooja Iyer',
      phone: '9844556677',
      email: 'pooja.iyer@gmail.com',
      referenceId: 'STU-2024-150',
      status: 'ACTIVE',
      plansCount: 1,
      totalPaid: 15000,
      outstanding: 0,
      pan: 'AIYPI4419P',
      panVerified: true,
      entityType: 'Individual / Person',
    },
    {
      id: 'CUST-005',
      fullName: 'Nitin Gadkari',
      phone: '9855667788',
      email: 'nitin.g@gmail.com',
      referenceId: 'STU-2024-188',
      status: 'INACTIVE',
      plansCount: 1,
      totalPaid: 9000,
      outstanding: 5400,
      pan: '',
      panVerified: false,
    },
  ]);

  // Automated Real-time PAN Verification Handler
  const handleVerifyPan = async () => {
    setPanError('');
    const cleanPan = panInput.trim().toUpperCase();

    const formatCheck = validatePanFormat(cleanPan);
    if (!formatCheck.valid) {
      setPanError(formatCheck.error || 'Please enter a valid 10-digit PAN (e.g. ABCDE1234F).');
      return;
    }

    setIsVerifyingPan(true);
    try {
      const result = await verifyPanAutomatically(cleanPan, newCustomer.fullName);
      setPanResult(result);

      // Auto-populate customer name from verified Income Tax records if empty
      if (!newCustomer.fullName && result.registeredName) {
        setNewCustomer((prev) => ({ ...prev, fullName: result.registeredName || '' }));
      }
    } catch (err: any) {
      setPanError('PAN verification service timed out. Please try again.');
    } finally {
      setIsVerifyingPan(false);
    }
  };

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
      pan: panInput.trim().toUpperCase() || '',
      panVerified: !!panResult?.valid,
      entityType: panResult?.entityType || undefined,
    };

    setCustomers([added, ...customers]);
    setShowAddModal(false);
    setNewCustomer({ fullName: '', phone: '', email: '', referenceId: '', address: '', notes: '' });
    setPanInput('');
    setPanResult(null);
    setPanError('');
  };

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.pan && c.pan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.referenceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer & Payer Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student parents, subscribers, and instalment buyers with automated PAN verification.
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddModal(true);
            setPanInput('');
            setPanResult(null);
            setPanError('');
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white bg-brand-600 hover:bg-brand-700 text-xs font-bold shadow-md shadow-brand-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Customer (With Auto-PAN)
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by customer name, mobile number, PAN card number, or student ID..."
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
                <th className="py-3.5 px-4">PAN Card Verification</th>
                <th className="py-3.5 px-4">Active Plans</th>
                <th className="py-3.5 px-4">Paid Total</th>
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

                  {/* PAN Verification Column */}
                  <td className="py-4 px-4">
                    {c.pan ? (
                      <div>
                        <div className="font-mono text-xs font-bold text-slate-900">{c.pan}</div>
                        {c.panVerified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded mt-0.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> ITD Verified
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-600 font-medium">Pending Verification</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Not Provided</span>
                    )}
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-700">
                    {c.plansCount} {c.plansCount === 1 ? 'Plan' : 'Plans'}
                  </td>
                  <td className="py-4 px-4 font-bold text-emerald-600">
                    {formatCurrency(c.totalPaid)}
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
                      onClick={() => alert(`View details & verified PAN records for ${c.fullName}`)}
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

      {/* Add Customer Modal with Automated PAN Verification */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add New Customer</h3>
                <p className="text-xs text-slate-500">With instant Income Tax PAN validation</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4 text-xs">
              
              {/* ─── AUTOMATED PAN VERIFICATION BLOCK ─── */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-brand-50/40 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand-600" />
                    Customer PAN Card (Instant Verification)
                  </label>
                  <span className="text-[10px] font-semibold text-brand-600 bg-brand-100/60 px-2 py-0.5 rounded">
                    Income Tax Dept Live Query
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={panInput}
                    maxLength={10}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setPanInput(val);
                      setPanError('');
                      if (panResult) setPanResult(null);
                    }}
                    placeholder="e.g. ABCDE1234F"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono uppercase font-bold text-slate-900 focus:border-brand-600 focus:outline-none text-sm tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyPan}
                    disabled={isVerifyingPan || panInput.trim().length !== 10}
                    className="px-4 py-2.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center gap-1.5 text-xs whitespace-nowrap shadow-sm"
                  >
                    {isVerifyingPan ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Verify PAN
                      </>
                    )}
                  </button>
                </div>

                {panError && (
                  <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {panError}
                  </p>
                )}

                {/* Verified Result Card */}
                {panResult && panResult.valid && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        PAN Verified Successfully
                      </span>
                      <span className="text-[10px] font-semibold bg-emerald-200/60 px-2 py-0.5 rounded text-emerald-800">
                        {panResult.entityType}
                      </span>
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-500 font-medium">Registered Taxpayer Name:</span>{' '}
                      <strong className="text-slate-900 font-bold">{panResult.registeredName}</strong>
                    </div>

                    {/* Auto-fill button if name doesn't match */}
                    {panResult.registeredName && newCustomer.fullName !== panResult.registeredName && (
                      <button
                        type="button"
                        onClick={() => setNewCustomer({ ...newCustomer, fullName: panResult.registeredName || '' })}
                        className="text-[11px] font-bold text-brand-700 hover:underline inline-flex items-center gap-1 pt-1"
                      >
                        Use this official name as customer name →
                      </button>
                    )}
                  </div>
                )}
              </div>

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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-brand-600 focus:outline-none font-medium"
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
