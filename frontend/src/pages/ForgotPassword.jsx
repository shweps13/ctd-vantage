import { Link } from 'react-router-dom'
import './SignIn.css'

function ForgotPassword() {
  return (
    <div className="signin-page">
      <div className="signin-card">
        <h1 className="signin-logo">FINEbank.IO</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
          Forgot password? Contact support or use your account recovery options. This flow can be wired to your backend later.
        </p>
        <p className="signin-footer">
          <Link to="/signin" className="signin-link">Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
