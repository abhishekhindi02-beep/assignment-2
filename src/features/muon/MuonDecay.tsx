import React, { useState } from 'react';
import { SectionHeader, SectionWrapper } from '@/components/layout/SectionLayout';
import { CalloutCard } from '@/components/ui/CalloutCard';
import { ControlSlider } from '@/components/ui/ControlSlider';
import { MathBlock, InlineMath } from '@/components/math/MathBlock';
import { QuizCard } from '@/components/quiz/QuizCard';
import { useProgress } from '@/hooks/useProgress';
import { gamma, timeDilation, lengthContraction } from '@/physics/relativity';
import { MoveRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MuonDecay() {
  const { markComplete } = useProgress();
  const [velocity, setVelocity] = useState(0.99);
  const [frame, setFrame] = useState<'earth' | 'muon'>('earth');

  const properLifetime = 2.2; // microseconds
  const atmosphereDepth = 10000; // meters
  const c = 300000000; // m/s
  
  const g = gamma(velocity);
  const dilatedLifetime = timeDilation(properLifetime, velocity);
  const contractedDistance = lengthContraction(atmosphereDepth, velocity);
  
  const muonSpeed = velocity * c;
  
  // Distance = v * t
  // t is in microseconds, so multiply by 1e-6
  const earthTravelDistance = muonSpeed * (dilatedLifetime * 1e-6);
  const muonTravelDistance = muonSpeed * (properLifetime * 1e-6);

  const classicalDistance = muonSpeed * (properLifetime * 1e-6);
  const reachesSurfaceEarth = earthTravelDistance >= atmosphereDepth;
  const reachesSurfaceMuon = contractedDistance <= muonTravelDistance;

  return (
    <SectionWrapper>
      <SectionHeader 
        title="6.2 — The Muon Paradox" 
        subtitle="How do muons reach Earth if they should decay first?"
      />

      <div className="mb-8">
        <p className="mb-4">
          Muons are subatomic particles created when cosmic rays strike the Earth's upper atmosphere, about 10 km above the surface. They are highly unstable and decay very quickly.
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>Proper lifetime (<InlineMath math="\Delta t_0" />):</strong> 2.2 μs (<InlineMath math="2.2 \times 10^{-6}" /> s)</li>
          <li><strong>Creation altitude:</strong> ~10,000 m</li>
          <li><strong>Typical speed:</strong> ~0.99c</li>
        </ul>
      </div>

      <CalloutCard type="warning" title="The Classical Prediction">
        <p className="mb-2">If we ignore relativity, a muon traveling at 0.99c for 2.2 μs would travel a distance of:</p>
        <MathBlock math="d = v \times \Delta t_0 = (0.99 \times 3 \times 10^8 \text{ m/s}) \times (2.2 \times 10^{-6} \text{ s}) \approx 653 \text{ m}" />
        <p className="mt-2 text-orange-700 font-semibold">
          653 meters is far less than 10,000 meters! Classically, practically NO muons should reach the surface. Yet we detect them constantly. How?
        </p>
      </CalloutCard>

      <div className="my-12 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <h3 className="font-bold text-lg mb-2">Dual-Frame Muon Simulation</h3>
          <p className="text-sm text-slate-600 mb-4">Observe the muon's journey from both perspectives.</p>
          
          <div className="flex flex-col sm:flex-row gap-6 mb-4">
            <div className="flex-1">
              <ControlSlider
                label="Muon Velocity (v)"
                value={velocity}
                min={0.90}
                max={0.999}
                step={0.001}
                onChange={setVelocity}
                format={(v) => `${v.toFixed(3)}c`}
              />
            </div>
            
            <div className="flex flex-col gap-2 min-w-[200px]">
              <label className="text-sm font-medium">Observer Frame</label>
              <div className="flex bg-slate-200 p-1 rounded-lg">
                <button
                  className={`flex-1 py-1 px-3 rounded-md text-sm font-medium transition-colors ${frame === 'earth' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-600 hover:bg-slate-300'}`}
                  onClick={() => setFrame('earth')}
                >
                  Earth Frame
                </button>
                <button
                  className={`flex-1 py-1 px-3 rounded-md text-sm font-medium transition-colors ${frame === 'muon' ? 'bg-white shadow-sm text-violet-700' : 'text-slate-600 hover:bg-slate-300'}`}
                  onClick={() => setFrame('muon')}
                >
                  Muon Frame
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 relative">
          {/* Visual SVG */}
          <div className="h-48 w-full bg-slate-50 rounded-lg border border-slate-200 relative mb-6 overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-b from-blue-200 to-green-100 flex items-center justify-center border-r-2 border-slate-300">
              <span className="text-xs font-bold text-slate-500 rotate-[-90deg] whitespace-nowrap">Upper Atmosphere</span>
            </div>
            <div className="absolute top-0 bottom-0 right-0 w-24 bg-emerald-100 flex items-center justify-center border-l-2 border-slate-300">
              <span className="text-xs font-bold text-slate-500 rotate-[-90deg] whitespace-nowrap">Earth Surface</span>
            </div>
            
            {/* Distance indicator */}
            <div className="absolute top-4 left-24 right-24 flex items-center gap-2">
              <div className="h-px bg-slate-400 flex-1"></div>
              <span className="text-sm font-medium text-slate-600">
                {frame === 'earth' ? '10,000 m' : `${Math.round(contractedDistance)} m (Contracted)`}
              </span>
              <div className="h-px bg-slate-400 flex-1"></div>
            </div>

            {/* Muon Particle */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 flex items-center"
              style={{ 
                left: reachesSurfaceEarth ? 'calc(100% - 6rem)' : `calc(6rem + ${(earthTravelDistance / atmosphereDepth) * (100 - 12)}%)`,
                transition: 'left 0.5s ease-out'
              }}
            >
              <div className="w-4 h-4 rounded-full bg-violet-600 shadow-[0_0_15px_rgba(124,58,237,0.8)] z-10" />
              <div className="w-16 h-1 bg-gradient-to-r from-violet-400 to-transparent -ml-2" />
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border ${frame === 'earth' ? 'bg-blue-50 border-blue-200' : 'bg-violet-50 border-violet-200'}`}>
            <h4 className={`font-bold mb-3 flex items-center gap-2 ${frame === 'earth' ? 'text-blue-800' : 'text-violet-800'}`}>
              {frame === 'earth' ? 'From Earth\'s Perspective' : 'From the Muon\'s Perspective'}
            </h4>
            
            {frame === 'earth' ? (
              <div className="space-y-3 text-blue-900">
                <p>The Earth observer measures the muon moving at <InlineMath math={`v = ${velocity.toFixed(3)}c`} />.</p>
                <p>Due to time dilation, the muon's lifetime is extended by the Lorentz factor (<InlineMath math={`\\gamma = ${g.toFixed(2)}`} />):</p>
                <MathBlock math={`\\Delta t = \\gamma \\Delta t_0 = ${g.toFixed(2)} \\times 2.2 \\mu\\text{s} = ${dilatedLifetime.toFixed(2)} \\mu\\text{s}`} />
                <p>In this dilated time, the muon travels a distance of:</p>
                <MathBlock math={`d = v \\times \\Delta t \\approx ${Math.round(earthTravelDistance)} \\text{ m}`} />
                <p className="font-semibold text-emerald-700 mt-2">
                  {reachesSurfaceEarth ? `Result: ${Math.round(earthTravelDistance)}m > 10,000m. The muon reaches the surface!` : 'Result: The muon decays before reaching the surface.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-violet-900">
                <p>In its own rest frame, the muon is stationary and the Earth rushes towards it at <InlineMath math={`v = ${velocity.toFixed(3)}c`} />.</p>
                <p>The muon lives for its proper lifetime of <InlineMath math="2.2 \mu\text{s}" />.</p>
                <p>Due to length contraction, the 10,000 m atmosphere is squished:</p>
                <MathBlock math={`L = L_0 / \\gamma = 10,000 / ${g.toFixed(2)} = ${Math.round(contractedDistance)} \\text{ m}`} />
                <p>In 2.2 μs, the Earth travels a distance of:</p>
                <MathBlock math={`d = v \\times \\Delta t_0 \\approx ${Math.round(muonTravelDistance)} \\text{ m}`} />
                <p className="font-semibold text-emerald-700 mt-2">
                  {reachesSurfaceMuon ? `Result: The ${Math.round(contractedDistance)}m atmosphere passes by before the muon decays!` : 'Result: The Earth does not reach the muon before it decays.'}
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-slate-800 text-slate-100 rounded-lg text-center font-medium shadow-md">
            TIME DILATION and LENGTH CONTRACTION are two consistent descriptions of the same physics.
          </div>
        </div>
      </div>

      <CalloutCard type="key-concept" title="Direct Evidence">
        <p>
          The muon experiment provides direct experimental evidence for time dilation. In 1977 at CERN, scientists accelerated muons to 0.9994c in a storage ring and confirmed their lifetime increased by exactly the predicted factor of <InlineMath math="\gamma \approx 29.3" />.
        </p>
      </CalloutCard>

      <CalloutCard type="tip" title="Exam Tip">
        <p>
          In muon problems, Earth measures dilated time while the muon measures contracted distance. Both explanations predict the exact same physical outcome.
        </p>
      </CalloutCard>

      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4">Test Your Understanding</h3>
        <QuizCard
          question="A muon travels at 0.95c through an atmosphere of 5 km. According to the muon, how thick is the atmosphere?"
          options={[
            "5.00 km (it doesn't change)",
            "15.86 km (it expands)",
            "1.56 km (it contracts)",
            "3.20 km (it contracts)"
          ]}
          correctIndex={2}
          explanation="At 0.95c, γ = 3.20. In the muon's frame, the Earth's atmosphere is moving, so it undergoes length contraction. L = L₀ / γ = 5 km / 3.20 = 1.56 km."
          onCorrect={() => markComplete('muon-decay')}
        />
      </div>

      <div className="mt-12 flex justify-between">
        <Link to="/simultaneity" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
          <MoveRight className="w-4 h-4 rotate-180" />
          Previous: Relativity of Simultaneity
        </Link>
        <Link to="/spacetime-diagrams" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
          Next: Spacetime Diagrams
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </SectionWrapper>
  );
}
