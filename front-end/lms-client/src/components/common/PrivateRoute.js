import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute({ component: Component, adminOnly, ...rest }) {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <Route
            {...rest}
            render={props => {
                if (!isAuthenticated) {
                    return <Redirect to="/login" />;
                }
                if (adminOnly && !isAdmin) {
                    return <Redirect to="/" />;
                }
                return <Component {...props} />;
            }}
        />
    );
}