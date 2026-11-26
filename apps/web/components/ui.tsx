'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PayStatus } from '@/lib/store';

/** Modal that slides up as a bottom sheet on phones and centers on desktop. */
export function Sheet({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white px-5 pt-5 pb-3 flex items-start justify-between border-b border-slate-100 z-10">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2 -m-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-500 mt-1">{hint}</span>}
    </label>
  );
}

export const inputCls =
  'w-full px-3.5 py-3 rounded-xl border border-slate-300 text-base text-slate-900 placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none bg-white';

export function Pills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: NoInfer<T>; label: string }[];
  value: T;
  onChange: (v: NoInfer<T>) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          type="button"
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-semibold border transition-colors',
            value === o.value
              ? 'bg-brand-600 border-brand-600 text-white'
              : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function PrimaryButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        'w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors',
        className,
      )}
    />
  );
}

const STATUS: Record<PayStatus, { label: string; cls: string }> = {
  SUCCESS: { label: 'Paid', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  PENDING: { label: 'Waiting', cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
  FAILED: { label: 'Failed', cls: 'bg-rose-50 text-rose-700 ring-rose-200' },
};

export function StatusBadge({ status }: { status: PayStatus }) {
  const s = STATUS[status];
  return <span className={cn('inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1', s.cls)}>{s.label}</span>;
}

export function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
      {initials}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0 whitespace-nowrap">{action}</div>}
    </div>
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('bg-white rounded-2xl border border-slate-200 shadow-sm', className)} />;
}

export function EmptyState({ icon, title, text, action }: { icon: React.ReactNode; title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-12 px-6">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mb-3">{icon}</div>
      <h4 className="text-base font-bold text-slate-900">{title}</h4>
      <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
