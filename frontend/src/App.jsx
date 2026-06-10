import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [page, setPage] = useState('landing')
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
    setPage('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    setPage('landing')
  }

  if (page === 'login') {
    return <LoginPage onLogin={handleLogin} onBack={() => setPage('landing')} />
  }
  if (page === 'dashboard') {
    return <Dashboard user={user} onLogout={handleLogout} />
  }
  return <LandingPage onGetStarted={() => setPage('login')} />
}
