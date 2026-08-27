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
    <div className="my-6 p-5 rounded-2xl bg-white border border-sky-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4" /> Check Yourself
        </span>
        {submitted && (
          <button onClick={handleReset} className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        )}
      </div>

      <div className="text-sm font-bold text-slate-900">{question}</div>

      <div className="space-y-2">
        {options.map((opt, idx) => {
          const isSel = selected === idx;
          const isCorr = idx === correctIndex;

          let btnClass = "border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-medium";
          if (isSel) btnClass = "border-sky-500 bg-sky-50 text-sky-900 font-bold";
          if (submitted) {
            if (isCorr) btnClass = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
            else if (isSel && !isCorr) btnClass = "border-rose-500 bg-rose-50 text-rose-900 font-medium";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnClass}`}
            >
              <span>{opt}</span>
              {submitted && isCorr && <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
              {submitted && isSel && !isCorr && <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            selected !== null ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Check Answer
        </button>
      ) : (
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 animate-fadeIn">
          <span className="font-bold text-sky-700">Explanation: </span>
          {explanation}
        </div>
      )}
    </div>
  );
};
