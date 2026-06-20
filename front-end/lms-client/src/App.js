import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookProvider } from './context/BookContext';
import { ToastProvider } from './components/common/Toast';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Books from './components/Books';
import BookDetail from './components/BookDetail';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import UserProfile from './components/UserProfile';
import PrivateRoute from './components/common/PrivateRoute';

function App() {
    return (
        <Router>
            <AuthProvider>
                <BookProvider>
                    <ToastProvider>
                        <div className="app">
                            <Header />
                            <main className="app-main">
                                <Switch>
                                    <Route path="/" exact component={Home} />
                                    <Route path="/login" component={Login} />
                                    <Route path="/register" component={Register} />
                                    <Route path="/books" exact component={Books} />
                                    <Route path="/books/:id" component={BookDetail} />
                                    <PrivateRoute path="/dashboard" component={Dashboard} />
                                    <PrivateRoute path="/admin" component={AdminPanel} adminOnly={true} />
                                    <PrivateRoute path="/profile" component={UserProfile} />
                                </Switch>
                            </main>
                            <Footer />
                        </div>
                    </ToastProvider>
                </BookProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
