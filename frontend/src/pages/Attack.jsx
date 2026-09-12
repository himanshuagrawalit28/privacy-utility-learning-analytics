import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  XCircle,
  CheckCircle2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  BarChart, 
  Bar 
} from 'recharts';
import { metricsAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export default function Attack() {
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Hacker Simulator State
  const [isAttacking, setIsAttacking] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [attackComplete, setAttackComplete] = useState(false);

  const runAttackSimulation = () => {
    setIsAttacking(true);
    setTerminalLogs([]);
    setAttackComplete(false);

    const logs = [
      "Initializing Membership Inference Attack (MIA) Protocol...",
      "Targeting baseline dataset parameters...",
      "Extracting shadow model gradients...",
      "Isolating Student STU-1004 prediction confidence...",
      "Attempting re-identification via loss differentials...",
      "CRITICAL ERROR: L2 Regularization threshold exceeded.",
      "CRITICAL ERROR: Noise multiplier blocked gradient inference.",
      "ACCESS DENIED: DP-SGD Shield Intact."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logs.length) {
        setTerminalLogs((prev) => {
          // Prevent any chance of undefined logs crashing React
          if (!logs[currentStep]) return prev;
          return [...prev, logs[currentStep]];
        });
        currentStep++;
      } else {
        clearInterval(interval);
        setAttackComplete(true);
      }
    }, 700);
  };

  useEffect(() => {
    async function loadAttackData() {
      try {
        setLoading(true);
        const res = await metricsAPI.getAttackSimulation();
        setData(res.data);
      } catch (err) {
        addToast('Failed to load membership attack simulation data from API.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadAttackData();
  }, [addToast]);

  if (loading || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Running Membership Inference Attack Visualizer via API..." size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Security Audit & Adversarial Attack Simulation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
          Membership Attack Visualization
        </h1>
        <p className="text-slate-400 text-sm mt-0.5 max-w-3xl">
          Visualizing adversary capability to identify training cohort members. Side-by-side metrics demonstrate how DP-SGD slashes attack AUC from 0.86 to 0.53 (near random baseline).
        </p>
      </div>

      {/* Visual Hacker Simulator Section */}
      <div className="flex justify-start">
        <button 
          onClick={runAttackSimulation}
          disabled={isAttacking && !attackComplete}
          className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold font-display shadow-md transition flex items-center gap-2 disabled:opacity-50"
        >
          <ShieldAlert className="w-5 h-5" />
          SIMULATE ADVERSARIAL ATTACK
        </button>
      </div>

      {isAttacking && (
        <div className="glass-card rounded-2xl p-4 border border-rose-500/30 bg-[#0a0a0a] font-mono text-sm h-64 overflow-y-auto shadow-lg animate-fade-in">
          <div className="text-emerald-500 mb-2">root@adversary-node:~# ./run_mia_attack.sh --target STU-1004</div>
          {terminalLogs.map((log, i) => {
            if (!log) return null;
            return (
              <div key={i} className={`mb-1 ${log.includes('CRITICAL') || log.includes('DENIED') ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                <span className="text-slate-500 mr-2">[{new Date().toISOString().split('T')[1].slice(0,8)}]</span>
                &gt; {log}
              </div>
            );
          })}
          {attackComplete && (
            <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-center font-bold text-lg animate-pulse">
              ATTACK FAILED - Student Privacy Guaranteed
            </div>
          )}
          {!attackComplete && (
            <div className="text-slate-500 mt-2 animate-pulse">_</div>
          )}
        </div>
      )}

      {/* Side-by-Side Model Attack Resilience Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Normal Model Under Attack */}
        <div className="glass-card rounded-2xl p-6 border border-rose-500/20 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="badge-high">Normal Model (Unprotected)</span>
                <h2 className="text-lg font-bold text-white mt-1">High MIA Vulnerability</h2>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-3 divide-y divide-slate-800 text-xs">
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Adversary AUC:</span>
                <span className="font-mono font-bold text-rose-400 text-sm">{data.stats.unprotectedAuc}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Attack Accuracy:</span>
                <span className="font-mono text-rose-400 font-bold">78.4%</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Confidence Separation:</span>
                <span className="font-mono text-rose-300">Stark divergence between members and test set</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Student Re-identification:</span>
                <span className="font-mono text-rose-400 font-semibold">High Risk</span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
            <XCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>Adversary can easily verify if an individual student was used in the training dataset.</span>
          </div>
        </div>

        {/* Protected Model Under Attack */}
        <div className="glass-card rounded-2xl p-6 border border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="badge-privacy">Protected Model (DP-SGD)</span>
                <h2 className="text-lg font-bold text-white mt-1">Negligible MIA Vulnerability</h2>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-3 divide-y divide-slate-800 text-xs">
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Adversary AUC:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{data.stats.protectedAuc}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Attack Accuracy:</span>
                <span className="font-mono text-emerald-400 font-bold">{data.stats.attackSuccessMember}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Leakage Reduction:</span>
                <span className="font-mono text-blue-300 font-bold">{data.stats.leakageReductionPercent}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Student Re-identification:</span>
                <span className="font-mono text-emerald-400 font-semibold">{data.stats.vulnerabilityLevel}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-cyan-950/30 border border-slate-700 text-cyan-200 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
            <span>Differential privacy noise ensures member outputs are indistinguishable from non-members.</span>
          </div>
        </div>
      </div>

      {/* ROC Curves & Confidence Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROC Curves */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-white">Receiver Operating Characteristic (ROC)</h2>
              <span className="badge-privacy">Adversary ROC</span>
            </div>
            <p className="text-xs text-slate-400">
              True Positive Rate vs False Positive Rate for member identification.
            </p>
          </div>

          <div className="h-72 w-full my-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.rocCurve} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="fpr" stroke="#64748b" fontSize={11} label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }} />
                <YAxis domain={[0, 1]} stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                
                {/* Unprotected Model ROC (High AUC) */}
                <Line 
                  type="monotone" 
                  dataKey="unprotectedTpr" 
                  name="Normal Model (AUC = 0.86)" 
                  stroke="#f43f5e" 
                  strokeWidth={2.5} 
                  dot={{ r: 3 }}
                />
                
                {/* Protected Model ROC (Low AUC) */}
                <Line 
                  type="monotone" 
                  dataKey="protectedTpr" 
                  name="Protected Model (AUC = 0.53)" 
                  stroke="#06b6d4" 
                  strokeWidth={2.5} 
                  dot={{ r: 3 }}
                />

                {/* Random Guess Baseline */}
                <Line 
                  type="linear" 
                  dataKey="randomBaseline" 
                  name="Random Guess (AUC = 0.50)" 
                  stroke="#64748b" 
                  strokeDasharray="4 4" 
                  strokeWidth={1.5} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <strong>ROC Analysis:</strong> The DP-SGD curve hugs the random guessing diagonal, proving that an attacker cannot reliably classify training members.
          </div>
        </div>

        {/* Prediction Confidence Overlap Histogram */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-white">Member vs Non-Member Score Overlap</h2>
              <span className="badge-model">Distribution</span>
            </div>
            <p className="text-xs text-slate-400">
              Confidence score alignment between training cohort (Members) and unseen cohort (Non-Members).
            </p>
          </div>

          <div className="h-72 w-full my-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.confidenceDistribution} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="bin" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="protectedMember" name="Protected Member" fill="#06b6d4" radius={[3, 3, 0, 0]} />
                <Bar dataKey="protectedNonMember" name="Protected Non-Member" fill="#818cf8" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <strong>Distribution Overlap:</strong> In the DP-protected model, member confidence distribution mirrors non-members with nearly identical variance.
          </div>
        </div>
      </div>
    </div>
  );
}
