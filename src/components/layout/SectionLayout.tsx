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

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {children}
      
      {(prev || next) && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-16 pt-8 border-t border-slate-200 gap-4">
          {prev && prevTarget ? (
            <Link
              to={prevTarget}
              onClick={handleNavClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:text-navy-900 hover:bg-slate-100 transition-all group w-full sm:w-auto justify-center"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-slate-500 group-hover:text-navy-900" />
              <span>{prev.label}</span>
            </Link>
          ) : <div />}

          {next && nextTarget ? (
            <Link
              to={nextTarget}
              onClick={handleNavClick}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-violet-600 text-white text-sm font-bold shadow-md shadow-violet-200 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-300 transition-all hover:scale-[1.02] active:scale-[0.98] group w-full sm:w-auto justify-center"
            >
              <span>{next.label}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : <div />}
        </div>
      )}
    </div>
  );
}

export default SectionWrapper;
