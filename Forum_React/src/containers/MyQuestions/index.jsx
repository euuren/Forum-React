import React, { useState, useEffect, use } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../MyQuestions/styles.css';
import Topbar from '../../components/Topbar';
import Api from '../../helpers/Api';
import { FaFilter, FaFire, FaTrophy, FaClock, FaEdit, FaTrash } from 'react-icons/fa';

const MyQuestions = () => {
    const { id = 0 } = useParams();
    const [questions, setQuestions] = useState([]);
    const [author, setAuthor] = useState({});
    const [sortedQuestions, setSortedQuestions] = useState(() => []);
    const [activeFilter, setActiveFilter] = useState('recent');

    const confirmAndDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            handleDelete(id);
        }
    };
    
    const fetchQuestions = async () => {
        if(id) {
            try {
                const response = await Api.getQuestionsByAuthor(id);
                if (response.ok) {
                    const data = await response.json();
                    setQuestions(data.questions);
                    setSortedQuestions(Array.isArray(data.questions) ? data.questions : []);
                } else {
                    console.error('Failed to fetch questions');
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        }
    };

    const fetchAuthor = async () => {
        try {
            const response = await Api.getUserById(id);
            if (response.ok) {
                const data = await response.json();
                setAuthor(data);
            } else {
                console.error('Failed to fetch author');
            }
        } catch (error) {
            console.error('Error fetching author:', error);
        }
    };

    const handleFilterHot = () => {
        setActiveFilter('hot');
        const sorted = [...questions].sort((a, b) => b.votes - a.votes);
        setSortedQuestions(sorted);
    };

    const handleFilterMostAnswered = () => {
        setActiveFilter('mostAnswered');
        const sorted = [...questions].sort((a, b) => b.answers.length - a.answers.length);
        setSortedQuestions(sorted);
    };

    const handleFilterRecent = () => {
        setActiveFilter('recent');
        const sorted = [...questions].sort((a, b) => new Date(b.created) - new Date(a.created));
        setSortedQuestions(sorted);
    };

    const handleDelete = async (id) => {
        try {
            const response = await Api.deleteQuestion(id);
            if (response.ok) {
                setQuestions(questions.filter(q => q._id !== id));
            }
        } catch (error) {
        console.error('Error deleting question:', error);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        fetchAuthor();
    }, [id]);

    useEffect(() => {
        if (questions.length > 0) {
            handleFilterRecent();
        }
    }, [questions]);

    if (!questions || questions.length === 0) {
        return (
        <div className="questions-container">
            <div className="table-container">
            <p>No questions available.</p>
            </div>
        </div>
        );
    }

    return (
        <div className="questions-container">
        <Topbar />
        <div className="table-container">
            <div className="filter-label">
            <p><FaFilter /> <strong>Filters:</strong></p>
            </div>
            <div className="filter-buttons">
            <button
                id="filter-hot"
                className={`btn btn-outline-primary ${activeFilter === 'hot' ? 'btn-active' : ''}`}
                onClick={handleFilterHot}
            >
                <FaFire /> Hot
            </button>
            <button
                id="filter-mostAnswered"
                className={`btn btn-outline-primary ${activeFilter === 'mostAnswered' ? 'btn-active' : ''}`}
                onClick={handleFilterMostAnswered}
            >
                <FaTrophy /> Most Answered
            </button>
            <button
                id="filter-recent"
                className={`btn btn-outline-primary ${activeFilter === 'recent' ? 'btn-active' : ''}`}
                onClick={handleFilterRecent}
            >
                <FaClock /> Most Recent
            </button>
            </div>

            <table className="table">
                <colgroup>
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} /> 
                    <col style={{ width: '65%' }} />
                    <col style={{ width: '15%' }} />
                </colgroup>
                <tbody>
                    {sortedQuestions.map((question) => (
                    <tr key={question._id} data-date={new Date(question.created).toISOString()}>
                        <td>
                        <div className="count-container">
                            <div>{question.votes}</div>
                            <div className="count-label">Votes</div>
                        </div>
                        </td>
                        <td>
                        <div className="count-container">
                            <div className="answers-count">{question.answers.length}</div>
                            <div className="count-label">Answers</div>
                        </div>
                        </td>
                        <td>
                        <Link to={`/questions/${question._id}`} className="question-title">
                            {question.title}
                        </Link>
                        <div className="mt-2">
                            {question.tags.map(tag => (
                            <span key={tag} className="badge bg-dark">{tag}</span>
                            ))}
                        </div>
                        <div className="user-info mt-2">
                            Asked by {author.username} on {new Date(question.created).toLocaleString()}
                        </div>
                        </td>
                        <td>
                        <div className="actions">
                            <Link to={`/questions/${question._id}/edit`} className="btn btn-primary">
                            <FaEdit /> Edit
                            </Link>
                            <button
                            onClick={() => confirmAndDelete(question._id)}
                            className="btn btn-danger"
                            >
                            <FaTrash /> Delete
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default MyQuestions;