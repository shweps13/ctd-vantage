import { useAuth } from '../context/useAuth'

function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <span className="dashboard-logo">Vantage</span>
        <button type="button" className="dashboard-logout" onClick={logout}>
          Sign out
        </button>
      </header>
      <main className="dashboard-main">
        <h1>Welcome back{user?.name ? `, ${user.name}` : ''}</h1>
        <p>You're signed in securely.</p>
      </main>
    </div>
  )
}

export default Dashboard
