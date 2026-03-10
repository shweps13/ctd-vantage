import React from 'react'
import { FaAnglesRight, FaBell } from "react-icons/fa6";

function NavBar() {
    return (
        <div className="navbar">
            <div className="navbar-date">
                <FaAnglesRight />
                <span>Date Now</span>
            </div>
            <div className="navbar-actions">
                <FaBell />
                <span>Search</span>
            </div>
        </div>
    )
}

export default NavBar