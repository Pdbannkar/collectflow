'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  School, Utensils, Landmark, Smartphone, Dumbbell, ShieldCheck,
  RefreshCw, CheckCircle2, Download, Clock, CreditCard, Calendar,
  User, Phone, Building, ArrowLeft, AlertCircle, HelpCircle,
  Check, ArrowRight, ChevronDown, Sparkles, Pause, Play,
  AlertTriangle, FileText, Info, Coffee, MapPin, Receipt
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface InstitutionProfile {
  id: string;
  name: string;
  category: 'SCHOOL' | 'MESS' | 'LENDING' | 'MOBILE_SHOP' | 'MEMBERSHIP';
  categoryLabel: string;
  icon: any;
  color: string;
  planName: string;
  totalAmount: number;
  paidAmount: number;
  instalmentAmount: number;
  remainingInstalments: number;
  totalInstalments: number;
  nextDueDate: string;
  frequency: string;
  mandateStatus: 'ACTIVE' | 'PENDING_AUTH';
  mandateMethod: string;
  mandateId: string;
  // Specific Dynamic Category Attributes (Come and Go)
  schoolDetails?: {
    rollNumber: string;
    gradeSection: string;
    academicYear: string;
    parentName: string;
    busRoute: string;
    feeBreakdown: { item: string; amount: number }[];
  };
  messDetails?: {
    mealPlanType: string;
    dietaryType: 'Pure Veg' | 'Non-Veg' | 'Jain Veg';
    tiffinAddress: string;
    mealsPerDay: number;
    monthlyMealsUsed: number;
    monthlyMealsTotal: number;
    vacationPauseActive: boolean;
    todayMenu: string;
  };
  lendingDetails?: {
    loanAccountNo: string;
    principalAmount: number;
    aprPercentage: number;
    processingFee: number;
    sanctionDate: string;
    coolingOffDaysRemaining: number;
    lenderName: string;
    rbiRegistrationNo: string;
    grievanceOfficer: { name: string; email: string; phone: string };
  };
  retailDetails?: {
    deviceModel: string;
    imeiNumber: string;
    downPayment: number;
    warrantyStatus: string;
    invoiceNumber: string;
  };
  membershipDetails?: {
    memberId: string;
    trainerName: string;
    accessHours: string;
    freezeAllowedDays: number;
  };
  paymentHistory: {
    id: string;
    date: string;
    amount: number;
    method: string;
    status: 'SUCCESS' | 'PENDING';
    receiptNo: string;
    description: string;
  }[];
}

const INSTITUTIONS: InstitutionProfile[] = [
  {
    id: 'inst-school',
    name: 'Sunrise Public School',
    category: 'SCHOOL',
    categoryLabel: 'School Fee Account',
    icon: School,
    color: 'from-blue-600 to-indigo-700',
    planName: 'Class 8 Annual Tuition & Transport Fee',
    totalAmount: 42000,
    paidAmount: 24500,
    instalmentAmount: 3500,
    remainingInstalments: 5,
    totalInstalments: 12,
    nextDueDate: '2026-12-10',
    frequency: 'Monthly',
    mandateStatus: 'ACTIVE',
    mandateMethod: 'UPI AutoPay (Google Pay)',
    mandateId: 'MND_SCH_88291039',
    schoolDetails: {
      rollNumber: 'ROLL-8B-042',
      gradeSection: 'Class 8 - Section B',
      academicYear: '2026-2027',
      parentName: 'Sunita Sharma (Mother)',
      busRoute: 'Bus Route #14 (Kothrud to Campus)',
      feeBreakdown: [
        { item: 'Core Tuition Fee', amount: 2500 },
        { item: 'GPS Bus Transport', amount: 800 },
        { item: 'Computer Lab & Activity', amount: 200 },
      ],
    },
    paymentHistory: [
      { id: 'TXN_SCH_01', date: '2026-11-10', amount: 3500, method: 'UPI AutoPay', status: 'SUCCESS', receiptNo: 'RCP-SCH-2026-0812', description: 'November 2026 Tuition & Transport' },
      { id: 'TXN_SCH_02', date: '2026-10-10', amount: 3500, method: 'UPI AutoPay', status: 'SUCCESS', receiptNo: 'RCP-SCH-2026-0701', description: 'October 2026 Tuition & Transport' },
      { id: 'TXN_SCH_03', date: '2026-09-10', amount: 3500, method: 'UPI AutoPay', status: 'SUCCESS', receiptNo: 'RCP-SCH-2026-0599', description: 'September 2026 Tuition & Transport' },
    ],
  },
  {
    id: 'inst-mess',
    name: 'Annapurna Hostel & Tiffin Mess',
    category: 'MESS',
    categoryLabel: 'Mess & Meal Subscription',
    icon: Utensils,
    color: 'from-amber-600 to-orange-700',
    planName: 'Monthly Unlimited 2-Time Tiffin (Lunch + Dinner)',
    totalAmount: 30000,
    paidAmount: 17500,
    instalmentAmount: 2500,
    remainingInstalments: 5,
    totalInstalments: 12,
    nextDueDate: '2026-12-01',
    frequency: 'Monthly (Daily Delivery)',
    mandateStatus: 'ACTIVE',
    mandateMethod: 'UPI AutoPay (PhonePe)',
    mandateId: 'MND_MESS_991823',
    messDetails: {
      mealPlanType: 'Full Day 2 Meals (Lunch & Dinner)',
      dietaryType: 'Pure Veg',
      tiffinAddress: 'Hostel Block C, Room 304, University North Campus',
      mealsPerDay: 2,
      monthlyMealsUsed: 44,
      monthlyMealsTotal: 60,
      vacationPauseActive: false,
      todayMenu: 'Paneer Butter Masala, Dal Tadka, 4 Butter Phulkas, Steamed Jeera Rice, Fresh Salad & Gulab Jamun',
    },
    paymentHistory: [
      { id: 'TXN_MESS_01', date: '2026-11-01', amount: 2500, method: 'UPI AutoPay', status: 'SUCCESS', receiptNo: 'RCP-MESS-9921', description: 'November Meal Subscription (Lunch + Dinner)' },
      { id: 'TXN_MESS_02', date: '2026-10-01', amount: 2500, method: 'UPI AutoPay', status: 'SUCCESS', receiptNo: 'RCP-MESS-8812', description: 'October Meal Subscription (Lunch + Dinner)' },
    ],
  },
  {
    id: 'inst-lending',
    name: 'FairLend Regulated NBFC',
    category: 'LENDING',
    categoryLabel: 'Regulated Credit & Lending Agency',
    icon: Landmark,
    color: 'from-emerald-700 to-teal-800',
    planName: 'Small Enterprise Working Capital Loan',
    totalAmount: 60000,
    paidAmount: 25000,
    instalmentAmount: 5000,
    remainingInstalments: 7,
    totalInstalments: 12,
    nextDueDate: '2026-12-05',
    frequency: 'Monthly EMI',
    mandateStatus: 'ACTIVE',
    mandateMethod: 'eNACH / NetBanking Auto-Debit',
    mandateId: 'MND_NACH_772183921',
    lendingDetails: {
      loanAccountNo: 'LAN-MH-2026-881920',
      principalAmount: 50000,
      aprPercentage: 14.5,
      processingFee: 500,
      sanctionDate: '2026-06-05',
      coolingOffDaysRemaining: 0,
      lenderName: 'FairLend Capital Finance Limited (RBI Regd. NBFC-ND)',
      rbiRegistrationNo: 'B-05.02918',
      grievanceOfficer: {
        name: 'Suresh Menon, Nodal Grievance Officer',
        email: 'grievance@fairlend.in',
        phone: '1800-209-4411 (Toll Free, Mon-Sat 9AM-6PM)',
      },
    },
    paymentHistory: [
      { id: 'TXN_LOAN_01', date: '2026-11-05', amount: 5000, method: 'eNACH Mandate', status: 'SUCCESS', receiptNo: 'RCP-EMI-1105', description: 'Monthly EMI #5 (Principal ₹4,210 + Interest ₹790)' },
      { id: 'TXN_LOAN_02', date: '2026-10-05', amount: 5000, method: 'eNACH Mandate', status: 'SUCCESS', receiptNo: 'RCP-EMI-1005', description: 'Monthly EMI #4 (Principal ₹4,180 + Interest ₹820)' },
    ],
  },
  {
    id: 'inst-mobile',
    name: 'Apex Mobile & Electronics Hub',
    category: 'MOBILE_SHOP',
    categoryLabel: 'Retail Electronics Instalments',
    icon: Smartphone,
    color: 'from-purple-600 to-indigo-800',
    planName: 'Samsung Galaxy S24 Ultra (6-Month 0% Interest)',
    totalAmount: 48000,
    paidAmount: 32000,
    instalmentAmount: 8000,
    remainingInstalments: 2,
    totalInstalments: 6,
    nextDueDate: '2026-12-15',
    frequency: 'Monthly Product EMI',
    mandateStatus: 'ACTIVE',
    mandateMethod: 'UPI AutoPay (Paytm)',
    mandateId: 'MND_MOB_551029',
    retailDetails: {
      deviceModel: 'Samsung Galaxy S24 Ultra (256GB Titanium Gray)',
      imeiNumber: '358941094812345 / 358941094812346',
      downPayment: 12000,
      warrantyStatus: '1 Year Brand Warranty Active (Till Oct 2027)',
      invoiceNumber: 'INV-APEX-2026-4412',
    },
    paymentHistory: [
      { id: 'TXN_MOB_01', date: '2026-11-15', amount: 8000, method: 'UPI AutoPay', status: 'SUCCESS', receiptNo: 'RCP-MOB-1115', description: 'Product EMI 4 of 6' },
      { id: 'TXN_MOB_02', date: '2026-10-15', amount: 8000, method: 'UPI AutoPay', status: 'SUCCESS', receiptNo: 'RCP-MOB-1015', description: 'Product EMI 3 of 6' },
    ],
  },
  {
    id: 'inst-gym',
    name: 'Pulse Pro Fitness Club',
    category: 'MEMBERSHIP',
    categoryLabel: 'Fitness & Gym Membership',
    icon: Dumbbell,
    color: 'from-rose-600 to-pink-700',
    planName: 'Annual All-Access Fitness & Cardio Pass',
    totalAmount: 18000,
    paidAmount: 10500,
    instalmentAmount: 1500,
    remainingInstalments: 5,
    totalInstalments: 12,
    nextDueDate: '2026-12-01',
    frequency: 'Monthly Subscription',
    mandateStatus: 'ACTIVE',
    mandateMethod: 'UPI AutoPay (Google Pay)',
    mandateId: 'MND_GYM_331902',
    membershipDetails: {
      memberId: 'PULSE-VIP-8819',
      trainerName: 'Coach Rakesh Singh (Strength & Conditioning)',
      accessHours: '6:00 AM - 10:30 PM (All 7 Days)',
      freezeAllowedDays: 30,
    },
    paymentHistory: [
      { id: 'TXN_GYM_01', date: '2026-11-01', amount: 1500, method: 'UPI AutoPay', status: 'SUCCESS', receiptNo: 'RCP-GYM-1101', description: 'November All-Access Pass' },
    ],
  },
];

export default function CustomerPortalPage() {
  const [selectedInstId, setSelectedInstId] = useState<string>('inst-school');
  const [selectedTab, setSelectedTab] = useState<'plan' | 'history' | 'support'>('plan');
  const [paidToast, setPaidToast] = useState<string>('');
  const [vacationPause, setVacationPause] = useState<boolean>(false);
  const [dietaryPreference, setDietaryPreference] = useState<'Pure Veg' | 'Non-Veg' | 'Jain Veg'>('Pure Veg');
  const [institutionsState, setInstitutionsState] = useState<InstitutionProfile[]>(INSTITUTIONS);

  const active = institutionsState.find((i) => i.id === selectedInstId) || institutionsState[0];
  const IconComponent = active.icon;

  const handleSimulatePayment = () => {
    setPaidToast(`Instalment of ${formatCurrency(active.instalmentAmount)} successfully authorized for ${active.name}! Receipt generated.`);
    setTimeout(() => setPaidToast(''), 5500);
  };

  const toggleVacationPause = () => {
    const nextVal = !vacationPause;
    setVacationPause(nextVal);
    if (nextVal) {
      setPaidToast('🌴 Holiday Vacation Pause Activated: Daily meal billing is paused. Your subscription validity is automatically extended!');
    } else {
      setPaidToast('🍽️ Meal Deliveries Resumed: Regular breakfast & dinner schedule is now active.');
    }
    setTimeout(() => setPaidToast(''), 6000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      
      {/* ─── TOP NOTIFICATION / TOAST ─── */}
      {paidToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92%] p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center justify-between text-xs sm:text-sm font-semibold animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{paidToast}</span>
          </div>
          <button onClick={() => setPaidToast('')} className="text-white/60 hover:text-white text-xs pl-2">
            ✕
          </button>
        </div>
      )}

      {/* ─── PORTAL HEADER ─── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              CF
            </Link>
            <div>
              <span className="text-base font-extrabold text-slate-950 flex items-center gap-2">
                CollectFlow Payer Portal
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Self-Serve
                </span>
              </span>
              <span className="block text-[11px] text-slate-500 font-medium">
                Payer: <strong>Aarav Sharma</strong> (+91 9811122233)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* ─── INSTITUTE / BUSINESS SELECTOR ─── */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                Your Enrolled Institutions & Businesses
              </span>
              <p className="text-xs text-slate-600 mt-0.5">
                Select an institution below to view its fees, recurring rules, and specialized features:
              </p>
            </div>
            <span className="text-[11px] font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-full self-start sm:self-auto">
              5 Active Subscriptions
            </span>
          </div>

          {/* Selector Horizontal Grid / Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
            {institutionsState.map((inst) => {
              const CurIcon = inst.icon;
              const isSelected = inst.id === selectedInstId;
              return (
                <button
                  key={inst.id}
                  type="button"
                  onClick={() => setSelectedInstId(inst.id)}
                  className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-brand-50/80 border-brand-600 ring-2 ring-brand-500/25 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                    }`}>
                      <CurIcon className="w-4 h-4" />
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                    )}
                  </div>
                  <div>
                    <span className={`text-xs font-bold leading-tight block truncate ${isSelected ? 'text-brand-950 font-extrabold' : 'text-slate-800'}`}>
                      {inst.name}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
                      {inst.category === 'SCHOOL' && 'Fees & Tuition'}
                      {inst.category === 'MESS' && 'Meal Subscription'}
                      {inst.category === 'LENDING' && 'Regulated EMI'}
                      {inst.category === 'MOBILE_SHOP' && 'Device EMI'}
                      {inst.category === 'MEMBERSHIP' && 'Gym Pass'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── ACTIVE INSTITUTION BANNER ─── */}
        <div className={`bg-gradient-to-r ${active.color} text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all duration-300`}>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-white/20 text-white border border-white/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <IconComponent className="w-3.5 h-3.5" />
                {active.categoryLabel}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {active.name}
              </h1>
              <p className="text-xs sm:text-sm text-white/90">
                Active Plan: <strong className="underline underline-offset-2">{active.planName}</strong>
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-right min-w-[170px] self-start sm:self-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/80 block">Next Due Date</span>
              <span className="text-lg font-black tracking-tight block mt-0.5">{formatDate(active.nextDueDate)}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> AutoPay Ready
              </span>
            </div>
          </div>
        </div>

        {/* ─── NAVIGATION TABS ─── */}
        <div className="flex border-b border-slate-200 text-xs sm:text-sm font-bold text-slate-600 gap-6">
          <button
            onClick={() => setSelectedTab('plan')}
            className={`pb-3 transition-colors flex items-center gap-1.5 ${
              selectedTab === 'plan'
                ? 'border-b-2 border-brand-600 text-brand-600'
                : 'hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Plan & Category Controls
          </button>
          <button
            onClick={() => setSelectedTab('history')}
            className={`pb-3 transition-colors flex items-center gap-1.5 ${
              selectedTab === 'history'
                ? 'border-b-2 border-brand-600 text-brand-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            Receipts & Payment History ({active.paymentHistory.length})
          </button>
        </div>

        {/* ─── TAB 1: PLAN & DYNAMIC CATEGORY FEATURES ─── */}
        {selectedTab === 'plan' && (
          <div className="space-y-6">
            
            {/* 1. Universal Financial Overview Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Next Instalment / Subscription Debit
                  </span>
                  <div className="text-3xl font-black text-slate-950 mt-1">
                    {formatCurrency(active.instalmentAmount)}
                    <span className="text-xs font-bold text-slate-500 ml-2">/ {active.frequency}</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Automated Debit via {active.mandateMethod}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  className="inline-flex items-center justify-center gap-2 text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white px-6 py-3.5 rounded-xl shadow-md shadow-brand-600/25 transition-all text-center"
                >
                  Pay Now Ahead of Schedule <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
                  <span>Paid so far: <strong className="text-slate-900">{formatCurrency(active.paidAmount)}</strong></span>
                  <span>Total Facility: <strong className="text-slate-900">{formatCurrency(active.totalAmount)}</strong></span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(active.paidAmount / active.totalAmount) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-medium">
                  <span>{active.totalInstalments - active.remainingInstalments} Payments Cleared</span>
                  <span className="font-bold text-brand-600">{active.remainingInstalments} Instalments Remaining</span>
                </div>
              </div>

              {/* AutoPay Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Approved Mandate Rail:</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{active.mandateMethod}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Mandate Reference ID:</span>
                  <span className="font-mono text-slate-700 block mt-0.5">{active.mandateId}</span>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                DYNAMIC CATEGORY FEATURE SECTION ("COME AND GO" LOGIC)
               ════════════════════════════════════════════════════════════════ */}

            {/* ─── A. IF MESS / TIFFIN SELECTED: MEAL PAUSE & DIET CONTROLS COME ─── */}
            {active.category === 'MESS' && active.messDetails && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
                <div className="flex items-center justify-between border-b border-amber-200/60 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md">
                      <Utensils className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-amber-950">Mess & Tiffin Subscription Controls</h3>
                      <p className="text-xs text-amber-800">Specialized features for daily meal subscribers and hostel students</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold bg-amber-200 text-amber-900 px-3 py-1 rounded-full uppercase tracking-wider">
                    Mess Exclusive Feature
                  </span>
                </div>

                {/* Vacation Pause Feature (Toggles Meal Debit) */}
                <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">Holiday & Vacation Pause Mode</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        vacationPause ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {vacationPause ? 'PAUSED (On Vacation)' : 'ACTIVE (Delivering Daily)'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 max-w-lg">
                      Going home for holidays or exam leave? Toggle pause so meals are not prepared or billed. Your subscription days roll over automatically!
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={toggleVacationPause}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all whitespace-nowrap shadow-sm ${
                      vacationPause
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    {vacationPause ? (
                      <>
                        <Play className="w-4 h-4" /> Resume Daily Meals
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4" /> Pause Meals For Holidays
                      </>
                    )}
                  </button>
                </div>

                {/* Dietary Preference & Delivery Location */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-amber-200 space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Dietary Food Choice:
                    </span>
                    <div className="flex gap-2">
                      {(['Pure Veg', 'Non-Veg', 'Jain Veg'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setDietaryPreference(type);
                            setPaidToast(`Dietary preference updated to: ${type}`);
                            setTimeout(() => setPaidToast(''), 4000);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            dietaryPreference === type
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400 block pt-1">
                      Chef prepares your tiffin strictly according to this kitchen tag.
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-amber-200 space-y-1 text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Delivery Room / Address:</span>
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      {active.messDetails.tiffinAddress}
                    </p>
                    <span className="text-[11px] text-slate-500 block pt-1">
                      Meals used: <strong>{active.messDetails.monthlyMealsUsed} of {active.messDetails.monthlyMealsTotal}</strong> this month
                    </span>
                  </div>
                </div>

                {/* Today's Live Mess Menu */}
                <div className="p-4 rounded-2xl bg-amber-100/70 border border-amber-200 text-xs text-amber-950 space-y-1">
                  <span className="font-extrabold flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-amber-900">
                    <Coffee className="w-3.5 h-3.5 text-amber-700" /> Today's Scheduled Kitchen Menu:
                  </span>
                  <p className="text-xs font-medium">{active.messDetails.todayMenu}</p>
                </div>
              </div>
            )}

            {/* ─── B. IF LENDING AGENCY SELECTED: RBI REGULATORY DISCLOSURES & SANCTION LETTER COME ─── */}
            {active.category === 'LENDING' && active.lendingDetails && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-md">
                      <Landmark className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-950">RBI Digital Lending Regulatory Compliance Portal</h3>
                      <p className="text-xs text-emerald-800">Statutory disclosures as mandated by Reserve Bank of India Digital Lending Directions</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full uppercase tracking-wider">
                    RBI Compliant
                  </span>
                </div>

                {/* Key Fact Statement (KFS) Card */}
                <div className="bg-white rounded-2xl p-5 border border-emerald-200 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Key Fact Statement (KFS)</h4>
                      <p className="text-xs text-slate-500">Regulated NBFC: {active.lendingDetails.lenderName} (Reg: {active.lendingDetails.rbiRegistrationNo})</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert(`Downloading RBI Sanction Letter for Loan Account: ${active.lendingDetails?.loanAccountNo}`)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3.5 py-2 rounded-xl transition-all shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Sanction Letter (PDF)
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Loan Account No</span>
                      <span className="font-mono font-bold text-slate-900 block mt-0.5">{active.lendingDetails.loanAccountNo}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Principal Sanctioned</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{formatCurrency(active.lendingDetails.principalAmount)}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Annual Rate (APR)</span>
                      <span className="font-bold text-emerald-700 block mt-0.5">{active.lendingDetails.aprPercentage}% p.a. (Reducing)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Processing Fee</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{formatCurrency(active.lendingDetails.processingFee)}</span>
                    </div>
                  </div>
                </div>

                {/* Grievance Redressal & Pre-closure Transparency */}
                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-1.5">
                    <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                      Mandatory Grievance Officer:
                    </span>
                    <p className="font-semibold text-slate-900">{active.lendingDetails.grievanceOfficer.name}</p>
                    <p className="text-slate-600 font-mono text-[11px]">{active.lendingDetails.grievanceOfficer.email}</p>
                    <p className="text-slate-600 text-[11px]">{active.lendingDetails.grievanceOfficer.phone}</p>
                    <p className="text-[10px] text-slate-400 pt-1">
                      Escalation: RBI CMS Portal at cms.rbi.org.in (Toll free: 14448)
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-2">
                    <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                      Pre-closure & Foreclosure Rights:
                    </span>
                    <p className="text-slate-600 text-xs">
                      As per RBI guidelines for individual floating-rate micro loans, there is <strong>0% prepayment or foreclosure penalty</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => alert(`Foreclosure statement generated for Loan ${active.lendingDetails?.loanAccountNo}. Total remaining dues: ${formatCurrency(active.totalAmount - active.paidAmount)} with 0% penalty.`)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Receipt className="w-3.5 h-3.5" /> Request Foreclosure Statement
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── C. IF SCHOOL / COACHING SELECTED: STUDENT DETAILS & ACADEMIC BREAKDOWN COME ─── */}
            {active.category === 'SCHOOL' && active.schoolDetails && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
                <div className="flex items-center justify-between border-b border-blue-200/60 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                      <School className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-blue-950">Student Academic & Transport Ledger</h3>
                      <p className="text-xs text-blue-800">Official student fee division for tax rebates under Section 80C</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold bg-blue-200 text-blue-900 px-3 py-1 rounded-full uppercase tracking-wider">
                    School Fee Breakdown
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-blue-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Roll No</span>
                    <span className="font-mono font-bold text-slate-900 block mt-0.5">{active.schoolDetails.rollNumber}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-blue-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Class & Section</span>
                    <span className="font-bold text-slate-900 block mt-0.5">{active.schoolDetails.gradeSection}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-blue-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Academic Session</span>
                    <span className="font-bold text-slate-900 block mt-0.5">{active.schoolDetails.academicYear}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-blue-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Registered Parent</span>
                    <span className="font-bold text-slate-900 block mt-0.5">{active.schoolDetails.parentName}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-blue-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                    Monthly Fee Itemization:
                  </span>
                  <div className="divide-y divide-slate-100">
                    {active.schoolDetails.feeBreakdown.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <span className="text-slate-700 font-medium">{item.item}</span>
                        <span className="font-bold text-slate-900">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── D. IF MOBILE SHOP SELECTED: DEVICE IMEI & WARRANTY COME ─── */}
            {active.category === 'MOBILE_SHOP' && active.retailDetails && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
                <div className="flex items-center justify-between border-b border-purple-200/60 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md">
                      <Smartphone className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-purple-950">Device Instalment & Warranty Details</h3>
                      <p className="text-xs text-purple-800">Product purchase EMI schedule and digital GST invoice</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold bg-purple-200 text-purple-900 px-3 py-1 rounded-full uppercase tracking-wider">
                    Retail EMI
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-purple-200 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Purchased Device</span>
                    <span className="font-bold text-slate-900 block">{active.retailDetails.deviceModel}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-purple-200 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">IMEI / Serial Numbers</span>
                    <span className="font-mono text-slate-800 block text-[11px]">{active.retailDetails.imeiNumber}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-purple-200 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Warranty Status</span>
                    <span className="text-emerald-700 font-bold block">{active.retailDetails.warrantyStatus}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ─── E. IF GYM / MEMBERSHIP SELECTED: GYM PASS & FREEZE PRIVILEGE COME ─── */}
            {active.category === 'MEMBERSHIP' && active.membershipDetails && (
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
                <div className="flex items-center justify-between border-b border-rose-200/60 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md">
                      <Dumbbell className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-rose-950">Gym Pass & Membership Privileges</h3>
                      <p className="text-xs text-rose-800">Trainer assigned, facility access timings, and seasonal membership freeze</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold bg-rose-200 text-rose-900 px-3 py-1 rounded-full uppercase tracking-wider">
                    Fitness Membership
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-rose-200 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Membership Barcode ID</span>
                    <span className="font-mono font-bold text-slate-900 block">{active.membershipDetails.memberId}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-rose-200 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Personal Trainer</span>
                    <span className="font-bold text-slate-900 block">{active.membershipDetails.trainerName}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-rose-200 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Gym Hours</span>
                    <span className="font-bold text-slate-900 block">{active.membershipDetails.accessHours}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ─── TAB 2: RECEIPT HISTORY ─── */}
        {selectedTab === 'history' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Official Verified Receipts for {active.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Direct merchant receipts with verified transaction hashes</p>
              </div>
              <span className="text-xs font-bold text-slate-400">{active.paymentHistory.length} Receipts</span>
            </div>

            <div className="divide-y divide-slate-100">
              {active.paymentHistory.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(item.amount)} Paid</p>
                      <p className="text-xs text-slate-500">{item.description}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{formatDate(item.date)} • {item.method}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400 hidden sm:inline">{item.receiptNo}</span>
                    <button
                      type="button"
                      onClick={() => alert(`Downloading verified PDF receipt for ${item.receiptNo} from ${active.name}...`)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3.5 py-2 rounded-xl transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ─── FOOTER ─── */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Secured by CollectFlow • Dynamic Category-Compliant Collection Architecture</span>
      </footer>
    </div>
  );
}
