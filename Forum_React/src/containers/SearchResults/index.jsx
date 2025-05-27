import { Link, useLocation } from 'react-router-dom';
import '../SearchResults/styles.css';
import React, { useEffect, useState } from 'react';
import Api from '../../helpers/Api';
import Topbar from '../../components/Topbar';

const SearchResults = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortedQuestions, setSortedQuestions] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('q') || '';

    useEffect(() => {
        const fetchQuestions = async () => {
            // Immediately reset questions to avoid showing stale data
            setQuestions([]);
            setSortedQuestions([]);
            setLoading(true);

            try {
                const response = await Api.searchApi(searchQuery);
                if (response.ok) {
                    const data = await response.json();
                    setQuestions(data || []);
                    setSortedQuestions(data || []);
                } else {
                    console.error('Failed to fetch questions');
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                setLoading(false);
            }
        };

        if (searchQuery) {
            fetchQuestions();
        } else {
            setQuestions([]);
            setSortedQuestions([]);
            setLoading(false);
        }
    }, [searchQuery]);

    return (
        <div className="search-results-page">
            <Topbar />
            <section className="main-content">
                <div className="container">
                    <h2 className="mb-4">Search Results for: {searchQuery}</h2>

                    <div className="container">
                        {loading ? (
                            <div className="text-center my-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : sortedQuestions.length > 0 ? (
                            <table className="table">
                                <colgroup>
                                    <col style={{ width: '70%' }} />
                                    <col style={{ width: '15%' }} />
                                    <col style={{ width: '15%' }} />
                                </colgroup>
                                <tbody>
                                    {sortedQuestions.map(question => (
                                        <tr key={question._id}>
                                            <td>
                                                <Link to={`/questions/${question._id}`} className="question-title">{question.title}</Link>
                                                <div className="mt-2">
                                                    {question.tags?.map(tag => (
                                                        <span key={tag} className="badge bg-dark">{tag}</span>
                                                    ))}
                                                </div>
                                                <div className="user-info mt-2">
                                                    Asked by {question.authorUsername} on {new Date(question.created).toLocaleString()}
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
                                                    <div className="answers-count">{question.answers?.length || 0}</div>
                                                    <div className="count-label">Answers</div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="alert alert-info mt-4">
                                No questions found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SearchResults;
