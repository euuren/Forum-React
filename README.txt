Tan Eu Ren
A0282415H

Database Details:

questionSchema = {
    _id: hexstring,
    title: String,
    body: String,
    tags: [String],
    created: Date,
    votes: Int,
    answers: [ hexstring ],
    author: hexstring,
    upvotedBy: [ hexstring ],
    downvotedBy: [ hexstring ]
  }
]
}

answerSchema = {
    _id: hexstring,
    body: String,
    created: Date,
    votes: Int,
    questionId: hexstring,
    author: hexstring,
    upvotedBy: [ hexstring ],
    downvotedBy: [ hexstring ]
}

userSchema = {
    _id: hexstring,
    username: String,
    profileImage: url,
    email: String,
    password: String,
    created: Date,
    bio: String
}


NOTE: React Project is inside ExpressJS Project File

Instructions:
1. Ensure NodeJS is installed.
2. Open the Forum_Backend folder on VSCode.
3. Open a terminal, the terminal should show 'Forum_Backend %'
4. Enter 'npm install' on the terminal.
5. Open the Forum_Frontend folder on VSCode.
6. Open a terminal, the terminal should show 'Forum_Frontend %'
7. Enter 'npm install' on the terminal.
8. Ensure Docker and mongosh is downloaded.
9. Create and run a container on Docker.
10. Open a new terminal on vscode.
11. Enter 'mongosh'.
12. Enter 'use forum'.
13. Go back to the terminal initially opened in step 3.
14. Enter 'npm run server' to run backend server.
15. Go back to the terminal initially opened in step 6.
16. Enter 'npm run dev' to run frontend server.

Extra Features:
1. Search by tags
2. List of a user's questions
3. Filter a user's questions based on number of votes
4. Filter a user's questions based on number of answers
5. Filter a user's questions based on time
6. List of users answers
7. Filter a user's answers based on number of votes
8. Filter a user's answers based on time
9. Count of number of answers for each question displayed in main page and "single question with all its answers" page

