import React, { useState, useEffect } from 'react';
import { X, Sliders, Sparkles, TrendingUp, TrendingDown, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { AcademicRecord, PredictionResult } from '../types';
import { getCategoryBadge } from '../utils/formatters';

interface WhatIfSimulatorModalProps {
  isOpen: boolean;
  baseAcademic?: AcademicRecord | null;
  onClose: () => void;
}

export const WhatIfSimulatorModal: React.FC<WhatIfSimulatorModalProps> = ({
  isOpen,
  baseAcademic,
  onClose
}) => {
  const [attendance, setAttendance] = useState(78);
  const [studyHours, setStudyHours] = useState(12);
  const [internal1, setInternal1] = useState(36);
  const [internal2, setInternal2] = useState(38);
  const [assignment, setAssignment] = useState(75);
  const [lab, setLab] = useState(80);
  const [cgpa, setCgpa] = useState(7.4);
  const [sleep, setSleep] = useState(7);

  const [simulation, setSimulation] = useState<PredictionResult | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [initialScore, setInitialScore] = useState<number | null>(null);

  useEffect(() => {
    if (baseAcademic) {
      setAttendance(baseAcademic.attendancePercent);
      setStudyHours(baseAcademic.studyHoursPerWeek);
      setInternal1(baseAcademic.internalTest1);
      setInternal2(baseAcademic.internalTest2);
      setAssignment(baseAcademic.assignmentScore);
      setLab(baseAcademic.labScore);
      setCgpa(baseAcademic.previousCgpa);
      setSleep(baseAcademic.sleepHours || 7);
    }
  }, [baseAcademic, isOpen]);

  // Run simulation on parameter change (debounced)
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      setSimulating(true);
      try {
        const res = await api.simulateWhatIf({
          attendancePercent: attendance,
          studyHoursPerWeek: studyHours,
          internalTest1: internal1,
          internalTest2: internal2,
          assignmentScore: assignment,
          labScore: lab,
          previousCgpa: cgpa,
          sleepHours: sleep
        });
        setSimulation(res.simulation);

        if (initialScore === null) {
          setInitialScore(res.simulation.predictedScore);
        } else if (res.simulation.predictedScore >= 85 && res.simulation.predictedScore > initialScore) {
          // Trigger confetti on breaking into Excellent category!
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      } catch (err) {
        console.error('Simulation failed', err);
      } finally {
        setSimulating(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [attendance, studyHours, internal1, internal2, assignment, lab, cgpa, sleep, isOpen]);

  if (!isOpen) return null;

  const categoryBadge = getCategoryBadge(simulation?.category);
  const deltaScore = simulation && initialScore !== null ? Math.round((simulation.predictedScore - initialScore) * 10) / 10 : 0;

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

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-lg shadow-emerald-500/20">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>What-If Academic Simulator</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live ML Inference
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Experiment with study hours, attendance, and midterms to observe real-time predicted grade shifts
            </p>
          </div>
        </div>

        {/* Live Simulation Score Dashboard Banner */}
        {simulation && (
          <div className="mb-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-900/50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <span className="text-xs uppercase font-bold text-indigo-300 block">Projected Score</span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
                    {simulation.predictedScore}%
                  </span>
                  {deltaScore !== 0 && (
                    <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                      deltaScore > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {deltaScore > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {deltaScore > 0 ? `+${deltaScore}%` : `${deltaScore}%`}
                    </span>
                  )}
                </div>
                <span className="text-xs text-indigo-300 mt-1 block">
                  Projected SGPA: <strong className="text-amber-300 font-mono text-sm">{simulation.predictedSgpa.toFixed(2)}</strong> / 10.0
                </span>
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-indigo-300 block">Performance Category</span>
                <div className="mt-1.5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm font-bold ${categoryBadge.bg} border`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${categoryBadge.dot}`} />
                    <span>{simulation.category}</span>
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  Risk Level: <strong className="text-white">{simulation.riskLevel}</strong>
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/10 text-xs">
                <span className="text-indigo-200 font-bold block mb-1">Key Insight:</span>
                <p className="text-indigo-100 text-[11px] leading-relaxed">
                  {attendance < 75 ? (
                    <span className="text-rose-300 font-semibold">
                      ⚠️ Warning: Attendance is below 75% ({attendance}%). University regulations impose internal mark deduction and detention risk.
                    </span>
                  ) : studyHours < 12 ? (
                    'Increasing study hours to 16-20 hrs/week can yield up to +0.8 additional SGPA boost.'
                  ) : (
                    'Excellent configuration! Strong attendance and balanced study cadence secure highest percentile.'
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          
          {/* Attendance Slider */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-800">
                Attendance Percentage: <span className="font-mono text-indigo-600 text-sm">{attendance}%</span>
              </label>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                attendance >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {attendance >= 75 ? 'Meets Norm' : 'Below 75% Criteria'}
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              value={attendance}
              onChange={(e) => setAttendance(Number(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
              <span>40%</span>
              <span className="text-amber-600 font-bold">75% (Mandatory)</span>
              <span>100%</span>
            </div>
          </div>

          {/* Study Hours Slider */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-800">
                Weekly Study Hours: <span className="font-mono text-indigo-600 text-sm">{studyHours} hrs/wk</span>
              </label>
              <span className="text-[10px] text-slate-500 font-medium">
                {studyHours >= 18 ? 'High Cadence' : studyHours >= 12 ? 'Moderate' : 'Low'}
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="35"
              value={studyHours}
              onChange={(e) => setStudyHours(Number(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
              <span>2 hrs</span>
              <span className="text-indigo-600 font-semibold">18-22 hrs (Sweet Spot)</span>
              <span>35 hrs</span>
            </div>
          </div>

          {/* Midterms (Internal 1 & 2) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-800">
                Continuous Internals (IAT 1 & 2): <span className="font-mono text-indigo-600 text-sm">{internal1 + internal2} / 100</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                IAT1: {internal1} • IAT2: {internal2}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block mb-1">IAT 1 (50)</span>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={internal1}
                  onChange={(e) => setInternal1(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block mb-1">IAT 2 (50)</span>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={internal2}
                  onChange={(e) => setInternal2(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Assignments & Lab */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-800">
                Assignments & Practical Labs
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                Asgn: {assignment}% • Lab: {lab}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block mb-1">Assignments (100)</span>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={assignment}
                  onChange={(e) => setAssignment(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block mb-1">Practical Labs (100)</span>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={lab}
                  onChange={(e) => setLab(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Previous CGPA Slider */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-800">
                Previous CGPA: <span className="font-mono text-purple-700 text-sm">{cgpa.toFixed(2)} / 10.0</span>
              </label>
            </div>
            <input
              type="range"
              step="0.05"
              min="4.0"
              max="10.0"
              value={cgpa}
              onChange={(e) => setCgpa(Number(e.target.value))}
              className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
              <span>4.0</span>
              <span>7.0 Baseline</span>
              <span>10.0</span>
            </div>
          </div>

          {/* Sleep Hours Slider */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-800">
                Daily Sleep: <span className="font-mono text-indigo-600 text-sm">{sleep} hrs</span>
              </label>
              <span className="text-[10px] text-slate-500">
                {sleep < 5 ? '⚠️ Sleep Deprivation' : sleep >= 7 ? 'Optimal Rest' : 'Borderline'}
              </span>
            </div>
            <input
              type="range"
              step="0.5"
              min="4"
              max="10"
              value={sleep}
              onChange={(e) => setSleep(Number(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
              <span>4 hrs (Cognitive Penalty)</span>
              <span className="text-emerald-600 font-semibold">7-8 hrs (Optimal)</span>
              <span>10 hrs</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <button
            onClick={() => {
              setAttendance(85);
              setStudyHours(18);
              setInternal1(44);
              setInternal2(45);
              setAssignment(90);
              setLab(92);
              setCgpa(8.5);
              setSleep(7.5);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Load "Ideal B.Tech Aim" Preset</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 active:scale-98 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
