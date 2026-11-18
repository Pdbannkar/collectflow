'use client';

import React, { useState } from 'react';
import { Settings, CreditCard, Bell, ShieldCheck, Building, Key } from 'lucide-react';

export default function SettingsPage() {
  const [toast, setToast] = useState('');
  const [autopayEnabled, setAutopayEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToast('Business settings and notification rules saved successfully.');
    setTimeout(() => setToast(''), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white font-medium text-xs shadow-lg flex items-center justify-between">
          <span>{toast}</span>
          <button onClick={() => setToast('')}>✕</button>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Business Settings & Gateway Setup</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure payment gateway adapters, settlement bank account, and WhatsApp templates.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Gateway Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <CreditCard className="w-5 h-5 text-brand-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Payment Gateway Connections</h3>
              <p className="text-xs text-slate-500">Active recurring collection rails for your merchant account.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Cashfree Subscriptions & UPI AutoPay</span>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">✓ Sandbox / Production Adapter Connected</span>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200">
                Connected
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Razorpay Subscriptions (eMandate / Cards)</span>
                <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">Ready for live key configuration</span>
              </div>
              <button
                type="button"
                onClick={() => alert('Razorpay adapter configuration dialog')}
                className="text-xs font-bold text-brand-600 hover:underline"
              >
                Configure
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Bell className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Automated Customer Communications</h3>
              <p className="text-xs text-slate-500">Configure how and when payment reminders and receipts are sent.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs font-medium text-slate-700">
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Automatic WhatsApp Due-Date Reminders</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Sent 3 days and 1 day prior to instalment due date.</span>
              </div>
              <input
                type="checkbox"
                checked={whatsappEnabled}
                onChange={(e) => setWhatsappEnabled(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Instant WhatsApp & SMS PDF Receipts</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Dispatches branded receipt within 30 seconds of confirmed collection.</span>
              </div>
              <input
                type="checkbox"
                checked={autopayEnabled}
                onChange={(e) => setAutopayEnabled(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded"
              />
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
