import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { FiEye, FiEyeOff } from "react-icons/fi"
import { FcGoogle } from "react-icons/fc"
import logo from '../assets/logo.png'

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [keepSignedIn, setKeepSignedIn] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login, token } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (token) navigate(from, { replace: true })
  }, [token, navigate, from])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password, keepSignedIn)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="signin-page">
      <div className="signin-card">
        <div className="signin-logo-wrap">
          <img src={logo} alt="Vantage Finance logo" className="signin-logo-img" />
        </div>

        <form className="signin-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="signin-error" role="alert">{error}</div>}

          <label className="signin-label" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            className="signin-input"
            placeholder="johndoe@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
            required
          />

          <div className="signin-password-header">
            <label className="signin-label" htmlFor="password">Password</label>
            <Link to="/forgot-password" className="signin-forgot">Forgot Password?</Link>
          </div>
          <div className="signin-password-wrap">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="signin-input signin-input-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="signin-eye"
              onClick={() => setShowPassword((p) => !p)}
              tabIndex={-1}
            >
              {showPassword ? (
                <FiEye />
              ) : (
                <FiEyeOff />
              )}
            </button>
          </div>

          <label className="signin-checkbox-label">
            <input
              type="checkbox"
              className="signin-checkbox"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
            />
            <span className="signin-checkbox-text">Keep me signed in</span>
          </label>

          <button type="submit" className="signin-submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <div className="signin-divider">
          <span>or sign in with</span>
        </div>

        <button type="button" className="signin-google" disabled>
          <FcGoogle className="signin-google-icon" />
          Continue with Google
        </button>

        <p className="signin-footer">
          <Link to="/signup" className="signin-link">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn
