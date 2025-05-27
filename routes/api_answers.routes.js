const express = require("express");
const router = express.Router();

const {
    editAnswerJSON,
    deleteAnAnswerJSON,
    upvoteAnswerJSON,
    downvoteAnswerJSON,
    getAnAnswerByIdJSON,
} = require("../handlers/api_answers.handlers");

router.get("/:id", getAnAnswerByIdJSON);
router.put("/:id", editAnswerJSON);
router.delete("/:id", deleteAnAnswerJSON);
router.put("/:id/upvote", upvoteAnswerJSON);
router.put("/:id/downvote", downvoteAnswerJSON);

module.exports = router;