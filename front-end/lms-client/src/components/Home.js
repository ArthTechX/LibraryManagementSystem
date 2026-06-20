import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BOOK_ENDPOINTS } from '../util/Constant';
import { apiGet } from '../util/APIUtils';
import '../css/Home.css';

export default function Home() {
    const { isAuthenticated } = useAuth();
    const [stats, setStats] = useState({ books: 0, genres: 0 });

    useEffect(() => {
        async function loadStats() {
            try {
                const books = await apiGet(BOOK_ENDPOINTS.ALL);
                const genres = await apiGet(BOOK_ENDPOINTS.GENRES);
                setStats({ books: books.length, genres: genres.length });
            } catch (e) { /* silent */ }
        }
        loadStats();
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section" id="hero">
                <div className="hero-bg-orbs">
                    <div className="orb orb-1"></div>
                    <div className="orb orb-2"></div>
                    <div className="orb orb-3"></div>
                </div>

                <div className="hero-content animate-fade-in-up">
                    <span className="hero-badge">📖 Open Library Platform</span>
                    <h1 className="hero-title">
                        Your Digital<br/>
                        <span className="hero-gradient-text">Library Hub</span>
                    </h1>
                    <p className="hero-subtitle">
                        Discover, borrow, and manage books effortlessly. A modern library
                        management system designed for the digital age.
                    </p>
                    <div className="hero-actions">
                        <Link to="/books" className="btn-primary btn-lg" id="hero-browse-btn">
                            Browse Catalog →
                        </Link>
                        {!isAuthenticated && (
                            <Link to="/register" className="btn-outline btn-lg" id="hero-register-btn">
                                Get Started
                            </Link>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="hero-stats animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <div className="stat-item glass-card">
                        <div className="stat-number">{stats.books}+</div>
                        <div className="stat-label">Books Available</div>
                    </div>
                    <div className="stat-item glass-card">
                        <div className="stat-number">{stats.genres}</div>
                        <div className="stat-label">Genres</div>
                    </div>
                    <div className="stat-item glass-card">
                        <div className="stat-number">24/7</div>
                        <div className="stat-label">Online Access</div>
                    </div>
                    <div className="stat-item glass-card">
                        <div className="stat-number">14</div>
                        <div className="stat-label">Day Loans</div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features-section" id="features">
                <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
                    Why Choose <span className="hero-gradient-text">LMS</span>?
                </h2>
                <div className="features-grid stagger-children">
                    <div className="feature-card glass-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Smart Search</h3>
                        <p>Find books instantly by title, author, ISBN, or genre with real-time search results.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="feature-icon">📱</div>
                        <h3>Borrow Online</h3>
                        <p>Reserve and borrow books from anywhere. Track due dates and manage returns online.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="feature-icon">📊</div>
                        <h3>Personal Dashboard</h3>
                        <p>Track your reading history, active borrows, and due dates all in one place.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="feature-icon">🔐</div>
                        <h3>Secure & Fast</h3>
                        <p>JWT-based authentication keeps your account safe. Lightning-fast API responses.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="feature-icon">👑</div>
                        <h3>Admin Panel</h3>
                        <p>Full CRUD management for books, users, and borrow records with role-based access.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="feature-icon">🌙</div>
                        <h3>Modern UI</h3>
                        <p>Beautiful dark theme with glassmorphism design, smooth animations, and responsive layout.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section" id="cta">
                <div className="cta-card glass-card">
                    <h2>Ready to start reading?</h2>
                    <p>Join our library and get access to hundreds of books across all genres.</p>
                    <div className="hero-actions" style={{ justifyContent: 'center' }}>
                        <Link to={isAuthenticated ? "/books" : "/register"} className="btn-accent btn-lg">
                            {isAuthenticated ? "Browse Books" : "Create Free Account"} →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}