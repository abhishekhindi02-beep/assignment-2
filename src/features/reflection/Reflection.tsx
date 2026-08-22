import React, { useState } from 'react';
import { SectionHeader, SectionWrapper } from '@/components/layout/SectionLayout';
import { CalloutCard } from '@/components/ui';
import { useProgress } from '@/hooks/useProgress';

type Status = 'Not yet' | 'Nearly there' | 'Ready to move on';

interface Objective {
  id: number;
  text: string;
  status: Status;
}

const initialObjectives: Objective[] = [
  { id: 1, text: "Can I identify an inertial reference frame?", status: 'Not yet' },
  { id: 2, text: "Can I explain Einstein's two postulates?", status: 'Not yet' },
  { id: 3, text: "Can I calculate the gamma factor?", status: 'Not yet' },
  { id: 4, text: "Can I apply Lorentz transformations?", status: 'Not yet' },
  { id: 5, text: "Can I distinguish proper time from dilated time?", status: 'Not yet' },
  { id: 6, text: "Can I explain time dilation?", status: 'Not yet' },
  { id: 7, text: "Can I explain length contraction?", status: 'Not yet' },
  { id: 8, text: "Can I use relativistic velocity addition?", status: 'Not yet' },
  { id: 9, text: "Can I explain muon decay evidence?", status: 'Not yet' },
  { id: 10, text: "Can I calculate the spacetime interval?", status: 'Not yet' },
  { id: 11, text: "Can I read and interpret spacetime diagrams?", status: 'Not yet' },
  { id: 12, text: "Can I explain simultaneity using a spacetime diagram?", status: 'Not yet' }
];

export const Reflection: React.FC = () => {
  const [objectives, setObjectives] = useState<Objective[]>(initialObjectives);
  const { markComplete } = useProgress();
  const [isTOKOpen, setIsTOKOpen] = useState(false);

  const cycleStatus = (current: Status): Status => {
    if (current === 'Not yet') return 'Nearly there';
    if (current === 'Nearly there') return 'Ready to move on';
    return 'Not yet';
  };

  const handleStatusClick = (id: number) => {
    setObjectives(prev => {
      const updated = prev.map(obj => 
        obj.id === id ? { ...obj, status: cycleStatus(obj.status) } : obj
      );
      if (updated.every(obj => obj.status === 'Ready to move on')) {
        markComplete();
      }
      return updated;
    });
  };

  const resetProgress = () => {
    setObjectives(initialObjectives);
  };

  const getStatusColor = (status: Status) => {
    if (status === 'Not yet') return 'bg-red-100 text-red-800 border-red-300';
    if (status === 'Nearly there') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  };

  const readyCount = objectives.filter(o => o.status === 'Ready to move on').length;

  return (
    <SectionWrapper>
      <SectionHeader title="Chapter Reflection" subtitle="Assess your understanding of Special Relativity" />

      <CalloutCard type="info" title="Progress Summary">
        <div className="flex justify-between items-center">
          <p>You have mastered {readyCount} out of {objectives.length} objectives.</p>
          <button onClick={resetProgress} className="px-4 py-2 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 transition-colors">
            Reset Progress
          </button>
        </div>
      </CalloutCard>

      <div className="mt-8 space-y-3">
        {objectives.map((obj) => (
          <div key={obj.id} className="flex justify-between items-center p-3 border rounded shadow-sm bg-white">
            <span className="text-slate-700">{obj.text}</span>
            <button 
              onClick={() => handleStatusClick(obj.id)}
              className={`px-4 py-1.5 rounded-full border text-sm font-semibold transition-colors ${getStatusColor(obj.status)}`}
            >
              {obj.status}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">Key Takeaways</h3>
        <ul className="list-disc pl-6 space-y-2 text-slate-700">
          <li>The speed of light in a vacuum is the same for all observers, regardless of the motion of the light source or observer.</li>
          <li>The laws of physics are the same in all inertial reference frames.</li>
          <li>Time and space are relative; they depend on the observer's frame of reference.</li>
          <li>Events that are simultaneous in one frame may not be simultaneous in another.</li>
          <li>The spacetime interval is an invariant quantity, agreed upon by all observers.</li>
        </ul>
      </div>

      <div className="mt-8">
        <button 
          onClick={() => setIsTOKOpen(!isTOKOpen)}
          className="w-full text-left bg-violet-100 p-4 rounded-lg flex justify-between items-center font-bold text-violet-800"
        >
          Theory of Knowledge Connection
          <span>{isTOKOpen ? '−' : '+'}</span>
        </button>
        {isTOKOpen && (
          <div className="p-4 bg-violet-50 border border-t-0 border-violet-100 rounded-b-lg text-slate-700">
            "If two observers make different measurements, which one is correct? In Special Relativity, both are equally valid within their frames. The laws of physics and invariant quantities remain consistent."
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <a href="#" className="text-blue-600">← Prev: Final Challenge</a>
      </div>
    </SectionWrapper>
  );
};

export default Reflection;
