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
  getRandomMixedRulesQuizzes,
} = require("../controllers/quizController");

const router = express.Router();

// إضافة middleware للتحقق من الأخطاء
router.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// ✅ توليد كويز تلقائي
router.post("/", GenerateQuizzes);

// ✅ CRUD operations
router.get("/all", getAllQuizzes);
router.post("/create", createQuiz);
router.post("/bulk", createManyQuizzes);

// ✅ قواعد وأنواع الأسئلة (يجب أن تأتي قبل المسارات الديناميكية)
router.get("/rules", getAllRules);
// الحصول على أسئلة عشوائية من قواعد مختلفة
router.get("/random/mixed-rules", getRandomMixedRulesQuizzes);
// ✅ مسارات CRUD بالمعرف (تأتي في النهاية)
router.get("/:id", getQuizById);
router.put("/:id", updateQuiz);
router.delete("/:id", deleteQuiz);

// معالجة الأخطاء
router.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = router;
