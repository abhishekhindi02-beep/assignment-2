import { useState, useEffect } from 'react';
import { SectionHeader, SectionWrapper } from '@/components/layout/SectionLayout';
import { useProgress } from '@/hooks/useProgress';
import { CheckCircle2, AlertCircle, HelpCircle, RotateCcw, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { InlineMath } from '@/components/math/MathBlock';

type Status = 'not-yet' | 'nearly' | 'ready';

interface Objective {
  id: string;
  text: string;
}

const OBJECTIVES: Objective[] = [
  { id: 'obj-1', text: 'Can I identify an inertial reference frame and distinguish it from non-inertial frames?' },
  { id: 'obj-2', text: "Can I state and explain Einstein's two postulates of Special Relativity?" },
  { id: 'obj-3', text: 'Can I calculate the gamma factor (γ) for any given relative velocity (v/c)?' },
  { id: 'obj-4', text: 'Can I apply Lorentz transformations to convert event coordinates between reference frames?' },
  { id: 'obj-5', text: 'Can I distinguish proper time (Δt₀) from dilated time (Δt) in relativistic problems?' },
  { id: 'obj-6', text: 'Can I explain time dilation using light clock thought experiments and calculate Δt = γΔt₀?' },
  { id: 'obj-7', text: 'Can I explain proper length (L₀) and calculate horizontal length contraction L = L₀/γ?' },
  { id: 'obj-8', text: 'Can I calculate combined speeds using Einstein’s relativistic velocity addition formula?' },
  { id: 'obj-9', text: 'Can I explain cosmic muon atmospheric survival using time dilation and length contraction?' },
  { id: 'obj-10', text: 'Can I calculate the invariant spacetime interval (Δs)² = (cΔt)² - (Δx)²?' },
  { id: 'obj-11', text: 'Can I construct and interpret Minkowski spacetime diagrams, worldlines, and primed axes?' },
  { id: 'obj-12', text: 'Can I explain the relativity of simultaneity using train experiments and light cones?' },
];

export function Reflection() {
  const { progress, setReflection, markComplete } = useProgress();
  const [isTOKOpen, setIsTOKOpen] = useState(false);

  useEffect(() => {
    markComplete('/reflection');
  }, [markComplete]);

  const getStatus = (id: string): Status => {
    return (progress.reflectionStatus?.[id] as Status) || 'not-yet';
  };

  const handleSetStatus = (id: string, status: Status) => {
    setReflection(id, status);
  };

  const resetAll = () => {
    OBJECTIVES.forEach(obj => setReflection(obj.id, 'not-yet'));
  };

  const readyCount = OBJECTIVES.filter(obj => getStatus(obj.id) === 'ready').length;
  const nearlyCount = OBJECTIVES.filter(obj => getStatus(obj.id) === 'nearly').length;

  return (
    <SectionWrapper
      prev={{ to: '/final-challenge', label: '14 Final Challenge' }}
    >
      <SectionHeader
        section="Chapter Reflection"
        title="Self-Assessment & IB Revision Checklist"
        subtitle="Review each learning objective from Chapter 6 (Special Relativity) and select your current confidence level."
      />

      {/* Progress Summary Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Revision Readiness</h3>
            <p className="text-sm text-slate-600 mt-1">
              You have mastered <strong className="text-emerald-700">{readyCount}</strong> out of {OBJECTIVES.length} chapter objectives.
            </p>
          </div>
          {(readyCount > 0 || nearlyCount > 0) && (
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw size={14} />
              Reset Self-Assessment
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-3 rounded-full mt-5 overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${(readyCount / OBJECTIVES.length) * 100}%` }}
            title="Ready to move on"
          />
          <div
            className="bg-amber-400 h-full transition-all duration-500"
            style={{ width: `${(nearlyCount / OBJECTIVES.length) * 100}%` }}
            title="Nearly there"
          />
        </div>
        <div className="flex items-center gap-6 mt-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Ready ({readyCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Nearly There ({nearlyCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span>Needs Review ({OBJECTIVES.length - readyCount - nearlyCount})</span>
          </div>
        </div>
      </div>

      {/* Objectives Checklist */}
      <div className="space-y-3 mb-10">
        <h3 className="text-base font-bold text-slate-900 mb-2">Select Your Confidence Level for Each Objective:</h3>
        {OBJECTIVES.map((obj) => {
          const currentStatus = getStatus(obj.id);

          return (
            <div
              key={obj.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-slate-300"
            >
              <span className="text-slate-800 text-sm font-medium leading-relaxed flex-1">
                {obj.text}
              </span>

              {/* 3 Explicit Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 p-1 rounded-xl border border-slate-100">
                <button
                  onClick={() => handleSetStatus(obj.id, 'not-yet')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    currentStatus === 'not-yet'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <HelpCircle size={13} />
                  <span>Not Yet</span>
                </button>

                <button
                  onClick={() => handleSetStatus(obj.id, 'nearly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    currentStatus === 'nearly'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <AlertCircle size={13} />
                  <span>Nearly</span>
                </button>

                <button
                  onClick={() => handleSetStatus(obj.id, 'ready')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    currentStatus === 'ready'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <CheckCircle2 size={13} />
                  <span>Ready</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Takeaways Section */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 mb-8 shadow-md">
        <div className="flex items-center gap-2 mb-4 text-violet-400">
          <BookOpen size={20} />
          <h3 className="text-lg font-bold text-white">Key Chapter Takeaways</h3>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-violet-400 font-bold">•</span>
            <span>The speed of light in vacuum (<InlineMath math="c" />) is invariant for all inertial observers.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-400 font-bold">•</span>
            <span>The laws of physics take the exact same form in all inertial reference frames.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-400 font-bold">•</span>
            <span>Proper time (<InlineMath math="\Delta t_0" />) is measured in the rest frame and is always the shortest duration.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-400 font-bold">•</span>
            <span>Proper length (<InlineMath math="L_0" />) contracts only along the direction of relative motion (<InlineMath math="L = L_0/\gamma" />).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-400 font-bold">•</span>
            <span>Simultaneity is relative: spatially separated simultaneous events in <InlineMath math="S" /> occur at different times in <InlineMath math="S'" />.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-400 font-bold">•</span>
            <span>The spacetime interval <InlineMath math="(\Delta s)^2 = (c\Delta t)^2 - (\Delta x)^2" /> is invariant across all reference frames.</span>
          </li>
        </ul>
      </div>

      {/* Theory of Knowledge Connection */}
      <div className="border border-violet-200 rounded-2xl overflow-hidden bg-violet-50/50">
        <button
          onClick={() => setIsTOKOpen(!isTOKOpen)}
          className="w-full text-left p-5 flex justify-between items-center font-bold text-violet-900 hover:bg-violet-100/50 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2 text-base">
            <span>🧠</span>
            <span>Theory of Knowledge (TOK) Connection</span>
          </span>
          {isTOKOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {isTOKOpen && (
          <div className="p-5 border-t border-violet-100 text-slate-700 text-sm leading-relaxed space-y-3 bg-white">
            <p>
              <strong>Knowledge Query:</strong> "If two inertial observers measure different time intervals and lengths for the exact same physical process, which observer is making the correct measurement?"
            </p>
            <p className="text-slate-600">
              <strong>Relativistic Answer:</strong> In Special Relativity, both observers are 100% correct within their respective reference frames. Nature does not privilege one inertial observer over another. Scientific truth is preserved through <em>invariant quantities</em> (like the spacetime interval and the speed of light) rather than absolute space or time.
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export default Reflection;
