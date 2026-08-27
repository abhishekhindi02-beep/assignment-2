import { useState } from 'react';
import { MathBlock } from '../math/MathBlock';
import { BookOpen, AlertTriangle, Lightbulb, HelpCircle, Compass, Zap, ArrowRight } from 'lucide-react';

export const DefinitionCallout = ({ term, symbol, definition, vector = false }) => {
  return (
    <div className="my-4 p-4 rounded-xl bg-white border border-slate-200 border-l-4 border-l-sky-500 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-sky-50 text-sky-600 mt-0.5">
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-bold text-sky-600">Definition</span>
            <h4 className="text-lg font-bold text-slate-900">{term}</h4>
            {symbol && <span className="text-sm font-semibold text-sky-700">({symbol})</span>}
            {vector !== undefined && (
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${vector ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                {vector ? 'Vector Quantity' : 'Scalar Quantity'}
              </span>
            )}
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">{definition}</p>
        </div>
      </div>
    </div>
  );
};

export const FormulaCard = ({ title, formula, derivation, variables, condition }) => {
  const [showDerivation, setShowDerivation] = useState(false);

  return (
    <div className="my-4 p-5 rounded-2xl bg-white border border-sky-200 shadow-xs relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-sky-600 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" /> Key Equation
        </span>
        {condition && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
            {condition}
          </span>
        )}
      </div>

      <h4 className="text-base font-bold text-slate-900 mb-1">{title}</h4>
      <MathBlock math={formula} />

      {variables && (
        <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {Object.entries(variables).map(([key, desc]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="font-semibold text-sky-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{key}</span>
              <span className="text-slate-600">{desc}</span>
            </div>
          ))}
        </div>
      )}

      {derivation && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <button
            onClick={() => setShowDerivation(!showDerivation)}
            className="text-xs text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1 transition-colors"
          >
            {showDerivation ? 'Hide Derivation' : 'Show Derivation & Proof'}
            <ArrowRight className={`w-3.5 h-3.5 transition-transform ${showDerivation ? 'rotate-90' : ''}`} />
          </button>
          {showDerivation && (
            <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 animate-fadeIn">
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
    <div className="my-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200 border-l-4 border-l-amber-500 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-100 text-amber-700 mt-0.5">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">IB Exam Tip</span>
          <div className="text-slate-800 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
};

export const MisconceptionCard = ({ misconception, reality, explanation }) => {
  return (
    <div className="my-4 rounded-2xl bg-white border border-rose-200 overflow-hidden shadow-xs">
      <div className="bg-rose-50 px-4 py-2.5 border-b border-rose-200 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-rose-600" />
        <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Common Misconception</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-900 text-sm font-medium">
          <span className="text-rose-700 font-bold mr-2">❌ Misconception:</span> "{misconception}"
        </div>
        <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-900 text-sm font-medium">
          <span className="text-emerald-700 font-bold mr-2">✓ Scientific Reality:</span> {reality}
        </div>
        {explanation && (
          <p className="text-xs text-slate-600 leading-relaxed pt-1 pl-1">
            {explanation}
          </p>
        )}
      </div>
    </div>
  );
};

export const NatureOfScience = ({ title = "The Simple and the Complex", children }) => {
  return (
    <div className="my-6 p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs">
      <div className="flex items-center gap-2 mb-2 text-emerald-700">
        <Compass className="w-5 h-5" />
        <span className="text-xs font-bold uppercase tracking-wider">Nature of Science</span>
      </div>
      <h4 className="text-base font-bold text-slate-900 mb-2">{title}</h4>
      <div className="text-sm text-slate-700 leading-relaxed space-y-2">{children}</div>
    </div>
  );
};

export const TheoryOfKnowledge = ({ question, discussion }) => {
  return (
    <div className="my-6 p-5 rounded-2xl bg-white border border-purple-200 shadow-xs">
      <div className="flex items-center gap-2 mb-2 text-purple-700">
        <HelpCircle className="w-5 h-5" />
        <span className="text-xs font-bold uppercase tracking-wider">Theory of Knowledge (TOK)</span>
      </div>
      <h4 className="text-base font-bold text-slate-900 mb-2">{question}</h4>
      <p className="text-sm text-slate-700 leading-relaxed">{discussion}</p>
    </div>
  );
};

export const KnowledgeTransfer = ({ title, connection, topicLink }) => {
  return (
    <div className="my-5 p-4 rounded-xl bg-sky-50/60 border border-sky-200 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
          <Zap className="w-4 h-4" /> Transfer of Knowledge
        </span>
        {topicLink && <span className="text-xs font-semibold text-sky-700">{topicLink}</span>}
      </div>
      <h5 className="text-sm font-bold text-slate-900 mt-2">{title}</h5>
      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{connection}</p>
    </div>
  );
};
