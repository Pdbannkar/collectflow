'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldAlert, Building2, Users, CreditCard, Settings,
  LogOut, CheckCircle2, AlertTriangle, BarChart3, ArrowLeft
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('collectflow_user');
    }
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col sm:flex-row">
      
      {/* Super Admin Sidebar */}
      <aside className="w-full sm:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-xs">
              SA
            </div>
            <div>
              <span className="text-base font-extrabold text-white">Super Admin</span>
              <span className="block text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                CollectFlow HQ
              </span>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                pathname === '/admin'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Businesses & KYC
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Switch to Business View
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out Admin
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-6xl w-full">
        {children}
      </main>

    </div>
  );
}
