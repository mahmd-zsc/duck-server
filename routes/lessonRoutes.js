const express = require("express");
const router = express.Router();
const {
  createLesson,
  getLessonById,
  getAllLessons,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");


router.post("/", createLesson);


router.get("/:id", getLessonById);


router.get("/", getAllLessons);


router.put("/:id", updateLesson);


router.delete("/:id", deleteLesson);

module.exports = router;
