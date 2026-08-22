import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MousePointer2 } from 'lucide-react';
import CalloutCard from '@/components/ui/CalloutCard';
import ControlSlider from '@/components/ui/ControlSlider';
import { SectionHeader, SectionWrapper } from '@/components/layout/SectionLayout';
import useProgress from '@/hooks/useProgress';

const CLASSIFIER_SCENARIOS = [
  { id: 1, text: 'A train moving at a constant velocity of 100 km/h.', inertial: true, explanation: 'Constant velocity means zero acceleration. This is an inertial frame.' },
  { id: 2, text: 'A passenger plane accelerating down the runway.', inertial: false, explanation: 'The plane is accelerating, so it is a non-inertial frame.' },
  { id: 3, text: 'A skydiver falling at terminal velocity.', inertial: true, explanation: 'At terminal velocity, air resistance balances gravity, so acceleration is zero. Inertial frame.' },
  { id: 4, text: 'A car slamming on its brakes.', inertial: false, explanation: 'Braking is deceleration (negative acceleration). Non-inertial frame.' },
  { id: 5, text: 'The Earth rotating on its axis.', inertial: false, explanation: 'Rotation involves centripetal acceleration. Strictly speaking, Earth is non-inertial (though often approximated as inertial).' }
];

export default function ReferenceFrames() {
  const { markComplete } = useProgress();
  
  // Classifier State
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [feedback, setFeedback] = useState<{correct: boolean, text: string} | null>(null);
  const [score, setScore] = useState(0);
  const [classifierFinished, setClassifierFinished] = useState(false);

  const handleClassify = (guessInertial: boolean) => {
    const scenario = CLASSIFIER_SCENARIOS[currentScenarioIdx];
    const correct = guessInertial === scenario.inertial;
    
    if (correct) {
      setScore(s => s + 1);
    }
    
    setFeedback({
      correct,
      text: scenario.explanation
    });
  };

  const nextScenario = () => {
    setFeedback(null);
    if (currentScenarioIdx < CLASSIFIER_SCENARIOS.length - 1) {
      setCurrentScenarioIdx(curr => curr + 1);
    } else {
      setClassifierFinished(true);
      markComplete('reference-frames');
    }
  };

  // Event Explorer State
  const [eventPos, setEventPos] = useState<{x: number, y: number} | null>(null);
  const [frameVel, setFrameVel] = useState(0);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setEventPos({ x, y });
  };

  return (
    <SectionWrapper>
      <SectionHeader title="6.1 — Reference Frames" />
      
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Intro & Definition */}
        <section className="space-y-6">
          <p className="text-lg text-slate-700 leading-relaxed">
            Before we can talk about how things move, we have to agree on where and when they happen. In physics, we define an observation platform called a <strong>Reference Frame</strong>.
          </p>
          
          <CalloutCard type="definition" title="Event">
            An <strong>Event</strong> is a physical occurrence that happens at a specific location in space and a specific moment in time. It requires four coordinates: <span className="font-mono bg-slate-100 px-1 rounded">(x, y, z, t)</span>.
          </CalloutCard>
        </section>

        {/* Inertial vs Non-Inertial */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-navy border-b border-slate-200 pb-2">Inertial Reference Frames</h2>
          <p className="text-slate-700 leading-relaxed">
            An <strong>inertial reference frame</strong> is one where Newton's First Law holds true: an object at rest stays at rest, and an object in motion stays in motion with a constant velocity, unless acted upon by a net external force. Simply put, an inertial frame is <em>not accelerating</em>.
          </p>
          
          {/* Classifier Interactive */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h3 className="text-lg font-bold text-navy mb-4">Interactive: Inertial Frame Classifier</h3>
            
            {!classifierFinished ? (
              <div className="space-y-6">
                <div className="flex justify-between text-sm text-slate-500 font-medium">
                  <span>Scenario {currentScenarioIdx + 1} of {CLASSIFIER_SCENARIOS.length}</span>
                  <span>Score: {score}</span>
                </div>
                
                <div className="p-6 bg-slate-50 rounded-xl text-center text-lg font-medium text-slate-800 min-h-[120px] flex items-center justify-center">
                  {CLASSIFIER_SCENARIOS[currentScenarioIdx].text}
                </div>

                {!feedback ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleClassify(true)}
                      className="py-3 px-4 bg-emerald-100 text-emerald-800 rounded-xl font-bold hover:bg-emerald-200 transition-colors"
                    >
                      Inertial (a = 0)
                    </button>
                    <button 
                      onClick={() => handleClassify(false)}
                      className="py-3 px-4 bg-orange-100 text-orange-800 rounded-xl font-bold hover:bg-orange-200 transition-colors"
                    >
                      Not Inertial (a ≠ 0)
                    </button>
                  </div>
                ) : (
                  <div className={`p-4 rounded-xl ${feedback.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'} border`}>
                    <div className="font-bold mb-1 flex items-center gap-2">
                      {feedback.correct ? <span className="text-emerald-700">Correct!</span> : <span className="text-red-700">Incorrect.</span>}
                    </div>
                    <p className="text-slate-700 text-sm mb-4">{feedback.text}</p>
                    <button 
                      onClick={nextScenario}
                      className="bg-navy text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors"
                    >
                      Next Scenario
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {score}/{CLASSIFIER_SCENARIOS.length}
                </div>
                <h4 className="text-xl font-bold text-navy mb-2">Classifier Complete!</h4>
                <p className="text-slate-600">You've mastered the identification of inertial frames.</p>
              </div>
            )}
          </div>
        </section>

        {/* Event Coordinate Explorer */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-navy border-b border-slate-200 pb-2">Event Coordinates</h2>
          <p className="text-slate-700 leading-relaxed">
            The same event has different coordinates depending on the observer. Let's look at a stationary frame <strong>S (Navy)</strong> and a moving frame <strong>S' (Violet)</strong> sliding to the right. Click anywhere to create an Event.
          </p>

          <div className="bg-slate-900 rounded-2xl p-6 overflow-hidden shadow-inner flex flex-col items-center">
            <h3 className="text-sm font-semibold tracking-wider text-slate-400 mb-4 uppercase flex items-center gap-2">
              <MousePointer2 className="w-4 h-4" /> Click to place event
            </h3>
            
            <div className="relative w-full max-w-[500px] h-[300px] bg-slate-800 rounded-xl mb-6 cursor-crosshair">
              <svg viewBox="0 0 500 300" className="w-full h-full" onClick={handleSvgClick}>
                {/* Frame S (Stationary) */}
                <line x1="50" y1="250" x2="450" y2="250" stroke="#1e3a5f" strokeWidth="3" />
                <line x1="100" y1="50" x2="100" y2="250" stroke="#1e3a5f" strokeWidth="3" />
                <text x="110" y="70" fill="#64748b" fontSize="16" fontWeight="bold">S (x, y)</text>

                {/* Frame S' (Moving) - Offset by frameVel * time (let's assume time=1 for the visual offset) */}
                {/* Visual Offset: map 0-100 to 0-200 px shift */}
                <g transform={`translate(${frameVel * 2}, 0)`}>
                  <line x1="50" y1="260" x2="450" y2="260" stroke="#7c3aed" strokeWidth="2" strokeDasharray="4,4" />
                  <line x1="100" y1="50" x2="100" y2="260" stroke="#7c3aed" strokeWidth="2" strokeDasharray="4,4" />
                  <text x="110" y="90" fill="#a78bfa" fontSize="16" fontWeight="bold">S' (x', y')</text>
                </g>

                {/* Event */}
                {eventPos && (
                  <g>
                    {/* Lines to axes in S */}
                    <line x1="100" y1={eventPos.y} x2={eventPos.x} y2={eventPos.y} stroke="rgba(255,255,255,0.2)" strokeDasharray="2,2" />
                    <line x1={eventPos.x} y1="250" x2={eventPos.x} y2={eventPos.y} stroke="rgba(255,255,255,0.2)" strokeDasharray="2,2" />
                    
                    <circle cx={eventPos.x} cy={eventPos.y} r="6" fill="#f59e0b" className="animate-pulse" />
                    <text x={eventPos.x + 10} y={eventPos.y - 10} fill="#f59e0b" fontSize="14" fontWeight="bold">Event E</text>
                  </g>
                )}
              </svg>
            </div>

            <div className="w-full max-w-[500px] mb-6">
              <ControlSlider
                label="Velocity of S' relative to S (v)"
                value={frameVel}
                min={0}
                max={100}
                step={1}
                onChange={setFrameVel}
              />
            </div>

            {eventPos ? (
              <div className="w-full max-w-[500px] grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <div className="text-slate-400 text-sm mb-1">Coordinates in S (Navy)</div>
                  <div className="font-mono text-white text-lg">x = {Math.round(eventPos.x - 100)}</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <div className="text-slate-400 text-sm mb-1">Coordinates in S' (Violet)</div>
                  <div className="font-mono text-violet-300 text-lg">x' = {Math.round((eventPos.x - 100) - (frameVel * 2))}</div>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 italic">Click the diagram to place an event.</div>
            )}
          </div>
        </section>

        {/* Exam Tip */}
        <CalloutCard type="tip" title="Exam Tip: The Rest Frame">
          Always identify the "rest frame" or "proper frame" first. This is the reference frame where the object of interest is stationary. Many relativistic paradoxes are solved simply by clearly defining who is measuring what.
        </CalloutCard>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 mt-12 border-t border-slate-200">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-navy transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link to="/galilean-relativity" className="flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-full hover:bg-slate-800 transition-colors font-bold shadow-md">
            Next: Galilean Relativity <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </SectionWrapper>
  );
}
