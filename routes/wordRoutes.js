const express = require("express");
const router = express.Router();

const {
  createWord,
  getWordById,
  getAllWords,
  updateWord,
  deleteWord,
  markWordsAsReviewed,
  updateReviewStats,
  getHardWords,
  getRecentWords,
  searchWords,
  getWordsByType,
  getUnreviewedWords,
  markWordsAsEasy,
  markWordsAsHard,
  getHardWordsCount,
  getWordsNeedingReview,
  markWordsAsImportant, // أضف هذا الاستيراد
  markWordsAsUnimportant, // أضف هذا الاستيراد
  getImportantWords, // أضف هذا الاستيراد
} = require("../controllers/wordController");

// --- CRUD Routes ---
router.post("/", createWord);
router.get("/", getAllWords);
router.get("/needs-review", getWordsNeedingReview);
router.get("/:id", getWordById);
router.put("/:id", updateWord);
router.delete("/:id", deleteWord);

// --- Batch Operations ---
router.patch("/batch/mark-reviewed", markWordsAsReviewed);
router.patch("/batch/review-stats", updateReviewStats);
router.patch("/batch/mark-hard", markWordsAsHard);
router.patch("/batch/mark-easy", markWordsAsEasy);
router.patch("/batch/mark-important", markWordsAsImportant); // أضف هذا المسار
router.patch("/batch/mark-unimportant", markWordsAsUnimportant); // أضف هذا المسار

// --- Extra Utility Routes ---
router.get("/filter/hard", getHardWords); // الكلمات الصعبة
router.get("/filter/unreviewed", getUnreviewedWords); // الكلمات غير المراجَعة
router.get("/filter/important", getImportantWords); // أضف هذا المسار للكلمات المهمة
router.get("/filter/recent", getRecentWords); // أحدث الكلمات
router.get("/search", searchWords); // البحث بالكلمة أو المعنى
router.get("/type/:type", getWordsByType); // حسب نوع الكلمة (noun, verb, ...)
router.get("/hard/count", getHardWordsCount);

module.exports = router;
