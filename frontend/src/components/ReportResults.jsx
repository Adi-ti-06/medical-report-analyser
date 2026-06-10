import { useState } from 'react'
import {
  User, FileText, AlertTriangle, CheckCircle, Clock,
  Lightbulb, MessageSquare, Pill, ArrowRight, Heart,
  TrendingUp, Activity, ChevronDown, ChevronUp, Info
} from 'lucide-react'
import SectionCard from './SectionCard'
import HealthScoreBadge from './HealthScoreBadge'

const statusColors = {
  Normal:     'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  High:       'bg-red-500/15 text-red-400 border-red-500/30',
  Low:        'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Abnormal:   'bg-red-500/15 text-red-400 border-red-500/30',
  Borderline: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
}

const severityColors = {
  Mild:     { bg: 'bg-amber-500/10',  border: 'border-l-amber-400',  badge: 'bg-amber-500/15 text-amber-400' },
  Moderate: { bg: 'bg-orange-500/10', border: 'border-l-orange-400', badge: 'bg-orange-500/15 text-orange-400' },
  Severe:   { bg: 'bg-red-500/10',    border: 'border-l-red-400',    badge: 'bg-red-500/15 text-red-400' },
}

const priorityColors = {
  'Urgent — See doctor immediately': 'bg-red-500/15 text-red-400 border-red-500/30',
  'Soon — Within 2 weeks':           'bg-orange-500/15 text-orange-400 border-orange-500/30',
  'Routine — Within 3 months':       'bg-blue-500/15 text-blue-400 border-blue-500/30',
}

const riskColors = {
  Low:      'bg-emerald-500/15 text-emerald-400',
  Moderate: 'bg-amber-500/15 text-amber-400',
  High:     'bg-red-500/15 text-red-400',
}

const categoryIcons = {
  Diet: '🥗', Exercise: '🏃', Sleep: '😴', Stress: '🧘',
  Hydration: '💧', Lifestyle: '🌟', Supplements: '💊',
}

function Collapsible({ title, count, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left py-1 px-1 rounded hover:bg-white/5 transition-colors"
      >
        <span className="font-semibold text-slate-300 text-sm">
          {title} {count !== undefined && <span className="text-slate-500 font-normal">({count})</span>}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

export default function ReportResults({ analysis }) {
  const a = analysis

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div className="bg-[#0f172a] rounded-2xl border border-white/8 p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-3">{a.report_title || 'Medical Report Analysis'}</h2>
            <p className="text-slate-400 leading-relaxed">{a.summary}</p>
          </div>
          {a.overall_health_score && (
            <div className="flex-shrink-0">
              <p className="text-xs text-slate-500 mb-2 text-center">Overall Status</p>
              <HealthScoreBadge score={a.overall_health_score} large />
            </div>
          )}
        </div>
      </div>

      {/* Patient Info */}
      {a.patient_info && Object.values(a.patient_info).some(v => v && v !== 'Not specified') && (
        <SectionCard icon={User} title="Patient Information" color="slate">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(a.patient_info).map(([k, v]) => (
              v && v !== 'Not specified' && (
                <div key={k} className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-xs text-slate-500 capitalize mb-0.5">{k.replace(/_/g, ' ')}</p>
                  <p className="font-semibold text-slate-200 text-sm">{v}</p>
                </div>
              )
            ))}
          </div>
        </SectionCard>
      )}

      {/* Abnormal Findings */}
      {a.abnormal_findings?.length > 0 && (
        <SectionCard icon={AlertTriangle} title={`Abnormal Findings (${a.abnormal_findings.length})`} color="red">
          <div className="space-y-4">
            {a.abnormal_findings.map((f, i) => {
              const sc = severityColors[f.severity] || severityColors.Mild
              return (
                <div key={i} className={`${sc.bg} border border-red-500/20 border-l-4 ${sc.border} rounded-xl p-4 abnormal-pulse`}>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-bold text-white">{f.finding}</h4>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${sc.badge}`}>{f.severity}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 mb-3 text-sm">
                    <div className="bg-white/5 rounded-lg p-2.5">
                      <p className="text-xs text-slate-500 mb-0.5">Your value</p>
                      <p className="font-semibold text-slate-200">{f.your_value || '—'}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2.5">
                      <p className="text-xs text-slate-500 mb-0.5">Normal range</p>
                      <p className="font-semibold text-slate-200">{f.what_is_normal || '—'}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">{f.plain_explanation}</p>
                  <p className="text-slate-400 text-sm italic">{f.why_it_matters}</p>
                  {f.common_causes?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-slate-500 font-medium mb-1">Possible causes:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {f.common_causes.map((c, ci) => (
                          <span key={ci} className="text-xs bg-white/8 border border-white/10 rounded-full px-2.5 py-0.5 text-slate-400">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </SectionCard>
      )}

      {/* Key Findings Table */}
      {a.key_findings?.length > 0 && (
        <SectionCard icon={Activity} title="All Test Results" color="blue">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-3 text-slate-400 font-semibold">Parameter</th>
                  <th className="text-left py-2 px-3 text-slate-400 font-semibold">Your Value</th>
                  <th className="text-left py-2 px-3 text-slate-400 font-semibold hidden sm:table-cell">Normal Range</th>
                  <th className="text-left py-2 px-3 text-slate-400 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {a.key_findings.map((f, i) => (
                  <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/3' : ''}`}>
                    <td className="py-2.5 px-3">
                      <p className="font-medium text-white">{f.parameter}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{f.simple_explanation}</p>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-300">{f.value || '—'}</td>
                    <td className="py-2.5 px-3 text-slate-500 hidden sm:table-cell">{f.normal_range || '—'}</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-semibold border ${statusColors[f.status] || 'bg-white/10 text-slate-400 border-white/10'}`}>
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* Normal Findings */}
      {a.normal_findings?.length > 0 && (
        <SectionCard icon={CheckCircle} title="Good News — Normal Findings" color="green">
          <div className="grid sm:grid-cols-2 gap-2">
            {a.normal_findings.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-white/5 rounded-xl p-3 border border-emerald-500/15">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  {typeof f === 'string' ? (
                    <p className="text-sm text-slate-300">{f}</p>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-white">{f.parameter}</p>
                      {f.value && <p className="text-xs text-slate-500">{f.value}</p>}
                      {f.note && <p className="text-xs text-emerald-400 mt-0.5">{f.note}</p>}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Future Concerns */}
      {a.future_health_concerns?.length > 0 && (
        <SectionCard icon={TrendingUp} title="Future Health Concerns to Watch" color="yellow">
          <div className="space-y-3">
            {a.future_health_concerns.map((c, i) => (
              <div key={i} className="bg-white/5 rounded-xl border border-amber-500/15 p-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h4 className="font-bold text-white">{c.concern}</h4>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${riskColors[c.risk_level] || 'bg-white/10 text-slate-400'}`}>
                    {c.risk_level} Risk
                  </span>
                  {c.timeline && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {c.timeline}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400 mb-2">{c.explanation}</p>
                {c.prevention && (
                  <p className="text-sm text-amber-400 flex items-start gap-1.5">
                    <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {c.prevention}
                  </p>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Recommendations */}
      {a.recommendations?.length > 0 && (
        <SectionCard icon={ArrowRight} title="What You Should Do Next" color="purple">
          <div className="space-y-3">
            {a.recommendations.map((r, i) => (
              <div key={i} className="bg-white/5 rounded-xl border border-purple-500/15 p-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <h4 className="font-bold text-white">{r.action}</h4>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${priorityColors[r.priority] || 'bg-white/10 text-slate-400 border-white/10'}`}>
                    {r.priority}
                  </span>
                </div>
                <p className="text-sm text-slate-400 ml-8">{r.details}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Lifestyle Tips */}
      {a.lifestyle_improvements?.length > 0 && (
        <SectionCard icon={Heart} title="Lifestyle Improvements" color="teal">
          <div className="grid sm:grid-cols-2 gap-3">
            {a.lifestyle_improvements.map((tip, i) => (
              <div key={i} className="bg-white/5 rounded-xl border border-teal-500/15 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{categoryIcons[tip.category] || '✨'}</span>
                  <span className="text-xs font-semibold text-teal-400 bg-teal-500/15 px-2 py-0.5 rounded-full">{tip.category}</span>
                </div>
                <p className="text-sm font-medium text-white mb-1">{tip.tip}</p>
                <p className="text-xs text-teal-400/80">{tip.impact}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Questions for Doctor */}
      {a.questions_for_doctor?.length > 0 && (
        <SectionCard icon={MessageSquare} title="Questions to Ask Your Doctor" color="orange">
          <div className="space-y-2">
            {a.questions_for_doctor.map((q, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-3.5 border border-orange-500/15">
                <span className="text-orange-400 font-bold text-sm flex-shrink-0">Q{i + 1}</span>
                <p className="text-sm text-slate-300">{q}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Medications */}
      {a.medications_mentioned?.length > 0 && (
        <SectionCard icon={Pill} title="Medications Mentioned" color="slate">
          <div className="space-y-2">
            {a.medications_mentioned.map((m, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-3.5 border border-white/5">
                <Pill className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white text-sm">{m.medication}</p>
                  <p className="text-xs text-slate-500">{m.purpose}</p>
                  {m.notes && <p className="text-xs text-slate-600 mt-0.5">{m.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Next Steps */}
      {a.next_steps?.length > 0 && (
        <SectionCard icon={CheckCircle} title="Your Action Plan" color="blue">
          <ol className="space-y-2">
            {a.next_steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-sm text-slate-300">{step}</p>
              </li>
            ))}
          </ol>
        </SectionCard>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-500/8 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-400/80 leading-relaxed">
          {a.disclaimer || 'This AI analysis is for educational purposes only and does not replace professional medical advice. Always consult with your healthcare provider.'}
        </p>
      </div>
    </div>
  )
}
