const express = require("express");
const router = express.Router();

const {
    newQuestionJSON,
    getAQuestionByIdJSON,
    editQuestionJSON,
    deleteAQuestionJSON,
    newAnswerJSON,
    upvoteQuestionJSON,
    downvoteQuestionJSON,
    getAllQuestionsJSON,
} = require("../handlers/api_questions.handlers");

router.post("/", newQuestionJSON);
router.get("/", getAllQuestionsJSON);
router.get("/:id", getAQuestionByIdJSON);
router.put("/:id", editQuestionJSON);
router.delete("/:id", deleteAQuestionJSON);
router.post("/:id/answers", newAnswerJSON);
router.put("/:id/upvote", upvoteQuestionJSON);
router.put("/:id/downvote", downvoteQuestionJSON);

module.exports = router;