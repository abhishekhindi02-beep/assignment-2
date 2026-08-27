import { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

export const ConceptCheck = ({ id, question, options, correctIndex, explanation }) => {
  const { setQuizCompleted } = useProgress();
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (idx) => {
    if (submitted) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    const isCorrect = selected === correctIndex;
    setQuizCompleted(id, isCorrect ? 100 : 0);
  };

  const handleReset = () => {
    setSelected(null);
    setSubmitted(false);
  };

  return (
    <div className="my-6 p-5 rounded-2xl glass-panel border border-cyan-500/30 bg-slate-900/90 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4" /> Check Yourself
        </span>
        {submitted && (
          <button onClick={handleReset} className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        )}
      </div>

      <div className="text-sm font-semibold text-slate-100">{question}</div>

      <div className="space-y-2">
        {options.map((opt, idx) => {
          const isSel = selected === idx;
          const isCorr = idx === correctIndex;

          let btnClass = "border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300";
          if (isSel) btnClass = "border-cyan-500 bg-cyan-950/40 text-cyan-200 font-bold";
          if (submitted) {
            if (isCorr) btnClass = "border-emerald-500 bg-emerald-950/40 text-emerald-200 font-bold";
            else if (isSel && !isCorr) btnClass = "border-rose-500 bg-rose-950/40 text-rose-200";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnClass}`}
            >
              <span>{opt}</span>
              {submitted && isCorr && <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
              {submitted && isSel && !isCorr && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selected !== null ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          Check Answer
        </button>
      ) : (
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 animate-fadeIn">
          <span className="font-bold text-cyan-400">Explanation: </span>
          {explanation}
        </div>
      )}
    </div>
  );
};
