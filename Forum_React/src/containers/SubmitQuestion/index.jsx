import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import Api from '../../helpers/Api';
import '../SubmitQuestion/styles.css';

const SubmitQuestion = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await Api.createQuestion({
        title,
        body,
        tags
      });
      if (response.ok) {
        navigate('/questions');
      } else {
        console.error('Failed to submit question');
        const errorData = await response.json();
        console.error(errorData);
      }
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  const handleCancel = () => {
    navigate('/questions');
  };

  return (
    <div className="submit-question-page">
      <Topbar />
      <div className="container mt-5">
        <form onSubmit={handleSubmit} className="question-form">
          {/* Question Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control full-width-input"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter your question title"
            />
          </div>
          <p></p>
          {/* Question Body */}
          <div className="form-group">
            <label htmlFor="body" className="form-label">
              Question Body
            </label>
            <textarea
              className="form-control full-width-input"
              id="body"
              name="body"
              rows="8"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              placeholder="Provide more details about your question"
            ></textarea>
          </div>
          <p></p>
          {/* Tags */}
          <div className="form-group">
            <label htmlFor="tags" className="form-label">
              Tags
            </label>
            <input
              type="text"
              className="form-control full-width-input"
              id="tags"
              name="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              required
              placeholder="Enter tags separated by commas (e.g. A, B, C)"
            />
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary submit-btn">
              Submit
            </button>
            <button 
              type="button" 
              onClick={handleCancel} 
              className="btn btn-outline-danger cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitQuestion;