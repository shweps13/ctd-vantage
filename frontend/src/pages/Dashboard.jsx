import { useAuth } from '../context/useAuth'
import Sidebar from '../components/Sidebar'

function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="dashboard-main">
        <h1>Welcome back{user?.name ? `, ${user.name}` : ''}</h1>
        <p>You're signed in securely.</p>
      </main>
    </div>
  )
}

export default Dashboard
