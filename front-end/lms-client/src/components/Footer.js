import React from "react";
import { Link } from "react-router-dom";
import '../css/Footer.css';

export default function Footer() {
    return (
        <footer className="lms-footer" id="main-footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <span className="footer-logo">📚 LMS</span>
                    <p className="footer-desc">
                        A modern library management system for the digital age.
                    </p>
                </div>

                <div className="footer-links">
                    <div className="footer-col">
                        <h4>Navigate</h4>
                        <Link to="/">Home</Link>
                        <Link to="/books">Catalog</Link>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Features</h4>
                        <span>Book Search</span>
                        <span>Online Borrowing</span>
                        <span>Reading History</span>
                        <span>Admin Dashboard</span>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Library Management System. Built with Spring Boot & React.</p>
                </div>
            </div>
        </footer>
    );
}