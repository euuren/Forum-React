import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../MyProfile/styles.css';
import Topbar from '../../components/Topbar';
import Api from '../../helpers/Api';

const ProfilePage = () => {
    const { id = 0 } = useParams();
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const response = await Api.getUserById(id);
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                console.error('Failed to fetch user');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    const handleLogout = () => {
        try {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userId');
            window.location.href = '/#/login';
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="profile-page-container">
            <Topbar />
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
                <div className="card p-4 shadow text-center" style={{ width: '100%', maxWidth: '600px' }}>
                    <img
                        src={`public/${user?.profileImage}`}
                        alt="Profile"
                        className="profile-img mb-3"
                    />
                    <h2 className="card-title">{user?.username}</h2>
                    <p className="profile-email">{user?.email}</p>
                    <p className="card-text">{user?.bio || 'No bio yet'}</p>
    
                    <div className="profile-buttons mt-4 d-flex justify-content-center gap-3 flex-wrap">
                        <Link to={`/users/${id}/edit`} className="btn btn-primary">
                            Edit Profile
                        </Link>
                        <button onClick={handleLogout} className="btn btn-outline-danger">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );    
};

export default ProfilePage;
