import React, { useEffect, useState } from 'react';
import { BOOK_ENDPOINTS, BORROW_ENDPOINTS, USER_ENDPOINTS } from '../util/Constant';
import { apiGet, apiPost, apiPut, apiDelete } from '../util/APIUtils';
import { useToast } from './common/Toast';
import '../css/Admin.css';

export default function AdminPanel() {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('books');
    const [books, setBooks] = useState([]);
    const [borrows, setBorrows] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editBook, setEditBook] = useState(null);
    const [form, setForm] = useState({
        title: '', author: '', isbn: '', genre: '', description: '',
        coverImage: '', totalCopies: 1, availableCopies: 1, publishYear: 2024
    });

    useEffect(() => { loadData(); }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'books') {
                setBooks(await apiGet(BOOK_ENDPOINTS.ALL));
            } else if (activeTab === 'borrows') {
                setBorrows(await apiGet(BORROW_ENDPOINTS.ALL));
            } else if (activeTab === 'users') {
                setUsers(await apiGet(USER_ENDPOINTS.ALL));
            }
        } catch (err) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: ['totalCopies', 'availableCopies', 'publishYear'].includes(name)
                ? parseInt(value) || 0 : value
        }));
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (editBook) {
                await apiPut(BOOK_ENDPOINTS.BY_ID(editBook.id), form);
                toast.success('Book updated!');
            } else {
                await apiPost(BOOK_ENDPOINTS.ALL, form);
                toast.success('Book created!');
            }
            setShowForm(false);
            setEditBook(null);
            resetForm();
            loadData();
        } catch (err) {
            toast.error(err.message || 'Failed to save book');
        }
    };

    const handleEdit = (book) => {
        setEditBook(book);
        setForm({
            title: book.title, author: book.author, isbn: book.isbn || '',
            genre: book.genre || '', description: book.description || '',
            coverImage: book.coverImage || '', totalCopies: book.totalCopies,
            availableCopies: book.availableCopies, publishYear: book.publishYear || 2024
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;
        try {
            await apiDelete(BOOK_ENDPOINTS.BY_ID(id));
            toast.success('Book deleted');
            loadData();
        } catch (err) {
            toast.error(err.message || 'Failed to delete');
        }
    };

    const resetForm = () => {
        setForm({
            title: '', author: '', isbn: '', genre: '', description: '',
            coverImage: '', totalCopies: 1, availableCopies: 1, publishYear: 2024
        });
    };

    return (
        <div className="page-container" id="admin-page">
            <h1 className="page-title">Admin Panel ⚙️</h1>

            <div className="admin-tabs">
                {['books', 'borrows', 'users'].map(tab => (
                    <button
                        key={tab}
                        className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => { setActiveTab(tab); setShowForm(false); }}
                    >{tab === 'books' ? '📚 Books' : tab === 'borrows' ? '📋 Borrows' : '👥 Users'}</button>
                ))}
            </div>

            {/* Books Tab */}
            {activeTab === 'books' && (
                <div className="admin-section animate-fade-in">
                    <div className="admin-actions">
                        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditBook(null); resetForm(); }}>
                            {showForm ? 'Cancel' : '+ Add Book'}
                        </button>
                    </div>

                    {showForm && (
                        <form className="admin-form glass-card" onSubmit={handleCreateOrUpdate} id="book-form">
                            <h3>{editBook ? 'Edit Book' : 'Add New Book'}</h3>
                            <div className="form-row">
                                <div className="form-group"><label className="form-label">Title *</label>
                                    <input className="form-input" name="title" value={form.title} onChange={handleFormChange} required />
                                </div>
                                <div className="form-group"><label className="form-label">Author *</label>
                                    <input className="form-input" name="author" value={form.author} onChange={handleFormChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group"><label className="form-label">ISBN</label>
                                    <input className="form-input" name="isbn" value={form.isbn} onChange={handleFormChange} />
                                </div>
                                <div className="form-group"><label className="form-label">Genre</label>
                                    <input className="form-input" name="genre" value={form.genre} onChange={handleFormChange} />
                                </div>
                            </div>
                            <div className="form-group"><label className="form-label">Description</label>
                                <textarea className="form-input" name="description" value={form.description} onChange={handleFormChange} rows="3" />
                            </div>
                            <div className="form-group"><label className="form-label">Cover Image URL</label>
                                <input className="form-input" name="coverImage" value={form.coverImage} onChange={handleFormChange} />
                            </div>
                            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                                <div className="form-group"><label className="form-label">Total Copies *</label>
                                    <input className="form-input" type="number" name="totalCopies" value={form.totalCopies} onChange={handleFormChange} min="1" required />
                                </div>
                                <div className="form-group"><label className="form-label">Available *</label>
                                    <input className="form-input" type="number" name="availableCopies" value={form.availableCopies} onChange={handleFormChange} min="0" required />
                                </div>
                                <div className="form-group"><label className="form-label">Publish Year</label>
                                    <input className="form-input" type="number" name="publishYear" value={form.publishYear} onChange={handleFormChange} />
                                </div>
                            </div>
                            <button type="submit" className="btn-accent">{editBook ? 'Update Book' : 'Create Book'}</button>
                        </form>
                    )}

                    {loading ? <div className="loading-container"><div className="spinner"></div></div> : (
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Available</th><th>Actions</th></tr>
                                </thead>
                                <tbody>
                                    {books.map(book => (
                                        <tr key={book.id}>
                                            <td className="td-title">{book.title}</td>
                                            <td>{book.author}</td>
                                            <td>{book.genre || '—'}</td>
                                            <td className="td-isbn">{book.isbn || '—'}</td>
                                            <td><span className={`badge ${book.availableCopies > 0 ? 'badge-available' : 'badge-unavailable'}`}>{book.availableCopies}/{book.totalCopies}</span></td>
                                            <td className="td-actions">
                                                <button className="btn-outline btn-sm" onClick={() => handleEdit(book)}>Edit</button>
                                                <button className="btn-danger btn-sm" onClick={() => handleDelete(book.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Borrows Tab */}
            {activeTab === 'borrows' && (
                <div className="admin-section animate-fade-in">
                    {loading ? <div className="loading-container"><div className="spinner"></div></div> : (
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr><th>User</th><th>Book</th><th>Borrowed</th><th>Due</th><th>Returned</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {borrows.map(b => (
                                        <tr key={b.id}>
                                            <td>{b.userFullName} <span style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>(@{b.username})</span></td>
                                            <td className="td-title">{b.bookTitle}</td>
                                            <td>{b.borrowDate}</td>
                                            <td>{b.dueDate}</td>
                                            <td>{b.returnDate || '—'}</td>
                                            <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="admin-section animate-fade-in">
                    {loading ? <div className="loading-container"><div className="spinner"></div></div> : (
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr><th>Name</th><th>Username</th><th>Email</th><th>Roles</th><th>Joined</th></tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.firstName} {u.lastName}</td>
                                            <td>@{u.username}</td>
                                            <td>{u.email}</td>
                                            <td>{u.roles?.map(r => r.replace('ROLE_','')).join(', ')}</td>
                                            <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
