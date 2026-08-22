import { useState, useEffect } from 'react';
import { SectionHeader, SectionWrapper } from '@/components/layout/SectionLayout';
import { CalloutCard } from '@/components/ui';
import { useProgress } from '@/hooks/useProgress';
import { Check, X, RotateCcw, Lock, Trophy, ArrowRight } from 'lucide-react';
import { MathBlock } from '@/components/math/MathBlock';

const STAGE_STORAGE_KEY = 'relativity-lab-challenge-stage';

interface Stage {
  type: 'mcq' | 'numeric';
  question: string;
  options?: string[];
  correctIndex?: number;
  answer?: number;
  tolerance?: number;
  unit?: string;
  explanation: string;
}

export function FinalChallenge() {
  const [currentStage, setCurrentStage] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STAGE_STORAGE_KEY);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Local state for active stage interaction
  const [selectedMcq, setSelectedMcq] = useState<number | null>(null);
  const [numericInput, setNumericInput] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const { markComplete } = useProgress();

  useEffect(() => {
    try {
      localStorage.setItem(STAGE_STORAGE_KEY, currentStage.toString());
    } catch { /* ignore */ }
    if (currentStage >= 10) {
      markComplete('/final-challenge');
    }
  }, [currentStage, markComplete]);

  // Reset stage input state whenever currentStage changes
  useEffect(() => {
    setSelectedMcq(null);
    setNumericInput('');
    setSubmitted(false);
  }, [currentStage]);

  const advanceToNextStage = () => {
    setCurrentStage(prev => {
      const next = prev + 1;
      return next > 10 ? 10 : next;
    });
  };

  const resetMission = () => {
    setCurrentStage(0);
    setSelectedMcq(null);
    setNumericInput('');
    setSubmitted(false);
    try {
      localStorage.removeItem(STAGE_STORAGE_KEY);
    } catch { /* ignore */ }
  };

  const stages: Stage[] = [
    {
      type: 'mcq',
      question: "STAGE 1 — REFERENCE FRAMES: Which frame measures proper time for the spacecraft clock?",
      options: ["Earth frame", "Spacecraft frame", "Alpha Centauri frame", "Any inertial frame"],
      correctIndex: 1,
      explanation: "Proper time is always measured in the frame where the clock is at rest (the spacecraft frame)."
    },
    {
      type: 'numeric',
      question: "STAGE 2 — GAMMA: The spacecraft travels at 0.90c. Calculate γ.",
      answer: 2.294,
      tolerance: 0.03,
      explanation: "γ = 1 / √(1 - v²/c²) = 1 / √(1 - 0.90²) = 1 / √(1 - 0.81) = 1 / √0.19 ≈ 2.294"
    },
    {
      type: 'numeric',
      question: "STAGE 3 — LORENTZ TRANSFORM: An event occurs at x=4.0 ly, t=5.0 yr in Earth frame. Find x' in spacecraft frame (v=0.90c).",
      answer: -1.147,
      tolerance: 0.1,
      unit: 'ly',
      explanation: "x' = γ(x - vt) = 2.294 * (4.0 - 0.90 * 5.0) = 2.294 * (4.0 - 4.5) = 2.294 * (-0.5) ≈ -1.147 ly"
    },
    {
      type: 'numeric',
      question: "STAGE 4 — TIME DILATION: Earth measures the journey takes 4.72 years. How long does the spacecraft clock read?",
      answer: 2.06,
      tolerance: 0.05,
      unit: 'years',
      explanation: "Δt' = Δt / γ = 4.72 / 2.294 ≈ 2.06 years."
    },
    {
      type: 'numeric',
      question: "STAGE 5 — LENGTH CONTRACTION: Alpha Centauri is 4.25 ly from Earth. What distance does the spacecraft measure?",
      answer: 1.85,
      tolerance: 0.05,
      unit: 'ly',
      explanation: "L = L₀ / γ = 4.25 / 2.294 ≈ 1.85 ly."
    },
    {
      type: 'numeric',
      question: "STAGE 6 — VELOCITY ADDITION: The spacecraft launches a probe at 0.50c relative to itself. What speed does Earth measure (in c)?",
      answer: 0.965,
      tolerance: 0.02,
      unit: 'c',
      explanation: "u = (v + u') / (1 + vu'/c²) = (0.90 + 0.50) / (1 + 0.90 * 0.50) = 1.40 / 1.45 ≈ 0.965c"
    },
    {
      type: 'mcq',
      question: "STAGE 7 — SIMULTANEITY: Two signals sent simultaneously in Earth frame from front and back of spacecraft. Are they simultaneous in spacecraft frame?",
      options: ["Yes", "No", "Depends on the observer's exact location"],
      correctIndex: 1,
      explanation: "Events that are simultaneous in one frame are NOT simultaneous in another frame moving relative to it."
    },
    {
      type: 'numeric',
      question: "STAGE 8 — SPACETIME: On a spacetime diagram (x vs ct), what angle does the spacecraft worldline make with the ct-axis (in degrees)?",
      answer: 41.98,
      tolerance: 0.5,
      unit: '°',
      explanation: "θ = arctan(v/c) = arctan(0.90) ≈ 41.98°"
    },
    {
      type: 'mcq',
      question: "STAGE 9 — LIGHT SIGNAL: A light signal is sent from Earth when the spacecraft departs. Can it reach Alpha Centauri before the spacecraft?",
      options: ["Yes, light is faster", "No, the spacecraft is moving at relativistic speeds", "They will arrive at the same time"],
      correctIndex: 0,
      explanation: "Light travels at 1.0c, which is strictly faster than the spacecraft's 0.90c."
    },
    {
      type: 'mcq',
      question: "STAGE 10 — INVARIANT: Calculate the spacetime interval between departure and arrival. Is it the same in both frames?",
      options: ["Yes, the interval is invariant", "No, it changes due to time dilation", "No, it changes due to length contraction"],
      correctIndex: 0,
      explanation: "The spacetime interval s² = (cΔt)² - (Δx)² is invariant across all inertial frames."
    }
  ];

  const activeStage = currentStage < 10 ? stages[currentStage] : null;

  // Answer validation for active stage
  let isStageCorrect = false;
  if (activeStage && submitted) {
    if (activeStage.type === 'mcq') {
      isStageCorrect = selectedMcq === activeStage.correctIndex;
    } else {
      const numVal = parseFloat(numericInput);
      isStageCorrect = !isNaN(numVal) && Math.abs(numVal - (activeStage.answer ?? 0)) <= (activeStage.tolerance ?? 0.05);
    }
  }

  return (
    <SectionWrapper
      prev={{ to: '/relativity-lab', label: '13 Relativity Lab' }}
      next={{ to: '/reflection', label: 'Reflection & Review' }}
    >
      <SectionHeader
        section="Final Challenge"
        title="The Relativity Mission"
        subtitle="Prove your mastery of Special Relativity across 10 sequential mission stages."
      />
      
      {/* Status Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
              <Trophy size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Mission Status</h3>
              <p className="text-xs text-slate-500">
                {currentStage >= 10 ? 'Mission Complete! All 10 stages passed.' : `Stage ${currentStage + 1} of 10 in progress`}
              </p>
            </div>
          </div>
          {currentStage > 0 && (
            <button
              onClick={resetMission}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              Reset Mission
            </button>
          )}
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-violet-600 h-full transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(100, (currentStage / 10) * 100)}%` }}
          />
        </div>
      </div>

      {currentStage >= 10 ? (
        <div className="space-y-6">
          <CalloutCard type="success" title="RELATIVITY MISSION COMPLETE!">
            <p className="text-base font-semibold text-emerald-800 mb-3">
              Congratulations! You have successfully completed all 10 stages of the Relativity Mission.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
              {stages.map((stage, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-600 flex-shrink-0" />
                  <span>{stage.question.split(':')[0]}</span>
                </li>
              ))}
            </ul>
          </CalloutCard>
        </div>
      ) : (
        <div className="space-y-4">
          {stages.map((stage, index) => {
            if (index > currentStage) {
              return (
                <div key={index} className="opacity-50 pointer-events-none p-4 border border-slate-200 rounded-xl bg-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock size={16} className="text-slate-400" />
                    <span className="font-semibold text-slate-600 text-sm">Stage {index + 1}: Locked</span>
                  </div>
                  <span className="text-xs text-slate-400">Complete previous stage to unlock</span>
                </div>
              );
            }

            if (index < currentStage) {
              return (
                <div key={index} className="p-4 border border-emerald-200 rounded-xl bg-emerald-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check size={18} className="text-emerald-600" />
                    <span className="font-semibold text-emerald-800 text-sm">{stage.question.split(':')[0]}</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Passed</span>
                </div>
              );
            }

            // ACTIVE STAGE
            return (
              <div key={index} className="p-6 border-2 border-violet-500 rounded-2xl bg-white shadow-lg animate-fade-in space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-700">
                    Active Stage — {index + 1} of 10
                  </span>
                </div>

                <div className="text-slate-900 font-semibold text-base leading-relaxed">
                  {stage.question}
                </div>

                {/* MCQ Stage Input */}
                {stage.type === 'mcq' && (
                  <div className="space-y-2">
                    {stage.options!.map((opt, optIdx) => {
                      const isOptionSelected = selectedMcq === optIdx;
                      const isCorrectOpt = optIdx === stage.correctIndex;
                      let btnStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50';

                      if (submitted) {
                        if (isCorrectOpt) {
                          btnStyle = 'border-emerald-300 bg-emerald-50 font-medium text-emerald-900';
                        } else if (isOptionSelected && !isCorrectOpt) {
                          btnStyle = 'border-red-300 bg-red-50 text-red-900';
                        } else {
                          btnStyle = 'border-slate-200 opacity-50';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={submitted}
                          onClick={() => {
                            setSelectedMcq(optIdx);
                            setSubmitted(true);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm flex items-center gap-3 ${btnStyle} ${!submitted ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                          <span className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {submitted && isCorrectOpt ? (
                              <Check size={14} className="text-emerald-600" />
                            ) : submitted && isOptionSelected && !isCorrectOpt ? (
                              <X size={14} className="text-red-500" />
                            ) : (
                              String.fromCharCode(65 + optIdx)
                            )}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Numeric Stage Input */}
                {stage.type === 'numeric' && (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <input
                        type="number"
                        disabled={submitted}
                        value={numericInput}
                        onChange={(e) => setNumericInput(e.target.value)}
                        placeholder="Enter numerical answer..."
                        step="any"
                        className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                      {stage.unit && <span className="self-center text-sm font-semibold text-slate-500">{stage.unit}</span>}
                      {!submitted && (
                        <button
                          onClick={() => setSubmitted(true)}
                          disabled={numericInput.trim() === ''}
                          className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Check
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* SUBMITTED FEEDBACK & ACTION BUTTONS */}
                {submitted && (
                  <div className={`p-4 rounded-xl border space-y-4 ${isStageCorrect ? 'bg-emerald-50/70 border-emerald-200' : 'bg-orange-50/70 border-orange-200'}`}>
                    <div className="flex items-center gap-2">
                      {isStageCorrect ? (
                        <Check size={18} className="text-emerald-600" />
                      ) : (
                        <X size={18} className="text-orange-600" />
                      )}
                      <span className={`font-bold text-sm ${isStageCorrect ? 'text-emerald-800' : 'text-orange-800'}`}>
                        {isStageCorrect ? 'Correct!' : `Not quite — the answer is ${stage.type === 'numeric' ? stage.answer : stage.options![stage.correctIndex!]}`}
                      </span>
                    </div>

                    <div className="text-sm text-slate-700 leading-relaxed border-t border-slate-200/60 pt-3">
                      {stage.explanation}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={advanceToNextStage}
                        className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl shadow-md transition-all hover:scale-[1.02] cursor-pointer inline-flex items-center gap-2"
                      >
                        <span>Continue to Stage {currentStage + 2}</span>
                        <ArrowRight size={16} />
                      </button>

                      {!isStageCorrect && (
                        <button
                          onClick={() => {
                            setSubmitted(false);
                            setSelectedMcq(null);
                            setNumericInput('');
                          }}
                          className="px-4 py-2.5 border border-slate-300 hover:bg-white text-slate-700 font-medium text-sm rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw size={14} />
                          <span>Try Again</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </SectionWrapper>
  );
}

export default FinalChallenge;
