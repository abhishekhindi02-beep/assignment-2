import { useState, type ReactNode } from 'react';
import { Check, X, RotateCcw } from 'lucide-react';

interface QuizCardProps {
  question: string | ReactNode;
  options: any[];
  explanation?: string | ReactNode;
  correctIndex?: number;
  onCorrect?: () => void;
  className?: string;
}

export function QuizCard({ question, options: rawOptions, explanation: globalExplanation, correctIndex, onCorrect, className = '' }: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const options = rawOptions.map((opt: any, i: number) => {
    if (typeof opt === 'string') {
      return { text: opt, isCorrect: correctIndex !== undefined ? i === correctIndex : i === 0, explanation: '' };
    }
    return {
      text: opt.text || opt.label || String(opt),
      isCorrect: opt.isCorrect ?? opt.correct ?? (correctIndex !== undefined ? i === correctIndex : false),
      explanation: opt.explanation || '',
    };
  });

  const answered = selected !== null;
  const isCorrect = selected !== null && options[selected]?.isCorrect;
  const currentExplanation = selected !== null
    ? (options[selected]?.explanation || globalExplanation || 'Review the concept and try again.')
    : '';

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setShowExplanation(true);
    if (options[index].isCorrect && onCorrect) {
      onCorrect();
    }
  };

  const reset = () => {
    setSelected(null);
    setShowExplanation(false);
  };

  return (
    <div className={`bg-white border border-slate-200 rounded-xl overflow-hidden ${className}`}>
      <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded bg-violet-100 flex items-center justify-center">
            <span className="text-xs font-bold text-violet-700">?</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-violet-700">Concept Check</span>
        </div>
        <div className="text-sm text-slate-800 font-medium mt-2">{question}</div>
      </div>

      <div className="p-4 space-y-2">
        {options.map((opt: any, i: number) => {
          let optionStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50';
          if (answered) {
            if (opt.isCorrect) {
              optionStyle = 'border-emerald-300 bg-emerald-50';
            } else if (i === selected && !opt.isCorrect) {
              optionStyle = 'border-red-300 bg-red-50';
            } else {
              optionStyle = 'border-slate-200 opacity-60';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`w-full text-left px-4 py-2.5 rounded-lg border transition-all text-sm flex items-center gap-3 ${optionStyle} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs font-semibold">
                {answered && opt.isCorrect ? (
                  <Check size={12} className="text-emerald-600" />
                ) : answered && i === selected && !opt.isCorrect ? (
                  <X size={12} className="text-red-500" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span className="flex-1">{opt.text}</span>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className={`px-5 py-3 border-t animate-fade-in ${isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-orange-50/50 border-orange-200'}`}>
          <div className="flex items-center gap-2 mb-1">
            {isCorrect ? (
              <Check size={14} className="text-emerald-600" />
            ) : (
              <X size={14} className="text-orange-600" />
            )}
            <span className={`text-xs font-bold uppercase tracking-wider ${isCorrect ? 'text-emerald-700' : 'text-orange-700'}`}>
              {isCorrect ? 'Correct!' : 'Not quite'}
            </span>
          </div>
          <div className="text-sm text-slate-700">{currentExplanation}</div>
          {!isCorrect && (
            <button onClick={reset} className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium">
              <RotateCcw size={12} /> Try again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface NumericQuizProps {
  question: string | ReactNode;
  correctAnswer?: number;
  targetValue?: number;
  tolerance: number;
  unit?: string;
  explanation?: string | ReactNode;
  onCorrect?: () => void;
  className?: string;
}

export function NumericQuiz({ question, correctAnswer: rawCorrectAnswer, targetValue, tolerance, unit = '', explanation, onCorrect, className = '' }: NumericQuizProps) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const target = rawCorrectAnswer ?? targetValue ?? 0;
  const numVal = parseFloat(input);
  const isCorrect = submitted && !isNaN(numVal) && Math.abs(numVal - target) <= tolerance;

  const handleSubmit = () => {
    if (input.trim() === '') return;
    setSubmitted(true);
    if (!isNaN(numVal) && Math.abs(numVal - target) <= tolerance && onCorrect) {
      onCorrect();
    }
  };

  const reset = () => {
    setInput('');
    setSubmitted(false);
  };

  return (
    <div className={`bg-white border border-slate-200 rounded-xl overflow-hidden ${className}`}>
      <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded bg-violet-100 flex items-center justify-center">
            <span className="text-xs font-bold text-violet-700">#</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-violet-700">Calculate</span>
        </div>
        <div className="text-sm text-slate-800 font-medium mt-2">{question}</div>
      </div>
      <div className="p-4">
        <div className="flex gap-2">
          <input type="number" value={input}
            onChange={(e) => { setInput(e.target.value); setSubmitted(false); }}
            placeholder="Your answer..." step="any" aria-label="Your answer"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
          {unit && <span className="self-center text-sm text-slate-500">{unit}</span>}
          <button onClick={handleSubmit} disabled={input.trim() === ''}
            className="px-4 py-2 bg-violet-700 text-white text-sm font-medium rounded-lg hover:bg-violet-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Check
          </button>
        </div>
        {submitted && (
          <div className={`mt-3 p-3 rounded-lg animate-fade-in ${isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-orange-50 border border-orange-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              {isCorrect ? <Check size={14} className="text-emerald-600" /> : <X size={14} className="text-orange-600" />}
              <span className={`text-xs font-bold ${isCorrect ? 'text-emerald-700' : 'text-orange-700'}`}>
                {isCorrect ? 'Correct!' : `Not quite — the answer is ${target}${unit}`}
              </span>
            </div>
            {explanation && <div className="text-sm text-slate-700">{explanation}</div>}
            {!isCorrect && (
              <button onClick={reset} className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium">
                <RotateCcw size={12} /> Try again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizCard;
