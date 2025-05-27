const { 
    insertQuestion, 
    getQuestionById,
    getUserById,
    updateQuestion,
    deleteQuestion,
    insertAnswer,
    addAnswerToQuestion,
    getAnswerById,
    deleteAnswer,
    updateQuestionVotes,
    addQuestionUpvotedBy,
    removeQuestionUpvotedBy,
    addQuestionDownvotedBy,
    removeQuestionDownvotedBy,
    getAllQuestions,
} = require("../lib/database");

const newQuestionJSON = async (req, res) => {
    const { title, body, tags } = req.body;
    if (!title || !body || !tags) {
        return res.status(400).send("All fields (title, body, tags) are required.");
    }

    try {
        const tagsArray = tags.split(",").map(tag => tag.trim());
        const user = await getUserById(req.user.uid);

        const questionData = {
            title,
            body,
            tags: tagsArray,
            created: new Date(),
            votes: 0,
            answers: [],
            author: req.user.uid,
            upvotedBy: [],
            downvotedBy: [],
        };

        console.log("Question data:", questionData);

        const question = await insertQuestion(questionData);
        res.status(201).json(question);
    } catch (error) {
        console.error("Error creating question:", error);
        res.status(500).send("Internal Server Error");
    }
};

const getAllQuestionsJSON = async (req, res) => {
    const questions = await getAllQuestions();
    if (!questions) {
        return res.status(404).send("No questions found");
    }
    res.status(200).json(questions);
};

const getAQuestionByIdJSON = async (req, res) => {
    const questionId = req.params.id;

    try {
        const question = await getQuestionById(questionId);
        if (!question) {
            return res.status(404).send("Question not found");
        }

        const answers = [];
        for (const answerId of question.answers) {
            const answerIdStr = answerId.toString();
            const answer = await getAnswerById(answerIdStr);
            const answerAuthor = await getUserById(answer.author);
            answer.author = answerAuthor;
            if (answer) {
                answers.push(answer);
            }
        }
        res.status(200).json({ question, answers });
    } catch (error) {
        console.error("Error fetching question:", error);
        res.status(500).send("Internal Server Error");
    }
};

const editQuestionJSON = async (req, res) => {
    const questionId = req.params.id;

    try {
        const question = await getQuestionById(questionId);
        if (!question) {
            return res.status(404).send("Question not found");
        }

        const { title, body, tags } = req.body;
        if (!title || !body || !tags) {
            return res.status(400).send("All fields (title, body, tags) are required.");
        }

        const tagsArray = tags.split(",").map(tag => tag.trim());
        const questionData = {
            title,
            body,
            tags: tagsArray,
        };

        await updateQuestion(questionId, questionData);
        res.status(204).send();
    } catch (error) {
        console.error("Error editing question:", error);
        res.status(500).send("Internal Server Error");
    }
};

const deleteAQuestionJSON = async (req, res) => {
    const questionId = req.params.id;

    try {
        const question = await getQuestionById(questionId);
        if (!question) {
            return res.status(404).send("Question not found");
        }
        for (const answerId of question.answers) {
            await deleteAnswer(answerId.toString());
        }

        await deleteQuestion(questionId);
        res.status(204).send();
        //res.redirect("/questions/list");
    } catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).send("Internal Server Error");
    }
};

const newAnswerJSON = async (req, res) => {
    const { body } = req.body;
    if (!body) {
        return res.status(400).send("Answer body is required.");
    }

    try {
        const question = await getQuestionById(req.params.id);
        if (!question) {
            return res.status(404).send("Question not found");
        }
        const user = await getUserById(req.user.uid);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const answerData = {
            body,
            created: new Date(),
            votes: 0,
            questionId: req.params.id,
            author: req.user.uid,
            upvotedBy: [],
            downvotedBy: [],
        };

        console.log("Answer data:", answerData);

        const answer = await insertAnswer(answerData);
        await addAnswerToQuestion(req.params.id, answer.insertedId);
        res.status(201).json(answer);
    } catch (error) {
        console.error("Error creating answer:", error);
        res.status(500).send("Internal Server Error");
    }
};

const upvoteQuestionJSON = async (req, res) => {
    const questionId = req.params.id;
    const userId = req.user.uid;
    try {
        const question = await getQuestionById(questionId);
        if (!question) {
            return res.status(404).send("Question not found");
        }

        if (question.upvotedBy.includes(userId)) {
            return res.status(400).send("You have already upvoted this question.");
        } else if (question.downvotedBy.includes(userId)) {
            question.votes += 1;
            await removeQuestionDownvotedBy(questionId, userId);
        } else {
            question.votes += 1;
            await addQuestionUpvotedBy(questionId, userId);
        }

        updatedQuestion = await updateQuestionVotes(questionId, question);
        res.status(200).json(updatedQuestion);
    } catch (error) {
        console.error("Error upvoting question:", error);
        res.status(500).send("Internal Server Error");
    }
};

const downvoteQuestionJSON = async (req, res) => {
    const questionId = req.params.id;
    const userId = req.user.uid;

    try {
        const question = await getQuestionById(questionId);
        if (!question) {
            return res.status(404).send("Question not found");
        }

        if (question.downvotedBy.includes(userId)) {
            return res.status(400).send("You have already downvoted this question.");
        } else if (question.upvotedBy.includes(userId)) {
            question.votes -= 1;
            await removeQuestionUpvotedBy(questionId, userId);
        } else {
            question.votes -= 1;
            await addQuestionDownvotedBy(questionId, userId);
        }

        updatedQuestion = await updateQuestionVotes(questionId, question);
        res.status(200).json(updatedQuestion);
    } catch (error) {
        console.error("Error downvoting question:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    newQuestionJSON,
    getAQuestionByIdJSON,
    editQuestionJSON,
    deleteAQuestionJSON,
    newAnswerJSON,
    upvoteQuestionJSON,
    downvoteQuestionJSON,
    getAllQuestionsJSON,
};