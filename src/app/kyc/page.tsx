"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ChevronLeft, ChevronRight, CheckCircle, User, CreditCard, Landmark, Briefcase } from "lucide-react";

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "KYC", icon: CreditCard },
  { id: 3, label: "Employment", icon: Briefcase },
  { id: 4, label: "Bank", icon: Landmark },
];

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  options?: string[];
  value: string;
  error?: string;
  onChange: (name: string, value: string) => void;
}

function Field({
  label, name, type = "text", placeholder, maxLength,
  required = true, options, value, error, onChange,
}: FieldProps) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className={`w-full border-2 rounded-2xl px-4 py-3.5 text-gray-900 bg-white appearance-none ${
            error ? "border-red-400" : "border-purple-100 focus:border-purple-500"
          } focus:shadow-lg focus:shadow-purple-100 transition-all`}
        >
          <option value="">Select {label}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full border-2 rounded-2xl px-4 py-3.5 text-gray-900 ${
            error ? "border-red-400" : "border-purple-100 focus:border-purple-500"
          } focus:shadow-lg focus:shadow-purple-100 transition-all`}
        />
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function KYCPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    dob: user?.dob || "",
    gender: user?.gender || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    pincode: user?.pincode || "",
    pan: user?.pan || "",
    aadhaar: user?.aadhaar || "",
    employment: user?.employment || "",
    income: user?.income || "",
    company: "",
    bankName: user?.bankName || "",
    accountNo: user?.accountNo || "",
    ifsc: user?.ifsc || "",
  });

  const handleChange = (key: string, val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handlePanChange = (val: string) => {
    handleChange("pan", val.toUpperCase());
  };

  const handleAadhaarChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 12);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    handleChange("aadhaar", formatted);
  };

  const handleIfscChange = (val: string) => {
    handleChange("ifsc", val.toUpperCase());
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!form.name.trim()) newErrors.name = "Name is required";
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Valid email required";
      if (!form.dob) newErrors.dob = "Date of birth required";
      if (!form.gender) newErrors.gender = "Select gender";
      if (!form.address.trim()) newErrors.address = "Address required";
      if (!form.city.trim()) newErrors.city = "City required";
      if (!form.state.trim()) newErrors.state = "State required";
      if (form.pincode.length !== 6) newErrors.pincode = "Valid 6-digit pincode required";
    } else if (step === 2) {
      if (form.pan.length !== 10 || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan.toUpperCase())) {
        newErrors.pan = "Valid PAN required (e.g. ABCDE1234F)";
      }
      if (form.aadhaar.replace(/\s/g, "").length !== 12) newErrors.aadhaar = "Valid 12-digit Aadhaar required";
    } else if (step === 3) {
      if (!form.employment) newErrors.employment = "Select employment type";
      if (!form.income) newErrors.income = "Select income range";
    } else if (step === 4) {
      if (!form.bankName.trim()) newErrors.bankName = "Bank name required";
      if (form.accountNo.length < 8) newErrors.accountNo = "Valid account number required";
      if (form.ifsc.length !== 11) newErrors.ifsc = "Valid 11-character IFSC required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    if (step < 4) {
      setStep((s) => (s + 1) as Step);
    } else {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1500));
      updateUser({
        ...form,
        pan: form.pan.toUpperCase(),
        profileComplete: true,
        kycComplete: true,
      });
      router.replace("/dashboard");
    }
  };

  const f = (name: string) => form[name as keyof typeof form];
  const e = (name: string) => errors[name];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="gradient-purple px-5 pt-10 pb-6">
        <button onClick={() => step > 1 ? setStep((s) => (s - 1) as Step) : router.back()} className="flex items-center gap-1 text-purple-200 mb-4">
          <ChevronLeft size={18} />
          <span className="text-sm">Back</span>
        </button>
        <h1 className="text-white text-xl font-bold">Complete Your Profile</h1>
        <p className="text-purple-200 text-sm mt-1">Step {step} of 4</p>

        {/* Progress */}
        <div className="flex gap-1.5 mt-4">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                s.id <= step ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Step tabs */}
        <div className="flex mt-4 gap-2">
          {STEPS.map(({ id, label, icon: Icon }) => (
            <div key={id} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                id < step ? "bg-green-400" : id === step ? "bg-white" : "bg-white/20"
              }`}>
                {id < step ? (
                  <CheckCircle size={16} className="text-white" />
                ) : (
                  <Icon size={14} className={id === step ? "text-purple-700" : "text-white/50"} />
                )}
              </div>
              <span className={`text-[10px] font-medium ${id === step ? "text-white" : "text-white/50"}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-3 px-5 pt-6 pb-24 overflow-y-auto">
        {step === 1 && (
          <div className="space-y-4 fade-in">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Personal Information</h2>
            <Field label="Full Name" name="name" placeholder="As per Aadhaar" value={f("name")} error={e("name")} onChange={handleChange} />
            <Field label="Email Address" name="email" type="email" placeholder="you@example.com" value={f("email")} error={e("email")} onChange={handleChange} />
            <Field label="Date of Birth" name="dob" type="date" value={f("dob")} error={e("dob")} onChange={handleChange} />
            <Field label="Gender" name="gender" options={["Male", "Female", "Other"]} value={f("gender")} error={e("gender")} onChange={handleChange} />
            <Field label="Address" name="address" placeholder="House No, Street, Area" value={f("address")} error={e("address")} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="City" name="city" placeholder="City" value={f("city")} error={e("city")} onChange={handleChange} />
              <Field label="State" name="state" placeholder="State" value={f("state")} error={e("state")} onChange={handleChange} />
            </div>
            <Field label="Pincode" name="pincode" placeholder="6-digit pincode" maxLength={6} value={f("pincode")} error={e("pincode")} onChange={handleChange} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 fade-in">
            <h2 className="text-lg font-bold text-gray-900 mb-2">KYC Details</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 mb-2">
              <p className="text-blue-700 text-xs font-medium">🔒 Your KYC data is encrypted and stored securely as per RBI guidelines.</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                PAN Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.pan}
                onChange={(e) => handlePanChange(e.target.value)}
                placeholder="ABCDE1234F"
                maxLength={10}
                className={`w-full border-2 rounded-2xl px-4 py-3.5 text-gray-900 uppercase tracking-widest font-mono ${
                  errors.pan ? "border-red-400" : "border-purple-100 focus:border-purple-500"
                } focus:shadow-lg focus:shadow-purple-100 transition-all`}
              />
              {errors.pan && <p className="text-red-500 text-xs mt-1">{errors.pan}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Aadhaar Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={form.aadhaar}
                onChange={(e) => handleAadhaarChange(e.target.value)}
                placeholder="XXXX XXXX XXXX"
                maxLength={14}
                className={`w-full border-2 rounded-2xl px-4 py-3.5 text-gray-900 tracking-widest font-mono ${
                  errors.aadhaar ? "border-red-400" : "border-purple-100 focus:border-purple-500"
                } focus:shadow-lg focus:shadow-purple-100 transition-all`}
              />
              {errors.aadhaar && <p className="text-red-500 text-xs mt-1">{errors.aadhaar}</p>}
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3">
              <p className="text-yellow-700 text-xs">⚠ Please ensure your details match your official documents for seamless verification.</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 fade-in">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Employment Details</h2>
            <Field
              label="Employment Type"
              name="employment"
              options={["Salaried", "Self-Employed", "Business Owner", "Freelancer", "Student", "Homemaker"]}
              value={f("employment")} error={e("employment")} onChange={handleChange}
            />
            <Field
              label="Monthly Income"
              name="income"
              options={[
                "Below ₹15,000",
                "₹15,000 - ₹25,000",
                "₹25,000 - ₹40,000",
                "₹40,000 - ₹60,000",
                "₹60,000 - ₹1,00,000",
                "Above ₹1,00,000",
              ]}
              value={f("income")} error={e("income")} onChange={handleChange}
            />
            <Field label="Company/Organization Name" name="company" placeholder="Your employer name" required={false} value={f("company")} error={e("company")} onChange={handleChange} />
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <p className="text-green-800 text-sm font-semibold mb-1">💡 Increase your loan limit</p>
              <p className="text-green-700 text-xs">Higher income documentation can help you get a larger loan amount and better interest rates.</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 fade-in">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Bank Account Details</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 mb-2">
              <p className="text-blue-700 text-xs">💳 Loan amount will be directly credited to this bank account after approval.</p>
            </div>
            <Field
              label="Bank Name"
              name="bankName"
              options={[
                "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank",
                "Kotak Mahindra Bank", "Punjab National Bank", "Bank of Baroda",
                "Canara Bank", "Union Bank of India", "Yes Bank", "Other",
              ]}
              value={f("bankName")} error={e("bankName")} onChange={handleChange}
            />
            <Field label="Account Number" name="accountNo" placeholder="Enter account number" type="tel" value={f("accountNo")} error={e("accountNo")} onChange={handleChange} />
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Confirm Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="Re-enter account number"
                className="w-full border-2 border-purple-100 rounded-2xl px-4 py-3.5 text-gray-900 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-100 transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                IFSC Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.ifsc}
                onChange={(e) => handleIfscChange(e.target.value)}
                placeholder="e.g. SBIN0001234"
                maxLength={11}
                className={`w-full border-2 rounded-2xl px-4 py-3.5 text-gray-900 uppercase font-mono tracking-wider ${
                  errors.ifsc ? "border-red-400" : "border-purple-100 focus:border-purple-500"
                } focus:shadow-lg focus:shadow-purple-100 transition-all`}
              />
              {errors.ifsc && <p className="text-red-500 text-xs mt-1">{errors.ifsc}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-purple-50 px-5 py-4">
        <button
          onClick={handleNext}
          disabled={loading}
          className="w-full gradient-purple text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95 shadow-lg shadow-purple-200"
        >
          {loading ? (
            <span className="flex gap-1">
              <span className="w-2 h-2 bg-white rounded-full loading-dot" />
              <span className="w-2 h-2 bg-white rounded-full loading-dot" />
              <span className="w-2 h-2 bg-white rounded-full loading-dot" />
            </span>
          ) : (
            <>
              {step < 4 ? (
                <>Next <ChevronRight size={18} /></>
              ) : (
                <>Submit &amp; Get Loan Offer ✓</>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
