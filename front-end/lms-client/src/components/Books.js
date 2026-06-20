import React, { useEffect, useState } from 'react';
import { useBooks } from '../context/BookContext';
import BookCard from './common/BookCard';
import '../css/Books.css';

export default function Books() {
    const { books, genres, loading, fetchBooks, fetchGenres, searchBooks, filterByGenre } = useBooks();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeGenre, setActiveGenre] = useState('All');

    useEffect(() => {
        fetchBooks();
        fetchGenres();
    }, [fetchBooks, fetchGenres]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            searchBooks(searchQuery.trim());
            setActiveGenre('All');
        } else {
            fetchBooks();
        }
    };

    const handleGenreFilter = (genre) => {
        setActiveGenre(genre);
        setSearchQuery('');
        filterByGenre(genre);
    };

    const handleClear = () => {
        setSearchQuery('');
        setActiveGenre('All');
        fetchBooks();
    };

    return (
        <div className="page-container" id="books-page">
            <div className="books-header animate-fade-in-up">
                <h1 className="page-title">Book Catalog</h1>

                <form className="search-bar" onSubmit={handleSearch} id="book-search-form">
                    <input
                        type="text"
                        className="form-input search-input"
                        placeholder="Search by title, author, ISBN, or genre..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        id="book-search-input"
                    />
                    <button type="submit" className="btn-primary" id="book-search-btn">Search</button>
                    {(searchQuery || activeGenre !== 'All') && (
                        <button type="button" className="btn-outline btn-sm" onClick={handleClear}>Clear</button>
                    )}
                </form>

                {genres.length > 0 && (
                    <div className="genre-filters">
                        <span
                            className={`badge badge-genre ${activeGenre === 'All' ? 'active' : ''}`}
                            onClick={() => handleGenreFilter('All')}
                        >All</span>
                        {genres.map(genre => (
                            <span
                                key={genre}
                                className={`badge badge-genre ${activeGenre === genre ? 'active' : ''}`}
                                onClick={() => handleGenreFilter(genre)}
                            >{genre}</span>
                        ))}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading books...</p>
                </div>
            ) : books.length === 0 ? (
                <div className="empty-state animate-fade-in">
                    <div className="empty-icon">📚</div>
                    <h3>No books found</h3>
                    <p>Try a different search or filter.</p>
                </div>
            ) : (
                <div className="books-grid stagger-children">
                    {books.map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            )}
        </div>
    );
}
