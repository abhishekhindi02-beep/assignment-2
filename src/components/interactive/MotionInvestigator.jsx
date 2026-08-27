import { useState } from 'react';
import { Search, CheckCircle, XCircle, HelpCircle, ArrowRight } from 'lucide-react';

export const MotionInvestigator = () => {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const cases = [
    {
      id: 1,
      title: "Unknown Motion Case #1 — Position vs Time Curve",
      description: "An object's motion produces the position-time graph below. Analyze its qualitative features.",
      svgType: "concave_down",
      question: "Between t = 0s and t = 3s, what can you infer about the object's velocity and acceleration?",
      options: [
        "Velocity is positive and constant; acceleration is zero.",
        "Velocity is positive but decreasing; acceleration is negative (concave down).",
        "Velocity is negative and increasing; acceleration is positive.",
        "Velocity is zero; acceleration is negative."
      ],
      correctIndex: 1,
      explanation: "The position curve is sloped upward (positive velocity), but it curves downward (concave down). This means velocity is decreasing over time, indicating a negative acceleration!"
    },
    {
      id: 2,
      title: "Unknown Motion Case #2 — Velocity vs Time Crossing Zero",
      description: "An object moves along a straight line. Its velocity-time graph starts at +15 m/s and crosses zero at t = 3s to reach -15 m/s at t = 6s.",
      svgType: "vt_cross_zero",
      question: "What physical event occurs exactly at t = 3s?",
      options: [
        "The object stops permanently.",
        "The object instantaneously stops and reverses its direction of motion.",
        "The acceleration becomes zero.",
        "The displacement reaches zero."
      ],
      correctIndex: 1,
      explanation: "When velocity passes through zero from positive to negative, the object momentarily comes to rest and changes direction (motion reversal). Acceleration is still non-zero!"
    },
    {
      id: 3,
      title: "Unknown Motion Case #3 — Asymptotic Speed Curve",
      description: "A falling object's speed-time graph rises rapidly at first and then flattens horizontally near 30 m/s.",
      svgType: "terminal_speed",
      question: "What is happening physically as the curve flattens horizontally?",
      options: [
        "Gravity stops pulling on the object.",
        "Air resistance force equals weight force (F_drag = mg), so acceleration reaches zero.",
        "The object reaches the ground and bounces.",
        "The speed becomes zero."
      ],
      correctIndex: 1,
      explanation: "As speed increases, air resistance increases until F_drag = mg. The net force becomes zero, causing acceleration to approach zero while the object continues at constant terminal speed!"
    }
  ];

  const currentCase = cases[currentCaseIndex];

  const handleSelect = (idx) => {
    if (submitted) return;
    setSelectedAnswer(idx);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setSubmitted(true);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setSubmitted(false);
    setCurrentCaseIndex((prev) => (prev + 1) % cases.length);
  };

  return (
    <div className="my-8 p-6 rounded-3xl glass-panel border border-violet-500/40 bg-slate-950/90 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Search className="w-4 h-4" /> Signature Feature #6
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">MOTION INVESTIGATOR</h2>
          <p className="text-xs text-slate-400">
            Deduce physical motion properties directly from raw data and graph shapes before calculating.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-violet-400 px-3 py-1 bg-violet-950/40 rounded-lg border border-violet-500/30">
          Case {currentCaseIndex + 1} of {cases.length}
        </span>
      </div>

      {/* Case Overview */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-100">{currentCase.title}</h3>
        <p className="text-xs text-slate-300 leading-relaxed">{currentCase.description}</p>

        {/* SVG Visualization for Case */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
          <svg viewBox="0 0 300 120" className="w-full max-w-sm h-32">
            <line x1="20" y1="100" x2="280" y2="100" stroke="#334155" strokeWidth="2" />
            <line x1="20" y1="20" x2="20" y2="100" stroke="#334155" strokeWidth="2" />

            {currentCase.svgType === 'concave_down' && (
              <path d="M 20 100 Q 150 20 280 40" fill="none" stroke="#a78bfa" strokeWidth="3" />
            )}
            {currentCase.svgType === 'vt_cross_zero' && (
              <path d="M 20 20 L 280 100" fill="none" stroke="#a78bfa" strokeWidth="3" />
            )}
            {currentCase.svgType === 'terminal_speed' && (
              <path d="M 20 100 Q 80 40 280 40" fill="none" stroke="#a78bfa" strokeWidth="3" />
            )}
          </svg>
        </div>
      </div>

      {/* Interactive Question */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-violet-400" /> {currentCase.question}
        </h4>

        <div className="space-y-2">
          {currentCase.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === currentCase.correctIndex;

            let btnStyle = "border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300";
            if (isSelected) {
              btnStyle = "border-violet-500 bg-violet-950/40 text-violet-200 font-bold";
            }
            if (submitted) {
              if (isCorrect) {
                btnStyle = "border-emerald-500 bg-emerald-950/40 text-emerald-200 font-bold";
              } else if (isSelected && !isCorrect) {
                btnStyle = "border-rose-500 bg-rose-950/40 text-rose-200";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-3 ${btnStyle}`}
              >
                <span>{option}</span>
                {submitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                {submitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Submit / Next Buttons */}
        <div className="flex items-center justify-between pt-2">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                selectedAnswer !== null
                  ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20 active:scale-95'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              Submit Inference
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg active:scale-95"
            >
              Next Case <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Explanation Modal/Panel */}
        {submitted && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1 animate-fadeIn">
            <span className="font-bold text-violet-400">Scientific Explanation: </span>
            <span>{currentCase.explanation}</span>
          </div>
        )}
      </div>
    </div>
  );
};
