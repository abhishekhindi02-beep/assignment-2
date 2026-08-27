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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-slate-200 z-50 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
              K
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                KINEMATICS LAB
              </h1>
              <p className="text-[11px] text-sky-600 font-semibold mt-0.5">IB Physics 7th Edition</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-slate-700">Chapter Progress</span>
            <span className="font-semibold text-sky-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-sky-500 h-full transition-all duration-300 rounded-full"
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
                className={`w-full p-2.5 rounded-xl text-left text-xs flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-sky-50 text-sky-800 font-semibold border border-sky-200 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-[11px] text-slate-400 font-semibold">{mod.num}</span>
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span className="truncate">{mod.title}</span>
                </div>
                {isCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Tagline */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 text-center font-medium">
          "See motion. Measure motion. Understand motion."
        </div>
      </aside>
    </>
  );
};
