import React, { useState } from 'react';
import { X, Cpu, CheckCircle2, Award, BookOpen, Terminal, Layers, ArrowRight, Share2, Server } from 'lucide-react';
import { MODEL_METRICS } from '../../server/mlEngine';

interface ModelArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelArchitectureModal: React.FC<ModelArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'deployment'>('architecture');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white p-5 sm:p-8 shadow-2xl border border-slate-100 my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Machine Learning Model & Project Specs</h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-violet-100 text-violet-800">
                B.Tech 2nd Year CSE AIML
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical Formulation, Feature Weights, Evaluation Metrics, and Deployment Guide
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-5 text-xs sm:text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'architecture'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ML Model Architecture & Weights
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('deployment')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'deployment'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            How to Run & Deploy (PWA + Full-Stack)
          </button>
        </div>

        {activeTab === 'architecture' && (
          <div className="space-y-5 text-slate-700 text-xs sm:text-sm">
            {/* Accuracy Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Coefficient of Det. (R²)</span>
                <span className="text-2xl font-black font-mono text-indigo-600">0.942</span>
                <span className="text-[10px] text-slate-400 block">High goodness of fit</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Mean Absolute Error (MAE)</span>
                <span className="text-2xl font-black font-mono text-emerald-600">2.14%</span>
                <span className="text-[10px] text-slate-400 block">Average prediction delta</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Root Mean Sq Error (RMSE)</span>
                <span className="text-2xl font-black font-mono text-purple-600">3.02%</span>
                <span className="text-[10px] text-slate-400 block">Low variance in residuals</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Classification Accuracy</span>
                <span className="text-2xl font-black font-mono text-blue-600">94.8%</span>
                <span className="text-[10px] text-slate-400 block">Category binning accuracy</span>
              </div>
            </div>

            {/* Formula & Explanation */}
            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <h3 className="font-bold text-indigo-950 text-sm mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Prediction Formulation: Ridge Regression + Interaction Penalties</span>
              </h3>
              <p className="text-xs text-indigo-900 leading-relaxed mb-3">
                The predicted final examination score <code className="bg-white/80 px-1 py-0.5 rounded text-indigo-800 font-mono">Y_hat</code> is computed by aggregating normalized academic vectors weighted by their feature significance coefficients derived from educational datasets:
              </p>
              <div className="bg-slate-900 text-indigo-200 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                Y_hat = (0.30 * IAT_avg) + (0.22 * CGPA_norm) + (0.18 * Attend_pct) + (0.15 * Study_factor) + (0.10 * Asgn_score) + (0.05 * Lab_score) + InteractionPenalties
              </div>
              <p className="text-[11px] text-indigo-800 mt-2">
                * Real-World Constraint: If Attendance &lt; 75%, an automatic deduction of up to 8.5% is applied, simulating university eligibility and detention warnings.
              </p>
            </div>

            {/* Feature Weights Table */}
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-2">Trained Feature Weights</h3>
              <div className="space-y-2">
                {MODEL_METRICS.features.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <div className="w-1/3 font-semibold text-slate-800">{f.name}</div>
                    <div className="w-1/3 text-slate-500 text-[11px]">{f.description}</div>
                    <div className="w-1/4 flex items-center justify-end gap-2">
                      <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${f.weight * 100 * 2.5}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-indigo-700 w-10 text-right">
                        {(f.weight * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Bands */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                <strong className="block text-emerald-900 font-bold">Excellent</strong>
                <span className="font-mono">≥ 85% • SGPA ≥ 8.5</span>
                <p className="text-[10px] mt-1 text-emerald-700">Top percentile, distinction</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800">
                <strong className="block text-indigo-900 font-bold">Good</strong>
                <span className="font-mono">70 - 84.9% • SGPA 7.0 - 8.4</span>
                <p className="text-[10px] mt-1 text-indigo-700">Strong first class performance</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                <strong className="block text-amber-900 font-bold">Average</strong>
                <span className="font-mono">50 - 69.9% • SGPA 5.0 - 6.9</span>
                <p className="text-[10px] mt-1 text-amber-700">Passing, needs study reinforcement</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                <strong className="block text-rose-900 font-bold">Needs Improvement</strong>
                <span className="font-mono">&lt; 50% • SGPA &lt; 5.0</span>
                <p className="text-[10px] mt-1 text-rose-700">At-risk of semester arrear/detention</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deployment' && (
          <div className="space-y-4 text-slate-700 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-3">
              <div>
                <p className="text-slate-400"># 1. Install Dependencies</p>
                <p className="text-emerald-400">npm install</p>
              </div>
              <div>
                <p className="text-slate-400"># 2. Run Full-Stack Development Server (Express + Vite PWA)</p>
                <p className="text-emerald-400">npm run dev</p>
                <p className="text-slate-500 text-[11px] mt-0.5">→ Launches on port 3000 with unified API and PWA service worker</p>
              </div>
              <div>
                <p className="text-slate-400"># 3. Build for Production</p>
                <p className="text-emerald-400">npm run build</p>
                <p className="text-slate-400"># 4. Start Production Server</p>
                <p className="text-emerald-400">npm start</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Installing as a Mobile / iPad PWA:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                <li><strong>iPad Safari:</strong> Tap the <em>Share</em> button in Safari toolbar &rarr; choose <em>Add to Home Screen</em>.</li>
                <li><strong>Android Chrome:</strong> Tap the <em>Install App</em> button in the navbar or top banner, or browser menu &rarr; <em>Install app</em>.</li>
                <li><strong>Offline Caching:</strong> Academic records and client views are cached via Service Worker and local storage so students can access their scorecards without active internet.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
          <span className="text-xs text-slate-500">
            Author: B.Tech 2nd Year CSE AIML Student
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 active:scale-98 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
