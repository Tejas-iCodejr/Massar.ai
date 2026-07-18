import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Mail, Lock, ShieldCheck, Compass, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all credentials to synchronize your student record.');
      return;
    }

    setLoading(true);
    // Mimic database authentication latency
    setTimeout(() => {
      setLoading(false);
      setSuccess('Student authenticated! Launching personalized dashboard...');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen bg-[#f5f1e4] flex items-center justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl w-full">
        
        {/* Branding Sidebar */}
        <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-12 bg-white border border-[#d5d5d4] rounded-[40px] text-ink relative overflow-hidden">
          {/* Subtle background graphic */}
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#8ed462]/10 blur-xl" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-[#ff705d]/10 blur-xl" />

          <div className="relative">
            <div className="w-12 h-12 bg-[#8ed462] rounded-[15px] flex items-center justify-center mb-8 shadow-sm">
              <span className="text-white font-sans font-black text-2xl select-none">M</span>
            </div>
            
            <h2 className="font-sans font-black text-4xl uppercase tracking-tight leading-tight">
              YOUR <br />
              FUTURE <br />
              <span className="font-serif italic font-normal text-[#ff705d] lowercase tracking-normal">starts here</span>
            </h2>
            
            <p className="font-sans font-medium text-stone-gray text-xs leading-relaxed mt-4 max-w-xs">
              Synchronize your personal academic logs, plan your Middle East admissions, and unlock verified student discount packages.
            </p>
          </div>

          <div className="mt-12 lg:mt-24 pt-6 border-t border-hairline-mist border-dashed relative">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-ink">
              <ShieldCheck className="w-4 h-4 text-[#8ed462]" /> SECURE STUDENT ACCESS
            </div>
            <div className="font-mono text-[10px] text-stone-gray">
              Massar directory employs client-side credential verification protocols.
            </div>
          </div>
        </div>

        {/* Login Form card */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <Card className="bg-white p-8 sm:p-12 border border-[#d5d5d4] rounded-[40px] shadow-sm relative">
            <h3 className="font-sans font-black text-3xl uppercase tracking-tight text-ink mb-2">
              Sign In
            </h3>
            <p className="font-sans font-semibold text-stone-gray text-xs uppercase tracking-wider mb-8">
              Access your saved desk & comparison planners
            </p>

            {error && (
              <div className="p-4 bg-[#ff705d]/10 border border-[#ff705d]/30 text-ink font-sans text-xs font-semibold rounded-[15px] mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff705d] animate-ping" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-4 bg-[#8ed462]/10 border border-[#8ed462]/30 text-ink font-sans text-xs font-semibold rounded-[15px] mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8ed462] animate-bounce" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <div>
                <label className="block font-sans text-[11px] font-extrabold uppercase tracking-widest text-ink mb-2">
                  Student Email
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-gray">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    placeholder="student@school.ae"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#f5f1e4]/30 border border-hairline-mist p-4 pl-12 font-sans text-sm rounded-[15px] placeholder:text-stone-gray/60 focus:outline-none focus:border-[#8ed462] transition-colors text-ink"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-sans text-[11px] font-extrabold uppercase tracking-widest text-ink">
                    Secret Password
                  </label>
                  <a href="#forgot" className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#ff705d] hover:underline" onClick={(e) => e.preventDefault()}>
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-gray">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#f5f1e4]/30 border border-hairline-mist p-4 pl-12 pr-12 font-sans text-sm rounded-[15px] placeholder:text-stone-gray/60 focus:outline-none focus:border-[#8ed462] transition-colors text-ink"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-gray hover:text-ink"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me demo option */}
              <div className="flex items-center gap-2 py-2 select-none">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-hairline-mist text-[#8ed462] focus:ring-[#8ed462] cursor-pointer"
                />
                <label htmlFor="remember" className="font-sans text-xs font-semibold text-stone-gray uppercase tracking-wider cursor-pointer">
                  Keep active on this system
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full bg-[#8ed462] text-ink border border-ink hover:bg-opacity-95 p-4 rounded-[50px] font-sans font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                    <span>Synchronizing...</span>
                  </>
                ) : (
                  <>
                    <span>Unlock Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <span className="font-sans text-stone-gray text-xs">New student candidate? </span>
              <a href="#register" className="font-sans text-xs font-bold text-[#ff705d] hover:underline" onClick={(e) => e.preventDefault()}>
                Create school profile
              </a>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
