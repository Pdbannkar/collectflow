'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  School, Utensils, Smartphone, Dumbbell, Building, Briefcase,
  CheckCircle2, ArrowRight, ArrowLeft, RefreshCw, ShieldCheck,
  Check, Sparkles, Building2, MapPin, Mail, Phone, User, AlertCircle
} from 'lucide-react';
import { verifyPanAutomatically, validatePanFormat, PanVerificationResult } from '@/lib/pan-verification';

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // PAN Verification State
  const [panInput, setPanInput] = useState<string>('');
  const [isVerifyingPan, setIsVerifyingPan] = useState<boolean>(false);
  const [panResult, setPanResult] = useState<PanVerificationResult | null>(null);
  const [panError, setPanError] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Owner & Auth
    ownerName: '',
    phone: '',
    otp: '123456',
    // Step 2: Business Details
    businessName: '',
    category: 'SCHOOL',
    email: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    gstin: '',
    // Step 3: Collection Preferences
    primaryFrequency: 'MONTHLY',
    estimatedCustomers: '100',
    preferredRail: 'UPI_AUTOPAY',
  });

  const categories = [
    { id: 'SCHOOL', label: 'School / College', icon: School, hint: 'Tuition, term & bus fees' },
    { id: 'TUITION', label: 'Coaching / Institute', icon: Building, hint: 'Course batches & instalments' },
    { id: 'MESS', label: 'Mess / Tiffin Service', icon: Utensils, hint: 'Monthly meal subscriptions' },
    { id: 'MOBILE_SHOP', label: 'Mobile & Electronics', icon: Smartphone, hint: 'Product instalments & EMIs' },
    { id: 'MEMBERSHIP', label: 'Gym / Fitness Club', icon: Dumbbell, hint: 'Monthly recurring memberships' },
    { id: 'OTHER', label: 'Other Business', icon: Briefcase, hint: 'Services, charges & recurring' },
  ];

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVerifyPan = async () => {
    const format = validatePanFormat(panInput);
    if (!format.valid) {
      setPanError(format.error || 'Invalid PAN structure');
      setPanResult(null);
      return;
    }

    setIsVerifyingPan(true);
    setPanError('');
    try {
      const result = await verifyPanAutomatically(panInput, formData.ownerName || formData.businessName);
      setPanResult(result);
      if (!result.valid) {
        setPanError(result.message);
      } else if (!formData.businessName && result.registeredName) {
        setFormData((prev) => ({ ...prev, businessName: result.registeredName || prev.businessName }));
      }
    } catch {
      setPanError('PAN verification service timed out. Please try again.');
    } finally {
      setIsVerifyingPan(false);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (currentStep === 1) {
      if (!formData.ownerName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (formData.phone.replace(/\D/g, '').length !== 10) {
        setErrorMessage('Please enter a valid 10-digit mobile number.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.businessName.trim()) {
        setErrorMessage('Please enter your business or institution name.');
        return;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setErrorMessage('Please enter a valid business email.');
        return;
      }
      if (!formData.city.trim() || !formData.state.trim()) {
        setErrorMessage('Please enter city and state.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      
      // Attempt backend API registration
      const res = await fetch('/api/businesses/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.businessName,
          category: formData.category,
          ownerName: formData.ownerName,
          phone: cleanPhone,
          email: formData.email,
          address: formData.address || 'Commercial Area',
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode || '400001',
          gstin: formData.gstin || undefined,
        }),
      });

      // Save user session in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'collectflow_user',
          JSON.stringify({
            id: 'usr_' + Date.now(),
            name: formData.ownerName,
            phone: cleanPhone,
            role: 'BUSINESS_OWNER',
            businessId: 'biz_' + Date.now(),
            business: {
              name: formData.businessName,
              category: formData.category,
              status: 'APPROVED',
            },
          })
        );
      }

      // Success! Route directly into the business owner dashboard
      router.push('/dashboard');
    } catch (err: any) {
      // Fallback demo redirect
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'collectflow_user',
          JSON.stringify({
            name: formData.ownerName,
            phone: formData.phone,
            role: 'BUSINESS_OWNER',
            business: { name: formData.businessName, status: 'APPROVED' },
          })
        );
      }
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background ambient accents */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-brand-200/40 blur-3xl pointer-events-none -z-10" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center text-white shadow-md shadow-brand-700/20 group-hover:scale-105 transition-transform">
            <RefreshCw className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-brand-950 via-brand-900 to-brand-700 bg-clip-text text-transparent">
            Collect<span className="text-brand-600">Flow</span>
          </span>
        </Link>
        <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Register Your Business
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Start collecting fees, subscriptions & instalments with UPI AutoPay in 3 minutes.
        </p>
      </div>

      {/* Wizard Progress Stepper */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl mb-6">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10 -translate-y-1/2" />
          
          {/* Step 1 Pill */}
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              currentStep >= 1 ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-300 text-slate-600'
            }`}>
              {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
            </span>
            <span className="text-xs font-bold text-slate-700 hidden sm:inline">Owner Info</span>
          </div>

          {/* Step 2 Pill */}
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              currentStep >= 2 ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-300 text-slate-600'
            }`}>
              {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
            </span>
            <span className="text-xs font-bold text-slate-700 hidden sm:inline">Business Details</span>
          </div>

          {/* Step 3 Pill */}
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              currentStep >= 3 ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-300 text-slate-600'
            }`}>
              3
            </span>
            <span className="text-xs font-bold text-slate-700 hidden sm:inline">Collection Setup</span>
          </div>
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl shadow-slate-200/80 rounded-3xl border border-slate-200/90">
          
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleNextStep}>
            
            {/* ─── STEP 1: OWNER SETUP ─── */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">Step 1: Account & Primary Contact</h3>
                  <p className="text-xs text-slate-500 mt-0.5">We will send verification OTP and payment notifications here.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name of Owner / Administrator *
                    </label>
                    <div className="relative rounded-xl border border-slate-300 focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-500/20 bg-white transition-all overflow-hidden flex items-center">
                      <span className="pl-3.5 pr-2 text-slate-400">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={formData.ownerName}
                        onChange={(e) => handleFieldChange('ownerName', e.target.value)}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full px-2 py-3 text-slate-900 text-sm focus:outline-none"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Mobile Number (For WhatsApp / SMS alerts) *
                    </label>
                    <div className="relative rounded-xl border border-slate-300 focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-500/20 bg-white transition-all overflow-hidden flex items-center">
                      <div className="flex items-center gap-1 pl-3.5 pr-2 py-3 bg-slate-50 border-r border-slate-200 text-slate-600 text-sm font-bold">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="98765 43210"
                        maxLength={10}
                        className="w-full px-3.5 py-3 text-slate-900 text-sm focus:outline-none font-medium"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">This number will act as your Super Administrator login ID.</p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/25 transition-all"
                  >
                    Continue to Business Profile <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 2: BUSINESS DETAILS ─── */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">Step 2: Business Category & Details</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Select how your customers will be categorized on receipts and invoices.</p>
                </div>

                {/* Category Grid */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                    Select Your Business Category *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = formData.category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleFieldChange('category', cat.id)}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'bg-brand-50 border-brand-600 ring-2 ring-brand-500/20 text-brand-950 font-bold'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-brand-600' : 'text-slate-500'}`} />
                          <span className="text-xs font-bold leading-tight block">{cat.label}</span>
                          <span className="text-[10px] text-slate-500 mt-1 leading-tight block">{cat.hint}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Business / Institution Name *
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => handleFieldChange('businessName', e.target.value)}
                      placeholder="e.g. Oxford Public School"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-brand-600 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      placeholder="admin@school.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-brand-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleFieldChange('city', e.target.value)}
                      placeholder="Pune"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-brand-600 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleFieldChange('state', e.target.value)}
                      placeholder="Maharashtra"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-brand-600 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">PIN Code</label>
                    <input
                      type="text"
                      value={formData.pinCode}
                      onChange={(e) => handleFieldChange('pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="411001"
                      maxLength={6}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-brand-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* ─── PAN Card Verification Block ─── */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-brand-50/40 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                      <ShieldCheck className="w-4 h-4 text-brand-600" />
                      Business / Proprietor PAN (Instant Validation)
                    </label>
                    <span className="text-[10px] font-semibold text-brand-600 bg-brand-100/60 px-2 py-0.5 rounded">
                      ITD Verification
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
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verify PAN
                        </>
                      )}
                    </button>
                  </div>

                  {panError && (
                    <div className="flex items-center gap-1.5 text-[11px] text-rose-600 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{panError}</span>
                    </div>
                  )}

                  {panResult && panResult.valid && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1 animate-fade-in">
                      <div className="flex items-center justify-between font-bold text-emerald-800">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> PAN Verified with ITD
                        </span>
                        <span className="bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                          {panResult.entityType}
                        </span>
                      </div>
                      {panResult.registeredName && (
                        <p className="text-[11px] text-emerald-900">
                          Registered Legal Name: <strong className="font-semibold">{panResult.registeredName}</strong>
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400">
                    Optional during registration. 4th letter identifies entity structure (P: Individual, C: Company, F: Firm).
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-all"
                  >
                    Next: Collection Setup <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 3: COLLECTION SETUP ─── */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">Step 3: Collection Rules & Preferences</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Customize your automatic fee debit engine and frequencies.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Primary Fee / Collection Frequency
                    </label>
                    <select
                      value={formData.primaryFrequency}
                      onChange={(e) => handleFieldChange('primaryFrequency', e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm focus:border-brand-600 focus:outline-none bg-white font-medium"
                    >
                      <option value="MONTHLY">Monthly Recurring (Most common for Fees & EMIs)</option>
                      <option value="QUARTERLY">Quarterly (School 3-Month Terms)</option>
                      <option value="WEEKLY">Weekly Collections</option>
                      <option value="DAILY">Daily Collections (Mess / Daily Dues)</option>
                      <option value="CUSTOM">Custom Schedule per Customer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Preferred Automatic Payment Rail
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div
                        onClick={() => handleFieldChange('preferredRail', 'UPI_AUTOPAY')}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          formData.preferredRail === 'UPI_AUTOPAY'
                            ? 'bg-brand-50 border-brand-600 ring-2 ring-brand-500/20'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-900 block">UPI AutoPay (NPCI)</span>
                        <span className="text-[11px] text-slate-500 block mt-1">GPay, PhonePe, Paytm recurring auto-debit.</span>
                      </div>

                      <div
                        onClick={() => handleFieldChange('preferredRail', 'PAYMENT_LINK')}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          formData.preferredRail === 'PAYMENT_LINK'
                            ? 'bg-brand-50 border-brand-600 ring-2 ring-brand-500/20'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-900 block">WhatsApp Payment Links</span>
                        <span className="text-[11px] text-slate-500 block mt-1">One-click UPI links dispatched before due date.</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" /> Free 30-Day Evaluation Activated
                    </p>
                    <p className="text-[11px]">
                      Your account will be provisioned with unlimited test transactions, sandboxed UPI AutoPay triggers, and full Customer Portal access.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-xl shadow-brand-600/30 transition-all"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Provisioning Account...
                      </>
                    ) : (
                      <>
                        Complete & Launch Dashboard <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </form>

          {/* Switch to login */}
          <div className="pt-6 mt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-brand-600 hover:underline">
                Sign in to your portal →
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
