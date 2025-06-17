const express = require("express");
const GenerateQuizzes = require("../controllers/quizController");
const router = express.Router();

router.post("/", GenerateQuizzes);

module.exports = router;
