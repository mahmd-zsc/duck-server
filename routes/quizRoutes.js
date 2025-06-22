const express = require("express");
const GenerateQuizzes = require("../utils/quizGeneratorCtrl");
const {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getAllRules,
  createManyQuizzes,
} = require("../controllers/quizController");

const router = express.Router();

// ✅ توليد كويز تلقائي
router.post("/", GenerateQuizzes);

// ✅ CRUD
router.get("/all", getAllQuizzes);
router.get("/:id", getQuizById);
router.post("/create", createQuiz);
router.post("/bulk", createManyQuizzes); 
router.put("/:id", updateQuiz);
router.delete("/:id", deleteQuiz);

// ✅ قواعد وأنواع الأسئلة
router.get("/rules", getAllRules);



module.exports = router;
