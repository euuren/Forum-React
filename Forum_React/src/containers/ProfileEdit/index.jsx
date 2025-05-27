import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../ProfileEdit/styles.css";
import Topbar from '../../components/Topbar';
import Api from '../../helpers/Api';

const ProfileEdit = () => {
    const { id } = useParams();
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [bio, setBio] = useState();
    const [profileImage, setProfileImage] = useState();
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const response = await Api.getUserById(id);
            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);
                setEmail(data.email);
                setBio(data.bio);
                setProfileImage(data.profileImage);
            } else {
                console.error('Failed to fetch user');
            }
        }
        catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    const handleChangeProfileImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChangeUsername = (e) => {
        setUsername(e.target.value);
    };

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleChangeBio = (e) => {
        setBio(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await Api.updateUser(id, {
                username,
                email,
                bio,
                profileImage: fileInputRef.current.files[0]
            });
            if (response.ok) {
                console.log(response);
                navigate(`/users/${id}/myprofile`);
            } else {
                console.error('Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleCancel = () => {
        navigate(`/users/${id}/myprofile`);
    }

    return (
        <div className="profile-edit-page">
            <Topbar />
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
                <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '700px' }}>
                    <h4 className="mb-4 text-center">Edit Profile</h4>
                    <form
                        onSubmit={(event) => {
                            handleSubmit(event);
                        }}
                        encType="multipart/form-data"
                    >
                        <div className="text-center mb-4">
                            <img className="rounded-circle profile-img mb-2" src={profileImage} alt="Profile" />
                            <p></p>
                            <input
                                type="file"
                                className="form-control"
                                id="profileImage"
                                name="profileImage"
                                accept="image/*"
                                onChange={handleChangeProfileImage}
                                ref={fileInputRef}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                name="username"
                                value={username}
                                onChange={handleChangeUsername}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleChangeEmail}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="bio" className="form-label">Bio</label>
                            <textarea
                                className="form-control"
                                id="bio"
                                name="bio"
                                rows="3"
                                value={bio}
                                onChange={handleChangeBio}
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-between">
                            <button type="submit" className="btn btn-primary w-45">Save Changes</button>
                            <button type="button" className="btn btn-outline-danger w-45" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileEdit;