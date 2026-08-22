import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathBlockProps {
  latex?: string;
  math?: string;
  display?: boolean;
  className?: string;
}

export function MathBlock({ latex, math, display = true, className = '' }: MathBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const expression = latex || math || '';

  useEffect(() => {
    if (ref.current && expression) {
      try {
        katex.render(expression, ref.current, {
          displayMode: display,
          throwOnError: false,
          trust: true,
          strict: false,
        });
      } catch {
        ref.current.textContent = expression;
      }
    }
  }, [expression, display]);

  return (
    <div
      ref={ref}
      className={`${display ? 'katex-display my-3 text-center' : 'inline'} ${className}`}
      role="math"
      aria-label={expression}
    />
  );
}

interface InlineMathProps {
  latex?: string;
  math?: string;
  className?: string;
}

export function InlineMath({ latex, math, className = '' }: InlineMathProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const expression = latex || math || '';

  useEffect(() => {
    if (ref.current && expression) {
      try {
        katex.render(expression, ref.current, {
          displayMode: false,
          throwOnError: false,
          trust: true,
          strict: false,
        });
      } catch {
        ref.current.textContent = expression;
      }
    }
  }, [expression]);

  return <span ref={ref} className={className} role="math" aria-label={expression} />;
}

export default MathBlock;
