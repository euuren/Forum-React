import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import Api from '../../helpers/Api';
import '../QuestionsList/styles.css';

const QuestionsList = () => {
    const [questions, setQuestions] = useState([]);
    const [sortedQuestions, setSortedQuestions] = useState([]);
    const [activeFilter, setActiveFilter] = useState('recent');

    const fetchQuestions = async () => {
        try {
            const response = await Api.getAllQuestionsApi();
            if (response.status === 200) {
                const data = await response.json();
                const questionsWithDetails = await Promise.all(
                    data.map(async (question) => {
                        try {
                            const userResponse = await Api.getUserById(question.author);
                            if (userResponse.status === 200) {
                                const userData = await userResponse.json();
                                return {
                                    ...question,
                                    authorName: userData.username,
                                };
                            }
                        } catch (error) {
                            console.error('Error fetching question user:', error);
                        }
                        return question;
                    })
                );
                setSortedQuestions(questionsWithDetails);
                setQuestions(questionsWithDetails);
            } else {
                throw new Error('Failed to fetch questions');
            }
        } catch (error) {
            console.error('Error:', error);
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

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        handleFilterRecent();
    }, [questions]);

    return (
        <>
            <Topbar />
            <section className="main-content">
                <div className="table-container">
                    <div className="filter-label">
                        <p><i className="fa fa-filter"></i> <strong> Filters:</strong></p>
                    </div>
                    <div className="filter-buttons">
                        <button id="filter-hot" className={`btn btn-outline-primary ${activeFilter === 'hot' ? 'btn-active' : ''}`} onClick={handleFilterHot}>
                            <i className="fa fa-fire"></i> Hot
                        </button>
                        <button id="filter-mostAnswered" className={`btn btn-outline-primary ${activeFilter === 'mostAnswered' ? 'btn-active' : ''}`} onClick={handleFilterMostAnswered}>
                            <i className="fa fa-trophy"></i> Most Answered
                        </button>
                        <button id="filter-recent" className={`btn btn-outline-primary ${activeFilter === 'recent' ? 'btn-active' : ''}`} onClick={handleFilterRecent}>
                            <i className="fa fa-clock"></i> Most Recent
                        </button>
                    </div>
                    <table className="table">
                        <colgroup>
                            <col style={{ width: '70%' }} />
                            <col style={{ width: '15%' }} /> 
                            <col style={{ width: '15%' }} />
                        </colgroup>
                        <tbody>
                            {sortedQuestions.map(question => (
                                <tr key={question._id} data-date={new Date(question.created).toISOString()}>
                                    <td>
                                        <Link to={`/questions/${question._id}`} className="question-title">{question.title}</Link>
                                        <div className="mt-2">
                                            {question.tags.map(tag => (
                                                <span key={tag} className="badge bg-dark">{tag}</span>
                                            ))}
                                        </div>
                                        <div className="user-info mt-2">
                                            Asked by {question.authorName} on {new Date(question.created).toLocaleString()}
                                        </div>
                                    </td>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
};

export default QuestionsList;