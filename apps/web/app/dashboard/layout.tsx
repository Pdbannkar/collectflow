'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Users, CalendarClock, Receipt, BarChart3, Settings, LogOut,
  Plus, IndianRupee, UserPlus, CalendarPlus, CheckCircle2, MoreHorizontal, X,
} from 'lucide-react';
import { StoreProvider, useStore } from '@/lib/store';
import { GlobalSheets } from '@/components/sheets';
import { cn } from '@/lib/utils';

const MAIN_NAV = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Customers', href: '/dashboard/customers', icon: Users },
  { label: 'Plans', href: '/dashboard/plans', icon: CalendarClock },
  { label: 'Payments', href: '/dashboard/payments', icon: Receipt },
];
const EXTRA_NAV = [
  { label: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <Shell>{children}</Shell>
    </StoreProvider>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { openSheet, toast, showToast } = useStore();
  const [user, setUser] = useState<any>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [newMenuOpen, setNewMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('collectflow_user');
    setUser(stored ? JSON.parse(stored) : { name: 'Rajesh Sharma', phone: '9800000001', business: { name: 'Sunrise Public School' } });
  }, []);

  useEffect(() => {
    setMoreOpen(false);
    setNewMenuOpen(false);
  }, [pathname]);

  const signOut = () => {
    localStorage.removeItem('collectflow_token');
    localStorage.removeItem('collectflow_user');
    router.push('/login');
  };

  const isActive = (href: string) => (href === '/dashboard' ? pathname === href : pathname.startsWith(href));
  const businessName = user?.business?.name || 'My Business';

  const quickActions = [
    { label: 'Collect payment', desc: 'Record cash, UPI or bank payment', icon: IndianRupee, onClick: () => openSheet({ type: 'collect' }) },
    { label: 'Add customer', desc: 'Just a name and mobile number', icon: UserPlus, onClick: () => openSheet({ type: 'customer' }) },
    { label: 'New payment plan', desc: 'Monthly fee, EMI, membership…', icon: CalendarPlus, onClick: () => openSheet({ type: 'plan' }) },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ─── Desktop sidebar ─── */}
      <aside className="hidden lg:flex lg:flex-col w-60 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="h-16 flex items-center px-5 gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-sm">CF</div>
          <div className="min-w-0">
            <div className="text-base font-extrabold text-slate-900 leading-tight">CollectFlow</div>
            <div className="text-xs text-slate-500 truncate">{businessName}</div>
          </div>
        </div>

        <div className="px-3 pt-2 pb-4">
          <button
            onClick={() => openSheet({ type: 'collect' })}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-sm"
          >
            <IndianRupee className="w-4 h-4" /> Collect payment
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {[...MAIN_NAV, ...EXTRA_NAV].map(({ label, href, icon: Icon }, i) => (
            <React.Fragment key={href}>
              {i === MAIN_NAV.length && <div className="h-px bg-slate-100 my-3 mx-2" />}
              <Link
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                  isActive(href) ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
              </Link>
            </React.Fragment>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Admin'}</div>
            <div className="text-xs text-slate-500">+91 {user?.phone}</div>
          </div>
          <button onClick={signOut} title="Sign out" className="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 lg:h-16 bg-white/90 backdrop-blur border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">CF</div>
            <span className="text-sm font-bold text-slate-900 truncate max-w-[50vw]">{businessName}</span>
          </div>
          <div className="hidden lg:block text-sm text-slate-500">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>

          <div className="relative">
            <button
              onClick={() => setNewMenuOpen(!newMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-800"
            >
              <Plus className="w-4 h-4" /> New
            </button>
            {newMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNewMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50">
                  {quickActions.map(({ label, desc, icon: Icon, onClick }) => (
                    <button
                      key={label}
                      onClick={() => {
                        setNewMenuOpen(false);
                        onClick();
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-left"
                    >
                      <span className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-slate-900">{label}</span>
                        <span className="block text-xs text-slate-500">{desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 pb-28 lg:pb-8 max-w-6xl mx-auto w-full">{children}</main>
      </div>

      {/* ─── Mobile bottom tab bar ─── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5 items-end h-16">
          {MAIN_NAV.slice(0, 2).map((item) => (
            <TabLink key={item.href} {...item} active={isActive(item.href)} />
          ))}
          <div className="flex justify-center">
            <button
              onClick={() => openSheet({ type: 'collect' })}
              aria-label="Collect payment"
              className="-mt-6 w-14 h-14 rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30 flex items-center justify-center ring-4 ring-white"
            >
              <IndianRupee className="w-6 h-6" />
            </button>
          </div>
          {MAIN_NAV.slice(2, 3).map((item) => (
            <TabLink key={item.href} {...item} active={isActive(item.href)} />
          ))}
          <button onClick={() => setMoreOpen(true)} className={cn('flex flex-col items-center justify-center gap-0.5 h-full text-[11px] font-semibold', moreOpen ? 'text-brand-700' : 'text-slate-500')}>
            <MoreHorizontal className="w-6 h-6" /> More
          </button>
        </div>
      </nav>

      {/* Mobile "More" drawer */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40" onClick={() => setMoreOpen(false)}>
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl p-4 pb-8 space-y-1" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-2 pb-2">
              <span className="text-base font-bold text-slate-900">More</span>
              <button onClick={() => setMoreOpen(false)} className="p-2 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            {[MAIN_NAV[3], ...EXTRA_NAV].map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50">
                <Icon className="w-5 h-5 text-slate-500" /> {label}
              </Link>
            ))}
            <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-base font-semibold text-rose-600 hover:bg-rose-50">
              <LogOut className="w-5 h-5" /> Sign out
            </button>
          </div>
        </div>
      )}

      <GlobalSheets />

      {/* Toast */}
      {toast && (
        <div className="fixed z-[60] bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md">
          <button
            onClick={() => showToast('')}
            className="w-full flex items-center gap-2.5 px-4 py-3.5 rounded-2xl bg-slate-900 text-white text-sm font-medium shadow-xl text-left"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            {toast}
          </button>
        </div>
      )}
    </div>
  );
}

function TabLink({ label, href, icon: Icon, active }: { label: string; href: string; icon: any; active: boolean }) {
  return (
    <Link href={href} className={cn('flex flex-col items-center justify-center gap-0.5 h-full text-[11px] font-semibold', active ? 'text-brand-700' : 'text-slate-500')}>
      <Icon className="w-6 h-6" />
      {label}
    </Link>
  );
}
