import { useState } from 'react';
import { MathBlock, MathInline } from '../math/MathBlock';
import { CheckCircle, HelpCircle, ArrowRight, RefreshCw } from 'lucide-react';

export const WorkedExampleCard = ({ exampleId, title, problem, steps, finalAnswer }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [revealedAll, setRevealedAll] = useState(false);

  const totalSteps = steps.length;

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setRevealedAll(true);
    }
  };

  const handleRevealAll = () => {
    setCurrentStepIndex(totalSteps - 1);
    setRevealedAll(true);
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setRevealedAll(false);
  };

  return (
    <div className="my-6 rounded-2xl glass-panel border border-blue-500/30 bg-slate-900/90 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 px-5 py-4 border-b border-blue-500/20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-mono text-xs font-bold border border-blue-500/40">
            {exampleId}
          </span>
          <h3 className="text-base font-bold text-slate-100">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">
            Step {Math.min(currentStepIndex + 1, totalSteps)} of {totalSteps}
          </span>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset steps"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-950/50">
        <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-blue-400" /> Problem Statement
        </div>
        <div className="text-sm text-slate-200 leading-relaxed font-sans">
          {problem}
        </div>
      </div>

      {/* Interactive Step-by-Step Walkthrough */}
      <div className="p-5 space-y-4">
        {steps.slice(0, currentStepIndex + 1).map((step, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 animate-fadeIn space-y-2 shadow-inner"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center border border-blue-500/40">
                {idx + 1}
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300">
                {step.stepTitle}
              </h4>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed pl-7">
              {step.description}
            </div>
            {step.math && (
              <div className="pl-7">
                <MathBlock math={step.math} />
              </div>
            )}
          </div>
        ))}

        {/* Step Controls */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          {!revealedAll && currentStepIndex < totalSteps - 1 ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleNextStep}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                Reveal Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRevealAll}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Reveal Full Solution
              </button>
            </div>
          ) : (
            <div className="w-full p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-2 shadow-lg">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Final Solution Complete</span>
              </div>
              {finalAnswer && <MathInline math={finalAnswer} className="font-mono text-emerald-200" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const EquationSelector = () => {
  const [knowns, setKnowns] = useState({
    u: true,
    v: false,
    a: true,
    t: true,
    s: false
  });

  const toggleKnown = (key) => {
    setKnowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Determine equation based on SUVAT knowns/unknowns
  const getRecommendation = () => {
    const { u, v, a, t, s } = knowns;
    if (u && v && t && !s) {
      return {
        formula: "\\Delta s = \\left(\\frac{u+v}{2}\\right)t",
        reason: "You know u, v, and t. Acceleration a is not needed."
      };
    }
    if (u && a && t && !v) {
      return {
        formula: "\\Delta s = ut + \\frac{1}{2}at^2",
        reason: "You know u, a, and t. Final velocity v is not needed."
      };
    }
    if (u && a && t && !s) {
      return {
        formula: "v = u + at",
        reason: "You know u, a, and t. Displacement s is not needed."
      };
    }
    if (u && v && a && !t) {
      return {
        formula: "v^2 = u^2 + 2a\\Delta s",
        reason: "Time t is unknown and not required! Use the no-time equation."
      };
    }
    if (v && a && s && !u) {
      return {
        formula: "v^2 = u^2 + 2a\\Delta s \\quad \\implies \\quad u = \\sqrt{v^2 - 2a\\Delta s}",
        reason: "Rearrange the no-time equation to find initial velocity u."
      };
    }
    return {
      formula: "v = u + at \\quad \\text{or} \\quad \\Delta s = ut + \\frac{1}{2}at^2",
      reason: "Select 3 known SUVAT variables to get an exact single equation recommendation!"
    };
  };

  const rec = getRecommendation();

  return (
    <div className="my-6 p-5 rounded-2xl glass-panel border border-cyan-500/30 bg-slate-900/90 shadow-xl">
      <h4 className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-cyan-400" /> Which Kinematics Equation Should I Use?
      </h4>
      <p className="text-xs text-slate-400 mb-4">
        Toggle the quantities you know from your physics problem to find the optimal SUVAT equation.
      </p>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {[
          { key: 'u', label: 'u (initial vel)' },
          { key: 'v', label: 'v (final vel)' },
          { key: 'a', label: 'a (accel)' },
          { key: 't', label: 't (time)' },
          { key: 's', label: 'Δs (displ)' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => toggleKnown(item.key)}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              knowns[item.key]
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10 font-bold'
                : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:border-slate-700'
            }`}
          >
            <div className="text-xs uppercase font-mono">{item.key}</div>
            <div className="text-[10px] opacity-80 truncate">{knowns[item.key] ? 'Known' : 'Unknown'}</div>
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
        <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
          Recommended Kinematics Formula
        </div>
        <MathBlock math={rec.formula} />
        <p className="text-xs text-slate-300 mt-2 italic">{rec.reason}</p>
      </div>
    </div>
  );
};
