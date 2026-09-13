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
  ChevronRight,
  ShieldCheck,
  Users,
  MoreHorizontal
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
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
  const [activeEpsilonIndex, setActiveEpsilonIndex] = useState(3); // Default to index 3 (ε=1.2)

  const dynamicMetrics = metrics && tradeoffData.length > 0 ? {
    ...metrics,
    modelAccuracy: tradeoffData[activeEpsilonIndex].accuracy,
    privacyScore: tradeoffData[activeEpsilonIndex].privacyScore,
    attackSuccessRate: tradeoffData[activeEpsilonIndex].attackSuccess,
    epsilonBudget: tradeoffData[activeEpsilonIndex].epsilon,
  } : metrics;

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [metricsRes, tradeoffRes, studentsRes] = await Promise.all([
          metricsAPI.getOverviewMetrics(),
          metricsAPI.getTradeoffCurve(),
          studentsAPI.getStudents({ limit: 4 })
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

  // Calculate the donut chart dash array
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (dynamicMetrics.privacyScore / 100) * circumference;

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Privacy-Aware Learning Analytics</span>
          </div>
          <h1 className="text-3xl font-medium text-slate-900 tracking-tight font-display">
            Good morning, Dr. Vance
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            A clear view of learning progress, without compromising student privacy.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 mt-2 md:mt-0">
          <Link
            to="/privacy"
            className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 transition flex items-center gap-2 shadow-sm"
          >
            <Info className="w-3.5 h-3.5" />
            <span>View guide</span>
          </Link>
          <Link
            to="/prediction"
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Run analysis</span>
          </Link>
        </div>
      </div>

      {/* Alert Box */}
      <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-100/50 text-indigo-600 rounded-lg shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Your workspace is protected</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">All insights are aggregated and anonymized. The current privacy budget is healthy.</p>
          </div>
        </div>
        <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 shrink-0">
          Review controls <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Workspace Overview text */}
      <div className="pt-4">
        <h2 className="text-base font-semibold text-slate-900">Workspace overview</h2>
        <p className="text-xs text-slate-500 mt-0.5">How your learning community is doing this week</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Learners */}
        <div className="glass-card rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Active learners</div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-display text-slate-900">{dynamicMetrics.totalStudents}</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              ↑ 12.8% <span className="text-slate-400 font-normal">vs. previous period</span>
            </div>
          </div>
        </div>

        {/* Card 2: Learning Engagement */}
        <div className="glass-card rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center mb-3">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Learning engagement</div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-display text-slate-900">{dynamicMetrics.modelAccuracy}%</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              ↑ 5.2% <span className="text-slate-400 font-normal">vs. previous period</span>
            </div>
          </div>
        </div>

        {/* Card 3: Privacy Budget */}
        <div className="glass-card rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Privacy Budget</div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-display text-slate-900">{dynamicMetrics.privacyScore}%</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              ● Healthy <span className="text-slate-400 font-normal">remaining this cycle</span>
            </div>
          </div>
        </div>

        {/* Card 4: Insights Generated */}
        <div className="glass-card rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Insights generated</div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-display text-slate-900">342</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              ↑ 18.0% <span className="text-slate-400 font-normal">vs. previous period</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Chart (Learning Engagement / Accuracy curve) */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-900">Learning engagement</h3>
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-[11px] text-slate-500 mb-6">Aggregated activity across all cohorts</p>
          
          <div className="flex items-center gap-4 mb-4 text-[10px] font-medium text-slate-500">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Engagement score</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full border border-slate-300"></span> Learner activity</div>
          </div>

          <div className="flex-1 w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tradeoffData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="dbBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" stroke="#cbd5e1" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#cbd5e1" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', fontSize: '11px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#dbBlue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Donut/Slider (Privacy Budget) */}
        <div className="glass-card rounded-xl p-6 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900">Privacy budget</h3>
              <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Safe
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-6">Control your insight sensitivity</p>
          </div>

          {/* Donut Chart */}
          <div className="flex flex-col items-center justify-center flex-1 my-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="45"
                  stroke="#f1f5f9"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="45"
                  stroke="#6366f1"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-in-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold font-display text-slate-900">{dynamicMetrics.privacyScore}%</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">Remaining</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <h4 className="text-sm font-bold text-slate-900">Balanced protection</h4>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                Make budget-aware active insights. Your current setting protects individual identities.
              </p>
            </div>
          </div>

          {/* Slider */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex justify-between text-[10px] text-slate-500 font-semibold mb-3 uppercase tracking-wider">
              <span>Sensitivity</span>
              <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">ε = {dynamicMetrics.epsilonBudget}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max={tradeoffData.length > 0 ? tradeoffData.length - 1 : 7} 
              value={activeEpsilonIndex}
              onChange={(e) => setActiveEpsilonIndex(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[9px] font-medium text-slate-400 mt-2">
              <span>More robust</span>
              <span>More detail</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Recent learner activity</h2>
            <p className="text-xs text-slate-500 mt-0.5">Privacy-preserving events from your workspace</p>
          </div>
          <Link to="/students" className="text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 transition">
            View all activity <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="glass-card rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 p-3 bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <div className="col-span-5 px-3">Learner</div>
            <div className="col-span-5 px-3">Activity</div>
            <div className="col-span-2 px-3 text-right">Time</div>
          </div>
          
          {/* Table Rows */}
          <div className="divide-y divide-slate-100">
            {recentStudents.map((student, i) => {
              // Mock some activity strings for the demo based on the loop index
              const activities = [
                { icon: '✓', text: 'Completed module 4', time: '8 min ago' },
                { icon: '●', text: 'Started a new lesson', time: '24 min ago' },
                { icon: '✓', text: `Scored ${(student.riskScore * 100).toFixed(0)}% on quiz`, time: '41 min ago' },
                { icon: '→', text: 'Logged into workspace', time: '1 hr ago' },
              ];
              const activity = activities[i % activities.length];
              
              // Generate a mock avatar color
              const colors = ['bg-purple-100 text-purple-700', 'bg-emerald-100 text-emerald-700', 'bg-orange-100 text-orange-700', 'bg-blue-100 text-blue-700'];
              const initials = student.name.split(' ').map(n => n[0]).join('');

              return (
                <div key={student.id} className="grid grid-cols-12 p-3 items-center hover:bg-slate-50/50 transition">
                  <div className="col-span-5 flex items-center gap-3 px-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${colors[i % colors.length]}`}>
                      {initials}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{student.name}</div>
                      <div className="text-[10px] text-slate-500">{student.department}</div>
                    </div>
                  </div>
                  <div className="col-span-5 px-3 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-[8px]">
                      {activity.icon}
                    </div>
                    <span className="text-xs text-slate-600 font-medium">{activity.text}</span>
                  </div>
                  <div className="col-span-2 px-3 text-right flex items-center justify-end gap-3">
                    <span className="text-[10px] text-slate-400 font-medium">{activity.time}</span>
                    <button className="text-slate-300 hover:text-slate-500">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
