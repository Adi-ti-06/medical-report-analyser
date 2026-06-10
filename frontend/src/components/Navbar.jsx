import { useState } from 'react'
import { Activity, LogOut, User, ChevronDown, Shield } from 'lucide-react'

export default function Navbar({ user, onLogout }) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 no-print">
      <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-white tracking-tight">Vitalytics</span>
            <div className="flex items-center gap-1 -mt-0.5">
              <Shield className="w-2.5 h-2.5 text-indigo-400" />
              <span className="text-xs text-slate-500">Powered by Claude AI</span>
            </div>
          </div>
        </div>

        <div className="flex-1" />

        {/* User menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/8 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow">
                {user.avatar || user.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-white leading-tight">{user.name}</p>
                <p className="text-xs text-slate-500 leading-tight">{user.email}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#1e293b] rounded-2xl border border-white/10 shadow-2xl shadow-black/50 z-20 overflow-hidden animate-fade-in">
                  <div className="p-3 border-b border-white/8">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.avatar || user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 text-sm">
                      <User className="w-4 h-4" />
                      <span>Signed in via {user.provider || 'SSO'}</span>
                    </div>
                    <button
                      onClick={() => { setShowMenu(false); onLogout() }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-sm transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
