// API base URL — configurable via environment variable for deployment
// Set REACT_APP_API_URL in .env.production to your Railway/Render backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export { API_BASE_URL };

export const AUTH_ENDPOINTS = {
    SIGNIN: `${API_BASE_URL}/api/auth/signin`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
};

export const BOOK_ENDPOINTS = {
    ALL: `${API_BASE_URL}/api/books`,
    SEARCH: `${API_BASE_URL}/api/books/search`,
    GENRES: `${API_BASE_URL}/api/books/genres`,
    BY_GENRE: (genre) => `${API_BASE_URL}/api/books/genre/${genre}`,
    BY_ID: (id) => `${API_BASE_URL}/api/books/${id}`,
};

export const BORROW_ENDPOINTS = {
    BORROW: (bookId) => `${API_BASE_URL}/api/borrow/${bookId}`,
    RETURN: (borrowId) => `${API_BASE_URL}/api/borrow/return/${borrowId}`,
    MY_BORROWS: `${API_BASE_URL}/api/borrow/my`,
    MY_ACTIVE: `${API_BASE_URL}/api/borrow/my/active`,
    ALL: `${API_BASE_URL}/api/borrow/all`,
    ALL_ACTIVE: `${API_BASE_URL}/api/borrow/all/active`,
};

export const USER_ENDPOINTS = {
    ME: `${API_BASE_URL}/api/users/me`,
    ALL: `${API_BASE_URL}/api/users`,
};

export const TOKEN_KEY = 'lms_jwt_token';
export const USER_KEY = 'lms_user';

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    BOOKS: '/books',
    BOOK_DETAIL: '/books/:id',
    DASHBOARD: '/dashboard',
    ADMIN: '/admin',
    PROFILE: '/profile',
};
