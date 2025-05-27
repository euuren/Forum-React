const {
    updateUser,
    getUserById,
    getUserByEmail,
    getQuestionsByAuthor,
    getAnswersByAuthor,
    getQuestionById,
} = require("../lib/database");

const jwt = require("jsonwebtoken");
const JWT_SECRET = "0000";

const updateAUserJSON = async (req, res) => {
    const userId = req.params.id;
    const { username, email, bio } = req.body;
    const currentUser = await getUserById(userId);
    const profileImage = req.file ? `/uploads/${req.file.filename}` : currentUser.profileImage;

    console.log("Uploaded file:", req.file);
    console.log("Form data:", { username, email, bio, profileImage });

    if (!username || !email || !bio) {
        return res.status(400).send("Missing form data");
    }
    await updateUser(userId, { username, email, bio, profileImage });
    res.status(204).send();
};

const getAUserByIdJSON = async (req, res) => {
    const userId = req.params.id;
    const user = await getUserById(userId);
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.status(200).json(user);
};

const loginHandler = async (req, res) => {
    const { email, password } = req.body;
    const foundUser = await getUserByEmail(email);
    if (foundUser && foundUser.password === password) {
        const userDetails = { uid: foundUser._id }
        const accessToken = jwt.sign(userDetails, JWT_SECRET, { expiresIn: "12h" });
        res.json({accessToken, userDetails});
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
};

function requireAuthJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                //most likely token expired
                res.sendStatus(401);
                return;
            }
        });
    } else { res.sendStatus(401); }
}

const getAllMyQuestionsJSON = async (req, res) => {
    const questions = await getQuestionsByAuthor(req.user.uid);
    if (!questions) {
        return res.status(404).send("User not found");
    }
    if (questions.length === 0) {  
        return res.status(404).send("No questions found for this user.");
    }
    const author = await getUserById(req.user.uid);
    if (!author) {
        return res.status(404).send("Author not found");
    }
    res.status(200).json({ questions, author });
}

const getAllMyAnswersJSON = async (req, res) => {
    const answers = await getAnswersByAuthor(req.user.uid);
    if (!answers) {
        return res.status(404).send("User not found");
    }
    if (answers.length === 0) {
        return res.status(404).send("No answers found for this user.");
    }
    const author = await getUserById(req.user.uid);
    if (!author) {
        return res.status(404).send("Author not found");
    }

    const questions = [];
    for (const answer of answers) {
        const question = await getQuestionById(answer.questionId);
        if (question) {
            questions.push(question.title);
        } else {
            questions.push("Unknown Question");
        }
    } 
    res.status(200).json({ answers, author, questions });
};

module.exports = {
    updateAUserJSON,
    loginHandler,
    requireAuthJWT,
    getAUserByIdJSON,
    getAllMyQuestionsJSON,
    getAllMyAnswersJSON,
};