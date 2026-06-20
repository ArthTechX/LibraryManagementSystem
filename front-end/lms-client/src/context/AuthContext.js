import React, { createContext, useState, useContext, useEffect } from 'react';
import { TOKEN_KEY, USER_KEY, AUTH_ENDPOINTS, USER_ENDPOINTS } from '../util/Constant';
import { apiPost, apiGet } from '../util/APIUtils';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Restore session from localStorage
        const savedToken = localStorage.getItem(TOKEN_KEY);
        const savedUser = localStorage.getItem(USER_KEY);
        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setCurrentUser(JSON.parse(savedUser));
            } catch (e) {
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
            }
        }
        setLoading(false);
    }, []);

    const login = async (usernameOrEmail, password) => {
        const data = await apiPost(AUTH_ENDPOINTS.SIGNIN, { usernameOrEmail, password });
        localStorage.setItem(TOKEN_KEY, data.accessToken);
        const user = {
            id: data.userId,
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            roles: data.roles,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        setToken(data.accessToken);
        setCurrentUser(user);
        return user;
    };

    const signup = async (firstName, lastName, username, email, password) => {
        const data = await apiPost(AUTH_ENDPOINTS.SIGNUP, {
            firstName, lastName, username, email, password
        });
        localStorage.setItem(TOKEN_KEY, data.accessToken);
        const user = {
            id: data.userId,
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            roles: data.roles,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        setToken(data.accessToken);
        setCurrentUser(user);
        return user;
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setCurrentUser(null);
    };

    const refreshUser = async () => {
        try {
            const data = await apiGet(USER_ENDPOINTS.ME);
            const user = {
                id: data.id,
                username: data.username,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                roles: data.roles,
                createdAt: data.createdAt,
            };
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            setCurrentUser(user);
        } catch (e) {
            logout();
        }
    };

    const isAuthenticated = !!token && !!currentUser;
    const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN') || false;

    const value = {
        currentUser,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        signup,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
