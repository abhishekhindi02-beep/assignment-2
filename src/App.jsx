import { useState, useEffect } from 'react';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import {
  HomeView,
  DisplacementDistanceView,
  SpeedVelocityView,
  AccelerationView,
  KinematicsEquationsView,
  MotionGraphsView,
  ProjectileMotionView,
  FluidResistanceView,
  MotionInvestigatorView,
  PracticeBankView,
  MotionMissionView,
  ReflectionView
} from './components/views/SectionViews';

export function AppContent() {
  const [activeModule, setActiveModule] = useState('intro');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { markSectionComplete } = useProgress();

  // Automatically mark module as visited/complete whenever activeModule changes
  useEffect(() => {
    markSectionComplete(activeModule);
  }, [activeModule, markSectionComplete]);

  const renderActiveView = () => {
    switch (activeModule) {
      case 'intro':
        return <HomeView onNavigate={(id) => setActiveModule(id)} />;
      case 'position':
        return <DisplacementDistanceView />;
      case 'velocity':
        return <SpeedVelocityView />;
      case 'acceleration':
        return <AccelerationView />;
      case 'equations':
        return <KinematicsEquationsView />;
      case 'graphs':
        return <MotionGraphsView />;
      case 'projectiles':
        return <ProjectileMotionView />;
      case 'drag':
        return <FluidResistanceView />;
      case 'investigator':
        return <MotionInvestigatorView />;
      case 'practice':
        return <PracticeBankView />;
      case 'mission':
        return <MotionMissionView />;
      case 'reflection':
        return <ReflectionView />;
      default:
        return <HomeView onNavigate={(id) => setActiveModule(id)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        <Header onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <AppContent />
    </ProgressProvider>
  );
}
