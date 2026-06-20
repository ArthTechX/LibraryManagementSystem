import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

export default function BookCard({ book }) {
    const isAvailable = book.availableCopies > 0;

    return (
        <Link to={`/books/${book.id}`} className="book-card glass-card" id={`book-card-${book.id}`}>
            <div className="book-card-image">
                <img
                    src={book.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop'}
                    alt={book.title}
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop';
                    }}
                />
                <div className="book-card-overlay">
                    <span className="book-card-view">View Details →</span>
                </div>
            </div>
            <div className="book-card-content">
                <h3 className="book-card-title">{book.title}</h3>
                <p className="book-card-author">{book.author}</p>
                <div className="book-card-footer">
                    {book.genre && <span className="badge badge-genre">{book.genre}</span>}
                    <span className={`badge ${isAvailable ? 'badge-available' : 'badge-unavailable'}`}>
                        {isAvailable ? `${book.availableCopies} available` : 'Unavailable'}
                    </span>
                </div>
            </div>
        </Link>
    );
}
