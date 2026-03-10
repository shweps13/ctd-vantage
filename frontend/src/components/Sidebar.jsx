import React from 'react'
import logo from '../assets/logo-dark.png'
import { useAuth } from '../context/useAuth'
import { PiSquaresFour, PiWallet, PiSignOut, PiUserCircleFill } from 'react-icons/pi'
import { TbArrowsRightLeft } from 'react-icons/tb'

function Sidebar() {
  const { user, logout } = useAuth()
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Vantage Finance" className="sidebar-logo" />
      </div>
      <div className="sidebar-content">
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item sidebar-menu-item--active">
            <PiSquaresFour className="sidebar-menu-icon" />
            <span>Overview</span>
          </li>
          <li className="sidebar-menu-item">
            <PiWallet className="sidebar-menu-icon" />
            <span>Balances</span>
          </li>
          <li className="sidebar-menu-item">
            <TbArrowsRightLeft className="sidebar-menu-icon" />
            <span>Transactions</span>
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