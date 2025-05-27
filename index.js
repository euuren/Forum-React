const express = require("express");
const bodyParser = require("body-parser");
const apiUsersRoutes = require("./routes/api_users.routes");
const apiQuestionsRoutes = require("./routes/api_questions.routes");
const apiAnswersRoutes = require("./routes/api_answers.routes");
const { loginHandler, requireAuthJWT } = require("./handlers/api_users.handlers");
const app = express();
const port = 3000;
const cors = require("cors");
const { search, insertUser } = require("./lib/database");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.post("/api/login", loginHandler);

const register = async (req, res) => {
    const userData = req.body;
    userData.profileImage = 'uploads/placeholder.jpg';
    console.log(userData);
    const user = await insertUser(userData);
    res.status(201).json(user);
};

app.post("/api/register", register);
app.use("/api/users", requireAuthJWT, apiUsersRoutes);
app.use("/api/questions", requireAuthJWT, apiQuestionsRoutes);
app.use("/api/answers", requireAuthJWT, apiAnswersRoutes);
app.use("/uploads", express.static("uploads"));
app.set("view engine", "ejs");

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/api/search", async (req, res) => {
    const searchQuery = req.query.q;
    
    if (!searchQuery) {
        return res.status(400).json({ error: "Enter search term!" });
    }

    const tags = searchQuery.split(",").map(tag => tag.trim());
    const questions = await search(tags);
    
    if (!questions || questions.length === 0) {
        return res.status(404).json({ error: "No questions found" });
    }
    
    res.status(200).json(questions);
});