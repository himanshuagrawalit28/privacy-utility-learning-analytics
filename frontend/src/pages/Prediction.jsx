import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Sliders, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { predictionAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Prediction() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    attendance: 72,
    midtermScore: 65,
    studyHours: 10,
    absences: 5,
    enableDP: true,
    epsilon: 1.25,
  });

  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const calculateRisk = async () => {
    try {
      setIsCalculating(true);
      const res = await predictionAPI.predictRisk(formData);
      setResult(res.data);
    } catch (err) {
      console.error('Failed to compute prediction via API service.', err);
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateRisk();
    }, 300);
    return () => clearTimeout(timer);
  }, [formData]);

  const handleCalculate = (e) => {
    e.preventDefault();
    calculateRisk();
  };

  const loadPreset = (presetType) => {
    if (presetType === 'struggling') {
      setFormData((prev) => ({ ...prev, attendance: 55, midtermScore: 48, studyHours: 5, absences: 9 }));
      addToast('Loaded: Struggling Student Profile', 'info');
    } else if (presetType === 'average') {
      setFormData((prev) => ({ ...prev, attendance: 80, midtermScore: 74, studyHours: 12, absences: 3 }));
      addToast('Loaded: Average Student Profile', 'info');
    } else if (presetType === 'honor') {
      setFormData((prev) => ({ ...prev, attendance: 96, midtermScore: 94, studyHours: 22, absences: 0 }));
      addToast('Loaded: High Achieving Student Profile', 'info');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-500 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Interactive Student Risk Predictor</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight">
          Individual Prediction Simulator
        </h1>
        <p className="text-slate-500 text-sm mt-0.5 max-w-2xl">
          Input student features and submit to our backend inference engine for differential privacy noise perturbation and academic risk assessment.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="text-slate-500 font-semibold">Quick Presets:</span>
        <button
          onClick={() => loadPreset('struggling')}
          className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition font-medium"
        >
          High Risk Profile
        </button>
        <button
          onClick={() => loadPreset('average')}
          className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 transition font-medium"
        >
          Moderate Risk Profile
        </button>
        <button
          onClick={() => loadPreset('honor')}
          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition font-medium"
        >
          Low Risk Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 flex items-center justify-between mb-6">
              <span>Day-90 Student Profile Features</span>
              <span className="text-xs text-slate-400 font-mono">Feature Vector $X_i$</span>
            </h2>

            <form onSubmit={handleCalculate} className="space-y-6">
              {/* Attendance slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <label className="font-semibold text-slate-700">Class Attendance Rate</label>
                  <span className="font-mono text-indigo-600 font-bold">{formData.attendance}%</span>
                </div>
                <input
                  type="range"
                  name="attendance"
                  min="30"
                  max="100"
                  value={formData.attendance}
                  onChange={handleInputChange}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Midterm Score slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <label className="font-semibold text-slate-700">Previous / Midterm Exam Score</label>
                  <span className="font-mono text-blue-600 font-bold">{formData.midtermScore} / 100</span>
                </div>
                <input
                  type="range"
                  name="midtermScore"
                  min="20"
                  max="100"
                  value={formData.midtermScore}
                  onChange={handleInputChange}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Study Hours & Absences */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Weekly Study Hours
                  </label>
                  <input
                    type="number"
                    name="studyHours"
                    min="0"
                    max="50"
                    value={formData.studyHours}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-sm text-slate-900 font-mono shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Unexcused Absences
                  </label>
                  <input
                    type="number"
                    name="absences"
                    min="0"
                    max="30"
                    value={formData.absences}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-sm text-slate-900 font-mono shadow-sm"
                    required
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Differential Privacy Mechanism Configuration */}
          <div className="glass-card rounded-2xl p-6 border border-indigo-100 bg-indigo-50/30 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-bold text-slate-900">
                  Privacy Protection Control
                </span>
              </div>
              <input
                type="checkbox"
                name="enableDP"
                checked={formData.enableDP}
                onChange={handleInputChange}
                className="w-4 h-4 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Enable DP-SGD perturbation to mathematically prevent adversaries from inferring this specific student's features via model outputs.
            </p>

            {formData.enableDP && (
              <div className="pt-4 border-t border-indigo-100/50">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-600 font-semibold">Privacy Budget (ε)</span>
                  <span className="font-mono text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded font-bold">ε = {formData.epsilon}</span>
                </div>
                <input
                  type="range"
                  name="epsilon"
                  min="0.2"
                  max="5.0"
                  step="0.05"
                  value={formData.epsilon}
                  onChange={handleInputChange}
                  className="w-full h-1.5 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
                  <span>Strict Privacy (Higher Noise)</span>
                  <span>High Utility (Lower Noise)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Prediction Results Display */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="glass-card rounded-2xl p-6 border border-slate-200 shadow-lg flex-1 flex flex-col justify-between sticky top-6">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Prediction Result</h2>
                <span className="badge-model flex items-center gap-1">
                  <RotateCcw className={`w-3 h-3 ${isCalculating ? 'animate-spin' : ''}`} /> 
                  Live Inference
                </span>
              </div>

              {result ? (
                <div className="space-y-6 animate-fade-in">
                  {/* Category Badge */}
                  <div className="text-center py-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                      Predicted Outcome
                    </span>
                    <span className={`text-4xl font-extrabold font-display tracking-tight ${
                      result.predictedRisk === 'High' ? 'text-rose-600' :
                      result.predictedRisk === 'Medium' ? 'text-amber-500' : 'text-emerald-600'
                    }`}>
                      {result.predictedRisk} Risk
                    </span>
                  </div>

                  {/* Meter Bar */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-xs mb-2 font-semibold">
                      <span className="text-slate-600">Predicted Probability</span>
                      <span className="font-mono text-slate-900">{(result.riskScore * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 shadow-sm ${
                          result.predictedRisk === 'High' ? 'bg-gradient-to-r from-amber-400 to-rose-500' :
                          result.predictedRisk === 'Medium' ? 'bg-amber-400' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(5, result.riskScore * 100))}%` }}
                      />
                    </div>
                  </div>

                  {/* Baseline vs Protected Breakdown */}
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Model Trace</h4>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-3 border-b border-slate-100 flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Baseline (Unshielded) Prob:</span>
                        <span className="text-slate-900 font-mono font-bold">{(result.rawScore * 100).toFixed(1)}%</span>
                      </div>
                      
                      {formData.enableDP ? (
                        <>
                          <div className="p-3 border-b border-slate-100 flex justify-between items-center text-xs bg-indigo-50/50">
                            <span className="text-slate-600 font-medium flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                              Privacy Noise Added:
                            </span>
                            <span className={`font-mono font-bold ${result.noiseApplied >= 0 ? 'text-indigo-600' : 'text-amber-600'}`}>
                              {result.noiseApplied >= 0 ? `+${(result.noiseApplied * 100).toFixed(2)}%` : `${(result.noiseApplied * 100).toFixed(2)}%`}
                            </span>
                          </div>
                          <div className="p-3 flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">Privacy Bound:</span>
                            <span className="text-indigo-600 font-mono font-semibold text-[11px]">{result.privacyGuarantee}</span>
                          </div>
                        </>
                      ) : (
                        <div className="p-3 flex items-center gap-2 text-xs text-amber-600 bg-amber-50">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Model running without DP protection. High risk of membership inference leakage.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                    <Sliders className="w-6 h-6" />
                  </div>
                  <p className="max-w-[200px] leading-relaxed">Adjust features on the left to see live prediction results.</p>
                </div>
              )}
            </div>

            <div className="p-4 mt-6 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                <strong className="text-slate-700">DP-SGD Inference:</strong> Outputs with perturbation prevent adversaries from reverse-engineering attendance patterns from confidence score deltas.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
