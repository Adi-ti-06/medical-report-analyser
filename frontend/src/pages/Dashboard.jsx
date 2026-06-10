import { useState, useRef, useEffect } from 'react'
import {
  FileText, Image, Stethoscope, AlertCircle,
  RefreshCw, Download, ChevronRight, MapPin, Activity, Zap
} from 'lucide-react'
import Navbar from '../components/Navbar'
import UploadZone from '../components/UploadZone'
import LoadingState from '../components/LoadingState'
import ReportResults from '../components/ReportResults'
import ImageResults from '../components/ImageResults'
import SpecialistFinder from '../components/SpecialistFinder'

const API_BASE = 'http://localhost:8001'

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('report')
  const [demoMode, setDemoMode] = useState(false)
  const [reportFile, setReportFile] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const resultsRef = useRef(null)

  useEffect(() => {
    fetch(`${API_BASE}/health`).then(r => r.json()).then(d => setDemoMode(!!d.demo_mode)).catch(() => {})
  }, [])

  const handleImageSelect = (file) => {
    setImageFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const handleAnalyze = async () => {
    const file = activeTab === 'report' ? reportFile : imageFile
    if (!file) { setError('Please select a file first.'); return }

    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const endpoint = activeTab === 'report' ? '/analyze-report' : '/analyze-image'
      const response = await fetch(`${API_BASE}${endpoint}`, { method: 'POST', body: formData })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: 'Unknown error' }))
        throw new Error(errData.detail || `Server error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      if (err.message.includes('fetch') || err.message.includes('Failed')) {
        setError('Cannot connect to the server. Make sure the backend is running on port 8000.')
      } else {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError('')
    setReportFile(null)
    setImageFile(null)
    setImagePreview(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasFile = activeTab === 'report' ? !!reportFile : !!imageFile

  const tabs = [
    { key: 'report', icon: FileText, label: 'Medical Report', sub: 'PDF Analysis' },
    { key: 'image', icon: Image, label: 'Medical Image', sub: 'X-Ray / MRI / CT' },
    { key: 'specialists', icon: MapPin, label: 'Find Specialists', sub: 'Doctors Near You' },
  ]

  const featurePills = {
    report: ['🔍 Full Analysis', '⚠️ Abnormal Flags', '🌱 Future Risks', '💡 Action Plan'],
    image: ['👁️ Image Read', '🔴 Findings', '📋 Follow-up', '❓ Doctor Q&A'],
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100">
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none" />

      <Navbar user={user} onLogout={onLogout} />

      <main className="relative max-w-5xl mx-auto px-4 pt-28 pb-16">

        {/* Demo mode banner */}
        {demoMode && (
          <div className="mb-6 flex items-center gap-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl px-5 py-3.5 animate-fade-in">
            <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-300">
              <span className="font-bold">Demo Mode</span> — No API key configured. Upload any file to see a sample analysis.
              Add your <span className="font-mono bg-amber-500/20 px-1.5 py-0.5 rounded text-xs">ANTHROPIC_API_KEY</span> to <span className="font-mono bg-amber-500/20 px-1.5 py-0.5 rounded text-xs">backend/.env</span> for real analysis.
            </p>
          </div>
        )}

        {/* Hero text */}
        {!result && !isLoading && activeTab !== 'specialists' && (
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium px-4 py-2 rounded-full mb-5">
              <Activity className="w-4 h-4" />
              Understand your health in plain English
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
              AI Medical <span className="gradient-text">Report Analyzer</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
              Upload your medical reports or X-ray / MRI images. Our AI explains everything in simple language,
              highlights abnormal findings, and tells you what to do next.
            </p>
          </div>
        )}

        {activeTab === 'specialists' ? (
          <SpecialistFinder />
        ) : (
          <>
            {/* Upload Card */}
            {!result && !isLoading && (
              <div className="bg-[#0f172a] rounded-3xl border border-white/8 overflow-hidden animate-slide-up shadow-2xl shadow-black/50">

                {/* Tab bar */}
                <div className="flex border-b border-white/8">
                  {tabs.filter(t => t.key !== 'specialists').map(({ key, icon: Icon, label, sub }) => (
                    <button
                      key={key}
                      onClick={() => { setActiveTab(key); setError('') }}
                      className={`flex-1 flex items-center justify-center gap-2.5 py-4 px-4 font-semibold text-sm transition-all ${
                        activeTab === key
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:block">{label}</span>
                      <span className="sm:hidden">{sub}</span>
                    </button>
                  ))}
                </div>

                <div className="p-6 sm:p-8">
                  {/* Feature pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {(featurePills[activeTab] || []).map((label) => (
                      <div key={label} className="flex flex-col items-center gap-1.5 bg-white/4 rounded-xl py-3 px-2 border border-white/5 hover:bg-white/8 transition-colors">
                        <span className="text-lg">{label.split(' ')[0]}</span>
                        <span className="text-xs font-medium text-slate-400 text-center">{label.split(' ').slice(1).join(' ')}</span>
                      </div>
                    ))}
                  </div>

                  <UploadZone
                    type={activeTab}
                    onFileSelect={activeTab === 'report' ? setReportFile : handleImageSelect}
                    selectedFile={activeTab === 'report' ? reportFile : imageFile}
                    isLoading={isLoading}
                  />

                  {error && (
                    <div className="mt-4 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-400 text-sm">Analysis Failed</p>
                        <p className="text-red-400/80 text-sm mt-0.5">{error}</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleAnalyze}
                    disabled={!hasFile || isLoading}
                    className={`w-full mt-5 py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all ${
                      hasFile && !isLoading
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99]'
                        : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    <Stethoscope className="w-5 h-5" />
                    Analyze {activeTab === 'report' ? 'Medical Report' : 'Medical Image'}
                    {hasFile && <ChevronRight className="w-4 h-4" />}
                  </button>

                  <p className="text-center text-xs text-slate-600 mt-3">
                    Analysis takes 20–40 seconds &middot; Your data is never stored
                  </p>
                </div>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="bg-[#0f172a] rounded-3xl border border-white/8 overflow-hidden shadow-2xl shadow-black/50">
                <LoadingState type={activeTab} />
              </div>
            )}

            {/* Results */}
            {result && !isLoading && (
              <div ref={resultsRef}>
                <div className="flex items-center justify-between mb-6 no-print">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
                    <p className="text-slate-500 text-sm mt-0.5">
                      {activeTab === 'report' ? reportFile?.name : imageFile?.name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Print / Save</span>
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/25"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span className="hidden sm:inline">New Analysis</span>
                    </button>
                  </div>
                </div>

                {result.analysis?.parse_error ? (
                  <div className="bg-[#0f172a] rounded-2xl border border-white/8 shadow-sm p-6">
                    <h3 className="font-bold text-white mb-3">Analysis Result</h3>
                    <div className="bg-white/5 rounded-xl p-4 text-sm text-slate-300 whitespace-pre-wrap font-mono">
                      {result.analysis.raw_text}
                    </div>
                  </div>
                ) : result.type === 'report' ? (
                  <ReportResults analysis={result.analysis} />
                ) : (
                  <ImageResults analysis={result.analysis} imagePreview={imagePreview} />
                )}
              </div>
            )}
          </>
        )}

        <footer className="mt-16 text-center text-xs text-slate-600 space-y-1 no-print">
          <p>Vitalytics &mdash; For informational purposes only</p>
          <p>Always consult a qualified healthcare professional for medical decisions</p>
        </footer>
      </main>

      {/* Floating tab bar for specialists */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 no-print">
        <div className="glass rounded-2xl border border-white/10 p-1 flex gap-1 shadow-2xl shadow-black/60">
          {tabs.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => {
                if (key === activeTab) return
                setActiveTab(key)
                if (key !== 'specialists') handleReset()
                else { setResult(null); setError('') }
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === key
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/8'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
