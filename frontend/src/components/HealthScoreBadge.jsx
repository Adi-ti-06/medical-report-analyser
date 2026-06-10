import { ShieldCheck, ShieldAlert, Shield, ShieldX, AlertTriangle } from 'lucide-react'

const config = {
  'Excellent':                { icon: ShieldCheck,   bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', ring: 'ring-emerald-500/20' },
  'Good':                     { icon: ShieldCheck,   bg: 'bg-green-500/15',   text: 'text-green-400',   border: 'border-green-500/30',   ring: 'ring-green-500/20' },
  'Fair':                     { icon: Shield,         bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/30',   ring: 'ring-amber-500/20' },
  'Needs Attention':          { icon: ShieldAlert,   bg: 'bg-orange-500/15',  text: 'text-orange-400',  border: 'border-orange-500/30',  ring: 'ring-orange-500/20' },
  'Critical':                 { icon: ShieldX,       bg: 'bg-red-500/15',     text: 'text-red-400',     border: 'border-red-500/30',     ring: 'ring-red-500/20' },
  'Normal':                   { icon: ShieldCheck,   bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', ring: 'ring-emerald-500/20' },
  'Mild Abnormality':         { icon: AlertTriangle, bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/30',   ring: 'ring-amber-500/20' },
  'Moderate Abnormality':     { icon: ShieldAlert,   bg: 'bg-orange-500/15',  text: 'text-orange-400',  border: 'border-orange-500/30',  ring: 'ring-orange-500/20' },
  'Significant Abnormality':  { icon: ShieldX,       bg: 'bg-red-500/15',     text: 'text-red-400',     border: 'border-red-500/30',     ring: 'ring-red-500/20' },
  'Requires Urgent Attention':{ icon: ShieldX,       bg: 'bg-red-500/15',     text: 'text-red-400',     border: 'border-red-500/30',     ring: 'ring-red-500/20' },
}

export default function HealthScoreBadge({ score, large = false }) {
  const c = config[score] || config['Fair']
  const Icon = c.icon

  if (large) {
    return (
      <div className={`inline-flex flex-col items-center gap-2 px-8 py-5 rounded-2xl border-2 ring-4 ${c.bg} ${c.border} ${c.ring}`}>
        <Icon className={`w-10 h-10 ${c.text}`} />
        <span className={`font-bold text-lg ${c.text}`}>{score}</span>
      </div>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      <Icon className="w-4 h-4" />
      {score}
    </span>
  )
}
