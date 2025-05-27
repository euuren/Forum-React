import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import Api from '../../helpers/Api';
import '../QuestionEdit/styles.css';

const EditQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    tags: '',
    author: ''
  });

  const fetchQuestion = async () => {
    try {
      const response = await Api.getQuestionById(id);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.question.title,
          body: data.question.body,
          author: data.question.author,
          tags: Array.isArray(data.question.tags) ? data.question.tags.join(', ') : ''
        });
      } else {
        console.error('Failed to fetch question');
      }
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  useEffect(() => {
    fetchQuestion();
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
    try {
      const response = await Api.updateQuestion(id, {
        title: formData.title,
        body: formData.body,
        tags: formData.tags 
      });
      if (response.ok) {
        navigate(`/users/${formData.author}/myquestions`);
      } else {
        console.error('Failed to update question');
        const errorData = await response.json();
        console.error(errorData);
      }
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleCancel = () => {
    navigate(`/users/${formData.author}/myquestions`);
  };

  return (
    <div className="edit-question-page" style={{ padding: '25px' }}>
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
              value={formData.title}
              onChange={handleChange}
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
              value={formData.body}
              onChange={handleChange}
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
              value={formData.tags}
              onChange={handleChange}
              required
              placeholder="Enter tags separated by commas (e.g. A, B, C)"
            />
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary submit-btn">
              Edit
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

export default EditQuestion;