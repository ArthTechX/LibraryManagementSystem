import React, { useEffect, useState } from 'react';
import { USER_ENDPOINTS } from '../util/Constant';
import { apiGet } from '../util/APIUtils';
import { useAuth } from '../context/AuthContext';
import '../css/Profile.css';

export default function UserProfile() {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await apiGet(USER_ENDPOINTS.ME);
                setProfile(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, []);

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    const user = profile || currentUser;

    return (
        <div className="page-container" id="profile-page">
            <h1 className="page-title">My Profile</h1>

            <div className="profile-card glass-card animate-fade-in-up">
                <div className="profile-avatar">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>

                <div className="profile-info">
                    <h2>{user?.firstName} {user?.lastName}</h2>
                    <p className="profile-username">@{user?.username}</p>

                    <div className="profile-details">
                        <div className="profile-detail-item">
                            <span className="profile-label">Email</span>
                            <span>{user?.email}</span>
                        </div>
                        <div className="profile-detail-item">
                            <span className="profile-label">Roles</span>
                            <span>{user?.roles?.map(r => r.replace('ROLE_', '')).join(', ')}</span>
                        </div>
                        {profile?.createdAt && (
                            <div className="profile-detail-item">
                                <span className="profile-label">Member Since</span>
                                <span>{new Date(profile.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
