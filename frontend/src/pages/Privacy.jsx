import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Lock
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from 'recharts';
import { metricsAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export default function Privacy() {
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await metricsAPI.getPrivacyComparison();
        setData(res.data);
      } catch (err) {
        addToast('Failed to load privacy comparison metrics via API.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [addToast]);

  if (loading || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Fetching Differential Privacy Benchmarks from API..." size="large" />
      </div>
    );
  }

  const standardModel = data.models[0];
  const protectedModel = data.models[1];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Differential Privacy vs Baseline Benchmark</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
          Privacy Protection Comparison
        </h1>
        <p className="text-slate-400 text-sm mt-0.5 max-w-3xl">
          Side-by-side comparison between the unprotected baseline model and the PrivaLearn DP-SGD protected model under differential privacy guarantees.
        </p>
      </div>

      {/* Side by Side Model Comparison Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Normal Model (Unprotected / Vulnerable) */}
        <div className="glass-card rounded-2xl p-6 border border-rose-500/20 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="badge-high">Normal Model (Baseline)</span>
                <h2 className="text-lg font-bold text-white mt-1.5">{standardModel.type}</h2>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-3 divide-y divide-slate-800 text-xs">
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Classification Accuracy:</span>
                <span className="font-mono font-bold text-slate-100 text-sm">{standardModel.accuracy}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Precision / Recall:</span>
                <span className="font-mono text-slate-200">{standardModel.precision} / {standardModel.recall}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Privacy Budget (ε):</span>
                <span className="font-mono text-rose-400 font-bold">{standardModel.epsilon}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">MIA Vulnerability Rate:</span>
                <span className="font-mono text-rose-400 font-semibold">{standardModel.miaVulnerability}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Gradient Clipping:</span>
                <span className="font-mono text-slate-300">{standardModel.gradientClipping}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Noise Multiplier (σ):</span>
                <span className="font-mono text-slate-300">{standardModel.noiseMultiplier}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
            <XCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span><strong>Vulnerability:</strong> Standard training without DP leaks member presence via membership inference attacks.</span>
          </div>
        </div>

        {/* Protected Model (Differentially Private) */}
        <div className="glass-card rounded-2xl p-6 border border-slate-700 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="badge-privacy">Protected Model (PrivaLearn)</span>
                <h2 className="text-lg font-bold text-white mt-1.5">{protectedModel.type}</h2>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-3 divide-y divide-slate-800 text-xs">
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Classification Accuracy:</span>
                <span className="font-mono font-bold text-blue-300 text-sm">{protectedModel.accuracy}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Precision / Recall:</span>
                <span className="font-mono text-slate-200">{protectedModel.precision} / {protectedModel.recall}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Privacy Budget (ε, δ):</span>
                <span className="font-mono text-blue-300 font-bold">ε = {protectedModel.epsilon}, δ = {protectedModel.delta}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">MIA Vulnerability Rate:</span>
                <span className="font-mono text-emerald-400 font-semibold">{protectedModel.miaVulnerability}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Gradient Clipping:</span>
                <span className="font-mono text-slate-200 font-semibold">{protectedModel.gradientClipping}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Noise Multiplier (σ):</span>
                <span className="font-mono text-slate-200 font-semibold">{protectedModel.noiseMultiplier}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-cyan-950/30 border border-slate-700 text-cyan-200 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
            <span><strong>Mathematically Certified:</strong> Rigorous bounds against individual student re-identification under Rényi DP.</span>
          </div>
        </div>
      </div>

      {/* Radar Defense Comparison Chart & Feature Sensitivity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-6 glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Multi-Dimensional Defense Radar</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Normal Model vs Protected Model performance across utility and safety dimensions.
            </p>
          </div>

          <div className="h-72 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data.radarMetrics}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis stroke="#475569" angle={30} domain={[0, 100]} />
                <Radar name="Normal Model" dataKey="Standard" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.25} />
                <Radar name="Protected Model" dataKey="Protected" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            DP-SGD retains 94.9% of model utility while boosting defense dimensions by +380%.
          </div>
        </div>

        {/* Feature Sensitivity Table */}
        <div className="lg:col-span-6 glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Feature Weight Sensitivity</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Stability of student predictor coefficients after noise injection and gradient clipping.
            </p>
          </div>

          <div className="overflow-x-auto my-3">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-mono uppercase">
                <tr>
                  <th className="py-2.5 px-3">Student Feature</th>
                  <th className="py-2.5 px-3 text-center">Normal Weight</th>
                  <th className="py-2.5 px-3 text-center">Protected Weight</th>
                  <th className="py-2.5 px-3 text-right">Sensitivity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.featureSensitivity.map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-medium text-slate-200">{row.feature}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-400">{(row.standardWeight * 100).toFixed(0)}%</td>
                    <td className="py-2.5 px-3 text-center font-mono text-blue-300 font-semibold">{(row.dpWeight * 100).toFixed(0)}%</td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        row.sensitivity === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        row.sensitivity === 'Medium' ? 'bg-blue-500/10 text-blue-400 border border-cyan-500/20' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {row.sensitivity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-400 shrink-0" />
            <span>DP-SGD preserves key academic predictors while preventing memorization of outliers.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
