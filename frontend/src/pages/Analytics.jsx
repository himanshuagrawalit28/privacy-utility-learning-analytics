import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  ShieldCheck, 
  Sliders, 
  Cpu, 
  TrendingUp,
  Lock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { metricsAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export default function Analytics() {
  const { addToast } = useToast();
  const [tradeoffData, setTradeoffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEpsilon, setSelectedEpsilon] = useState(1.25);

  useEffect(() => {
    async function loadTradeoffData() {
      try {
        setLoading(true);
        const res = await metricsAPI.getTradeoffCurve();
        setTradeoffData(res.data);
      } catch (err) {
        addToast('Failed to load tradeoff analytics from API service.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadTradeoffData();
  }, [addToast]);

  const calcSimulatedUtility = (eps) => {
    const accuracy = Math.min(94.2, 70 + 24.2 * (1 - Math.exp(-0.8 * eps)));
    const privacy = Math.max(50, 100 - (eps * 3.8));
    const miaDefense = Math.max(50, 99.5 - (eps * 3.6));
    return {
      accuracy: parseFloat(accuracy.toFixed(1)),
      privacy: parseFloat(privacy.toFixed(1)),
      miaDefense: parseFloat(miaDefense.toFixed(1)),
    };
  };

  const currentSim = calcSimulatedUtility(selectedEpsilon);

  if (loading || tradeoffData.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Computing Pareto Tradeoff Analytics via API..." size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
          <LineChart className="w-4 h-4" />
          <span>Pareto Frontier Analysis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
          Accuracy vs. Privacy Tradeoff Analytics
        </h1>
        <p className="text-slate-400 text-sm mt-0.5 max-w-3xl">
          Differential privacy balances model utility with mathematical leakage bounds. Explore how shifting privacy budgets (ε) alters model risk prediction accuracy and defense resilience.
        </p>
      </div>

      {/* Interactive Epsilon Simulator Box */}
      <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div>
            <span className="badge-privacy">Interactive Simulation</span>
            <h2 className="text-base font-bold text-white mt-1">
              Differential Privacy Parameter Tuner
            </h2>
            <p className="text-xs text-slate-400">
              Drag the slider to test hypothetical privacy loss budgets (ε) and view simulated retention accuracy.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
              <span className="text-slate-400">Target: </span>
              <span className="text-cyan-300 font-bold">ε = {selectedEpsilon}</span>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>ε = 0.1 (Max Privacy)</span>
            <span className="text-cyan-400 font-bold">Recommended Zone (1.0 - 2.0)</span>
            <span>ε = 10.0 (Minimal Noise)</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="10.0"
            step="0.1"
            value={selectedEpsilon}
            onChange={(e) => setSelectedEpsilon(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Projected Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="text-xs text-slate-400">Projected Model Accuracy</div>
            <div className="text-2xl font-bold font-display text-indigo-400 mt-1">
              {currentSim.accuracy}%
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Retained prediction utility</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="text-xs text-slate-400">Projected Privacy Score</div>
            <div className="text-2xl font-bold font-display text-cyan-300 mt-1">
              {currentSim.privacy} / 100
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Theoretical anonymity score</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="text-xs text-slate-400">MIA Defense Efficacy</div>
            <div className="text-2xl font-bold font-display text-emerald-400 mt-1">
              {currentSim.miaDefense}%
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Membership attack resistance</div>
          </div>
        </div>
      </div>

      {/* Main Tradeoff Curve Chart */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-white">The Accuracy vs. Privacy Frontier</h2>
            <p className="text-xs text-slate-400">
              Dual-axis representation of Model Accuracy (%) and Attack Resistance across privacy bounds.
            </p>
          </div>
          <span className="badge-model">Pareto Optimal Curve</span>
        </div>

        <div className="h-80 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tradeoffData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
              <defs>
                <linearGradient id="anAccGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="anPrivGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
              <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area 
                type="monotone" 
                dataKey="accuracy" 
                name="Prediction Accuracy (%)" 
                stroke="#818cf8" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#anAccGrad2)" 
              />
              <Area 
                type="monotone" 
                dataKey="privacyScore" 
                name="Privacy Protection Score (%)" 
                stroke="#06b6d4" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#anPrivGrad2)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tradeoff Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <h2 className="text-base font-bold text-white mb-3">Evaluated Operating Configurations</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Epsilon Setting (ε)</th>
                <th className="py-3 px-4 text-center">Model Accuracy</th>
                <th className="py-3 px-4 text-center">Privacy Score</th>
                <th className="py-3 px-4 text-center">Attack Success</th>
                <th className="py-3 px-4 text-right">Deployment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {tradeoffData.map((row) => {
                const isSelected = row.epsilon === 1.2;
                return (
                  <tr key={row.epsilon} className={`hover:bg-slate-800/30 ${isSelected ? 'bg-cyan-500/10' : ''}`}>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      ε = {row.epsilon}
                      {isSelected && <span className="ml-2 text-[10px] text-cyan-400 font-sans font-bold">(ACTIVE)</span>}
                    </td>
                    <td className="py-3 px-4 text-center text-indigo-300 font-bold">{row.accuracy}%</td>
                    <td className="py-3 px-4 text-center text-cyan-300 font-bold">{row.privacyScore}%</td>
                    <td className="py-3 px-4 text-center text-emerald-400 font-semibold">{row.attackSuccess}%</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] ${
                        isSelected ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                        row.epsilon >= 8.0 ? 'bg-rose-500/10 text-rose-400' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {isSelected ? 'Active In Production' : row.epsilon >= 8.0 ? 'Vulnerable' : 'Certified'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
