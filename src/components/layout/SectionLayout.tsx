import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SectionHeaderProps {
  section?: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}

export function SectionHeader({ section, title, subtitle, icon }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        {section && (
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-violet-600">{section}</span>
        )}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
      {subtitle && <p className="text-base text-slate-500 mt-2 max-w-2xl">{subtitle}</p>}
    </div>
  );
}

interface NavItemLink {
  to?: string;
  path?: string;
  label: string;
}

interface SectionWrapperProps {
  children: ReactNode;
  prev?: NavItemLink;
  next?: NavItemLink;
}

export function SectionWrapper({ children, prev, next }: SectionWrapperProps) {
  const prevTarget = prev?.to || prev?.path || '';
  const nextTarget = next?.to || next?.path || '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {children}
      
      {(prev || next) && (
        <div className="flex items-center justify-between mt-16 pt-8 border-t border-slate-200">
          {prev && prevTarget ? (
            <Link
              to={prevTarget}
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              {prev.label}
            </Link>
          ) : <div />}
          {next && nextTarget ? (
            <Link
              to={nextTarget}
              className="inline-flex items-center gap-2 text-sm text-violet-700 hover:text-violet-900 font-semibold transition-colors group"
            >
              {next.label}
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : <div />}
        </div>
      )}
    </div>
  );
}

export default SectionWrapper;
