import { MathBlock } from './MathBlock';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface SymbolInfo {
  symbol: string;
  meaning?: string;
  definition?: string;
  unit?: string;
}

interface FormulaCardProps {
  name?: string;
  title?: string;
  latex?: string;
  formula?: string;
  description: string;
  symbols?: SymbolInfo[];
  variables?: SymbolInfo[];
  usage?: string;
  className?: string;
}

export function FormulaCard({ name, title, latex, formula, description, symbols: rawSymbols, variables, usage, className = '' }: FormulaCardProps) {
  const [expanded, setExpanded] = useState(false);
  const displayName = name || title || 'Formula';
  const displayLatex = latex || formula || '';
  const symbolsList = (rawSymbols || variables || []).map(s => ({
    symbol: s.symbol,
    meaning: s.meaning || s.definition || '',
    unit: s.unit
  }));

  return (
    <div className={`bg-white border border-slate-200 rounded-xl overflow-hidden ${className}`}>
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-600" />
            <h4 className="font-semibold text-sm text-slate-800 uppercase tracking-wide">{displayName}</h4>
          </div>
          {symbolsList.length > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-slate-500 hover:text-violet-700 flex items-center gap-1 transition-colors"
              aria-expanded={expanded}
              aria-label={expanded ? 'Collapse formula details' : 'Expand formula details'}
            >
              {expanded ? 'Less' : 'Understand this equation'}
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>
      </div>
      
      <div className="px-5 py-4">
        {displayLatex && <MathBlock latex={displayLatex} />}
        <p className="text-sm text-slate-600 mt-2">{description}</p>
      </div>

      {expanded && symbolsList.length > 0 && (
        <div className="px-5 pb-4 border-t border-slate-100 pt-3 animate-fade-in">
          <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Symbols</h5>
          <div className="space-y-1.5">
            {symbolsList.map((s, i) => (
              <div key={i} className="flex items-baseline gap-3 text-sm">
                <span className="font-mono text-violet-700 font-semibold min-w-[2rem]">{s.symbol}</span>
                <span className="text-slate-700">{s.meaning}</span>
                {s.unit && <span className="text-slate-400 text-xs ml-auto">[{s.unit}]</span>}
              </div>
            ))}
          </div>
          {usage && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">When to use</h5>
              <p className="text-sm text-slate-600">{usage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FormulaCard;
