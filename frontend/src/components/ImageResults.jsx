import {
  Eye, AlertTriangle, CheckCircle, ArrowRight,
  Search, MessageSquare, Info, Camera, Activity
} from 'lucide-react'
import SectionCard from './SectionCard'
import HealthScoreBadge from './HealthScoreBadge'

const severityColors = {
  Mild:      { bg: 'bg-amber-500/10',  border: 'border-l-amber-400',  badge: 'bg-amber-500/15 text-amber-400' },
  Moderate:  { bg: 'bg-orange-500/10', border: 'border-l-orange-400', badge: 'bg-orange-500/15 text-orange-400' },
  Severe:    { bg: 'bg-red-500/10',    border: 'border-l-red-400',    badge: 'bg-red-500/15 text-red-400' },
  Uncertain: { bg: 'bg-slate-500/10',  border: 'border-l-slate-400',  badge: 'bg-slate-500/15 text-slate-400' },
}

const confidenceColors = {
  High:     'bg-emerald-500/15 text-emerald-400',
  Moderate: 'bg-amber-500/15 text-amber-400',
  Low:      'bg-red-500/15 text-red-400',
}

const priorityColors = {
  'Urgent — See doctor immediately': 'bg-red-500/15 text-red-400 border-red-500/30',
  'Soon — Within 2 weeks':           'bg-orange-500/15 text-orange-400 border-orange-500/30',
  'Routine — Within 3 months':       'bg-blue-500/15 text-blue-400 border-blue-500/30',
}

const qualityColors = {
  Excellent: 'bg-emerald-500/15 text-emerald-400',
  Good:      'bg-green-500/15 text-green-400',
  Fair:      'bg-amber-500/15 text-amber-400',
  Poor:      'bg-red-500/15 text-red-400',
}

export default function ImageResults({ analysis, imagePreview }) {
  const a = analysis

  const getConf = (str) => {
    if (!str) return null
    const m = str.match(/^(High|Moderate|Low)/i)
    return m ? m[1] : null
  }

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div className="bg-[#0f172a] rounded-2xl border border-white/8 p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {imagePreview && (
            <div className="flex-shrink-0">
              <img
                src={imagePreview}
                alt="Uploaded medical image"
                className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl border border-white/10 shadow-xl"
              />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-2">
              {a.image_type || 'Medical Image'} Analysis
              {a.body_region && <span className="text-slate-400 font-normal"> — {a.body_region}</span>}
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {a.image_type && (
                <span className="text-xs px-2.5 py-1 bg-indigo-500/15 text-indigo-400 rounded-full font-medium flex items-center gap-1 border border-indigo-500/20">
                  <Camera className="w-3 h-3" /> {a.image_type}
                </span>
              )}
              {(a.technical_quality || a.image_quality) && (
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${qualityColors[a.technical_quality || a.image_quality] || 'bg-white/10 text-slate-400'}`}>
                  Quality: {a.technical_quality || a.image_quality}
                </span>
              )}
            </div>
            <p className="text-slate-400 leading-relaxed">{a.summary}</p>
          </div>
          {a.overall_impression && (
            <div className="flex-shrink-0">
              <p className="text-xs text-slate-500 mb-2 text-center">Overall Impression</p>
              <HealthScoreBadge score={a.overall_impression} large />
            </div>
          )}
        </div>
      </div>

      {/* What We See */}
      {a.what_we_see?.length > 0 && (
        <SectionCard icon={Eye} title="What's Visible in This Image" color="blue">
          <ul className="space-y-2">
            {a.what_we_see.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="text-indigo-400 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Abnormal Findings */}
      {a.abnormal_findings?.length > 0 && (
        <SectionCard icon={AlertTriangle} title={`Abnormal Findings (${a.abnormal_findings.length})`} color="red">
          <div className="space-y-4">
            {a.abnormal_findings.map((f, i) => {
              const sc = severityColors[f.severity] || severityColors.Uncertain
              const conf = getConf(f.confidence)
              return (
                <div key={i} className={`${sc.bg} border border-red-500/20 border-l-4 ${sc.border} rounded-xl p-4 abnormal-pulse`}>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-bold text-white">{f.finding}</h4>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${sc.badge}`}>{f.severity}</span>
                    {conf && (
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${confidenceColors[conf] || 'bg-white/10 text-slate-400'}`}>
                        {conf} Confidence
                      </span>
                    )}
                  </div>
                  {f.location && (
                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                      <Activity className="w-3 h-3" /> Location: {f.location}
                    </p>
                  )}
                  <p className="text-sm text-slate-300 mb-2">{f.plain_explanation}</p>
                  <p className="text-sm text-slate-400 italic">{f.significance || f.why_it_matters}</p>
                </div>
              )
            })}
          </div>
        </SectionCard>
      )}

      {/* Normal Findings */}
      {a.normal_findings?.length > 0 && (
        <SectionCard icon={CheckCircle} title="Normal Findings — Good News" color="green">
          <div className="space-y-3">
            {a.normal_findings.map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-3.5 border border-emerald-500/15">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                {typeof f === 'string' ? (
                  <p className="text-sm text-slate-300">{f}</p>
                ) : (
                  <div>
                    <p className="font-semibold text-white text-sm">{f.structure}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{f.observation}</p>
                    {f.why_good && <p className="text-xs text-emerald-400 mt-0.5">{f.why_good}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Future Concerns */}
      {a.future_concerns?.length > 0 && (
        <SectionCard icon={Search} title="Future Concerns to Monitor" color="yellow">
          <div className="space-y-3">
            {a.future_concerns.map((c, i) => (
              <div key={i} className="bg-white/5 rounded-xl border border-amber-500/15 p-4">
                <h4 className="font-bold text-white mb-1">{c.concern}</h4>
                <p className="text-sm text-slate-400 mb-2">{c.explanation}</p>
                {c.monitoring && (
                  <p className="text-xs text-amber-400 flex items-start gap-1.5">
                    <Eye className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    {c.monitoring}
                  </p>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Recommendations */}
      {a.recommendations?.length > 0 && (
        <SectionCard icon={ArrowRight} title="Recommendations" color="purple">
          <div className="space-y-3">
            {a.recommendations.map((r, i) => (
              <div key={i} className="bg-white/5 rounded-xl border border-purple-500/15 p-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <h4 className="font-bold text-white">{r.action}</h4>
                  {r.priority && (
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${priorityColors[r.priority] || 'bg-white/10 text-slate-400 border-white/10'}`}>
                      {r.priority}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400 ml-8">{r.details}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Follow-up Tests */}
      {a.follow_up_tests?.length > 0 && (
        <SectionCard icon={Activity} title="Suggested Follow-up Tests" color="teal">
          <div className="space-y-2">
            {a.follow_up_tests.map((t, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-3.5 border border-teal-500/15">
                <span className="text-teal-400 font-bold text-sm flex-shrink-0">{i + 1}.</span>
                <div>
                  <p className="font-semibold text-white text-sm">{t.test}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.reason}</p>
                </div>
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

      {/* Important Notes */}
      {a.important_notes?.length > 0 && (
        <SectionCard icon={Info} title="Important Notes About This Analysis" color="slate">
          <ul className="space-y-2">
            {a.important_notes.map((note, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
                <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                {note}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-500/8 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-400/80 leading-relaxed">
          {a.disclaimer || 'Medical image analysis by AI has significant limitations. Always consult with a qualified radiologist and healthcare professional for official diagnosis and treatment planning.'}
        </p>
      </div>
    </div>
  )
}
