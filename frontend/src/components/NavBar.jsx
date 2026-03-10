import React from 'react'
import { FaAnglesRight, FaBell } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";

function NavBar() {

    return (
        <div className="navbar">
            <div className="navbar-date">
                <FaAnglesRight />
                <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="navbar-actions">
                <FaBell />
                <div className="navbar-search">
                    <input type="text" placeholder="Search here" />
                    <button type="button">
                        <FiSearch size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NavBar