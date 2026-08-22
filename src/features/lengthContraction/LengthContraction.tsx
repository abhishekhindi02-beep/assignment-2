import { useState, useEffect } from 'react';
import { MathBlock, InlineMath } from '@/components/math/MathBlock';
import { FormulaCard } from '@/components/math/FormulaCard';
import { CalloutCard } from '@/components/ui/CalloutCard';
import { ControlSlider } from '@/components/ui/ControlSlider';
import { StepReveal } from '@/components/ui/StepReveal';
import { QuizCard } from '@/components/quiz/QuizCard';
import { SectionHeader, SectionWrapper } from '@/components/layout/SectionLayout';
import { useProgress } from '@/hooks/useProgress';
import { gamma, lengthContraction, formatNumber } from '@/physics/relativity';

export default function LengthContraction() {
  const { markComplete } = useProgress();
  const [velocity, setVelocity] = useState(0);
  const [properLength, setProperLength] = useState(100);

  useEffect(() => {
    markComplete('length-contraction');
  }, [markComplete]);

  const currentGamma = gamma(velocity);
  const contractedLength = lengthContraction(properLength, velocity);

  return (
    <SectionWrapper
      prev={{ to: '/time-dilation', label: 'Time Dilation' }}
      next={{ to: '/velocity-addition', label: 'Velocity Addition' }}
    >
      <SectionHeader
        section="6.2"
        title="Length Contraction"
        subtitle="Moving objects are shorter in the direction of motion."
      />

      <div className="space-y-8">
        <FormulaCard
          name="Length Contraction Formula"
          latex="L = \frac{L_0}{\gamma} = L_0 \sqrt{1 - v^2/c^2}"
          description="Calculates the length of an object measured by an observer moving at velocity v relative to the object."
          symbols={[
            { symbol: 'L', meaning: 'Contracted length (moving frame)', unit: 'm' },
            { symbol: 'L_0', meaning: 'Proper length (rest frame)', unit: 'm' },
            { symbol: '\\gamma', meaning: 'Lorentz factor' },
            { symbol: 'v', meaning: 'Relative velocity', unit: 'c' }
          ]}
        />

        <CalloutCard type="definition" title="Proper Length">
          Proper length is measured in the frame where the object is <strong>at rest</strong>.
        </CalloutCard>

        {/* INTERACTIVE VISUALIZER */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 p-4">
            <h3 className="text-lg font-semibold text-slate-800">Interactive Spaceship Visualizer</h3>
            <p className="text-sm text-slate-600 mt-1">See how a moving spaceship appears contracted to a stationary observer.</p>
          </div>
          <div className="p-6 space-y-8">
            <div className="flex flex-col gap-8 items-center justify-center">
              
              <div className="w-full max-w-2xl bg-navy-900 rounded-xl p-8 relative overflow-hidden h-48 flex items-center justify-center border-4 border-slate-800 shadow-inner">
                {/* Star background */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-4 left-10 w-1 h-1 bg-white rounded-full"></div>
                  <div className="absolute top-12 left-32 w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="absolute bottom-10 left-1/4 w-1 h-1 bg-white rounded-full"></div>
                  <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute bottom-8 right-12 w-1 h-1 bg-white rounded-full"></div>
                </div>

                {/* Spaceship Container */}
                <div 
                  className="relative transition-all duration-300 ease-out flex items-center justify-center"
                  style={{ width: `${(contractedLength / 100) * 80}%`, height: '80px' }}
                >
                  {/* The SVG Spaceship */}
                  <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full drop-shadow-xl text-slate-200 fill-current">
                    <path d="M10,15 Q30,5 90,15 Q30,25 10,15 Z" className="text-slate-300 fill-current" />
                    <path d="M0,12 L10,15 L0,18 Z" className="text-amber-500 fill-current" />
                    <circle cx="50" cy="15" r="3" className="text-sky-400 fill-current" />
                    <circle cx="65" cy="15" r="3" className="text-sky-400 fill-current" />
                    <circle cx="35" cy="15" r="3" className="text-sky-400 fill-current" />
                  </svg>
                  
                  {/* Dimension Line */}
                  <div className="absolute -bottom-6 left-0 right-0 border-b-2 border-x-2 border-emerald-400 h-2"></div>
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-emerald-400 font-mono text-sm font-bold whitespace-nowrap">
                    L = {formatNumber(contractedLength, 1)} m
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="max-w-md mx-auto space-y-6">
              <ControlSlider
                label="Proper Length (L₀)"
                value={properLength}
                min={1}
                max={100}
                step={1}
                onChange={(v) => setProperLength(v)}
                unit="m"
              />
              <ControlSlider
                label="Relative Velocity (v)"
                value={velocity}
                min={0}
                max={0.99}
                step={0.01}
                onChange={(v) => setVelocity(v)}
                unit="c"
              />
              
              <div className="flex items-center justify-between text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-600">Lorentz Factor (<InlineMath latex="\gamma" />): <strong className="text-slate-900">{formatNumber(currentGamma, 3)}</strong></span>
                <span className="text-slate-600"><InlineMath latex="L = L_0 / \gamma" /></span>
              </div>
            </div>
          </div>
        </div>

        <CalloutCard type="misconception">
          Moving objects do <strong>NOT</strong> contract in every spatial direction. Only the component of length <strong>parallel to the direction of motion</strong> contracts. The vertical dimensions remain unchanged!
        </CalloutCard>

        {/* Which Frame Challenge */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Interactive Challenge: Which Frame?</h3>
          <QuizCard
            question="A spaceship flies past Earth at 0.8c. Which frame measures the PROPER length of the spaceship?"
            options={[
              { text: 'Earth Frame', isCorrect: false },
              { text: 'Spaceship Frame', isCorrect: true },
              { text: 'Both measure proper length', isCorrect: false }
            ]}
            explanation="The spaceship frame measures the proper length because the spaceship is AT REST relative to that frame."
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Worked Example: Spacecraft Journey</h3>
          <StepReveal
            steps={[
              {
                label: 'The Scenario',
                content: 'A star is 100 light-years from Earth. A spacecraft travels to it at 0.95c. We want to find the distance and time measured in both frames.'
              },
              {
                label: 'Earth Frame (Rest Frame for Distance)',
                content: 'Earth measures the proper distance to the star: L₀ = 100 ly. The time taken is simply t = distance / velocity = 100 ly / 0.95c = 105.3 years.'
              },
              {
                label: 'Spacecraft Frame (Contracted Distance)',
                content: <><MathBlock latex="\gamma = \frac{1}{\sqrt{1 - 0.95^2}} = 3.203" /> The distance is contracted: <MathBlock latex="L = \frac{L_0}{\gamma} = \frac{100}{3.203} = 31.2 \text{ ly}" /></>
              },
              {
                label: 'Spacecraft Frame (Proper Time)',
                content: 'The time taken according to the spaceship clock is t₀ = distance / velocity = 31.2 ly / 0.95c = 32.9 years. (Alternatively, apply time dilation to Earth time: 105.3 / γ = 32.9 years).'
              }
            ]}
          />
        </div>

        <CalloutCard type="exam-tip">
          When measuring the length of a moving object, <strong>both ends must be measured at the SAME TIME</strong> in the measuring frame. Failure to do so leads to incorrect measurements.
        </CalloutCard>

        <QuizCard
          question="A 100m long train travels at 0.6c. What length is measured by a stationary observer on the platform?"
          options={[
            { text: '100m', isCorrect: false },
            { text: '125m', isCorrect: false },
            { text: '80m', isCorrect: true },
            { text: '60m', isCorrect: false }
          ]}
          explanation="At 0.6c, γ = 1.25. Contracted length = L₀ / γ = 100 / 1.25 = 80m."
        />
      </div>
    </SectionWrapper>
  );
}
