import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Sliders, 
  RotateCcw
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
      // We removed the toast here so it doesn't spam the user on every slider movement!
    } catch (err) {
      console.error('Failed to compute prediction via API service.', err);
    } finally {
      setIsCalculating(false);
    }
  };

  // Real-time "What-If" Simulator: Automatically run prediction when sliders move (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateRisk();
    }, 300); // 300ms debounce
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Interactive Student Risk Predictor</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
          Individual Prediction Simulator
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Input student features and submit to API for differential privacy noise perturbation and risk assessment.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold mr-1">Quick Presets:</span>
        <button
          onClick={() => loadPreset('struggling')}
          className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition"
        >
          High Risk Profile
        </button>
        <button
          onClick={() => loadPreset('average')}
          className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition"
        >
          Moderate Risk Profile
        </button>
        <button
          onClick={() => loadPreset('honor')}
          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition"
        >
          Low Risk Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-800 shadow-sm">
          <form onSubmit={handleCalculate} className="space-y-5">
            <h2 className="text-base font-bold text-white flex items-center justify-between">
              <span>Input Student Features</span>
              <span className="text-xs text-slate-400 font-normal">Feature Vector $X_i$</span>
            </h2>

            {/* Attendance slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-semibold text-slate-300">Class Attendance Rate</label>
                <span className="font-mono text-blue-400 font-bold">{formData.attendance}%</span>
              </div>
              <input
                type="range"
                name="attendance"
                min="30"
                max="100"
                value={formData.attendance}
                onChange={handleInputChange}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Midterm Score slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-semibold text-slate-300">Previous / Midterm Exam Score</label>
                <span className="font-mono text-indigo-400 font-bold">{formData.midtermScore} / 100</span>
              </div>
              <input
                type="range"
                name="midtermScore"
                min="20"
                max="100"
                value={formData.midtermScore}
                onChange={handleInputChange}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Study Hours & Absences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Weekly Study Hours
                </label>
                <input
                  type="number"
                  name="studyHours"
                  min="0"
                  max="50"
                  value={formData.studyHours}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-sm text-slate-100 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Unexcused Absences
                </label>
                <input
                  type="number"
                  name="absences"
                  min="0"
                  max="30"
                  value={formData.absences}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-sm text-slate-100 font-mono"
                  required
                />
              </div>
            </div>

            {/* Differential Privacy Mechanism Configuration */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    Apply Differential Privacy Perturbation
                  </span>
                </div>
                <input
                  type="checkbox"
                  name="enableDP"
                  checked={formData.enableDP}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>

              {formData.enableDP && (
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-400">Privacy Budget (ε)</span>
                    <span className="font-mono text-blue-300 font-bold">ε = {formData.epsilon}</span>
                  </div>
                  <input
                    type="range"
                    name="epsilon"
                    min="0.2"
                    max="5.0"
                    step="0.05"
                    value={formData.epsilon}
                    onChange={handleInputChange}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>Strict Privacy (Higher Noise)</span>
                    <span>High Utility (Lower Noise)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isCalculating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-slate-950 font-bold text-sm shadow-none transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCalculating ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Computing Privacy-Shielded Inference...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Model Inference via API</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results Display */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-sm flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white">Prediction Outcome</h2>
                <span className="badge-model">DP-SGD Inference</span>
              </div>

              {result ? (
                <div className="space-y-5 animate-fade-in">
                  {/* Category Badge */}
                  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Predicted Academic Risk
                    </span>
                    <span className={`text-2xl font-extrabold font-display ${
                      result.predictedRisk === 'High' ? 'text-rose-400' :
                      result.predictedRisk === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {result.predictedRisk} Risk
                    </span>
                  </div>

                  {/* Meter Bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Risk Probability</span>
                      <span className="font-mono text-white font-bold">{(result.riskScore * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${
                          result.predictedRisk === 'High' ? 'bg-gradient-to-r from-amber-500 to-rose-500' :
                          result.predictedRisk === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(5, result.riskScore * 100))}%` }}
                      />
                    </div>
                  </div>

                  {/* Noise Breakdown Details */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Unshielded Base Score:</span>
                      <span className="text-slate-200">{(result.rawScore * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Injected DP Noise:</span>
                      <span className={result.noiseApplied >= 0 ? 'text-blue-400' : 'text-amber-400'}>
                        {result.noiseApplied >= 0 ? `+${(result.noiseApplied * 100).toFixed(2)}%` : `${(result.noiseApplied * 100).toFixed(2)}%`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Privacy Bound:</span>
                      <span className="text-blue-300">{result.privacyGuarantee}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 text-xs space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 mx-auto flex items-center justify-center text-slate-400">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <p>Configure student features on the left and click "Run Model Inference via API" to compute the predicted risk.</p>
                </div>
              )}
            </div>

            <div className="p-3 mt-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-[11px] text-slate-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                Outputs with DP perturbation prevent adversaries from reverse-engineering attendance patterns from confidence score deltas.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
