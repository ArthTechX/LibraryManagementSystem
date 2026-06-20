import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './common/Toast';
import '../css/Login.css';

export default function Login() {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const toast = useToast();
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(usernameOrEmail, password);
            toast.success('Welcome back!');
            history.push('/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please try again.');
            toast.error('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card glass-card animate-fade-in-up" id="login-card">
                <div className="auth-header">
                    <div className="auth-icon">🔐</div>
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">Username or Email</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter username or email"
                            value={usernameOrEmail}
                            onChange={e => setUsernameOrEmail(e.target.value)}
                            required
                            autoComplete="username"
                            id="login-username"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            id="login-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary auth-submit"
                        disabled={loading}
                        id="login-submit"
                    >
                        {loading ? (
                            <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div> Signing in...</>
                        ) : 'Sign In →'}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Register here</Link>
                </div>

                <div className="auth-demo-info">
                    <strong>Demo Admin:</strong> admin / admin123
                </div>
            </div>
        </div>
    );
}