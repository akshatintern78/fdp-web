import { useCallback, useEffect, useState } from 'react'
import logo from './assets/Logo.jpeg'
import './App.css'

const TOKEN_KEY = 'fdp_admin_token'
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

async function api(path, { token, method = 'GET', body } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.error || 'Request failed')
    error.status = response.status
    throw error
  }
  return data
}

function Login({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const data = await api('/api/admin/login', {
        method: 'POST',
        body: { email, password },
      })
      localStorage.setItem(TOKEN_KEY, data.token)
      onSuccess(data.token)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="login-screen">
      <div className="login-blob login-blob-navy" aria-hidden="true" />
      <div className="login-blob login-blob-light" aria-hidden="true" />
      <div className="login-blob login-blob-pale-left" aria-hidden="true" />
      <div className="login-blob login-blob-pale-right" aria-hidden="true" />
      <svg className="login-book" viewBox="0 0 160 70" aria-hidden="true">
        <path d="M8 28 Q80 8 152 32 M8 28 Q80 48 152 32" />
      </svg>
      <section className="login-column">
        <div className="login-logo-wrap">
          <img className="login-logo" src={logo} alt="Chapersons Foundations" />
        </div>
        <div className="login-brand">
          <span />
          <p>CHAPERSONS FOUNDATIONS</p>
          <span />
        </div>
        <p className="login-welcome">Welcome Back</p>
        <h1 className="login-title">Sign In</h1>
        <p className="login-copy">
          Use the email and password created
          <br />
          in the admin panel.
        </p>
        <form onSubmit={submit}>
          <label className="login-field">
            <MailIcon />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              autoComplete="username"
            />
          </label>
          <label className="login-field">
            <LockIcon />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete="current-password"
            />
            <button
              className="login-eye"
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </label>
          {error ? <p className="login-error">{error}</p> : null}
          <button className="login-submit" type="submit" disabled={busy}>
            {busy ? (
              'Signing in…'
            ) : (
              <>
                <ArrowIcon />
                <span className="login-submit-rule" />
                Sign In
              </>
            )}
          </button>
        </form>
        <div className="login-trust">
          <span />
          <ShieldIcon />
          <p>Secure & Trusted</p>
          <span />
        </div>
      </section>
    </main>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5.5" y="10.5" width="13" height="9" rx="2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 4.5l18 15" />
      <path d="M9.2 9.4A3.2 3.2 0 0 0 12 15.2c.7 0 1.3-.2 1.8-.6" />
      <path d="M6.2 7.2C4.2 8.6 2.8 10.6 2.5 12c0 0 3.5 5.5 9.5 5.5 1.5 0 2.9-.4 4.1-1" />
      <path d="M10 6.7c.6-.1 1.3-.2 2-.2 6 0 9.5 5.5 9.5 5.5a16 16 0 0 1-3.2 3.4" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5l7 2.4v6.2c0 4.2-2.8 7.2-7 8.4-4.2-1.2-7-4.2-7-8.4V5.9l7-2.4z" />
    </svg>
  )
}

const emptyForm = { name: '', email: '', password: '', mobile: '' }

function Users({ token, onLogout }) {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  async function load(activeToken = token) {
    const data = await api('/api/admin/users', { token: activeToken })
    setUsers(data.users)
  }

  useEffect(() => {
    let ignore = false
    api('/api/admin/users', { token })
      .then((data) => {
        if (!ignore) setUsers(data.users)
      })
      .catch((err) => {
        if (ignore) return
        if (err.status === 401) onLogout()
        else setError(err.message)
      })
    return () => {
      ignore = true
    }
  }, [token, onLogout])

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const data = await api('/api/admin/users', { token, method: 'POST', body: form })
      setForm(emptyForm)
      setNotice(`${data.user.name} can now sign in to the app.`)
      await load()
    } catch (err) {
      if (err.status === 401) onLogout()
      else setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="screen" style={{ alignItems: 'start' }}>
      <section className="panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Chapersons Foundations</p>
            <h1>App users</h1>
            <p className="hint">Only these accounts can sign in and save slips.</p>
          </div>
          <button className="ghost" type="button" onClick={onLogout}>Sign out</button>
        </header>
        <div className="layout">
          <section className="card">
            <h2>Create user</h2>
            <form onSubmit={submit}>
              <label>
                Name
                <input value={form.name} onChange={(e) => update('name', e.target.value)} required />
              </label>
              <label>
                Email
                <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
              </label>
              <label>
                Password
                <input type="text" value={form.password} onChange={(e) => update('password', e.target.value)} required minLength={6} autoComplete="off" />
              </label>
              <label>
                Mobile number
                <input value={form.mobile} onChange={(e) => update('mobile', e.target.value)} required inputMode="numeric" placeholder="10-digit number" />
              </label>
              {error ? <p className="error">{error}</p> : null}
              {notice ? <p className="success">{notice}</p> : null}
              <button className="primary" type="submit" disabled={busy}>
                {busy ? 'Saving…' : 'Create user'}
              </button>
            </form>
          </section>
          <section className="card">
            <h2>Created accounts</h2>
            {users.length === 0 ? (
              <p className="empty">No app users yet.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.mobile}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  )
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }, [])

  if (!token) return <Login onSuccess={setToken} />
  return <Users token={token} onLogout={logout} />
}
