import { useState, type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useLocation } from 'react-router-dom';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-md border-b border-slate-200 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Open navigation"
          >
            <Menu size={20} className="text-slate-700" />
          </button>
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Chapter 6</span>
            <h1 className="text-sm font-bold text-slate-900 -mt-0.5">RELATIVITY LAB</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={`lg:ml-72 pt-14 lg:pt-0 min-h-screen ${isLanding ? 'pt-14' : ''}`}>
        {children}
      </main>
    </div>
  );
}
