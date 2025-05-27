const { 
    getUserById,
    getQuestionById,
    updateAnswer,
    deleteAnswer,
    getAnswerById,
    updateAnswerVotes,
    addAnswerUpvotedBy,
    removeAnswerUpvotedBy,
    addAnswerDownvotedBy,
    removeAnswerDownvotedBy
} = require("../lib/database");

const getAnAnswerByIdJSON = async (req, res) => {
    const answerId = req.params.id;

    try {
        const answer = await getAnswerById(answerId);
        if (!answer) {
            return res.status(404).send("Answer not found");
        }

        const author = await getUserById(answer.author);
        if (!author) {
            return res.status(404).send("Author not found");
        }

        const question = await getQuestionById(answer.questionId);
        if (!question) {
            return res.status(404).send("Question not found");
        }

        res.status(200).json({ answer, author, question });
    } catch (error) {
        console.error("Error fetching answer:", error);
        res.status(500).send("Internal Server Error");
    }
}

const editAnswerJSON = async (req, res) => {
    const answerId = req.params.id;

    try {
        const answer = await getAnswerById(answerId);
        if (!answer) {
            return res.status(404).send("Answer not found");
        }

        const { body } = req.body;
        if (!body) {
            return res.status(400).send("Answer body is required");
        }

        const answerData = {
            body,
        };

        await updateAnswer(answerId, answerData);
        res.status(204).send();
    } catch (error) {
        console.error("Error editing answer:", error);
        res.status(500).send("Internal Server Error");
    }
};

const deleteAnAnswerJSON = async (req, res) => {
    try {
        const answerId = req.params.id;

        const answer = await getAnswerById(answerId);
        if (!answer) {
            return res.status(404).send("Answer not found");
        }

        await deleteAnswer(answerId);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting answer:", error);
        res.status(500).send("Internal Server Error");
    }
};

const upvoteAnswerJSON = async (req, res) => {
    const answerId = req.params.id;
    const userId = req.user.uid;
    try {
        const answer = await getAnswerById(answerId);
        if (!answer) {
            return res.status(404).send("Answer not found");
        }

        if (answer.upvotedBy.includes(userId)) {
            return res.status(400).send("You have already upvoted this answer.");
        } else if (answer.downvotedBy.includes(userId)) {
            answer.votes += 1;
            await removeAnswerDownvotedBy(answerId, userId);
        } else {
            answer.votes += 1;
            await addAnswerUpvotedBy(answerId, userId);
        }
        const updatedQuestion = await updateAnswerVotes(answerId, answer);
        res.status(200).json(updatedQuestion);
    } catch (error) {
        console.error("Error upvoting answer:", error);
        res.status(500).send("Internal Server Error");
    }
}

const downvoteAnswerJSON = async (req, res) => {
    const answerId = req.params.id;
    const userId = req.user.uid;
    try {
        const answer = await getAnswerById(answerId);
        if (!answer) {
            return res.status(404).send("Answer not found");
        }

        if (answer.downvotedBy.includes(userId)) {
            return res.status(400).send("You have already downvoted this answer.");
        } else if (answer.upvotedBy.includes(userId)) {
            answer.votes -= 1;
            await removeAnswerUpvotedBy(answerId, userId);
        } else {
            answer.votes -= 1;
            await addAnswerDownvotedBy(answerId, userId);
        }
        const updatedQuestion = await updateAnswerVotes(answerId, answer);
        res.status(200).json(updatedQuestion);
    } catch (error) {
        console.error("Error downvoting answer:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    deleteAnAnswerJSON,
    editAnswerJSON,
    upvoteAnswerJSON,
    downvoteAnswerJSON,
    getAnAnswerByIdJSON,
};