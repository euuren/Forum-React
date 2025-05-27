import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Api from '../../helpers/Api'; 
import Topbar from '../../components/Topbar';

const SubmitAnswer = () => {
  const { id = 0 } = useParams();
  const navigate = useNavigate();
  const [answerBody, setAnswerBody] = useState('');
  const [question, setQuestion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuestion = async () => {
    try {
      const response = await Api.getQuestionById(id);
      if (response.ok) {
        const data = await response.json();
        setQuestion(data.question);
      }
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!answerBody.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await Api.createAnswer(id, { body: answerBody });
      if (response.ok) {
        navigate(`/questions/${id}`, { state: { answerSubmitted: true } });
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submit-answer-page">
      <Topbar />
      
      <main className="container mt-4" style={{ paddingTop: '80px' }}>
        <div className="row justify-content-center">
          <div className="col-lg-8" style={{ minWidth: '600px' }}>
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                
                {/* Question Preview */}
                {question && (
                  <div className="question-preview mb-4 p-3">
                    <h3 className="h4 mb-3 text-primary">{question.title}</h3>
                    <div className="text-muted mb-3">
                      <div dangerouslySetInnerHTML={{ __html: question.body }} />
                    </div>
                    <div className="text-end small text-muted">
                      Asked on {new Date(question.created).toLocaleDateString()}
                    </div>
                  </div>
                )}

                {/* Answer Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="answerBody" className="form-label fw-bold fs-5">
                      Your Answer
                    </label>
                    <textarea
                      id="answerBody"
                      className="form-control p-3"
                      rows={10}
                      value={answerBody}
                      onChange={(e) => setAnswerBody(e.target.value)}
                      required
                      placeholder="Write your answer here... Be specific and provide details."
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
                      onClick={() => navigate(`/questions/${id}`)}
                      className="btn btn-outline-danger px-4 py-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary px-4 py-2"
                      disabled={isSubmitting || !answerBody.trim()}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Posting...
                        </>
                      ) : (
                        'Post Your Answer'
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

export default SubmitAnswer;