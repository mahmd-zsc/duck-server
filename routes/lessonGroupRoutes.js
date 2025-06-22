const express = require("express");
const router = express.Router();

const {
  getAllLessonGroups,
  getLessonGroupById,
  createLessonGroup,
  updateLessonGroup,
  deleteLessonGroup,
} = require("../controllers/lessonGroupController");



// ✅ Get all lesson groups
router.get("/", getAllLessonGroups);

// ✅ Get single lesson group by ID
router.get("/:id", getLessonGroupById);

// ✅ Create new lesson group
router.post("/", createLessonGroup);

// ✅ Update lesson group by ID
router.put("/:id", updateLessonGroup);

// ✅ Delete lesson group by ID
router.delete("/:id", deleteLessonGroup);

module.exports = router;
