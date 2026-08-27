import { useState } from 'react';
import { CheckSquare, MessageSquare } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

export const SelfAssessment = () => {
  const { progress, updateSelfAssessment } = useProgress();

  const checklistItems = [
    { id: 'sa_1_1', section: '1.1', label: 'Define and distinguish position, displacement, distance, speed, and velocity.' },
    { id: 'sa_1_2', section: '1.2', label: 'Distinguish average vs instantaneous velocity and average vs instantaneous acceleration.' },
    { id: 'sa_1_3', section: '1.2', label: 'Solve constant-acceleration problems using the four kinematics (SUVAT) equations.' },
    { id: 'sa_1_4', section: '1.3', label: 'Analyse motion through graphs (gradient = velocity/acceleration, area = displacement).' },
    { id: 'sa_1_5', section: '1.4', label: 'Solve 2D projectile motion problems using independent horizontal and vertical components.' },
    { id: 'sa_1_6', section: '1.4', label: 'Describe qualitatively the effects of fluid resistance and explain terminal speed.' }
  ];

  const reflectionPrompts = [
    {
      q: "Why do distance and displacement differ during a round-trip journey?",
      a: "Distance is a scalar measuring total path length travelled, whereas displacement is a vector representing net change in position (s_final - s_initial). In a round trip, s_final = s_initial so displacement is 0, while distance is non-zero!"
    },
    {
      q: "What information does the slope (gradient) and area of a velocity-time graph provide?",
      a: "The gradient of a v-t graph equals instantaneous acceleration (a = dv/dt). The area under a v-t graph equals change in position, i.e., displacement (Δs = ∫v dt)."
    },
    {
      q: "Why does a falling object reach terminal speed when dropped in air?",
      a: "As the object accelerates downward, its speed increases, causing air drag force (F_drag = kv or kv²) to increase until F_drag = mg. At this point, net force becomes zero, acceleration becomes zero, and speed remains constant at terminal speed v_T."
    }
  ];

  const [activeReflection, setActiveReflection] = useState(null);

  return (
    <div className="my-8 p-6 rounded-3xl glass-panel border border-emerald-500/40 bg-slate-950/90 shadow-2xl space-y-8">
      {/* Self Assessment Checklist */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest border-b border-slate-800 pb-3">
          <CheckSquare className="w-5 h-5" /> Self-Evaluation Checklist
        </div>

        <div className="space-y-3">
          {checklistItems.map((item) => {
            const currentRating = progress.selfAssessment[item.id] || 'not_yet';

            return (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    Section {item.section}
                  </span>
                  <p className="text-xs text-slate-200 font-medium">{item.label}</p>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {[
                    { id: 'not_yet', label: 'Not Yet' },
                    { id: 'nearly', label: 'Nearly There' },
                    { id: 'ready', label: 'Ready to Move On' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => updateSelfAssessment(item.id, r.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        currentRating === r.id
                          ? r.id === 'ready'
                            ? 'bg-emerald-500 text-slate-950 shadow-md'
                            : r.id === 'nearly'
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-rose-500 text-slate-950 shadow-md'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Reflection Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest">
          <MessageSquare className="w-5 h-5" /> Chapter Reflection & Deep Conceptual Review
        </div>

        <div className="space-y-3">
          {reflectionPrompts.map((p, idx) => {
            const isOpen = activeReflection === idx;

            return (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <button
                  onClick={() => setActiveReflection(isOpen ? null : idx)}
                  className="w-full text-left font-semibold text-xs text-slate-200 hover:text-cyan-300 flex items-center justify-between gap-2"
                >
                  <span>{p.q}</span>
                  <span className="text-cyan-400 font-bold">{isOpen ? '−' : '+'}</span>
                </button>

                {isOpen && (
                  <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-900 animate-fadeIn">
                    {p.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
