import React, { useState } from 'react';
import { SectionHeader, SectionWrapper } from '@/components/layout/SectionLayout';
import { CalloutCard } from '@/components/ui/CalloutCard';
import { ControlSlider } from '@/components/ui/ControlSlider';
import { MathBlock, InlineMath } from '@/components/math/MathBlock';
import { StepReveal } from '@/components/ui/StepReveal';
import { useProgress } from '@/hooks/useProgress';
import { gamma, timeDilation, lengthContraction, velocityAddition, lorentzX, lorentzT, invariantInterval } from '@/physics/relativity';
import { Link } from 'react-router-dom';
import { MoveRight, ArrowRight, Calculator, Clock, Ruler, FastForward } from 'lucide-react';

export default function RelativityLabPage() {
  const { markComplete } = useProgress();
  const [activeTab, setActiveTab] = useState<'transform' | 'time' | 'length' | 'velocity'>('transform');

  // Time Calculator State
  const [timeProper, setTimeProper] = useState(10);
  const [timeV, setTimeV] = useState(0.8);
  
  // Length Calculator State
  const [lengthProper, setLengthProper] = useState(100);
  const [lengthV, setLengthV] = useState(0.8);

  // Velocity Calculator State
  const [velU, setVelU] = useState(0.5);
  const [velV, setVelV] = useState(0.5);

  // Frame Transformer State
  const [transX, setTransX] = useState(10);
  const [transT, setTransT] = useState(5);
  const [transV, setTransV] = useState(0.6);

  const c = 3e8;

  const renderLimitWarning = (v: number) => {
    if (v >= 1.0) {
      return (
        <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm font-semibold mb-4 border border-red-200">
          RELATIVITY LIMIT: A material object cannot reach or exceed c.
        </div>
      );
    }
    return null;
  };

  return (
    <SectionWrapper
      prev={{ to: '/worldlines', label: '12 Worldlines' }}
      next={{ to: '/final-challenge', label: '14 Final Challenge' }}
    >
      <SectionHeader 
        title="Relativity Lab" 
        subtitle="Change the observer. Change the measurement. Discover what stays invariant."
      />

      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-2">
          <button 
            className={`px-4 py-2 rounded-t-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'transform' ? 'bg-navy-900 text-white border-b-2 border-amber-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            onClick={() => setActiveTab('transform')}
          >
            <Calculator className="w-4 h-4" /> Frame Transformer
          </button>
          <button 
            className={`px-4 py-2 rounded-t-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'time' ? 'bg-navy-900 text-white border-b-2 border-amber-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            onClick={() => setActiveTab('time')}
          >
            <Clock className="w-4 h-4" /> Time Calculator
          </button>
          <button 
            className={`px-4 py-2 rounded-t-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'length' ? 'bg-navy-900 text-white border-b-2 border-amber-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            onClick={() => setActiveTab('length')}
          >
            <Ruler className="w-4 h-4" /> Length Calculator
          </button>
          <button 
            className={`px-4 py-2 rounded-t-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'velocity' ? 'bg-navy-900 text-white border-b-2 border-amber-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            onClick={() => setActiveTab('velocity')}
          >
            <FastForward className="w-4 h-4" /> Velocity Calculator
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
          {activeTab === 'transform' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold mb-4 text-navy-900">Lorentz Transformation Calculator</h3>
              <p className="text-slate-600 mb-6">Convert spacetime coordinates from a stationary frame (S) to a moving frame (S').</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-4">Input Event in Frame S</h4>
                    <ControlSlider label="Position x (ly)" value={transX} min={-20} max={20} step={1} onChange={setTransX} />
                    <ControlSlider label="Time t (yr)" value={transT} min={-20} max={20} step={1} onChange={setTransT} />
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-4">Relative Velocity</h4>
                    <ControlSlider label="v (in units of c)" value={transV} min={-0.99} max={0.99} step={0.01} onChange={setTransV} />
                  </div>
                </div>

                <div className="bg-violet-50 p-6 rounded-lg border border-violet-200 shadow-inner">
                  <h4 className="font-bold text-violet-900 text-lg border-b border-violet-200 pb-2 mb-4">Coordinates in Frame S'</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-violet-700">Lorentz Factor</span>
                      <MathBlock math={`\\gamma = ${gamma(Math.abs(transV)).toFixed(3)}`} />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-violet-700">Position x'</span>
                      <MathBlock math={`x' = \\gamma(x - vt) = ${lorentzX(transX, transT, transV).toFixed(3)} \\text{ ly}`} />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-violet-700">Time t'</span>
                      <MathBlock math={`t' = \\gamma(t - vx/c^2) = ${lorentzT(transT, transX, transV).toFixed(3)} \\text{ yr}`} />
                    </div>
                    <div className="mt-6 pt-4 border-t border-violet-200">
                      <span className="text-sm font-bold text-emerald-700">Invariant Interval (ds²)</span>
                      <p className="text-xs text-slate-600 mb-2">Notice how the spacetime interval is identical in both frames:</p>
                      <MathBlock math={`s^2 = x^2 - (ct)^2 = ${invariantInterval(transX, transT).toFixed(3)}`} />
                      <MathBlock math={`s'^2 = x'^2 - (ct')^2 = ${invariantInterval(lorentzX(transX, transT, transV), lorentzT(transT, transX, transV)).toFixed(3)}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'time' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold mb-4 text-navy-900">Time Dilation Calculator</h3>
              <p className="text-slate-600 mb-6">Calculate how a time interval measured in its rest frame (proper time) dilates when observed from a moving frame.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <ControlSlider label="Proper Time Δt₀" value={timeProper} min={1} max={100} step={1} onChange={setTimeProper} />
                  <ControlSlider label="Relative Velocity v (c)" value={timeV} min={0} max={1.0} step={0.01} onChange={setTimeV} />
                  {renderLimitWarning(timeV)}
                </div>

                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <h4 className="font-bold text-slate-800 text-lg mb-4">Results</h4>
                  {timeV >= 1.0 ? (
                    <p className="text-red-600">Calculations invalid at v ≥ c.</p>
                  ) : (
                    <div className="space-y-4">
                      <MathBlock math={`\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}} = ${gamma(timeV).toFixed(3)}`} />
                      <MathBlock math={`\\Delta t = \\gamma \\Delta t_0 = ${timeDilation(timeProper, timeV).toFixed(3)}`} />
                      
                      <div className="mt-4 p-4 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
                        <p className="text-sm font-medium">The moving clock ticks slower. What takes <span className="font-bold">{timeProper}</span> units of time for the moving observer takes <span className="font-bold">{timeDilation(timeProper, timeV).toFixed(2)}</span> units for the stationary observer.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'length' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold mb-4 text-navy-900">Length Contraction Calculator</h3>
              <p className="text-slate-600 mb-6">Calculate how an object's length measured in its rest frame (proper length) contracts when observed moving.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <ControlSlider label="Proper Length L₀" value={lengthProper} min={1} max={1000} step={10} onChange={setLengthProper} />
                  <ControlSlider label="Relative Velocity v (c)" value={lengthV} min={0} max={1.0} step={0.01} onChange={setLengthV} />
                  {renderLimitWarning(lengthV)}
                </div>

                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <h4 className="font-bold text-slate-800 text-lg mb-4">Results</h4>
                  {lengthV >= 1.0 ? (
                    <p className="text-red-600">Calculations invalid at v ≥ c.</p>
                  ) : (
                    <div className="space-y-4">
                      <MathBlock math={`\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}} = ${gamma(lengthV).toFixed(3)}`} />
                      <MathBlock math={`L = \\frac{L_0}{\\gamma} = ${lengthContraction(lengthProper, lengthV).toFixed(3)}`} />
                      
                      <div className="mt-4 p-4 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
                        <p className="text-sm font-medium">The moving object is shortened in the direction of motion. An object that is <span className="font-bold">{lengthProper}</span> units long at rest is measured as <span className="font-bold">{lengthContraction(lengthProper, lengthV).toFixed(2)}</span> units long when moving.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'velocity' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold mb-4 text-navy-900">Relativistic Velocity Addition</h3>
              <p className="text-slate-600 mb-6">Calculate the total velocity when an object is thrown from a moving vehicle. Unlike classical physics, velocities don't just simply add up.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <ControlSlider label="Frame Velocity v (c)" value={velV} min={-0.99} max={0.99} step={0.01} onChange={setVelV} />
                  <ControlSlider label="Object Velocity u' (c)" value={velU} min={-1.0} max={1.0} step={0.01} onChange={setVelU} />
                </div>

                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <h4 className="font-bold text-slate-800 text-lg mb-4">Results</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-slate-600">Classical (Galilean) Addition:</span>
                      <MathBlock math={`u_{classical} = v + u' = ${(velV + velU).toFixed(3)}c`} />
                      {(Math.abs(velV + velU) > 1.0) && (
                        <p className="text-xs text-red-600 mt-1">Warning: Classical physics predicts a speed faster than light!</p>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t border-slate-200">
                      <span className="text-sm font-bold text-blue-700">Relativistic Addition:</span>
                      <MathBlock math={`u = \\frac{v + u'}{1 + \\frac{vu'}{c^2}} = ${velocityAddition(velV, velU).toFixed(4)}c`} />
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded border border-blue-200">
                      <p className="text-sm font-medium">Notice how the relativistic sum never exceeds 1.0c, preserving the universal speed limit.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6 text-slate-900">SLAC Micro-Experiment</h3>
        <p className="mb-6">
          At the Stanford Linear Accelerator Center (SLAC), electrons are accelerated down a 3.0 km long tube. 
          Use the lab tools above or solve this real-world problem step by step.
        </p>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
          <p className="font-medium text-slate-800 mb-4">
            An electron travels down the 3.0 km SLAC tube at a speed of <InlineMath math="v = 0.960c" />. 
          </p>
          
          <StepReveal
            steps={[
              {
                title: "1. Calculate the Lorentz Factor",
                content: (
                  <div className="space-y-2">
                    <p>First, find <InlineMath math="\gamma" /> for <InlineMath math="v = 0.960c" />:</p>
                    <MathBlock math="\gamma = \frac{1}{\sqrt{1 - 0.960^2}} = \frac{1}{\sqrt{1 - 0.9216}} = \frac{1}{\sqrt{0.0784}} = 3.57" />
                  </div>
                )
              },
              {
                title: "2. How long does the trip take in the Lab Frame?",
                content: (
                  <div className="space-y-2">
                    <p>In the lab, the distance is 3.0 km (<InlineMath math="3000 \text{ m}" />) and speed is <InlineMath math="0.960c" /> (<InlineMath math="2.88 \times 10^8 \text{ m/s}" />).</p>
                    <MathBlock math="\Delta t_{lab} = \frac{d}{v} = \frac{3000}{2.88 \times 10^8} = 10.4 \text{ }\mu\text{s}" />
                  </div>
                )
              },
              {
                title: "3. How long does the trip take in the Electron's Frame?",
                content: (
                  <div className="space-y-2">
                    <p>The lab time is dilated. The electron experiences proper time <InlineMath math="\Delta t_0" />.</p>
                    <MathBlock math="\Delta t_0 = \frac{\Delta t_{lab}}{\gamma} = \frac{10.4}{3.57} = 2.91 \text{ }\mu\text{s}" />
                  </div>
                )
              },
              {
                title: "4. How long is the accelerator tube in the Electron's Frame?",
                content: (
                  <div className="space-y-2">
                    <p>The electron sees the tube moving at 0.960c, so it is length contracted.</p>
                    <MathBlock math="L = \frac{L_0}{\gamma} = \frac{3.0 \text{ km}}{3.57} = 0.84 \text{ km}" />
                    <p className="mt-2 text-emerald-700 font-medium">Notice: <InlineMath math="v = \frac{0.84 \text{ km}}{2.91 \text{ }\mu\text{s}} = 0.960c" />. Both frames agree on the relative velocity!</p>
                  </div>
                ),
                onReveal: () => markComplete('relativity-lab')
              }
            ]}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
