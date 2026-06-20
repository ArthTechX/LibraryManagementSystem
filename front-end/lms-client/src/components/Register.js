import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './common/Toast';
import '../css/Login.css';

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const toast = useToast();
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPass) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            await signup(firstName, lastName, username, email, password);
            toast.success('Account created! Welcome to LMS!');
            history.push('/dashboard');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
            toast.error('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card glass-card animate-fade-in-up" id="register-card" style={{ maxWidth: 520 }}>
                <div className="auth-header">
                    <div className="auth-icon">📝</div>
                    <h2>Create Account</h2>
                    <p>Join the library community</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input
                                type="text" className="form-input"
                                placeholder="First Name"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                required minLength="4"
                                id="register-firstname"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text" className="form-input"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                required minLength="4"
                                id="register-lastname"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                type="text" className="form-input"
                                placeholder="Username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required minLength="3" maxLength="20"
                                id="register-username"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email" className="form-input"
                                placeholder="Email Address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                id="register-email"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password" className="form-input"
                                placeholder="Min 6 characters"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required minLength="6"
                                id="register-password"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password" className="form-input"
                                placeholder="Repeat password"
                                value={confirmPass}
                                onChange={e => setConfirmPass(e.target.value)}
                                required
                                id="register-confirm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary auth-submit"
                        disabled={loading}
                        id="register-submit"
                    >
                        {loading ? (
                            <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div> Creating account...</>
                        ) : 'Create Account →'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Log in here</Link>
                </div>
            </div>
        </div>
    );
}