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
    <div className="my-8 p-6 rounded-3xl bg-white border border-emerald-200 shadow-xs space-y-8">
      {/* Self Assessment Checklist */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-widest border-b border-slate-200 pb-3">
          <CheckSquare className="w-5 h-5" /> Self-Evaluation Checklist
        </div>

        <div className="space-y-3">
          {checklistItems.map((item) => {
            const currentRating = progress.selfAssessment[item.id] || 'not_yet';

            return (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Section {item.section}
                  </span>
                  <p className="text-xs text-slate-800 font-semibold">{item.label}</p>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
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
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : r.id === 'nearly'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
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
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 text-sky-700 text-xs font-bold uppercase tracking-widest">
          <MessageSquare className="w-5 h-5" /> Chapter Reflection & Deep Conceptual Review
        </div>

        <div className="space-y-3">
          {reflectionPrompts.map((p, idx) => {
            const isOpen = activeReflection === idx;

            return (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <button
                  onClick={() => setActiveReflection(isOpen ? null : idx)}
                  className="w-full text-left font-bold text-xs text-slate-900 hover:text-sky-700 flex items-center justify-between gap-2"
                >
                  <span>{p.q}</span>
                  <span className="text-sky-700 font-bold">{isOpen ? '−' : '+'}</span>
                </button>

                {isOpen && (
                  <p className="text-xs text-slate-700 leading-relaxed pt-2 border-t border-slate-200 animate-fadeIn">
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
