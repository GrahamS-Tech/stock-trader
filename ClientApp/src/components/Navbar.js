import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar(props) {
    return (
        <header>
        <div className="container-fluid bg-primary d-flex justify-content-end" >
                <nav className="navbar navbar-expand-lg" >
                    <NavLink className="nav-link active text-white" to="/">Home</NavLink>
                    <NavLink className="nav-link active text-white" to="MyAccount">My Account</NavLink>
                    <NavLink className="nav-link active text-white" to="reports">Reports</NavLink>
                </nav>
            </div>
        </header>
    )
}