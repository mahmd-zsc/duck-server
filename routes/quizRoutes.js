const express = require("express");
const GenerateQuizzes = require("../controllers/quizController");
const router = express.Router();

router.get("/", GenerateQuizzes);

module.exports = router;
