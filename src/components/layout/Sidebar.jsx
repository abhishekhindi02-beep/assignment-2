import {
  Compass,
  Activity,
  Layers,
  Target,
  Wind,
  BookOpen,
  Trophy,
  CheckCircle2,
  X,
  Zap,
  Sparkles
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

const navigationModules = [
  { id: 'intro', num: '01', title: 'Motion Foundations', icon: Sparkles, section: 'Landing' },
  { id: 'position', num: '02', title: 'Displacement & Distance', icon: Compass, section: '1.1' },
  { id: 'velocity', num: '03', title: 'Speed & Velocity', icon: Activity, section: '1.1' },
  { id: 'acceleration', num: '04', title: 'Acceleration', icon: Zap, section: '1.2' },
  { id: 'equations', num: '05', title: 'Kinematics Equations', icon: BookOpen, section: '1.2' },
  { id: 'graphs', num: '06', title: 'Motion Graphs & Translation', icon: Layers, section: '1.3' },
  { id: 'projectiles', num: '07', title: 'Projectile Motion & Lab', icon: Target, section: '1.4' },
  { id: 'drag', num: '08', title: 'Fluid Resistance & Terminal Speed', icon: Wind, section: 'Fluid' },
  { id: 'investigator', num: '09', title: 'Motion Investigator', icon: Compass, section: 'Lab' },
  { id: 'practice', num: '10', title: 'Practice Bank', icon: BookOpen, section: 'Practice' },
  { id: 'mission', num: '11', title: 'Final Motion Mission', icon: Trophy, section: 'Challenge' },
  { id: 'reflection', num: '12', title: 'Reflection & Assessment', icon: CheckCircle2, section: 'Self' }
];

export const Sidebar = ({ activeModule, setActiveModule, mobileOpen, setMobileOpen }) => {
  const { progress } = useProgress();

  const completedCount = progress.completedSections.length;
  const progressPercent = Math.round((completedCount / navigationModules.length) * 100);

  const handleSelect = (id) => {
    setActiveModule(id);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-950/95 border-r border-slate-800/80 z-50 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-slate-950 text-lg shadow-lg shadow-cyan-500/20">
              K
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-100 tracking-tight leading-none">
                KINEMATICS LAB
              </h1>
              <p className="text-[10px] text-cyan-400 font-mono mt-0.5">IB Physics 7th Edition</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="px-5 py-3 border-b border-slate-800/60 bg-slate-900/40">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-bold text-slate-300">Chapter Progress</span>
            <span className="font-mono text-cyan-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Module Navigation List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navigationModules.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            const isCompleted = progress.completedSections.includes(mod.id);

            return (
              <button
                key={mod.id}
                onClick={() => handleSelect(mod.id)}
                className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="font-mono text-[10px] text-slate-500 font-bold">{mod.num}</span>
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="truncate">{mod.title}</span>
                </div>
                {isCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Tagline */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/30 text-[11px] text-slate-400 text-center">
          "See motion. Measure motion. Understand motion."
        </div>
      </aside>
    </>
  );
};
