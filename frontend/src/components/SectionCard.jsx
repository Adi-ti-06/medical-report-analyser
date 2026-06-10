export default function SectionCard({ icon: Icon, title, color = 'blue', children, className = '' }) {
  const colors = {
    blue:   { header: 'bg-indigo-600/80',   border: 'border-indigo-500/30',  body: 'bg-indigo-500/5' },
    red:    { header: 'bg-red-600/80',      border: 'border-red-500/30',     body: 'bg-red-500/5' },
    green:  { header: 'bg-emerald-600/80',  border: 'border-emerald-500/30', body: 'bg-emerald-500/5' },
    yellow: { header: 'bg-amber-600/80',    border: 'border-amber-500/30',   body: 'bg-amber-500/5' },
    purple: { header: 'bg-purple-600/80',   border: 'border-purple-500/30',  body: 'bg-purple-500/5' },
    slate:  { header: 'bg-slate-600/80',    border: 'border-slate-500/30',   body: 'bg-slate-500/5' },
    orange: { header: 'bg-orange-600/80',   border: 'border-orange-500/30',  body: 'bg-orange-500/5' },
    teal:   { header: 'bg-teal-600/80',     border: 'border-teal-500/30',    body: 'bg-teal-500/5' },
  }
  const c = colors[color] || colors.blue

  return (
    <div className={`rounded-2xl border ${c.border} overflow-hidden animate-slide-up bg-[#0f172a] ${className}`}>
      <div className={`${c.header} px-5 py-3 flex items-center gap-3`}>
        {Icon && <Icon className="w-5 h-5 text-white" />}
        <h3 className="font-bold text-white text-base">{title}</h3>
      </div>
      <div className={`${c.body} p-5`}>
        {children}
      </div>
    </div>
  )
}
