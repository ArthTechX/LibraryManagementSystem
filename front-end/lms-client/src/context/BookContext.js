import React, { createContext, useState, useContext, useCallback } from 'react';
import { BOOK_ENDPOINTS } from '../util/Constant';
import { apiGet } from '../util/APIUtils';

const BookContext = createContext(null);

export function BookProvider({ children }) {
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiGet(BOOK_ENDPOINTS.ALL);
            setBooks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchGenres = useCallback(async () => {
        try {
            const data = await apiGet(BOOK_ENDPOINTS.GENRES);
            setGenres(data);
        } catch (err) {
            console.error('Failed to fetch genres:', err);
        }
    }, []);

    const searchBooks = useCallback(async (query) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiGet(`${BOOK_ENDPOINTS.SEARCH}?q=${encodeURIComponent(query)}`);
            setBooks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const filterByGenre = useCallback(async (genre) => {
        if (!genre || genre === 'All') {
            return fetchBooks();
        }
        setLoading(true);
        setError(null);
        try {
            const data = await apiGet(BOOK_ENDPOINTS.BY_GENRE(genre));
            setBooks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [fetchBooks]);

    const value = {
        books,
        genres,
        loading,
        error,
        fetchBooks,
        fetchGenres,
        searchBooks,
        filterByGenre,
    };

    return (
        <BookContext.Provider value={value}>
            {children}
        </BookContext.Provider>
    );
}

export function useBooks() {
    const context = useContext(BookContext);
    if (!context) {
        throw new Error('useBooks must be used within a BookProvider');
    }
    return context;
}
