import { useCallback, useEffect, useState } from 'react'
import './App.css'

const TOKEN_KEY = 'fdp_admin_token'

async function api(path, { token, method = 'GET', body } = {}) {
  const response = await fetch(path, {
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
    <main className="screen">
      <section className="login-card">
        <p className="eyebrow">Chapersons Foundations</p>
        <h1>Admin sign in</h1>
        <p className="lede">Create the accounts that can fill donation slips in the app.</p>
        <form onSubmit={submit}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button className="primary" type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
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
