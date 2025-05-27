import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import Api from '../../helpers/Api';

const AnswerEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        body: '',
        author: ''
    });
    const [question, setQuestion] = useState({
        title: '',
        body: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchAnswer = async () => {
        try {
            const response = await Api.getAnswerById(id);
            if (response.ok) {
                const data = await response.json();
                setFormData({
                    body: data.answer.body,
                    author: data.answer.author
                });
                setQuestion({
                    title: data.question.title,
                    body: data.question.body
                });
            }
        } catch (error) {
            console.error('Error fetching answer:', error);
        }
    };

    useEffect(() => {
        fetchAnswer();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.body.trim()) return;
        
        setIsSubmitting(true);
        try {
            const response = await Api.updateAnswer(id, {
                body: formData.body
            });
            if (response.ok) {
                navigate(`/users/${formData.author}/myanswers`, { 
                    state: { answerUpdated: true } 
                });
            }
        } catch (error) {
            console.error('Error updating answer:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="edit-answer-page">
            <Topbar />
            
            <main className="container mt-4" style={{ paddingTop: '80px' }}>
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                {/* Question Preview */}
                                {question.title && (
                                    <div className="question-preview mb-4 p-3">
                                        <h3 className="h4 mb-3 fw-bold text-primary">{question.title}</h3>
                                        <div className="text-muted mb-3">
                                            <div dangerouslySetInnerHTML={{ __html: question.body }} />
                                        </div>
                                    </div>
                                )}

                                {/* Answer Form */}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="body" className="form-label fw-bold fs-5">
                                            Your Answer
                                        </label>
                                        <textarea
                                            className="form-control p-3"
                                            id="body"
                                            rows={10}
                                            name="body"
                                            value={formData.body}
                                            onChange={handleChange}
                                            required
                                            placeholder="Improve your answer here..."
                                            style={{ 
                                                minHeight: '200px',
                                                fontSize: '1rem',
                                                border: '1px solid #ced4da',
                                                borderRadius: '0.5rem'
                                            }}
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="d-flex justify-content-end gap-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/users/${formData.author}/myanswers`)}
                                            className="btn btn-outline-danger px-4 py-2"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary px-4 py-2"
                                            disabled={isSubmitting || !formData.body.trim()}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Updating...
                                                </>
                                            ) : (
                                                'Update Answer'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AnswerEdit;