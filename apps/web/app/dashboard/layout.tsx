'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, CreditCard, Receipt, BarChart3,
  Settings, LogOut, Bell, Building, Menu, X, ShieldCheck,
  RefreshCw, CheckCircle2, ChevronDown
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('collectflow_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default demo business session
        setUser({
          name: 'Rajesh Sharma',
          phone: '9800000001',
          business: {
            name: 'Sunrise Public School',
            category: 'SCHOOL',
            status: 'APPROVED',
          },
        });
      }
    }
  }, []);

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('collectflow_token');
      localStorage.removeItem('collectflow_user');
    }
    router.push('/login');
  };

  const navLinks = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Customers', href: '/dashboard/customers', icon: Users },
    { label: 'Payment Plans', href: '/dashboard/plans', icon: CreditCard },
    { label: 'Transactions', href: '/dashboard/payments', icon: Receipt },
    { label: 'Reports & Export', href: '/dashboard/reports', icon: BarChart3 },
    { label: 'Settings & Gateways', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300">
        
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
            CF
          </div>
          <span className="text-lg font-extrabold text-white tracking-tight">CollectFlow</span>
        </div>

        {/* Business Selector Pill */}
        <div className="p-4">
          <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700/70">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">
                <Building className="w-3.5 h-3.5" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-white truncate">{user?.business?.name || 'My Business'}</h4>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Merchant Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-1 mt-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white font-bold shadow-md shadow-brand-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="overflow-hidden">
              <span className="text-white font-semibold truncate block">{user?.name || 'Administrator'}</span>
              <span className="text-[11px] text-slate-500 font-mono">+91 {user?.phone || '9800000001'}</span>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* ─── MAIN CONTENT WRAPPER ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-base font-bold text-slate-900 hidden sm:block">
              {user?.business?.name || 'Business Portal'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              UPI AutoPay Ready
            </span>
            <Link
              href="/dashboard/plans"
              className="text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-2 rounded-lg shadow-sm transition-colors"
            >
              + Create Plan
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 text-slate-300 p-4 border-b border-slate-800 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold ${
                    isActive ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={handleSignOut}
              className="w-full text-left flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs text-rose-400 hover:bg-slate-800 font-semibold"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}

        {/* Children Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

    </div>
  );
}
