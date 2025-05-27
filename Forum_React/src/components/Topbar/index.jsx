import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Topbar/styles.css';
import { useEffect, useState } from 'react';

const Topbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');
    const [searchQuery, setSearchQuery] = useState('');
    const userId = localStorage.getItem('userId');

    useEffect(() => {

        if (location.pathname === '/questions' || location.pathname === '/') {
            setActiveTab('home');
        } else if (location.pathname === '/questions/new') {
            setActiveTab('ask');
        } else if (location.pathname.startsWith('/users/') && location.pathname.includes('/myquestions')) {
            setActiveTab('myquestions');
        } else if (location.pathname.startsWith('/users/') && location.pathname.includes('/myanswers')) {
            setActiveTab('myanswers');
        } else if (location.pathname.startsWith('/users/') && location.pathname.includes('/myprofile')) {
            setActiveTab('profile');
        } else {
            setActiveTab(null);
        }
    }, [location]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="top-bar">
            <div className="container">
                <div className="row">
                    <nav className="navbar navbar-expand-lg bg-body-tertiary">
                        <div className="container-fluid">
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <Link className="navbar-brand" to="/questions">Forum</Link>
                            <form className="d-flex flex-grow-1 mx-4" role="search" onSubmit={handleSearchSubmit}>
                                <input 
                                    className="form-control me-2 search-bar" 
                                    type="search" 
                                    placeholder="Search by tags" 
                                    aria-label="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="btn btn-outline-success" type="submit" disabled={!searchQuery.trim()}>
                                    Search
                                </button>
                            </form>
                            <div className="collapse navbar-collapse justify-content-end" id="navbarTogglerDemo03">
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <NavLink 
                                            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
                                            to="/questions"
                                            end
                                        >
                                            Home
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink 
                                            className={`nav-link ${activeTab === 'ask' ? 'active' : ''}`}
                                            to="/questions/new"
                                        >
                                            Ask a Question
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink 
                                            className={`nav-link ${activeTab === 'myquestions' ? 'active' : ''}`}
                                            to={`/users/${userId}/myquestions`}
                                        >
                                            My Questions
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink 
                                            className={`nav-link ${activeTab === 'myanswers' ? 'active' : ''}`}
                                            to={`/users/${userId}/myanswers`}
                                        >
                                            My Answers
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink 
                                            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                                            to={`/users/${userId}/myprofile`}
                                        >
                                            Profile
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Topbar;