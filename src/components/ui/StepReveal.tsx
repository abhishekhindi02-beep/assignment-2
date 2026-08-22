import { useState, type ReactNode } from 'react';
import { ChevronRight, Check } from 'lucide-react';

interface StepRevealProps {
  steps: any[];
  onComplete?: () => void;
  className?: string;
}

export function StepReveal({ steps: rawSteps, onComplete, className = '' }: StepRevealProps) {
  const [revealedCount, setRevealedCount] = useState(1);

  // Normalize steps to {label, content}
  const steps = rawSteps.map((s: any, i: number) => {
    if (typeof s === 'string') {
      return { label: `Step ${i + 1}`, content: s };
    }
    return {
      label: s.label || s.title || `Step ${i + 1}`,
      content: s.content || s.description || '',
    };
  });

  const allRevealed = revealedCount >= steps.length;

  const revealNext = () => {
    if (revealedCount < steps.length) {
      const next = revealedCount + 1;
      setRevealedCount(next);
      if (next === steps.length && onComplete) {
        onComplete();
      }
    }
  };

  const reset = () => setRevealedCount(1);

  return (
    <div className={`space-y-3 ${className}`}>
      {steps.slice(0, revealedCount).map((step: any, i: number) => (
        <div key={i} className="flex gap-3 animate-fade-in">
          <div className="flex-shrink-0 mt-0.5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              ${i < revealedCount - 1
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-violet-100 text-violet-700'
              }`}
            >
              {i < revealedCount - 1 ? <Check size={12} /> : i + 1}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-800 mb-1">{step.label}</h4>
            <div className="text-sm text-slate-600">{step.content}</div>
          </div>
        </div>
      ))}

      <div className="flex gap-2 pt-2">
        {!allRevealed ? (
          <button
            onClick={revealNext}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-700 text-white text-sm font-medium rounded-lg hover:bg-violet-800 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            Reveal Step {revealedCount + 1}
            <ChevronRight size={14} />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg">
              <Check size={14} />
              All steps revealed
            </span>
            <button onClick={reset} className="text-sm text-slate-500 hover:text-slate-700 underline">
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
