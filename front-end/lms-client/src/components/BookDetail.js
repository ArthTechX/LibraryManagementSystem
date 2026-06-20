import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { BOOK_ENDPOINTS, BORROW_ENDPOINTS } from '../util/Constant';
import { apiGet, apiPost } from '../util/APIUtils';
import { useAuth } from '../context/AuthContext';
import { useToast } from './common/Toast';
import '../css/BookDetail.css';

export default function BookDetail() {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const toast = useToast();
    const history = useHistory();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [borrowing, setBorrowing] = useState(false);

    useEffect(() => {
        async function loadBook() {
            try {
                const data = await apiGet(BOOK_ENDPOINTS.BY_ID(id));
                setBook(data);
            } catch (err) {
                toast.error('Failed to load book details');
            } finally {
                setLoading(false);
            }
        }
        loadBook();
    }, [id, toast]);

    const handleBorrow = async () => {
        if (!isAuthenticated) {
            history.push('/login');
            return;
        }
        setBorrowing(true);
        try {
            await apiPost(BORROW_ENDPOINTS.BORROW(book.id), {});
            toast.success(`"${book.title}" borrowed successfully! Due in 14 days.`);
            // Refresh book data
            const updated = await apiGet(BOOK_ENDPOINTS.BY_ID(id));
            setBook(updated);
        } catch (err) {
            toast.error(err.message || 'Failed to borrow book');
        } finally {
            setBorrowing(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading book details...</p>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="page-container">
                <div className="empty-state">
                    <div className="empty-icon">📖</div>
                    <h3>Book not found</h3>
                    <button className="btn-primary" onClick={() => history.push('/books')}>
                        Back to Catalog
                    </button>
                </div>
            </div>
        );
    }

    const isAvailable = book.availableCopies > 0;

    return (
        <div className="page-container" id="book-detail-page">
            <button className="btn-outline btn-sm" onClick={() => history.goBack()} style={{ marginBottom: 24 }}>
                ← Back
            </button>

            <div className="book-detail glass-card animate-fade-in-up">
                <div className="book-detail-image">
                    <img
                        src={book.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=500&fit=crop'}
                        alt={book.title}
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=500&fit=crop';
                        }}
                    />
                </div>

                <div className="book-detail-info">
                    <div className="book-detail-badges">
                        {book.genre && <span className="badge badge-genre">{book.genre}</span>}
                        <span className={`badge ${isAvailable ? 'badge-available' : 'badge-unavailable'}`}>
                            {isAvailable ? `${book.availableCopies} of ${book.totalCopies} available` : 'All copies borrowed'}
                        </span>
                    </div>

                    <h1 className="book-detail-title">{book.title}</h1>
                    <p className="book-detail-author">by {book.author}</p>

                    <div className="book-detail-meta">
                        {book.isbn && <div className="meta-item"><span className="meta-label">ISBN</span><span>{book.isbn}</span></div>}
                        {book.publishYear && <div className="meta-item"><span className="meta-label">Published</span><span>{book.publishYear}</span></div>}
                        <div className="meta-item"><span className="meta-label">Total Copies</span><span>{book.totalCopies}</span></div>
                    </div>

                    {book.description && (
                        <div className="book-detail-desc">
                            <h3>Description</h3>
                            <p>{book.description}</p>
                        </div>
                    )}

                    <div className="book-detail-actions">
                        <button
                            className="btn-accent btn-lg"
                            onClick={handleBorrow}
                            disabled={!isAvailable || borrowing}
                            id="borrow-btn"
                        >
                            {borrowing ? 'Borrowing...' : isAvailable ? '📖 Borrow This Book' : 'Not Available'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
