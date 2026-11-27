'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2, ArrowRight, ShieldCheck, Zap, Bell, FileText,
  CreditCard, Users, Building, School, Utensils, Smartphone,
  Dumbbell, TrendingUp, ChevronRight, HelpCircle, Star, Sparkles,
  Lock, RefreshCw, BarChart3, Clock, Check, Home
} from 'lucide-react';

export default function MarketingLandingPage() {
  const [activeTab, setActiveTab] = useState<'school' | 'coaching' | 'mess' | 'retail' | 'gym' | 'rent'>('school');
  const [customersCount, setCustomersCount] = useState<number>(250);
  const [avgAmount, setAvgAmount] = useState<number>(3500);

  // Dynamic calculations for the interactive savings calculator
  const monthlyVolume = customersCount * avgAmount;
  const estimatedHoursSaved = Math.round((customersCount * 0.25));
  const estimatedLateFeeRecovered = Math.round(monthlyVolume * 0.08);

  const industries = [
    {
      id: 'school',
      name: 'Schools & Colleges',
      icon: School,
      tagline: 'Term, Quarter & Monthly School Fees',
      desc: 'Automate student tuition, transportation, and laboratory fee schedules with automated parent notifications.',
      planExample: {
        title: 'Class 9 Tuition & Bus Fee',
        amount: '₹4,500',
        frequency: 'Every Month (10th of Month)',
        method: 'UPI AutoPay / eNACH',
        reminder: 'WhatsApp auto-alert 3 days before',
      },
    },
    {
      id: 'coaching',
      name: 'Coaching & Tuition',
      icon: Building,
      tagline: 'Course Batches & Monthly Coaching',
      desc: 'Set up fixed course instalment schedules or ongoing monthly tuition dues with zero manual tracking.',
      planExample: {
        title: 'JEE Advanced 6-Month Batch',
        amount: '₹3,000',
        frequency: '6 Monthly Instalments',
        method: 'AutoPay Mandate / Direct Link',
        reminder: 'Digital invoice sent automatically',
      },
    },
    {
      id: 'mess',
      name: 'Mess & Tiffin Services',
      icon: Utensils,
      tagline: 'Daily / Monthly Meal Subscriptions',
      desc: 'Collect recurring meal fees punctually on the 1st of every month without calling or following up with customers.',
      planExample: {
        title: 'Executive 2-Time Meal Plan',
        amount: '₹2,800',
        frequency: 'Monthly Subscription',
        method: 'UPI AutoPay Recurring',
        reminder: 'Automated receipt upon debit',
      },
    },
    {
      id: 'rent',
      name: 'House & Commercial Rent',
      icon: Home,
      tagline: 'Flat, PG, Hostel & Commercial Rent',
      desc: 'Landlords and property managers collect monthly rent on the 1st/5th automatically with instant HRA tax receipts.',
      planExample: {
        title: '2BHK Apartment Rent + Maintenance',
        amount: '₹20,000',
        frequency: 'Monthly on 5th',
        method: 'UPI AutoPay (Google Pay / PhonePe)',
        reminder: 'Landlord PAN verified HRA receipt sent',
      },
    },
    {
      id: 'retail',
      name: 'Mobile & Electronics',
      icon: Smartphone,
      tagline: 'Customer Purchase EMIs & Instalments',
      desc: 'Offer structured in-store instalments for appliances and gadgets while securing on-time automated repayments.',
      planExample: {
        title: 'Smartphone 0% Interest EMI',
        amount: '₹2,500',
        frequency: 'Monthly for 6 Months',
        method: 'eNACH Bank Mandate',
        reminder: 'Instant SMS & WhatsApp confirmation',
      },
    },
    {
      id: 'gym',
      name: 'Gyms & Clubs',
      icon: Dumbbell,
      tagline: 'Recurring Membership Passes',
      desc: 'Auto-renew fitness memberships every month or quarter with automated card or UPI AutoPay renewal.',
      planExample: {
        title: 'Gold Fitness & Cardio Pass',
        amount: '₹1,500',
        frequency: 'Monthly Auto-Renewal',
        method: 'UPI AutoPay',
        reminder: 'Membership validity auto-extends',
      },
    },
  ];

  const activeIndustry = industries.find((i) => i.id === activeTab) || industries[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      {/* ─── TOP ANNOUNCEMENT BANNER ─── */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 text-white text-xs sm:text-sm font-medium py-2 px-4 text-center flex items-center justify-center gap-2">
        <span className="bg-brand-500/30 text-brand-200 border border-brand-400/30 text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
          New in 2026
        </span>
        <span>Instant UPI AutoPay & WhatsApp Reminders for all Indian Businesses.</span>
        <Link href="/register" className="underline font-semibold hover:text-brand-200 ml-1 inline-flex items-center gap-0.5">
          Sign Up Free <ArrowRight className="w-3 h-3 inline" />
        </Link>
      </div>

      {/* ─── STICKY NAVIGATION BAR ─── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-900 flex items-center justify-center text-white shadow-md shadow-brand-700/20 group-hover:scale-105 transition-transform">
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-brand-950 via-brand-900 to-brand-700 bg-clip-text text-transparent">
                Collect<span className="text-brand-600">Flow</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                Business Collections
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#solutions" className="hover:text-brand-700 transition-colors">Solutions</a>
            <a href="#features" className="hover:text-brand-700 transition-colors">Features</a>
            <a href="#calculator" className="hover:text-brand-700 transition-colors">ROI Calculator</a>
            <a href="#pricing" className="hover:text-brand-700 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-brand-700 transition-colors">FAQ</a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 hover:text-brand-700 px-4 py-2.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl shadow-md shadow-brand-600/25 hover:shadow-lg hover:shadow-brand-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100">
        {/* Glow backdrop circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-indigo-200/30 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs sm:text-sm font-semibold shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Next-Gen Payment Mandates & Fee Engine
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
                Collect Customer Fees & Instalments on{' '}
                <span className="bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-600 bg-clip-text text-transparent">
                  Complete Autopilot.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                One unified platform for <strong>Schools, Coaching Institutes, Mess Services, Mobile & Electronics Stores</strong> to collect recurring fees and instalments through UPI AutoPay, smart WhatsApp reminders, and instant digital receipts.
              </p>

              {/* Primary Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-bold bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl shadow-xl shadow-brand-600/30 hover:shadow-2xl hover:shadow-brand-600/40 hover:-translate-y-0.5 transition-all text-center"
                >
                  Create Business Account
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-7 py-4 rounded-xl shadow-sm hover:border-slate-400 transition-all text-center"
                >
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Try 1-Click Demo Login
                </Link>
              </div>

              {/* Micro-guarantees */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  30-day full-featured free trial
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  RBI Compliance-Ready Architecture
                </span>
              </div>
            </div>

            {/* Right Visual: Interactive Live Platform Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl bg-white border border-slate-200/90 shadow-2xl p-6 sm:p-7 space-y-6">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      ₹
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Today's Collections</h4>
                      <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +18.4% vs last week
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live AutoPay
                  </span>
                </div>

                {/* Big Stat */}
                <div>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Settled Amount</span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-1">₹48,500<span className="text-lg font-normal text-slate-400">.00</span></div>
                  <p className="text-xs text-slate-500 mt-1">14 successful recurring debits processed today</p>
                </div>

                {/* Recent Collections Feed */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Live Stream</span>
                  
                  {/* Item 1 */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                        SS
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Aarav Sharma (Class 8)</p>
                        <p className="text-[11px] text-slate-500">Sunrise Public School • Monthly</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900">₹3,200</span>
                      <span className="block text-[10px] font-semibold text-emerald-600">UPI AutoPay</span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                        RK
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Rohit Kumar</p>
                        <p className="text-[11px] text-slate-500">Smart Mobile Store • EMI 3 of 6</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900">₹2,150</span>
                      <span className="block text-[10px] font-semibold text-emerald-600">eNACH Debit</span>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                        PT
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Pooja Tiwari</p>
                        <p className="text-[11px] text-slate-500">Fresh Mess • Monthly Plan</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900">₹2,500</span>
                      <span className="block text-[10px] font-semibold text-brand-600">WhatsApp Link</span>
                    </div>
                  </div>
                </div>

                {/* Automation Status Card */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-brand-900 to-indigo-950 text-white flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-4 h-4 text-emerald-400 animate-bounce" />
                    <div>
                      <p className="text-xs font-semibold">Smart WhatsApp Alerts</p>
                      <p className="text-[10px] text-slate-300">24 automated receipts dispatched</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    Active
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── TRUST & INTEGRATION LOGOS ─── */}
      <section className="py-10 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            Supported by Leading Indian Payment Rails & Gateways
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-600 opacity-80 font-bold text-sm sm:text-base">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> UPI AutoPay (NPCI)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> eNACH Mandates
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Cashfree Subscriptions
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Razorpay Subscriptions
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> PayU Recurring
            </span>
          </div>
        </div>
      </section>

      {/* ─── INDUSTRY SOLUTIONS TABS ─── */}
      <section id="solutions" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
              Tailored For Your Sector
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              One Engine. Customized for Every Recurring Business.
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Never use rigid loan-recovery or generic invoicing software. CollectFlow is tailored for the natural collection rhythms of your industry.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pb-4 sm:pb-0 mb-10 no-scrollbar">
            {industries.map((ind) => {
              const Icon = ind.icon;
              const isActive = activeTab === ind.id;
              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveTab(ind.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-brand-900 text-white shadow-lg shadow-brand-900/20'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-300' : 'text-slate-500'}`} />
                  {ind.name}
                </button>
              );
            })}
          </div>

          {/* Industry Showcase Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="text-xs font-extrabold text-brand-600 tracking-wider uppercase">
                  {activeIndustry.tagline}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Automate payments for {activeIndustry.name}
                </h3>
                <p className="text-slate-600 text-base leading-relaxed">
                  {activeIndustry.desc}
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    Customizable collection frequencies: Daily, Weekly, Monthly, or Quarterly
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    Automated branded WhatsApp receipts and payment reminders
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    Self-service Customer Portal so parents and clients check their fee receipts
                  </div>
                </div>
                <div className="pt-4">
                  <Link
                    href={`/register?category=${activeIndustry.id}`}
                    className="inline-flex items-center gap-2 text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl shadow-md transition-all"
                  >
                    Set Up {activeIndustry.name} Account <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Mock Plan Preview */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-brand-50/50 rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Example Plan Preset</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Ready to Deploy</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{activeIndustry.planExample.title}</h4>
                  <div className="text-3xl font-extrabold text-brand-900 mt-1">{activeIndustry.planExample.amount}</div>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Frequency:</span>
                    <span className="font-semibold text-slate-800">{activeIndustry.planExample.frequency}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Payment Rail:</span>
                    <span className="font-semibold text-slate-800">{activeIndustry.planExample.method}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Customer Communication:</span>
                    <span className="font-semibold text-slate-800">{activeIndustry.planExample.reminder}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── CORE PLATFORM FEATURES ─── */}
      <section id="features" className="py-20 sm:py-28 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
              Enterprise Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Everything You Need to Manage Dues & Subscriptions
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Built with iron-clad tenant isolation, multi-gateway support, and financial audit logs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-brand-300 hover:shadow-xl transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-600/30">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">UPI AutoPay & eNACH Mandates</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Customers approve payment mandates once with Google Pay, PhonePe, Paytm or Net Banking. Subsequent debits trigger automatically on their due date.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-brand-300 hover:shadow-xl transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Smart WhatsApp Reminders</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Send polite, automated WhatsApp reminders 3 days and 1 day before due date with instant 1-click payment links for non-mandate customers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-brand-300 hover:shadow-xl transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Automated Branded Receipts</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Deliver official GST or standard PDF receipts directly into parents' and customers' WhatsApp within seconds of confirmed settlement.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-brand-300 hover:shadow-xl transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Customer & Parent Portal</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                A simple mobile-friendly OTP portal where your clients view upcoming instalment dates, past payments, and download lifetime receipts.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-brand-300 hover:shadow-xl transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-600/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Direct Merchant Settlement</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Funds never pass through platform pool accounts. Money routes directly from payer to your approved merchant bank account via Cashfree or Razorpay.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-brand-300 hover:shadow-xl transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/30">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Automated Retry & Reconciliation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Intelligent retries for failed auto-debits (e.g. low balance on salary days) and automated webhook reconciliation so books are always accurate.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ─── INTERACTIVE ROI & SAVINGS CALCULATOR ─── */}
      <section id="calculator" className="py-20 sm:py-28 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest bg-brand-950 border border-brand-800 px-3 py-1 rounded-full">
              Live ROI Calculator
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              See How Much Time & Money CollectFlow Saves You
            </h2>
            <p className="text-slate-400 text-base">
              Adjust your customer count and monthly instalment amount below to see the impact.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-2xl">
            
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-300">Active Recurring Customers / Students</label>
                  <span className="text-2xl font-extrabold text-brand-400">{customersCount}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="2000"
                  step="10"
                  value={customersCount}
                  onChange={(e) => setCustomersCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>20 customers</span>
                  <span>2,000 customers</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-300">Average Fee / Instalment Amount</label>
                  <span className="text-2xl font-extrabold text-brand-400">₹{avgAmount.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="25000"
                  step="500"
                  value={avgAmount}
                  onChange={(e) => setAvgAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>₹500 / mo</span>
                  <span>₹25,000 / mo</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700 text-xs text-slate-400">
                💡 <strong>Calculation note:</strong> Based on an average 15 minutes spent per manual follow-up, receipt drafting, and reconciliation, plus an 8% overdue reduction with automated UPI AutoPay.
              </div>
            </div>

            {/* Result Display */}
            <div className="lg:col-span-5 bg-gradient-to-br from-brand-900 to-indigo-950 rounded-2xl border border-brand-700/50 p-7 space-y-6 text-center">
              <div>
                <span className="text-xs uppercase font-bold text-brand-300 tracking-wider">Estimated Monthly Volume</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                  ₹{monthlyVolume.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-brand-800">
                <div>
                  <span className="text-xs text-slate-300">Admin Hours Saved</span>
                  <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                    ~{estimatedHoursSaved} hrs<span className="text-xs font-normal text-slate-300">/mo</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-300">Overdue Rescued</span>
                  <div className="text-2xl font-extrabold text-amber-300 mt-1">
                    ₹{estimatedLateFeeRecovered.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-300">/mo</span>
                  </div>
                </div>
              </div>

              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center gap-2 text-sm font-bold bg-white hover:bg-slate-100 text-brand-950 px-6 py-3.5 rounded-xl transition-all shadow-md"
              >
                Start Collecting Automatically <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ─── TRANSPARENT PRICING ─── */}
      <section id="pricing" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
              Predictable Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Simple Plans. Never Hidden Fees.
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Start with our 30-day trial. Upgrade as your customer base grows.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            
            {/* Free Trial Plan */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Starter Evaluation</span>
                <h3 className="text-2xl font-bold text-slate-900">30-Day Free Trial</h3>
                <div className="text-4xl font-extrabold text-slate-900">₹0 <span className="text-sm font-medium text-slate-500">for 30 days</span></div>
                <p className="text-xs text-slate-600">Perfect to test UPI AutoPay, customer portal, and receipts risk-free.</p>
                <div className="pt-4 space-y-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Up to 50 Customers</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> UPI AutoPay & Payment Links</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> WhatsApp Receipts</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Customer Self-Serve Portal</div>
                </div>
              </div>
              <div className="pt-8">
                <Link
                  href="/register"
                  className="w-full inline-block text-center text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-xl transition-colors"
                >
                  Start 30-Day Free Trial
                </Link>
              </div>
            </div>

            {/* Growth Plan (Highlighted) */}
            <div className="bg-gradient-to-b from-brand-900 via-brand-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative flex flex-col justify-between border-2 border-brand-500">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                Most Popular for Schools & Stores
              </div>
              <div className="space-y-4">
                <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">Growth Tier</span>
                <h3 className="text-2xl font-bold text-white">Professional</h3>
                <div className="text-4xl font-extrabold text-white">₹2,499 <span className="text-sm font-medium text-slate-300">/ month</span></div>
                <p className="text-xs text-slate-300">For established schools, coaching centers, and multi-customer stores.</p>
                <div className="pt-4 space-y-3 text-xs text-slate-200">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> <strong>Unlimited Customers</strong></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> UPI AutoPay + eNACH NetBanking</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Bulk CSV Customer Import</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Automated Smart Retries & WhatsApp</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Up to 10 Staff Accounts</div>
                </div>
              </div>
              <div className="pt-8">
                <Link
                  href="/register"
                  className="w-full inline-block text-center text-sm font-bold bg-brand-500 hover:bg-brand-400 text-slate-950 py-3 rounded-xl transition-all shadow-lg shadow-brand-500/25"
                >
                  Start Professional Plan
                </Link>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Institutions</span>
                <h3 className="text-2xl font-bold text-slate-900">Enterprise</h3>
                <div className="text-4xl font-extrabold text-slate-900">₹7,999 <span className="text-sm font-medium text-slate-500">/ month</span></div>
                <p className="text-xs text-slate-600">Multi-branch institutes, large colleges, and franchise chains.</p>
                <div className="pt-4 space-y-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Multi-branch Branch Isolation</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Custom ERP / School Software API Sync</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Dedicated Account Manager</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Priority Gateway Onboarding Support</div>
                </div>
              </div>
              <div className="pt-8">
                <Link
                  href="/register"
                  className="w-full inline-block text-center text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl transition-colors"
                >
                  Contact for Enterprise
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── FREQUENTLY ASKED QUESTIONS (FAQ) ─── */}
      <section id="faq" className="py-20 sm:py-28 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-slate-950">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-base font-bold text-slate-900">Is this a loan recovery software?</h4>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                <strong>No.</strong> CollectFlow is a general-purpose SaaS collection platform designed for legitimate Indian businesses—such as schools collecting tuition, coaching institutes collecting course fees, tiffin services collecting meal plans, and stores collecting product instalments.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-base font-bold text-slate-900">How does UPI AutoPay work for my customers?</h4>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                When you create a payment plan, your customer receives an authorization link. They open Google Pay, PhonePe, Paytm, or BHIM, enter their UPI PIN once to approve the mandate, and future instalments debit automatically on the scheduled date!
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-base font-bold text-slate-900">Where do customer payments settle?</h4>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Directly into your own verified merchant bank account via our integrated payment gateway adapters (Cashfree, Razorpay, or PayU). CollectFlow never acts as a holding pool for your collections.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-base font-bold text-slate-900">Can my customers access their own receipts?</h4>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Yes! Every customer gets access to the lightweight <strong>Customer Portal</strong> using just their mobile number and an OTP. They can check upcoming instalment dates and download official PDF receipts anytime.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ─── BOTTOM CTA BANNER ─── */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-brand-950 via-brand-900 to-indigo-950 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Stop Chasing Payments. Start Automating Today.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Set up your business in under 3 minutes. Test the live workflow risk-free with 30 days of complimentary access.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-bold bg-brand-500 hover:bg-brand-400 text-slate-950 px-8 py-4 rounded-xl shadow-xl transition-all"
            >
              Start Free 30-Day Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 px-7 py-4 rounded-xl transition-all"
            >
              Sign In to Existing Portal
            </Link>
          </div>
        </div>
      </section>

      {/* ─── COMPREHENSIVE FOOTER ─── */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
                CF
              </div>
              <span className="text-base font-bold text-white tracking-tight">CollectFlow</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              India's specialized recurring payment & instalment management SaaS. Built for transparency, convenience, and peace of mind.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Industries</h5>
            <ul className="space-y-2">
              <li><a href="#solutions" className="hover:text-white transition-colors">Schools & Colleges</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">Coaching & Tuitions</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">Mess & Tiffin Services</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">Retail EMIs & Gadgets</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Platform</h5>
            <ul className="space-y-2">
              <li><Link href="/register" className="hover:text-white transition-colors">Business Registration</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Business Login</Link></li>
              <li><Link href="/portal" className="hover:text-white transition-colors">Customer Portal</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Super Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Compliance & Safety</h5>
            <ul className="space-y-2 text-[11px]">
              <li>✓ NPCI UPI AutoPay Ready</li>
              <li>✓ RBI Compliant Merchant Rails</li>
              <li>✓ End-to-End Tenant Isolation</li>
              <li>✓ 256-Bit SSL Encryption</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-900 text-center text-slate-500 text-[11px]">
          © {new Date().getFullYear()} CollectFlow Technologies India. All rights reserved. Not a banking company or NBFC.
        </div>
      </footer>
    </div>
  );
}
