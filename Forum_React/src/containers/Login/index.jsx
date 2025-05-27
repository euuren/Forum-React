import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Login/styles.css';
import Api from "../../helpers/Api";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        
        try {
            const response = await Api.login({ email, password });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const { accessToken, userDetails } = await response.json();
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('userId', userDetails.uid);
            
            navigate('/questions');
            
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100">
            <div className="card shadow-lg p-4 text-center" style={{ width: '24rem' }}>
                <h2 className="card-title fw-bold text-dark mb-3">Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
                <p className="mt-3">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;