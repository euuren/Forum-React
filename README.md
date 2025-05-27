# Forum System - React & ExpressJS

![Forum System](https://img.shields.io/badge/React-18.2.0-blue)
![Express](https://img.shields.io/badge/Express-4.18.2-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-red)

A Stack Overflow-inspired Q&A forum system built with modern web technologies.

## ✨ Features

### 👤 User Management
- ✅ User registration and authentication
- 🔐 Secure login/logout functionality
- 👤 Profile management:
  - Username
  - Email
  - Profile picture
  - Bio

### ❓ Question Management
- 📝 Create, read, update, delete questions
- 🔍 Advanced filtering and sorting:
  - Most recent questions
  - Trending ("Hot") questions
  - Filter by tags

### 💬 Answer Management
- ✍️ Post answers to questions
- 🔄 Edit existing answers
- 🗑️ Delete answers (author-only)

### ⬆️ Voting System
- 👍 Upvote/downvote questions and answers
- 🔄 Toggleable votes (change your vote)
- 🚫 Single vote per user per question/answer

## 🛠️ Tech Stack

| Component       | Technology       |
|-----------------|------------------|
| Frontend        | React 18         |
| Routing         | React Router v6  |
| State Management| React Context API|
| Backend         | Express.js       |
| Database        | MongoDB          |
| API             | RESTful          |

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local)
- npm

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/your-username/Forum-React.git

2. Install dependencies for both frontend and backend
   ```bash
   cd Forum-React
   npm install
   cd ../Forum_ExpressJS
   npm install
   
3. Configure environment variables
   ```env
   # Backend .env file
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key

4. Start the development servers

   ```bash
   # In backend directory
   npm start
    
   # In frontend directory
   npm start
