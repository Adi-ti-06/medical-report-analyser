import { useState } from 'react'
import {
  MapPin, Search, Stethoscope, Star, ExternalLink,
  AlertCircle, ChevronRight, Clock, MessageSquare, Loader,
  CheckCircle, Activity, Heart, Navigation
} from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8001'

const BADGE_STYLES = {
  indigo: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20',
  green:  'bg-green-500/15  text-green-400  border border-green-500/20',
  red:    'bg-red-500/15    text-red-400    border border-red-500/20',
  blue:   'bg-blue-500/15   text-blue-400   border border-blue-500/20',
  amber:  'bg-amber-500/15  text-amber-400  border border-amber-500/20',
}

function buildDoctorLinks(primarySpecialist, city) {
  const citySlug = city.toLowerCase().replace(/\s+/g, '-')
  const specSlug = primarySpecialist
    .toLowerCase()
    .replace(/\s*\/\s*/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
  const mapsQuery = encodeURIComponent(`${primarySpecialist} doctor near ${city}`)

  return [
    {
      name: 'Practo',
      tagline: 'Book verified doctors',
      description: `Find ${primarySpecialist}s in ${city} with ratings, fees & instant booking`,
      url: `https://www.practo.com/${citySlug}/${specSlug}`,
      badge: 'Most Popular in India',
      badgeColor: 'indigo',
    },
    {
      name: 'Google Maps',
      tagline: 'See clinics on map',
      description: `${primarySpecialist} clinics & hospitals near ${city} with directions & distance`,
      url: `https://www.google.com/maps/search/${mapsQuery}`,
      badge: 'Shows Distance',
      badgeColor: 'green',
    },
    {
      name: '1mg',
      tagline: 'Online + in-person',
      description: `Teleconsultation or in-clinic with ${primarySpecialist}s in ${city}`,
      url: `https://www.1mg.com/doctors/${specSlug}-in-${citySlug}`,
      badge: 'Teleconsult Available',
      badgeColor: 'red',
    },
    {
      name: 'Apollo 24|7',
      tagline: 'Trusted hospital chain',
      description: `Apollo network — specialist consults available online 24/7 and in ${city}`,
      url: `https://www.apollo247.com/specialties/${specSlug}`,
      badge: '24/7 Available',
      badgeColor: 'blue',
    },
    {
      name: 'JustDial',
      tagline: 'Local clinic listings',
      description: `Local ${primarySpecialist} clinics in ${city} with phone numbers & addresses`,
      url: `https://www.justdial.com/${citySlug}/${specSlug}`,
      badge: 'Local Listings',
      badgeColor: 'amber',
    },
  ]
}

export default function SpecialistFinder() {
  const [disease, setDisease] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!disease.trim() || !city.trim()) { setError('Please enter both a condition and your city.'); return }
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch(`${API_BASE}/find-specialists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disease: disease.trim(), city: city.trim() }),
      })
      if (!response.ok) {
        const err = await response.json().catch(() => ({ detail: 'Unknown error' }))
        throw new Error(err.detail || `Server error: ${response.status}`)
      }
      const data = await response.json()
      setResult(data)
    } catch (err) {
      if (err.message.includes('fetch') || err.message.includes('Failed')) {
        setError('Cannot connect to the server. Make sure the backend is running on port 8001.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const quickConditions = ['Diabetes', 'Heart Disease', 'Thyroid', 'Hypertension', 'Kidney Disease', 'Arthritis', 'Asthma', 'Cancer']

  const primarySpecialist = result?.specialist_types?.[0]?.type || disease
  const resolvedCity = result?.city || city
  const doctorLinks = result ? buildDoctorLinks(primarySpecialist, resolvedCity) : []

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up pb-24">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium px-4 py-2 rounded-full mb-5">
          <MapPin className="w-4 h-4" />
          Find Specialists Near You
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Right Doctor, <span className="gradient-text">Right City</span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Enter your condition and city to get direct search links for real doctors near you, plus guidance on what type of specialist to see.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-[#0f172a] rounded-3xl border border-white/8 p-6 sm:p-8 mb-6 shadow-2xl shadow-black/50">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                <Activity className="w-4 h-4 inline mr-1.5 text-indigo-400" />
                Condition / Disease
              </label>
              <input
                type="text"
                value={disease}
                onChange={e => setDisease(e.target.value)}
                placeholder="e.g. Diabetes, Heart Disease, Thyroid..."
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white/8 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1.5 text-emerald-400" />
                Your City
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Mumbai, Delhi, Bangalore..."
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white/8 transition-all"
              />
            </div>
          </div>

          {/* Quick conditions */}
          <div className="flex flex-wrap gap-2 mb-5">
            {quickConditions.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setDisease(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  disease === c
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all ${
              !loading
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99]'
                : 'bg-white/5 text-slate-600 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <><Loader className="w-5 h-5 animate-spin" /> Finding specialists...</>
            ) : (
              <><Search className="w-5 h-5" /> Find Specialists <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-[#0f172a] rounded-3xl border border-white/8 p-10 text-center animate-fade-in shadow-2xl shadow-black/50">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-t-emerald-500 border-transparent animate-spin" />
            <div className="absolute inset-2 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-white font-semibold mb-2">Finding specialists for {disease} in {city}...</p>
          <p className="text-slate-500 text-sm">Identifying the right doctors and search links for you</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-5 animate-fade-in-up">

          {/* Summary header */}
          <div className="bg-[#0f172a] rounded-2xl border border-emerald-500/20 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Specialists for <span className="text-emerald-400">{result.condition || disease}</span> in {resolvedCity}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{result.overview}</p>
              </div>
            </div>
          </div>

          {/* ── FIND REAL DOCTORS ── */}
          <div className="bg-[#0f172a] rounded-2xl border border-white/8 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Navigation className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-white">Find Real Doctors in {resolvedCity}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Click any platform — search opens pre-filled with your condition</p>
                </div>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
                {doctorLinks.length} platforms
              </span>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doctorLinks.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white/4 hover:bg-white/8 border border-white/5 hover:border-white/15 rounded-xl p-4 transition-all group cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-bold text-white text-sm">{platform.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE_STYLES[platform.badgeColor]}`}>
                        {platform.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{platform.description}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    <span className="text-xs text-slate-600 group-hover:text-emerald-400 transition-colors">Open</span>
                  </div>
                </a>
              ))}
            </div>

            <div className="px-5 pb-4">
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(`${primarySpecialist} doctor near ${resolvedCity}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.01]"
              >
                <MapPin className="w-4 h-4" />
                Open Google Maps — {primarySpecialist}s near {resolvedCity}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Specialist types */}
          {result.specialist_types?.length > 0 && (
            <div className="bg-[#0f172a] rounded-2xl border border-white/8 overflow-hidden">
              <div className="px-5 py-4 border-b border-white/8 flex items-center gap-3">
                <Stethoscope className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white">Types of Specialists You Need</h3>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.specialist_types.map((sp, i) => (
                  <div key={i} className="bg-white/4 rounded-xl border border-white/5 p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <Stethoscope className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-white text-sm">{sp.type}</h4>
                          {i === 0 && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed mb-2">{sp.role}</p>
                        {sp.when_to_see && (
                          <div className="flex items-start gap-1.5 text-xs text-indigo-300">
                            <Clock className="w-3 h-3 flex-shrink-0 mt-0.5" />
                            <span>{sp.when_to_see}</span>
                          </div>
                        )}
                        {/* Per-specialist search link */}
                        <a
                          href={`https://www.practo.com/${resolvedCity.toLowerCase().replace(/\s+/g, '-')}/${sp.type.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 mt-2 transition-colors"
                        >
                          <Search className="w-3 h-3" />
                          Find {sp.type}s on Practo
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Questions to ask */}
          {result.questions_to_ask?.length > 0 && (
            <div className="bg-[#0f172a] rounded-2xl border border-white/8 overflow-hidden">
              <div className="px-5 py-4 border-b border-white/8 flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white">Questions to Ask Your Specialist</h3>
              </div>
              <div className="p-5 space-y-2">
                {result.questions_to_ask.map((q, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white/4 rounded-xl p-3.5 border border-white/5">
                    <span className="text-amber-400 font-bold text-sm flex-shrink-0">Q{i + 1}</span>
                    <p className="text-sm text-slate-300">{q}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What to bring */}
          {result.what_to_bring?.length > 0 && (
            <div className="bg-[#0f172a] rounded-2xl border border-white/8 overflow-hidden">
              <div className="px-5 py-4 border-b border-white/8 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white">What to Bring to Your Appointment</h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.what_to_bring.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Urgency */}
          {result.urgency && (
            <div className={`rounded-2xl border p-5 flex items-start gap-3 ${
              result.urgency === 'High'     ? 'bg-red-500/10    border-red-500/20' :
              result.urgency === 'Moderate' ? 'bg-amber-500/10  border-amber-500/20' :
                                              'bg-emerald-500/10 border-emerald-500/20'
            }`}>
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                result.urgency === 'High'     ? 'text-red-400' :
                result.urgency === 'Moderate' ? 'text-amber-400' : 'text-emerald-400'
              }`} />
              <div>
                <p className={`text-sm font-bold mb-1 ${
                  result.urgency === 'High'     ? 'text-red-400' :
                  result.urgency === 'Moderate' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {result.urgency} Priority — {result.urgency_timeframe}
                </p>
                <p className="text-sm text-slate-400">{result.urgency_explanation}</p>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-amber-500/8 border border-amber-500/15 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-400/80 leading-relaxed">
              Search links open third-party platforms — always verify specialist credentials and check reviews before booking. This is not a medical referral service.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
