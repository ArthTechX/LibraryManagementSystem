import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import '../css/Header.css';

export default function Header() {
    const { isAuthenticated, isAdmin, currentUser, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const history = useHistory();

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        history.push('/');
    };

    return (
        <nav className="lms-navbar" id="main-navbar">
            <div className="nav-container">
                <Link to="/" className="nav-brand" id="nav-brand">
                    <div className="brand-icon">📚</div>
                    <span className="brand-text">LMS</span>
                </Link>

                <button
                    className={`mobile-toggle ${mobileOpen ? 'active' : ''}`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    id="mobile-toggle"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className={`nav-links ${mobileOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-link" onClick={() => setMobileOpen(false)}>Home</Link>
                    <Link to="/books" className="nav-link" onClick={() => setMobileOpen(false)}>Catalog</Link>
                    {isAuthenticated && (
                        <Link to="/dashboard" className="nav-link" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                    )}
                    {isAdmin && (
                        <Link to="/admin" className="nav-link nav-link-admin" onClick={() => setMobileOpen(false)}>Admin</Link>
                    )}
                </div>

                <div className="nav-actions">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className="btn-outline btn-sm" id="nav-login-btn">Log In</Link>
                            <Link to="/register" className="btn-primary btn-sm" id="nav-register-btn">Register</Link>
                        </>
                    ) : (
                        <div className="user-menu">
                            <button
                                className="user-avatar-btn"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                id="user-menu-btn"
                            >
                                <div className="user-avatar">
                                    {currentUser?.firstName?.charAt(0)}{currentUser?.lastName?.charAt(0)}
                                </div>
                            </button>

                            {dropdownOpen && (
                                <div className="user-dropdown animate-fade-in" id="user-dropdown">
                                    <div className="dropdown-header">
                                        <div className="dropdown-name">
                                            {currentUser?.firstName} {currentUser?.lastName}
                                        </div>
                                        <div className="dropdown-email">@{currentUser?.username}</div>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <Link
                                        to="/profile"
                                        className="dropdown-item"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        👤 Profile
                                    </Link>
                                    <Link
                                        to="/dashboard"
                                        className="dropdown-item"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        📊 Dashboard
                                    </Link>
                                    {isAdmin && (
                                        <Link
                                            to="/admin"
                                            className="dropdown-item"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            ⚙️ Admin Panel
                                        </Link>
                                    )}
                                    <div className="dropdown-divider"></div>
                                    <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                                        🚪 Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}