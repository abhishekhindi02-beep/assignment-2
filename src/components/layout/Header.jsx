import { Menu, RotateCcw } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

export const Header = ({ onOpenMobile }) => {
  const { resetProgress } = useProgress();

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20">
              Chapter 1 — Kinematics
            </span>
          </div>
          <h2 className="text-sm font-bold text-slate-100 hidden sm:block">
            Interactive Physics Web Module
          </h2>
        </div>
      </div>

      {/* Header Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={resetProgress}
          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          title="Reset local learning progress"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Progress</span>
        </button>
      </div>
    </header>
  );
};
