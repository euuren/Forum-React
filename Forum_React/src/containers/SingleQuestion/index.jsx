import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import Api from '../../helpers/Api';

const SingleQuestion = () => {
  const { id = 0 } = useParams();
  const [question, setQuestion] = useState();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestion = async () => {
    try {
      const response = await Api.getQuestionById(id);
      if (response.status === 200) {
        const data = await response.json();
        console.log(data.question.author);
        const userResponse = await Api.getUserById(data.question.author);
        if (userResponse.status === 200) {
          const userData = await userResponse.json();
          setQuestion({
            ...data.question,
            authorName: userData.username,
            profileImage: userData.profileImage,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnswers = async () => {
    try {
      const response = await Api.getQuestionById(id);
      if (response.ok) {
        const data = await response.json();
        const answersWithDetails = await Promise.all(
          data.answers.map(async (answer) => {
            try {
              console.log(answer.author._id);
              const userResponse = await Api.getUserById(answer.author._id);
              if (userResponse.ok) {
                const userData = await userResponse.json();
                return {
                  ...answer,
                  authorName: userData.username,
                  authorProfileImage: userData.profileImage,
                };
              }
            } catch (error) {
              console.error('Error fetching answer user:', error);
            }
            return { ...answer, authorName: 'Unknown User' };
          })
        );
        setAnswers(answersWithDetails);
      }
    } catch (error) {
      console.error('Error fetching answers:', error);
    }
  };

  const handleVote = async (type, id, action) => {
    try {
      const response = action === 'upvote' 
        ? await Api[`upvote${type}`](id)
        : await Api[`downvote${type}`](id);
      
      if (response.ok) {
        const updatedItem = await response.json();
        if (type === 'Question') {
          setQuestion(prev => ({ ...prev, votes: updatedItem.votes }));
        } else {
          setAnswers(prev => 
            prev.map(answer => 
              answer._id === id ? { ...answer, votes: updatedItem.votes } : answer
            )
          );
        }
      }
    } catch (error) {
      console.error(`Error ${action} ${type.toLowerCase()}:`, error);
    }
  };

  useEffect(() => {
    fetchQuestion();
    fetchAnswers();
  }, [id]);

  if (loading) {
    return (
      <>
        <Topbar />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar />
      <div className="container py-4" style={{ maxWidth: '1200px', marginTop: '70px' }}>
        {/* Question Section */}
        <div className="card mb-5" style={{
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px'
        }}>
          <div className="card-body p-4">
            <div className="row">
              {/* Votes Column */}
              <div className="col-md-1 d-flex flex-column align-items-center pe-0">
                <button 
                  className="btn btn-outline-secondary btn-sm p-2 mb-1"
                  onClick={() => handleVote('Question', question._id, 'upvote')}
                >
                  <i className="fas fa-arrow-up fs-5"></i>
                </button>
                <div className="fs-4 fw-bold text-center my-1">{question.votes} Votes</div>
                <button 
                  className="btn btn-outline-secondary btn-sm p-2"
                  onClick={() => handleVote('Question', question._id, 'downvote')}
                >
                  <i className="fas fa-arrow-down fs-5"></i>
                </button>
              </div>

              {/* Content Column */}
              <div className="col-md-11 ps-4">
                <h1 className="mb-3 fw-bold text-primary">{question.title}</h1>
                <div className="mb-4" dangerouslySetInnerHTML={{ __html: question.body }} />
                
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {question.tags?.map((tag, index) => (
                    <span key={index} className="badge bg-dark">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <img
                      className="rounded-circle me-2"
                      src={question.profileImage}
                      alt="Profile"
                      width="40"
                      height="40"
                    />
                    <div>
                      <small className="text-muted d-block">Asked by</small>
                      <strong>{question.authorName}</strong>
                    </div>
                  </div>
                  <div className="text-muted">
                    <small>{new Date(question.created).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">{answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}</h2>
          <Link 
            to={`/questions/${question._id}/submitanswer`} 
            className="btn btn-primary"
          >
            <i className="fas fa-plus me-2"></i>Post Your Answer
          </Link>
        </div>

        {answers.length > 0 ? (
          answers.map((answer) => (
            <div key={answer._id} className="card mb-4" style={{
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              borderRadius: '8px'
            }}>
              <div className="card-body p-4">
                <div className="row">
                  {/* Votes Column */}
                  <div className="col-md-1 d-flex flex-column align-items-center pe-0">
                    <button 
                      className="btn btn-outline-secondary btn-sm p-2 mb-1"
                      onClick={() => handleVote('Answer', answer._id, 'upvote')}
                    >
                      <i className="fas fa-arrow-up fs-5"></i>
                    </button>
                    <div className="fs-4 fw-bold text-center my-1">{answer.votes} Votes</div>
                    <button 
                      className="btn btn-outline-secondary btn-sm p-2"
                      onClick={() => handleVote('Answer', answer._id, 'downvote')}
                    >
                      <i className="fas fa-arrow-down fs-5"></i>
                    </button>
                  </div>

                  {/* Content Column */}
                  <div className="col-md-11 ps-4">
                    <div className="mb-3" dangerouslySetInnerHTML={{ __html: answer.body }} />
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img
                          className="rounded-circle me-2"
                          src={answer.authorProfileImage}
                          alt="Profile"
                          width="40"
                          height="40"
                        />
                        <div>
                          <small className="text-muted d-block">Answered by</small>
                          <strong>{answer.authorName}</strong>
                        </div>
                      </div>
                      <div className="text-muted">
                        <small>{new Date(answer.created).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="fas fa-comment-slash text-muted" style={{ fontSize: '4rem' }}></i>
            </div>
            <h3 className="mb-3">No Answers Yet</h3>
            <p className="text-muted mb-4">Be the first to answer this question!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default SingleQuestion;