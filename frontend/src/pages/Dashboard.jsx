import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default Dashboard
