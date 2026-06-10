import { Heart, Brain, Activity } from 'lucide-react'

const steps = [
  'Reading your document...',
  'Identifying findings...',
  'Analyzing parameters...',
  'Detecting abnormalities...',
  'Generating recommendations...',
  'Preparing your report...',
]

export default function LoadingState({ type }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 animate-fade-in">
      {/* Animated icon */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/15 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-indigo-500/20 animate-ping" style={{ animationDelay: '0.3s' }} />
        <div className="absolute inset-0 rounded-full border-2 border-t-indigo-500 border-transparent animate-spin" style={{ animationDuration: '1.2s' }} />
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-xl shadow-indigo-500/30">
          {type === 'image'
            ? <Brain className="w-10 h-10 text-white" />
            : <Activity className="w-10 h-10 text-white" />
          }
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">
        {type === 'image' ? 'Analyzing Medical Image' : 'Analyzing Medical Report'}
      </h3>
      <p className="text-slate-400 text-sm text-center max-w-sm mb-8 leading-relaxed">
        Our AI is carefully reviewing your {type === 'image' ? 'image' : 'report'} to provide a comprehensive analysis in plain language.
      </p>

      <div className="w-full max-w-xs space-y-2.5">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-sm animate-fade-in"
            style={{ animationDelay: `${i * 0.4}s`, animationFillMode: 'both', opacity: 0 }}
          >
            <div
              className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin flex-shrink-0"
              style={{ animationDuration: '1s', animationDelay: `${i * 0.4}s` }}
            />
            <span className="text-slate-400">{step}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs text-slate-500">
        <Heart className="w-3 h-3 text-red-400" />
        <span>This may take 20–40 seconds</span>
      </div>
    </div>
  )
}
