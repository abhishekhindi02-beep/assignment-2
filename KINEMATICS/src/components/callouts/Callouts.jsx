import { useState } from 'react';
import { MathBlock } from '../math/MathBlock';
import { BookOpen, AlertTriangle, Lightbulb, HelpCircle, Compass, Zap, ArrowRight } from 'lucide-react';

export const DefinitionCallout = ({ term, symbol, definition, vector = false }) => {
  return (
    <div className="my-4 p-4 rounded-xl glass-panel border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-950/30 to-slate-900/60 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5">
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">Definition</span>
            <h4 className="text-lg font-bold text-slate-100">{term}</h4>
            {symbol && <span className="text-sm font-mono text-cyan-300">({symbol})</span>}
            {vector !== undefined && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${vector ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-700/40 text-slate-400'}`}>
                {vector ? 'Vector Quantity' : 'Scalar Quantity'}
              </span>
            )}
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{definition}</p>
        </div>
      </div>
    </div>
  );
};

export const FormulaCard = ({ title, formula, derivation, variables, condition }) => {
  const [showDerivation, setShowDerivation] = useState(false);

  return (
    <div className="my-4 p-5 rounded-2xl glass-panel border border-cyan-500/30 bg-slate-900/80 shadow-xl relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" /> Key Equation
        </span>
        {condition && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
            {condition}
          </span>
        )}
      </div>

      <h4 className="text-base font-semibold text-slate-200 mb-1">{title}</h4>
      <MathBlock math={formula} />

      {variables && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {Object.entries(variables).map(([key, desc]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="font-mono text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{key}</span>
              <span className="text-slate-400">{desc}</span>
            </div>
          ))}
        </div>
      )}

      {derivation && (
        <div className="mt-3 pt-3 border-t border-slate-800/60">
          <button
            onClick={() => setShowDerivation(!showDerivation)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
          >
            {showDerivation ? 'Hide Derivation' : 'Show Derivation & Proof'}
            <ArrowRight className={`w-3.5 h-3.5 transition-transform ${showDerivation ? 'rotate-90' : ''}`} />
          </button>
          {showDerivation && (
            <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2 animate-fadeIn">
              {derivation}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ExamTipCallout = ({ children }) => {
  return (
    <div className="my-4 p-4 rounded-xl glass-panel border-l-4 border-l-amber-500 bg-amber-950/20 shadow-md">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">IB Exam Tip</span>
          <div className="text-slate-200 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
};

export const MisconceptionCard = ({ misconception, reality, explanation }) => {
  return (
    <div className="my-4 rounded-2xl glass-panel border border-rose-500/30 bg-slate-900/90 overflow-hidden shadow-lg">
      <div className="bg-rose-500/10 px-4 py-2.5 border-b border-rose-500/20 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-rose-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Common Misconception</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-rose-200 text-sm font-medium">
          <span className="text-rose-400 font-bold mr-2">❌ Misconception:</span> "{misconception}"
        </div>
        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-200 text-sm font-medium">
          <span className="text-emerald-400 font-bold mr-2">✓ Scientific Reality:</span> {reality}
        </div>
        {explanation && (
          <p className="text-xs text-slate-300 leading-relaxed pt-1 pl-1">
            {explanation}
          </p>
        )}
      </div>
    </div>
  );
};

export const NatureOfScience = ({ title = "The Simple and the Complex", children }) => {
  return (
    <div className="my-6 p-5 rounded-2xl glass-panel border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 to-slate-900/80 shadow-xl">
      <div className="flex items-center gap-2 mb-2 text-emerald-400">
        <Compass className="w-5 h-5" />
        <span className="text-xs font-bold uppercase tracking-wider">Nature of Science</span>
      </div>
      <h4 className="text-base font-bold text-slate-100 mb-2">{title}</h4>
      <div className="text-sm text-slate-300 leading-relaxed space-y-2">{children}</div>
    </div>
  );
};

export const TheoryOfKnowledge = ({ question, discussion }) => {
  return (
    <div className="my-6 p-5 rounded-2xl glass-panel border border-purple-500/30 bg-gradient-to-br from-purple-950/20 to-slate-900/80 shadow-xl">
      <div className="flex items-center gap-2 mb-2 text-purple-400">
        <HelpCircle className="w-5 h-5" />
        <span className="text-xs font-bold uppercase tracking-wider">Theory of Knowledge (TOK)</span>
      </div>
      <h4 className="text-base font-bold text-slate-100 mb-2">{question}</h4>
      <p className="text-sm text-slate-300 leading-relaxed">{discussion}</p>
    </div>
  );
};

export const KnowledgeTransfer = ({ title, connection, topicLink }) => {
  return (
    <div className="my-5 p-4 rounded-xl glass-panel border border-cyan-500/20 bg-cyan-950/10 shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <Zap className="w-4 h-4" /> Transfer of Knowledge
        </span>
        {topicLink && <span className="text-xs font-mono text-cyan-400/80">{topicLink}</span>}
      </div>
      <h5 className="text-sm font-semibold text-slate-200 mt-2">{title}</h5>
      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{connection}</p>
    </div>
  );
};
