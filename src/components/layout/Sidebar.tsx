import { NavLink, useLocation } from 'react-router-dom';
import { 
  Atom, ArrowRightLeft, Zap, Clock, Ruler, Gauge, Split, 
  Orbit, LayoutGrid, Sun, GitBranch, Beaker, Trophy, BookOpen,
  ChevronLeft, X, BarChart3
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';

const navItems = [
  { to: '/reference-frames', label: 'Reference Frames', icon: ArrowRightLeft, num: '01' },
  { to: '/galilean-relativity', label: 'Galilean Relativity', icon: Gauge, num: '02' },
  { to: '/einsteins-postulates', label: "Einstein's Postulates", icon: Zap, num: '03' },
  { to: '/lorentz-transformations', label: 'Lorentz Transforms', icon: Atom, num: '04' },
  { to: '/time-dilation', label: 'Time Dilation', icon: Clock, num: '05' },
  { to: '/length-contraction', label: 'Length Contraction', icon: Ruler, num: '06' },
  { to: '/velocity-addition', label: 'Velocity Addition', icon: GitBranch, num: '07' },
  { to: '/simultaneity', label: 'Simultaneity', icon: Split, num: '08' },
  { to: '/muon-decay', label: 'Muon Decay', icon: Orbit, num: '09' },
  { to: '/spacetime-diagrams', label: 'Spacetime Diagrams', icon: LayoutGrid, num: '10' },
  { to: '/light-cones', label: 'Light Cones', icon: Sun, num: '11' },
  { to: '/worldlines', label: 'Worldlines', icon: GitBranch, num: '12' },
  { to: '/relativity-lab', label: 'Relativity Lab', icon: Beaker, num: '13' },
  { to: '/final-challenge', label: 'Final Challenge', icon: Trophy, num: '14' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { isLessonComplete, progressPercent, completedCount, totalLessons } = useProgress();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-navy-950 text-white z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:z-30`}
        role="navigation"
        aria-label="Chapter navigation"
      >
        {/* Header */}
        <div className="px-5 pt-6 pb-4 border-b border-navy-800">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="group" onClick={onClose}>
              <div className="text-xs uppercase tracking-[0.2em] text-navy-400 font-medium">Chapter 6</div>
              <h1 className="text-lg font-bold text-white mt-0.5 group-hover:text-violet-300 transition-colors">
                RELATIVITY LAB
              </h1>
            </NavLink>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-navy-800 transition-colors"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-navy-400 mb-1.5">
              <span>Progress</span>
              <span className="font-mono">{completedCount}/{totalLessons}</span>
            </div>
            <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="py-3 px-3">
          <div className="text-[10px] uppercase tracking-[0.15em] text-navy-500 font-semibold px-2 mb-2">
            Special Relativity
          </div>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              const completed = isLessonComplete(item.to);
              
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group
                      ${active
                        ? 'bg-navy-800/80 text-white'
                        : 'text-navy-300 hover:text-white hover:bg-navy-800/40'
                      }`}
                  >
                    <span className={`text-[10px] font-mono font-semibold w-5 ${active ? 'text-violet-400' : 'text-navy-600'}`}>
                      {item.num}
                    </span>
                    <Icon size={15} className={`flex-shrink-0 ${active ? 'text-violet-400' : 'text-navy-500 group-hover:text-navy-300'}`} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {completed && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" title="Completed" />
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Bottom links */}
          <div className="border-t border-navy-800 mt-4 pt-3">
            <NavLink
              to="/reflection"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                ${location.pathname === '/reflection'
                  ? 'bg-navy-800/80 text-white'
                  : 'text-navy-400 hover:text-white hover:bg-navy-800/40'
                }`}
            >
              <BookOpen size={15} className="text-navy-500" />
              <span>Reflection & Review</span>
            </NavLink>
          </div>
        </nav>
      </aside>
    </>
  );
}
