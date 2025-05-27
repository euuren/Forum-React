const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");

const {
    updateAUserJSON,
    getAUserByIdJSON,
    getAllMyQuestionsJSON,
    getAllMyAnswersJSON,
} = require("../handlers/api_users.handlers");

router.get("/:id", getAUserByIdJSON);
router.put("/:id", upload.single("profileImage"), updateAUserJSON);
router.get("/:id/questions", getAllMyQuestionsJSON);
router.get("/:id/answers", getAllMyAnswersJSON);

module.exports = router;