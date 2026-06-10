import { useState, useEffect } from 'react'
import {
  Activity, Shield, Brain, ChevronRight, ArrowRight,
  FileText, Image, MapPin, CheckCircle, Zap, Lock,
  Heart, Stethoscope, Star, Globe, Search
} from 'lucide-react'

export default function LandingPage({ onGetStarted }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const steps = [
    {
      num: '01', title: 'Upload Your Report', color: 'from-indigo-500 to-blue-600',
      icon: FileText,
      desc: 'Upload your PDF lab report, blood test, or any medical document. Also supports X-ray, MRI, and CT scan images.',
      mockup: <UploadMockup />,
    },
    {
      num: '02', title: 'AI Analyzes Everything', color: 'from-purple-500 to-indigo-600',
      icon: Brain,
      desc: 'Claude AI reads every value, flags abnormalities, and cross-references clinical ranges in under 40 seconds.',
      mockup: <AnalysisMockup />,
    },
    {
      num: '03', title: 'Get Clear Insights', color: 'from-cyan-500 to-blue-500',
      icon: Activity,
      desc: 'Receive a full breakdown in plain English — what\'s normal, what\'s not, future risks, and a personalized action plan.',
      mockup: <ResultsMockup />,
    },
    {
      num: '04', title: 'Find Local Specialists', color: 'from-emerald-500 to-teal-600',
      icon: MapPin,
      desc: 'Instantly discover the right specialist for your condition in your city — with guidance on what to ask.',
      mockup: <SpecialistMockup />,
    },
  ]

  const features = [
    { icon: Brain, title: 'AI-Powered Analysis', desc: 'Claude AI provides accurate, empathetic medical insights in plain language', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { icon: FileText, title: 'PDF & Image Support', desc: 'Lab reports, blood tests, X-rays, MRIs, CT scans — all supported', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: MapPin, title: 'Find Local Specialists', desc: 'Discover the right doctor for your condition in your city', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: Shield, title: 'Privacy First', desc: 'Your data is never stored. Analysis happens in real-time and is discarded', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: Zap, title: 'Instant Results', desc: 'Comprehensive analysis in 20–40 seconds — faster than any appointment', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { icon: Globe, title: 'Plain Language', desc: 'Medical jargon translated to simple explanations anyone can understand', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ]

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 overflow-x-hidden">
      <div className="fixed inset-0 grid-bg opacity-60 pointer-events-none" />
      <div className="fixed inset-0 hero-glow pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">Vitalytics</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
          </div>
          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6">
        <div
          className="max-w-4xl mx-auto text-center transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Powered by Claude AI — Anthropic
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
            Understand Your<br />
            <span className="gradient-text">Health Reports</span><br />
            <span className="text-white">Instantly</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your medical reports, X-rays, or MRI scans. Vitalytics translates complex medical data
            into clear, actionable insights — and helps you find the right specialist.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base hover:from-indigo-500 hover:to-purple-500 transition-all shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.99]"
            >
              <Heart className="w-5 h-5" />
              Analyze My Report — Free
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Shield className="w-4 h-4 text-emerald-400" />
              No medical data stored. Ever.
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            {[
              { icon: CheckCircle, text: 'Free to use' },
              { icon: Shield, text: 'Data never stored' },
              { icon: Zap, text: '20–40 sec analysis' },
              { icon: Lock, text: 'Secure & private' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon className="w-4 h-4 text-indigo-400" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50+', label: 'Report Types Supported' },
              { value: '<40s', label: 'Analysis Time' },
              { value: '100%', label: 'Private & Secure' },
              { value: '0', label: 'Data Retained' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-extrabold gradient-text mb-1">{value}</div>
                <div className="text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
              How it Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              From Report to Clarity<br /><span className="gradient-text">in 4 Simple Steps</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              No medical degree required. Vitalytics does the heavy lifting so you understand every number, every finding, and what to do next.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div
                  key={i}
                  className="bg-[#0f172a] rounded-3xl border border-white/5 overflow-hidden card-glow animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
                >
                  <div className="p-6 pb-0">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-5xl font-black text-white/5 select-none leading-none">{step.num}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{step.desc}</p>
                  </div>
                  <div className="mx-4 mb-4 rounded-2xl overflow-hidden border border-white/5 bg-[#1e293b]/40 h-44 flex items-center justify-center">
                    {step.mockup}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Everything You Need to<br /><span className="gradient-text">Take Control of Your Health</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={i}
                  className="bg-[#0f172a] rounded-2xl border border-white/5 p-6 card-glow"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <h3 className="font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0f172a] rounded-3xl border border-indigo-500/20 p-10 sm:p-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Your Privacy is Our Priority</h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
              Vitalytics processes your medical data in real-time and never stores any files or analysis results. Your health information stays yours alone.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Shield, text: 'Zero data retention', sub: 'Files deleted immediately after analysis' },
                { icon: Lock, text: 'Encrypted transit', sub: 'All data secured end-to-end' },
                { icon: CheckCircle, text: 'No tracking', sub: 'No analytics on your uploads' },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="bg-white/5 rounded-2xl p-5">
                  <Icon className="w-6 h-6 text-indigo-400 mx-auto mb-3" />
                  <div className="text-sm font-semibold text-white mb-1">{text}</div>
                  <div className="text-xs text-slate-500">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Trusted by Health-Conscious Users</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Priya S.', role: 'Software Engineer', text: 'Finally understood my thyroid report without Googling every term. The action plan was incredibly helpful.' },
              { name: 'Rajesh M.', role: 'Teacher', text: 'Found the right cardiologist in my city within seconds after Vitalytics flagged my ECG findings.' },
              { name: 'Anita K.', role: 'Student', text: 'Uploaded my MRI and got a clear plain-English explanation. Felt so much more prepared for my doctor visit.' },
            ].map(({ name, role, text }) => (
              <div key={name} className="bg-[#0f172a] rounded-2xl border border-white/5 p-6 card-glow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"{text}"</p>
                <div>
                  <div className="font-semibold text-white text-sm">{name}</div>
                  <div className="text-xs text-slate-500">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Understand<br /><span className="gradient-text">Your Health?</span>
          </h2>
          <p className="text-slate-400 mb-8 text-lg">Start analyzing your reports for free. No signup required to try.</p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-500 hover:to-purple-500 transition-all shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.99]"
          >
            <Heart className="w-6 h-6" />
            Start Analyzing — It&apos;s Free
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-white">Vitalytics</span>
          </div>
          <p className="text-slate-500 text-xs text-center">For informational purposes only · Always consult a qualified healthcare professional</p>
          <p className="text-slate-600 text-xs">© 2025 Vitalytics</p>
        </div>
      </footer>
    </div>
  )
}

function UploadMockup() {
  return (
    <div className="w-full h-full p-5 flex items-center justify-center">
      <div className="w-full max-w-xs bg-[#0a1628]/80 rounded-xl border border-white/10 p-3">
        <div className="flex gap-2 mb-3">
          {['PDF Report', 'Medical Image'].map((t, i) => (
            <div key={t} className={`flex-1 py-1.5 rounded-lg text-xs text-center font-medium ${i === 0 ? 'bg-indigo-600 text-white' : 'text-white/30'}`}>{t}</div>
          ))}
        </div>
        <div className="border-2 border-dashed border-indigo-500/40 rounded-xl p-4 text-center">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center mx-auto mb-2">
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-white/70 text-xs font-medium">Drop your PDF here</p>
          <p className="text-white/30 text-xs mt-0.5">or click to browse</p>
        </div>
        <div className="mt-2 w-full py-2 bg-indigo-600/70 rounded-lg text-xs text-center text-white/80 font-medium">Analyze Report</div>
      </div>
    </div>
  )
}

function AnalysisMockup() {
  return (
    <div className="w-full h-full p-5 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-14 h-14 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-indigo-500 border-transparent animate-spin" />
          <div className="absolute inset-2 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
        <p className="text-white/70 text-xs font-semibold mb-3">AI analyzing your report...</p>
        <div className="space-y-1.5">
          {['Reading document', 'Extracting parameters', 'Flagging abnormalities', 'Generating insights'].map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                i === 0 ? 'bg-emerald-400' : i === 1 ? 'bg-indigo-400' : i === 2 ? 'bg-indigo-400/50 animate-pulse' : 'bg-white/10'
              }`} />
              <span className={i < 2 ? 'text-white/60' : i === 2 ? 'text-white/40' : 'text-white/20'}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ResultsMockup() {
  return (
    <div className="w-full h-full p-4 flex items-center justify-center">
      <div className="w-full max-w-xs space-y-2">
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs text-emerald-400 font-semibold">Overall: Good</span>
        </div>
        {[
          { label: 'Hemoglobin', val: '14.2 g/dL', ok: true },
          { label: 'Blood Glucose', val: '112 mg/dL', ok: false },
          { label: 'Cholesterol', val: '182 mg/dL', ok: true },
        ].map(({ label, val, ok }) => (
          <div key={label} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
            <span className="text-xs text-white/50">{label}</span>
            <span className={`text-xs font-semibold ${ok ? 'text-emerald-400' : 'text-amber-400'}`}>{val}</span>
          </div>
        ))}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          <p className="text-xs text-amber-400 font-medium">⚠ 1 finding needs attention</p>
        </div>
      </div>
    </div>
  )
}

function SpecialistMockup() {
  return (
    <div className="w-full h-full p-4 flex items-center justify-center">
      <div className="w-full max-w-xs space-y-2">
        <div className="flex gap-2 mb-1">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/30">Diabetes</div>
          <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/30">Mumbai</div>
          <div className="bg-indigo-600/70 rounded-lg px-3 flex items-center">
            <Search className="w-3 h-3 text-white/80" />
          </div>
        </div>
        {[
          { name: 'Dr. A. Sharma', spec: 'Endocrinologist', dist: '2.3 km' },
          { name: 'Dr. R. Patel', spec: 'Diabetologist', dist: '4.1 km' },
        ].map(({ name, spec, dist }) => (
          <div key={name} className="flex items-center gap-2.5 bg-white/5 rounded-lg px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white/70 font-semibold">{name}</div>
              <div className="text-xs text-white/30">{spec}</div>
            </div>
            <div className="text-xs text-emerald-400">{dist}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
