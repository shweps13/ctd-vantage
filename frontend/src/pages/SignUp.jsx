import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './SignIn.css'

const BACKEND = import.meta.env.VITE_API_URL || ''

function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch(`${BACKEND}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.msg || data.message || 'Registration failed')
      navigate('/signin', { state: { message: 'Account created. Please sign in.' } })
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="signin-page">
      <div className="signin-card">
        <h1 className="signin-logo">FINEbank.IO</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.25rem', fontSize: '0.9375rem' }}>Create an account</p>

        <form className="signin-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="signin-error" role="alert">{error}</div>}
          <label className="signin-label" htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            className="signin-input"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            minLength={3}
            required
          />
          <label className="signin-label" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            className="signin-input"
            placeholder="johndoe@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <label className="signin-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="signin-input"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
          />
          <button type="submit" className="signin-submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="signin-footer">
          Already have an account? <Link to="/signin" className="signin-link">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
