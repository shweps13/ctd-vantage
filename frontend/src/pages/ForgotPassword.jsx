import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

function ForgotPassword() {
  return (
    <div className="signin-page">
      <div className="signin-card">
        <div className="signin-logo-wrap">
          <img src={logo} alt="Vantage Finance" className="signin-logo-img" />
        </div>
        <p className="signin-subtitle">Forgot password? Contact support or use your account recovery options</p>
        <p className="signin-footer">
          <Link to="/signin" className="signin-link">Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
