import { Link } from 'react-router-dom'

function ForgotPassword() {
  return (
    <div className="signin-page">
      <div className="signin-card">
        <h1 className="signin-logo">Vantage</h1>
        <p className="signin-subtitle">Forgot password? Contact support or use your account recovery options</p>
        <p className="signin-footer">
          <Link to="/signin" className="signin-link">Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
