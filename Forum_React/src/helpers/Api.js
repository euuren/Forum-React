// api.js - Consolidated API helper for the application
const SERVER_PREFIX = "http://localhost:3000/api";

const Api = {
  getAllQuestionsApi() {
    return fetch(`${SERVER_PREFIX}/questions`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          }
    });
  },
  
  getQuestionById(id) {
    return fetch(`${SERVER_PREFIX}/questions/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
    });
  },
  
  createQuestion(data) {
    return fetch(`${SERVER_PREFIX}/questions`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  
  updateQuestion(id, data) {
    return fetch(`${SERVER_PREFIX}/questions/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      method: "PUT",
      body: JSON.stringify(data)
    });
  },
  
  deleteQuestion(id) {
    return fetch(`${SERVER_PREFIX}/questions/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      method: "DELETE"
    });
  },
  
  upvoteQuestion(id) {
    return fetch(`${SERVER_PREFIX}/questions/${id}/upvote`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      method: "PUT"
    });
  },
  
  downvoteQuestion(id) {
    return fetch(`${SERVER_PREFIX}/questions/${id}/downvote`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      method: "PUT"
    });
  },
  
  getQuestionsByAuthor(userId) {
    return fetch(`${SERVER_PREFIX}/users/${userId}/questions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
  },

  getAnswerById(id) {
    return fetch(`${SERVER_PREFIX}/answers/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
  },
  
  createAnswer(questionId, data) {
    return fetch(`${SERVER_PREFIX}/questions/${questionId}/answers`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  
  updateAnswer(id, data) {
    return fetch(`${SERVER_PREFIX}/answers/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      method: "PUT",
      body: JSON.stringify(data)
    });
  },
  
  deleteAnswer(id) {
    return fetch(`${SERVER_PREFIX}/answers/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      method: "DELETE"
    });
  },
  
  upvoteAnswer(id) {
    return fetch(`${SERVER_PREFIX}/answers/${id}/upvote`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      method: "PUT"
    });
  },
  
  downvoteAnswer(id) {
    return fetch(`${SERVER_PREFIX}/answers/${id}/downvote`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      method: "PUT"
    });
  },
  
  getAnswersByAuthor(userId) {
    return fetch(`${SERVER_PREFIX}/users/${userId}/answers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
  },

  getUserById(userId) {
    console.log(`Fetching user from: ${SERVER_PREFIX}/users/${userId}`);
    return fetch(`${SERVER_PREFIX}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
  },
  
  updateUser(id, data) {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    
    return fetch(`${SERVER_PREFIX}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      method: "PUT",
      body: formData
    });
  },
  
  login(credentials) {
    return fetch(`${SERVER_PREFIX}/login`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(credentials)
    });
  },

  register(credentials) {
    return fetch(`${SERVER_PREFIX}/register`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(credentials)
    });
  },
  
  getUserQuestions(userId) {
    return fetch(`${SERVER_PREFIX}/users/${userId}/questions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
  },
  
  getUserAnswers(userId) {
    return fetch(`${SERVER_PREFIX}/users/${userId}/answers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
  },

  searchApi(query) {
    return fetch(`${SERVER_PREFIX}/search?q=${query}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
  }
};

export default Api;