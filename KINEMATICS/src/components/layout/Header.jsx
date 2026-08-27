import { Menu, RotateCcw } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

export const Header = ({ onOpenMobile }) => {
  const { resetProgress } = useProgress();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[11px] font-semibold border border-sky-200">
              Chapter 1 — Kinematics
            </span>
          </div>
          <h2 className="text-sm font-bold text-slate-800 hidden sm:block mt-0.5">
            Interactive Physics Web Module
          </h2>
        </div>
      </div>

      {/* Header Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={resetProgress}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          title="Reset local learning progress"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Progress</span>
        </button>
      </div>
    </header>
  );
};
