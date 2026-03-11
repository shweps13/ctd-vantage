import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-outlet">
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard
