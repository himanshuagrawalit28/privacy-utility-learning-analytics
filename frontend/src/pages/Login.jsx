import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles } from 'lucide-react';
import { authAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [email, setEmail] = useState('e.vance@campus.edu');
  const [password, setPassword] = useState('PrivalearnSecure#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter institutional email and password.', 'warning');
      return;
    }

    try {
      setIsLoading(true);
      const res = await authAPI.login({ email, password });
      addToast(`Authenticated via API service. Welcome back, ${res.data.name}!`, 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.message || 'Authentication failed. Please verify credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutofill = () => {
    setEmail('e.vance@campus.edu');
    setPassword('PrivalearnSecure#2026');
    addToast('Demo credentials autofilled.', 'info', 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background ambient glow removed for cleaner UI */}

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600 mb-4">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">PrivaLearn AI</h1>
          <p className="text-slate-400 text-sm mt-1">
            Privacy-Preserving Student Risk Analytics & Differential Privacy Console
          </p>
        </div>

        {/* Login Form Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="faculty@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-slate-100 placeholder-slate-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-sm text-slate-100 placeholder-slate-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Autofill */}
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={handleAutofill}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1.5 font-medium transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fill Demo Credentials</span>
              </button>
              <span className="text-xs text-slate-500 font-mono">FERPA DP-SGD</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Authenticating via API...</span>
                </>
              ) : (
                <>
                  <span>Access Privacy Console</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Differential Privacy Cert: ε = 1.25, δ = 10⁻⁵</span>
          </div>
        </div>
      </div>
    </div>
  );
}
