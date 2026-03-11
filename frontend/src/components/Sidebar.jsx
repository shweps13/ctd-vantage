import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/logo-dark.png'
import { useAuth } from '../context/useAuth'
import { PiWallet, PiSignOut, PiUserCircleFill } from 'react-icons/pi'
import { TbArrowsRightLeft } from 'react-icons/tb'

function Sidebar() {
  const { user, logout } = useAuth()
  const navLinkClass = ({ isActive }) =>
    `sidebar-menu-link ${isActive ? 'sidebar-menu-item--active' : ''}`

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Vantage Finance" className="sidebar-logo" />
      </div>
      <div className="sidebar-content">
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item">
            <NavLink to="/balances" className={navLinkClass}>
              <PiWallet className="sidebar-menu-icon" />
              <span>Balances</span>
            </NavLink>
          </li>
          <li className="sidebar-menu-item">
            <NavLink to="/transactions" className={navLinkClass}>
              <TbArrowsRightLeft className="sidebar-menu-icon" />
              <span>Transactions</span>
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="sidebar-footer">
        <button type="button" className="sidebar-logout" onClick={logout}>
          <PiSignOut className="sidebar-logout-icon" />
          Logout
        </button>
        <hr className="sidebar-divider" />
        <div className="sidebar-user-info">
          <PiUserCircleFill className="sidebar-user-avatar" />
          <span className="sidebar-username">{user?.name ?? 'User'}</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar