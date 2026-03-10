import { useAuth } from '../context/useAuth'

function Overview() {
  const { user } = useAuth()

  return (
    <div className="overview">
      <h1>Welcome back{user?.name ? `, ${user.name}` : ''}</h1>
    </div>
  )
}

export default Overview
