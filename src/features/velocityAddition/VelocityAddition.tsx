import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader, SectionWrapper } from '@/components/layout/SectionLayout';
import { MathBlock, InlineMath } from '@/components/math/MathBlock';
import { FormulaCard } from '@/components/math/FormulaCard';
import { CalloutCard } from '@/components/ui/CalloutCard';
import { ControlSlider } from '@/components/ui/ControlSlider';
import { StepReveal } from '@/components/ui/StepReveal';
import { QuizCard } from '@/components/quiz/QuizCard';
import { useProgress } from '@/hooks/useProgress';
import { relativisticVelocityAdd, galileanVelocityAdd, formatNumber } from '@/physics/relativity';
import { ArrowLeft, ArrowRight, Info, AlertTriangle, Zap } from 'lucide-react';

export default function VelocityAddition() {
  const { markSectionComplete } = useProgress();
  
  // State for Velocity Addition Lab
  const [uPrime, setUPrime] = useState(0.5);
  const [v, setV] = useState(0.5);

  // State for Two Rockets Experiment
  const [vA, setVA] = useState(0.8);
  const [vB, setVB] = useState(-0.8);

  // Fallbacks if physics functions are not strictly implemented as asked
  const calcGalilean = (u: number, frameV: number) => {
    try {
      return galileanVelocityAdd(u, frameV);
    } catch {
      return u + frameV;
    }
  };
  
  const calcRelativistic = (u: number, frameV: number) => {
    try {
      return relativisticVelocityAdd(u, frameV);
    } catch {
      return (u + frameV) / (1 + u * frameV);
    }
  };

  const galileanRes = calcGalilean(uPrime, v);
  const relativisticRes = calcRelativistic(uPrime, v);
  const isImpossible = Math.abs(galileanRes) > 1;

  // Relative velocity of B as seen by A
  // A sees the ground moving at -vA. B is moving at vB relative to ground.
  // u' = vB (velocity of B in ground), v = -vA (velocity of ground relative to A).
  // Therefore velocity of B as seen by A is relativistic add of vB and -vA.
  const vB_in_A = calcRelativistic(vB, -vA);

  useEffect(() => {
    markSectionComplete('velocity-addition');
  }, [markSectionComplete]);

  return (
    <SectionWrapper>
      <SectionHeader 
        title="6.2 — Relativistic Velocity Addition" 
        subtitle="Why nothing can travel faster than light"
      />

      <div className="space-y-6">
        <p className="text-slate-700 leading-relaxed">
          In classical physics, if you are on a train moving at 50 mph and you throw a ball forward at 20 mph, 
          an observer on the ground sees the ball moving at 70 mph. You simply add the velocities. 
          But at speeds close to light, this Galilean addition fails, because it would allow objects to exceed <InlineMath math="c" />.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <FormulaCard
            title="Velocity Addition (S to S')"
            formula="u = \frac{u' + v}{1 + \frac{u'v}{c^2}}"
            description="Velocity of an object measured in the ground frame S."
            symbols={[
              { symbol: "u", meaning: "Velocity in frame S (ground)" },
              { symbol: "u'", meaning: "Velocity in frame S' (moving)" },
              { symbol: "v", meaning: "Velocity of frame S' relative to S" }
            ]}
          />
          <FormulaCard
            title="Inverse Velocity Addition (S' to S)"
            formula="u' = \frac{u - v}{1 - \frac{uv}{c^2}}"
            description="Velocity of an object measured in the moving frame S'."
            symbols={[
              { symbol: "u'", meaning: "Velocity in frame S' (moving)" },
              { symbol: "u", meaning: "Velocity in frame S (ground)" },
              { symbol: "v", meaning: "Velocity of frame S' relative to S" }
            ]}
          />
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-violet-600" />
            Velocity Addition Lab
          </h3>
          <p className="text-slate-600 mb-6">
            Compare Galilean and Relativistic velocity addition by adjusting the velocities below.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <ControlSlider
                label="Object Velocity in S' (u')"
                value={uPrime}
                min={-0.99}
                max={0.99}
                step={0.01}
                onChange={setUPrime}
                unit="c"
              />
              <ControlSlider
                label="Frame Velocity (v)"
                value={v}
                min={0}
                max={0.99}
                step={0.01}
                onChange={setV}
                unit="c"
              />
            </div>
            <div className="space-y-6 flex flex-col justify-center">
              <div className="p-4 rounded-xl bg-white shadow-sm border border-slate-200">
                <div className="text-sm font-semibold text-slate-500 mb-1">Galilean Result (Wrong)</div>
                <div className={`text-3xl font-bold ${isImpossible ? 'text-orange-600' : 'text-slate-800'}`}>
                  {formatNumber(galileanRes)}c
                </div>
                {isImpossible && (
                  <div className="mt-2 text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                    Galilean prediction exceeds c — physically impossible!
                  </div>
                )}
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-sm">
                <div className="text-sm font-semibold text-emerald-700 mb-1">Relativistic Result (Correct)</div>
                <div className="text-3xl font-bold text-emerald-600">
                  {formatNumber(relativisticRes)}c
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-8 bg-slate-200 rounded-full overflow-hidden flex relative">
            {/* Visual Bar Chart */}
            <div 
              className={`absolute top-0 bottom-0 left-1/2 opacity-50 ${isImpossible ? 'bg-orange-500' : 'bg-slate-400'}`}
              style={{ width: `${Math.min(100, Math.abs(galileanRes) * 50)}%`, right: galileanRes < 0 ? '50%' : 'auto', left: galileanRes < 0 ? 'auto' : '50%' }}
            />
            <div 
              className="absolute top-0 bottom-0 bg-emerald-500"
              style={{ width: `${Math.min(100, Math.abs(relativisticRes) * 50)}%`, right: relativisticRes < 0 ? '50%' : 'auto', left: relativisticRes < 0 ? 'auto' : '50%' }}
            />
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-800" />
            <div className="absolute top-0 bottom-0 left-[0%] w-0.5 bg-red-400 opacity-50" />
            <div className="absolute top-0 bottom-0 left-[100%] w-0.5 bg-red-400 opacity-50" />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>-c</span>
            <span>0</span>
            <span>+c</span>
          </div>
        </div>

        <CalloutCard type="info" title="Light Speed Invariance">
          <p>
            If a rocket moves at <InlineMath math="v = 0.9c" /> and fires a laser beam forward, the light moves at <InlineMath math="u' = 1.0c" /> relative to the rocket. What speed does a ground observer measure for the light?
          </p>
          <div className="mt-3">
            <MathBlock math="u = \frac{1.0c + 0.9c}{1 + (1.0)(0.9)} = \frac{1.9c}{1.9} = 1.0c" />
          </div>
          <p className="mt-2 text-sm text-slate-700">
            The velocity addition formula naturally guarantees that the speed of light is exactly <InlineMath math="c" /> in all frames, reinforcing Einstein's second postulate!
          </p>
        </CalloutCard>

        <div className="bg-slate-900 rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Two Rockets Experiment</h3>
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div>
              <ControlSlider
                label="Rocket A Velocity (v_A)"
                value={vA}
                min={0}
                max={0.99}
                step={0.01}
                onChange={setVA}
                unit="c"
              />
              <div className="mt-4">
                <ControlSlider
                  label="Rocket B Velocity (v_B)"
                  value={vB}
                  min={-0.99}
                  max={0}
                  step={0.01}
                  onChange={setVB}
                  unit="c"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div className="text-slate-400 text-sm mb-2">Velocity of B relative to A</div>
              <div className="text-4xl font-bold text-violet-400">{formatNumber(vB_in_A)}c</div>
              <div className="mt-2 text-xs text-slate-500 max-w-[200px] text-center">
                Even if both rockets travel towards each other at 0.99c, they will never see each other approach faster than c.
              </div>
            </div>
          </div>
          
          <div className="relative h-24 bg-slate-800 rounded-xl overflow-hidden flex items-center border border-slate-700">
            {/* Simple Rocket A */}
            <div 
              className="absolute transition-all duration-300 flex items-center"
              style={{ left: `${50 - (vA * 40)}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-12 h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(245,158,11,0.5)]">A</div>
              <ArrowRight className="w-4 h-4 ml-1 text-amber-500" />
            </div>

            {/* Simple Rocket B */}
            <div 
              className="absolute transition-all duration-300 flex items-center"
              style={{ left: `${50 - (vB * 40)}%`, transform: 'translateX(-50%)' }}
            >
              <ArrowLeft className="w-4 h-4 mr-1 text-violet-500" />
              <div className="w-12 h-6 bg-violet-500 rounded-full flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(124,58,237,0.5)]">B</div>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Worked Example</h3>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <p className="text-slate-700 mb-4">
            A spaceship moves past Earth at <InlineMath math="v = 0.80c" />. It fires a probe forward at <InlineMath math="u' = 0.50c" /> relative to the ship. What is the probe's speed relative to Earth?
          </p>
          <StepReveal steps={[
            {
              title: "Identify given values",
              content: <p>Velocity of ship (frame <InlineMath math="S'" />) relative to Earth (frame <InlineMath math="S" />): <InlineMath math="v = 0.80c" /><br />Velocity of probe in frame <InlineMath math="S'" />: <InlineMath math="u' = 0.50c" /></p>
            },
            {
              title: "Calculate Galilean expectation (incorrect)",
              content: <p>Classical mechanics predicts: <InlineMath math="u = u' + v = 0.50c + 0.80c = 1.30c" />. This is impossible!</p>
            },
            {
              title: "Apply relativistic velocity addition",
              content: <MathBlock math="u = \frac{u' + v}{1 + \frac{u'v}{c^2}} = \frac{0.50c + 0.80c}{1 + (0.50)(0.80)} = \frac{1.30c}{1 + 0.40} = \frac{1.30c}{1.40} \approx 0.929c" />
            }
          ]} />
        </div>

        <div className="mt-8">
          <QuizCard
            question="A spaceship moving at 0.6c fires a laser beam forward. What speed does an observer on a stationary space station measure for the laser light?"
            options={[
              { id: "a", text: "1.6c", isCorrect: false, explanation: "Light speed is invariant and cannot exceed c." },
              { id: "b", text: "1.0c", isCorrect: true, explanation: "According to Einstein's second postulate, the speed of light in a vacuum is exactly c for all observers, regardless of the source's motion." },
              { id: "c", text: "0.4c", isCorrect: false, explanation: "The speed of light is always c." },
              { id: "d", text: "0.77c", isCorrect: false, explanation: "Applying the velocity addition formula with u' = c gives exactly c." }
            ]}
          />
        </div>

        <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-200">
          <Link to="/length-contraction" className="flex items-center text-slate-600 hover:text-violet-600 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Length Contraction
          </Link>
          <Link to="/simultaneity" className="flex items-center text-slate-600 hover:text-violet-600 transition-colors font-medium">
            Simultaneity
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}
