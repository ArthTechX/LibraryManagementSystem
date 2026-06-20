import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BORROW_ENDPOINTS } from '../util/Constant';
import { apiGet, apiPut } from '../util/APIUtils';
import { useAuth } from '../context/AuthContext';
import { useToast } from './common/Toast';
import '../css/Dashboard.css';

export default function Dashboard() {
    const { currentUser } = useAuth();
    const toast = useToast();
    const [borrows, setBorrows] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadBorrows = async () => {
        try {
            const data = await apiGet(BORROW_ENDPOINTS.MY_BORROWS);
            setBorrows(data);
        } catch (err) {
            toast.error('Failed to load borrow history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadBorrows(); }, []);

    const handleReturn = async (borrowId, bookTitle) => {
        try {
            await apiPut(BORROW_ENDPOINTS.RETURN(borrowId));
            toast.success(`"${bookTitle}" returned successfully!`);
            loadBorrows();
        } catch (err) {
            toast.error(err.message || 'Failed to return book');
        }
    };

    const activeBorrows = borrows.filter(b => b.status === 'BORROWED');
    const returnedBorrows = borrows.filter(b => b.status === 'RETURNED');

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date();
    };

    return (
        <div className="page-container" id="dashboard-page">
            <div className="dash-header animate-fade-in-up">
                <h1 className="page-title">
                    Welcome, {currentUser?.firstName}! 👋
                </h1>
                <p className="dash-subtitle">Manage your borrowed books and reading history.</p>
            </div>

            {/* Stats */}
            <div className="dash-stats animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="dash-stat glass-card">
                    <div className="dash-stat-number">{activeBorrows.length}</div>
                    <div className="dash-stat-label">Active Borrows</div>
                </div>
                <div className="dash-stat glass-card">
                    <div className="dash-stat-number">{returnedBorrows.length}</div>
                    <div className="dash-stat-label">Returned</div>
                </div>
                <div className="dash-stat glass-card">
                    <div className="dash-stat-number">{5 - activeBorrows.length}</div>
                    <div className="dash-stat-label">Slots Available</div>
                </div>
            </div>

            {loading ? (
                <div className="loading-container"><div className="spinner"></div><p>Loading...</p></div>
            ) : (
                <>
                    {/* Active Borrows */}
                    <section className="dash-section animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h2 className="section-title">📖 Currently Borrowed</h2>
                        {activeBorrows.length === 0 ? (
                            <div className="dash-empty glass-card">
                                <p>You don't have any books borrowed right now.</p>
                                <Link to="/books" className="btn-primary btn-sm">Browse Catalog →</Link>
                            </div>
                        ) : (
                            <div className="borrow-list">
                                {activeBorrows.map(borrow => (
                                    <div key={borrow.id} className="borrow-item glass-card" id={`borrow-${borrow.id}`}>
                                        <div className="borrow-book-info">
                                            <h4>{borrow.bookTitle}</h4>
                                            <p className="borrow-author">by {borrow.bookAuthor}</p>
                                            <div className="borrow-dates">
                                                <span>Borrowed: {borrow.borrowDate}</span>
                                                <span className={isOverdue(borrow.dueDate) ? 'overdue' : ''}>
                                                    Due: {borrow.dueDate} {isOverdue(borrow.dueDate) && '⚠️ OVERDUE'}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            className="btn-accent btn-sm"
                                            onClick={() => handleReturn(borrow.id, borrow.bookTitle)}
                                        >
                                            Return Book
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* History */}
                    {returnedBorrows.length > 0 && (
                        <section className="dash-section animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <h2 className="section-title">📋 Reading History</h2>
                            <div className="borrow-list">
                                {returnedBorrows.map(borrow => (
                                    <div key={borrow.id} className="borrow-item glass-card borrow-returned">
                                        <div className="borrow-book-info">
                                            <h4>{borrow.bookTitle}</h4>
                                            <p className="borrow-author">by {borrow.bookAuthor}</p>
                                            <div className="borrow-dates">
                                                <span>Borrowed: {borrow.borrowDate}</span>
                                                <span>Returned: {borrow.returnDate}</span>
                                            </div>
                                        </div>
                                        <span className="badge badge-returned">Returned</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}
