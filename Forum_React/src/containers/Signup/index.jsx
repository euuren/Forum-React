import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from "../../helpers/Api";

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Clear any previous errors
        setError('');

        Api.register({ username, email, password })
            .then((response) => {
                if (response.status === 201) {
                    return response.json();
                } else {
                    throw new Error('Signup failed');
                }
            })
            .then((data) => {
                navigate('/login');
            })
            .catch((error) => {
                console.error('Error:', error);
                setError('Signup failed. Please try again.');
            });
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100">
            <div className="card shadow-lg p-4 text-center" style={{ width: '24rem' }}>
                <h2 className="card-title fw-bold text-dark mb-3">Sign Up</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="form-control"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="form-control"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="form-control"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="form-control"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                </form>
                <p className="mt-3">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;