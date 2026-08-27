import { useMemo } from 'react';
import katex from 'katex';

export const MathInline = ({ math, className = "" }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: false,
        throwOnError: false
      });
    } catch (error) {
      console.error("KaTeX inline error:", error);
      return math;
    }
  }, [math]);

  return (
    <span 
      className={`inline-math text-sky-700 font-semibold px-1 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const MathBlock = ({ math, className = "" }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: true,
        throwOnError: false
      });
    } catch (error) {
      console.error("KaTeX block error:", error);
      return math;
    }
  }, [math]);

  return (
    <div 
      className={`my-3 py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 overflow-x-auto shadow-xs ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
