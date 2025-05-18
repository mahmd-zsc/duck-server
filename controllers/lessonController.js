const asyncHandler = require("express-async-handler");
const {
  Lesson,
  createLessonValidation,
  updateLessonValidation,
} = require("../models/lessonModel");
const { Word } = require("../models/wordModel");

/**
 * @desc Create a new lesson
 * @route POST /api/lessons
 * @access Private
 */
const createLesson = asyncHandler(async (req, res) => {
  const { title, level, color, emoji } = req.body;

  // تحقق من الـ validation
  const { error } = createLessonValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const lesson = new Lesson({
    title,
    level,
    color,
    emoji,
  });

  await lesson.save();
  res.status(201).json(lesson);
});

/**
 * @desc Get a single lesson by ID
 * @route GET /api/lessons/:id
 * @access Private
 */
const getLessonById = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id).populate("words");

  if (!lesson) {
    return res.status(404).json({ message: "الدرس غير موجود" });
  }

  const totalWords = lesson.words.length;
  const reviewedWords = lesson.words.filter((word) => word.isReviewed).length;

  // نحسب النسبة بالمية
  const reviewedPercentage =
    totalWords > 0 ? Math.round((reviewedWords / totalWords) * 100) : 0;

  const response = {
    ...lesson.toObject(),
    wordsNumber: totalWords,
    reviewedPercentage,
  };

  res.status(200).json(response);
});

/**
 * @desc   Get all lessons
 * @route  GET /api/lessons
 * @access Private
 */
const getAllLessons = asyncHandler(async (req, res) => {
  // جيب كل الدروس
  const lessons = await Lesson.find();

  if (!lessons || lessons.length === 0) {
    return res.status(404).json({ message: "لا توجد دروس" });
  }

  // احسب عدد الكلمات الحقيقي لكل درس
  const lessonsWithWordsCount = await Promise.all(
    lessons.map(async (lesson) => {
      // شيل أي تكرار في الـ IDs عشان العد يكون أدق
      const uniqueWordIds = [...new Set(lesson.words.map(String))];

      // عدّ الكلمات اللي لسه موجودة فعلياً في الـ collection
      const realWordsNumber = await Word.countDocuments({
        _id: { $in: uniqueWordIds },
      });

      return {
        ...lesson.toObject(),
        wordsNumber: realWordsNumber,
      };
    })
  );

  res.status(200).json(lessonsWithWordsCount);
});
/**
 * @desc Update a lesson by ID
 * @route PUT /api/lessons/:id
 * @access Private
 */
const updateLesson = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, level, color, words, emoji } = req.body;

  // تحقق من الـ validation
  const { error } = updateLessonValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const lesson = await Lesson.findById(id);
  if (!lesson) {
    return res.status(404).json({ message: "الدرس غير موجود" });
  }

  lesson.title = title || lesson.title;
  lesson.level = level || lesson.level;
  lesson.color = color || lesson.color;
  lesson.words = words || lesson.words;
  lesson.emoji = emoji || lesson.emoji;

  await lesson.save();
  res.status(200).json(lesson);
});

/**
 * @desc Delete a lesson by ID
 * @route DELETE /api/lessons/:id
 * @access Private
 */
const deleteLesson = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const lesson = await Lesson.findById(id);
  if (!lesson) {
    return res.status(404).json({ message: "الدرس غير موجود" });
  }

  await Lesson.findByIdAndDelete(id); // ✅ حذف مباشر من الموديل

  res.status(200).json({ message: "تم حذف الدرس بنجاح" });
});

module.exports = {
  createLesson,
  getLessonById,
  getAllLessons,
  updateLesson,
  deleteLesson,
};
