import React, { useState } from 'react';
import { SectionHeader, SectionWrapper } from '@/components/layout/SectionLayout';
import { MathBlock, InlineMath } from '@/components/math/MathBlock';
import { CalloutCard, ControlSlider, StepReveal } from '@/components/ui';
import { QuizCard } from '@/components/quiz/QuizCard';
import { NavigationLinks } from '@/components/layout/NavigationLinks';
import { lorentzT, lorentzX } from '@/physics/relativity';

export const Worldlines: React.FC = () => {
  const [velocity, setVelocity] = useState(0.5);
  
  // Event Ordering Challenge state
  const [selectedEventSequence, setSelectedEventSequence] = useState<number[]>([]);
  const challengeEvents = [
    { id: 1, x: 2, t: 1, label: 'A' },
    { id: 2, x: 1, t: 2, label: 'B' },
    { id: 3, x: 4, t: 3, label: 'C' }
  ];

  const handleEventClick = (id: number) => {
    if (!selectedEventSequence.includes(id)) {
      setSelectedEventSequence([...selectedEventSequence, id]);
    }
  };

  return (
    <SectionWrapper>
      <SectionHeader title="6.3 — Worldlines & Events" />
      
      <div className="prose max-w-none text-slate-800 mb-8">
        <p>
          A <strong>worldline</strong> is the unique path that an object traces through spacetime as time progresses.
          In a spacetime diagram, the vertical axis represents time (usually scaled as <InlineMath math="ct" />) and the horizontal axis represents space (<InlineMath math="x" />).
        </p>
      </div>

      <CalloutCard type="info" title="Interactive Worldline Explorer">
        <div className="flex flex-col md:flex-row gap-6 mb-4">
          <div className="flex-1 border border-slate-200 rounded-lg bg-white p-4 relative overflow-hidden" style={{ minHeight: '300px' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              {/* Grid */}
              <g stroke="#e2e8f0" strokeWidth="0.5">
                {[...Array(11)].map((_, i) => (
                  <React.Fragment key={i}>
                    <line x1={i * 10} y1="0" x2={i * 10} y2="100" />
                    <line x1="0" y1={i * 10} x2="100" y2={i * 10} />
                  </React.Fragment>
                ))}
              </g>
              
              {/* Axes */}
              <line x1="50" y1="100" x2="50" y2="0" stroke="#0f172a" strokeWidth="1" markerEnd="url(#arrow)" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#0f172a" strokeWidth="1" markerEnd="url(#arrow)" />
              
              {/* Stationary object (x=0) */}
              <line x1="50" y1="100" x2="50" y2="0" stroke="#1e3a5f" strokeWidth="2" />
              <text x="52" y="10" fontSize="3" fill="#1e3a5f">Stationary</text>

              {/* Photon (x = ct) */}
              <line x1="50" y1="50" x2="100" y2="0" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2" />
              <line x1="50" y1="50" x2="0" y2="0" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2" />
              <text x="90" y="15" fontSize="3" fill="#f59e0b">Photon</text>

              {/* Moving object */}
              <line x1="50" y1="50" x2={50 + 50 * velocity} y2="0" stroke="#7c3aed" strokeWidth="2" />
              <text x={50 + 50 * velocity - 10} y="15" fontSize="3" fill="#7c3aed">v = {velocity}c</text>
              
              {/* Impossible FTL */}
              {velocity > 0 && (
                <line x1="50" y1="50" x2="95" y2="20" stroke="#dc2626" strokeWidth="1" strokeDasharray="1" />
              )}
            </svg>
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            <ControlSlider
              label="Velocity (v/c)"
              value={velocity}
              onChange={setVelocity}
              min={-0.99}
              max={0.99}
              step={0.01}
            />
            <div className="bg-slate-50 p-4 rounded-md text-sm text-slate-700">
              <p>Observe how the angle of the worldline changes with velocity.</p>
              <MathBlock math={`\\tan(\\theta) = \\frac{v}{c} = ${Math.abs(velocity).toFixed(2)}`} />
            </div>
          </div>
        </div>
      </CalloutCard>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Event Ordering Challenge</h3>
        <p className="text-slate-700 mb-4">
          Click the events in the order they occur in the stationary frame S. Then observe how changing the velocity slider might affect the sequence in frame S'.
        </p>
        <div className="flex gap-4">
           <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setSelectedEventSequence([])}>Reset</button>
           <div>Selected: {selectedEventSequence.map(id => challengeEvents.find(e => e.id === id)?.label).join(' -> ')}</div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Worked Example</h3>
        <StepReveal
          steps={[
            "Identify the event coordinates on the diagram.",
            "Use the slope of the worldline to determine the velocity.",
            "Calculate proper time using the spacetime interval."
          ]}
        />
      </div>

      <div className="mt-8">
        <QuizCard
          question="What is the significance of a worldline that has a 45-degree angle in a spacetime diagram where the axes are ct and x?"
          options={[
            "It represents an object at rest.",
            "It represents a photon traveling at the speed of light.",
            "It represents an object traveling faster than light.",
            "It represents an object experiencing maximum time dilation."
          ]}
          correctIndex={1}
          explanation="In a spacetime diagram where space and time are plotted with the same scale (x and ct), a photon travels exactly 1 unit of space for every 1 unit of time, creating a 45-degree line."
        />
      </div>
      
      <div className="mt-8">
         {/* Navigation would go here, mock representation */}
         <div className="flex justify-between">
           <a href="#" className="text-blue-600">← Prev: Light Cones</a>
           <a href="#" className="text-blue-600">Next: Relativity Lab →</a>
         </div>
      </div>
    </SectionWrapper>
  );
};

export default Worldlines;
