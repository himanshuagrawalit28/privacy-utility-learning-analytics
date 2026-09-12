import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  TrendingUp, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  Sparkles,
  Lock,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  CartesianGrid,
  Legend
} from 'recharts';
import { metricsAPI, studentsAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export default function Dashboard() {
  const { addToast } = useToast();
  const [metrics, setMetrics] = useState(null);
  const [tradeoffData, setTradeoffData] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [metricsRes, tradeoffRes, studentsRes] = await Promise.all([
          metricsAPI.getOverviewMetrics(),
          metricsAPI.getTradeoffCurve(),
          studentsAPI.getStudents({ limit: 5 })
        ]);
        setMetrics(metricsRes.data);
        setTradeoffData(tradeoffRes.data);
        setRecentStudents(studentsRes.data);
      } catch (err) {
        addToast('Failed to load dashboard metrics from API service.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [addToast]);

  if (loading || !metrics) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Fetching Privacy-Preserving Evaluation Metrics from API..." size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-blue-600/10 via-indigo-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" />
              <span>Differential Privacy Production Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              Model Safety & Student Risk Overview
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-2xl">
              Real-time monitoring of differential privacy guarantees (ε = {metrics.epsilonBudget}, δ = {metrics.deltaBudget}) protecting {metrics.totalStudents} enrolled students while predicting academic risk with {metrics.modelAccuracy}% retained accuracy.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/prediction"
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm shadow-sm transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Predict Student Risk</span>
            </Link>
            <Link
              to="/privacy"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-800 font-medium text-sm border border-slate-700 transition flex items-center gap-2"
            >
              <span>Audit Benchmarks</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Model Accuracy */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Model Accuracy</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-white">{metrics.modelAccuracy}%</span>
            <span className="text-xs text-slate-500">vs {metrics.modelAccuracyBaseline}% baseline</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-400">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Only -{(metrics.modelAccuracyBaseline - metrics.modelAccuracy).toFixed(1)}% utility tradeoff for privacy</span>
          </div>
        </div>

        {/* KPI 2: Privacy Score */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Privacy Score</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-blue-700">{metrics.privacyScore}</span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Rényi DP Guaranteed</span>
          </div>
        </div>

        {/* KPI 3: Attack Success Rate */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Attack Success</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-emerald-400">{metrics.attackSuccessRate}%</span>
            <span className="text-xs text-slate-500 line-through">{metrics.attackSuccessBaseline}%</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <span>Near random guess baseline (50%)</span>
          </div>
        </div>

        {/* KPI 4: Privacy Budget (ε) */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Privacy Budget (ε)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-white font-mono">{metrics.epsilonBudget}</span>
            <span className="text-xs text-slate-500 font-mono">δ = {metrics.deltaBudget}</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-600">
            <span>Tight DP bounds applied</span>
          </div>
        </div>
      </div>

      {/* Accuracy vs Privacy Tradeoff Graph & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tradeoff Graph */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Accuracy vs. Privacy Tradeoff Graph</span>
                <span className="badge-privacy">Pareto Frontier</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Model Accuracy (utility) and Privacy Protection score as a function of Epsilon (ε).
              </p>
            </div>
            <Link 
              to="/analytics" 
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium transition"
            >
              <span>Explore full frontier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tradeoffData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="dbAccGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="dbPrivGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area 
                  type="monotone" 
                  dataKey="accuracy" 
                  name="Model Accuracy (%)" 
                  stroke="#818cf8" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#dbAccGrad)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="privacyScore" 
                  name="Privacy Score (%)" 
                  stroke="#22d3ee" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#dbPrivGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Risk Distribution Donut Chart */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-white">Student Risk Profile</h2>
              <span className="text-xs font-mono text-slate-500">Total: {metrics.totalStudents}</span>
            </div>
            <p className="text-xs text-slate-500">Predicted retention risk across university population</p>
          </div>

          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {metrics.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center">
            {metrics.riskDistribution.map((item) => (
              <div key={item.name} className="flex flex-col">
                <span className="text-[11px] text-slate-500">{item.name}</span>
                <span className="text-sm font-bold font-display" style={{ color: item.color }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Breakdown & Recent Predictions Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Breakdown BarChart */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Risk Distribution by Department</h2>
              <p className="text-xs text-slate-500">Evaluated with DP-SGD noise injected per cluster</p>
            </div>
            <span className="badge-model">5 Academic Units</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.departmentBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="department" stroke="#64748b" fontSize={10} tickFormatter={(val) => val.split(' ')[0]} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="low" name="Low Risk" fill="#10B981" stackId="a" />
                <Bar dataKey="medium" name="Medium Risk" fill="#F59E0B" stackId="a" />
                <Bar dataKey="high" name="High Risk" fill="#F43F5E" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Predictor Feed */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white">Recent Student Cohort</h2>
              <Link to="/students" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {recentStudents.map((student) => {
                let badgeClass = 'badge-low';
                if (student.predictedRisk === 'High') badgeClass = 'badge-high';
                if (student.predictedRisk === 'Medium') badgeClass = 'badge-medium';

                return (
                  <div key={student.id} className="p-3 rounded-xl bg-slate-50/60 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{student.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{student.id} • {student.department}</div>
                    </div>
                    <div className="text-right">
                      <span className={badgeClass}>{student.predictedRisk}</span>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">Score: {(student.riskScore * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200">
            <Link
              to="/students"
              className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-100 text-xs font-medium text-slate-600 flex items-center justify-center gap-1.5 transition"
            >
              <span>Manage Student Cohort</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
