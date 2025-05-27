import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../MyAnswers/styles.css';
import Api from '../../helpers/Api'; 
import Topbar from '../../components/Topbar';

const MyAnswers = () => {
    const { id = 0 } = useParams();
    const [answers, setAnswers] = useState([]);
    const [sortedAnswers, setSortedAnswers] = useState([]);
    const [activeFilter, setActiveFilter] = useState('recent');

    const confirmAndDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this answer?')) {
            handleDelete(id);
        }
    };

    useEffect(() => {
        if (activeFilter === 'recent') {
            handleFilterRecent();
        } else if (activeFilter === 'hot') {
            handleFilterHot();
        }
    }, [activeFilter, answers]);

    const fetchAnswers = async () => {
        if (id) {
            try {
                const response = await Api.getAnswersByAuthor(id);
                if (response.ok) {
                    const data = await response.json();
                    const answersWithTitles = await Promise.all(
                        data.answers.map(async (answer) => {
                            try {
                                const questionResponse = await Api.getQuestionById(answer.questionId);
                                if (questionResponse.ok) {
                                    const questionData = await questionResponse.json();
                                    const userResponse = await Api.getUserById(answer.author);
                                    if (userResponse.ok) {
                                        const userData = await userResponse.json();
                                        return {
                                            ...answer,
                                            questionTitle: questionData.question.title,
                                            authorName: userData.username,
                                        };
                                    }
                                }
                            } catch (error) {
                                console.error('Error fetching question title:', error);
                            }
                            return { ...answer, questionTitle: 'Unknown Question' };
                        })
                    );
                    setAnswers(answersWithTitles);
                    setSortedAnswers(Array.isArray(answersWithTitles) ? answersWithTitles : []);
                } else {
                    console.error('Failed to fetch answers');
                }
            } catch (error) {
                console.error('Error fetching answers:', error);
            }
        }
    };

    const handleFilterHot = () => {
        setActiveFilter('hot');
        const sorted = [...answers].sort((a, b) => b.votes - a.votes);
        setSortedAnswers(sorted);
    };

    const handleFilterRecent = () => {
        setActiveFilter('recent');
        const sorted = [...answers].sort((a, b) => new Date(b.created) - new Date(a.created));
        setSortedAnswers(sorted);
    };

    useEffect(() => {
        fetchAnswers();
    }, []);

    useEffect(() => {
        if (answers.length > 0) {
            handleFilterRecent();
        }
    }, [answers]);


    const handleDelete = async (answerId) => {
        try {
            const response = await Api.deleteAnswer(answerId);
            if (response.ok) {
                setAnswers(answers.filter(answer => answer._id !== answerId));
                setSortedAnswers(sortedAnswers.filter(answer => answer._id !== answerId));
            } else {
                console.error('Failed to delete answer');
            }
        } catch (error) {
            console.error('Error deleting answer:', error);
        }
    };

    if (!answers || answers.length === 0) {
        return (
            <div className="container">
                <Topbar />
                <div className="no-answers">
                    <h4>No answers found.</h4>
                </div>
            </div>
        );
    }

    return (
        <div className="answers-container">
            <Topbar />
            <div className="table-container">
                <div className="filter-label">
                    <p><i className="fas fa-filter"></i> <strong> Filters:</strong></p>
                </div>
                <div className="filter-buttons">
                    <button id="filter-hot" className={`btn btn-outline-primary ${activeFilter === 'hot' ? 'btn-active' : ''}`} onClick={handleFilterHot}>
                        <i className="fas fa-fire"></i> Hot
                    </button>
                    <button id="filter-recent" className={`btn btn-outline-primary ${activeFilter === 'recent' ? 'btn-active' : ''}`} onClick={handleFilterRecent}>
                        <i className="fas fa-clock"></i> Recent
                    </button>
                </div>

                <table className="table">
                    <colgroup>
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '75%' }} /> 
                        <col style={{ width: '15%' }} />
                    </colgroup>
                    <tbody>
                        {sortedAnswers.map((answer) => (
                            <tr key={answer._id} data-date={new Date(answer.created).toISOString()}>
                                <td>
                                    <div className="count-container">
                                        <div>{answer.votes}</div>
                                        <div className="count-label">Votes</div>
                                    </div>
                                </td>
                                <td>
                                    <a style={{ fontSize: '1.0em', color: '#6c757d' }}>answer to </a>
                                    <Link to={`/questions/${answer.questionId}`} className="question-title">
                                        {answer.questionTitle || 'Unknown Question'}
                                    </Link>
                                    <div className="mt-2"></div>
                                    <p>{answer.body}</p>
                                    <div className="user-info mt-2" style={{ fontSize: '1.0em', color: '#6c757d' }}>
                                        <em>Answered by {answer.authorName} on {new Date(answer.created).toLocaleString()}</em>
                                    </div>
                                </td>
                                <td>
                                    <div className="actions">
                                        <Link to={`/answers/${answer._id}/edit`} className="btn btn-primary">
                                            <i className="fas fa-edit"></i> Edit
                                        </Link>
                                        <button onClick={() => confirmAndDelete(answer._id)} className="btn btn-danger">
                                            <i className="fas fa-trash"></i> Delete
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

export default MyAnswers;
