const {
  Quiz,
  createQuizValidation,
  updateQuizValidation,
} = require("../models/quizModel");
const asyncHandler = require("express-async-handler");

/**
 * @desc Get all quizzes
 * @route GET /api/quizzes
 * @access Private
 */
const getAllQuizzes = asyncHandler(async (req, res) => {
  const { rule, limit, leastAnswered } = req.query;

  const filter = {};
  if (rule) {
    filter.rule = rule;
  }

  let query = Quiz.find(filter);

  // ترتيب تلقائي من الأقل حلًا للأكثر
  query = query.sort({ timesAnswered: 1 });

  // تحديد عدد النتائج لو المستخدم بعت limit
  if (limit) {
    query = query.limit(Number(limit));
  }

  const quizzes = await query.exec();

  res.status(200).json(quizzes);
});

/**
 * @desc Get a quiz by ID
 * @route GET /api/quizzes/:id
 * @access Private
 */
const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    return res.status(404).json({ message: "الكويز غير موجود" });
  }
  res.status(200).json(quiz);
});

/**
 * @desc Create a new quiz
 * @route POST /api/quizzes
 * @access Private
 */
const createQuiz = asyncHandler(async (req, res) => {
  const { error } = createQuizValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // التأكد لو فيه كويز بنفس السؤال
  let quiz = await Quiz.findOne({ question: req.body.question });

  if (!quiz) {
    quiz = new Quiz({
      ...req.body,
      timesAnswered: req.body.timesAnswered || 0,
      lastAnsweredAt: req.body.lastAnsweredAt || null,
    });

    await quiz.save();
  }

  res.status(201).json(quiz);
});

/**
 * @desc    Create multiple quizzes at once (bulk insert)
 * @route   POST /api/quizzes/bulk
 * @access  Private
 */

const createManyQuizzes = asyncHandler(async (req, res) => {
  const quizzes = req.body;

  if (!Array.isArray(quizzes) || quizzes.length === 0) {
    return res.status(400).json({ message: "لازم تبعت مصفوفة فيها كويزات" });
  }

  const inserted = [];
  const skipped = [];

  for (const quizData of quizzes) {
    const { error } = createQuizValidation(quizData);
    if (error) {
      skipped.push({
        question: quizData.question,
        reason: error.details[0].message,
      });
      continue;
    }

    const exists = await Quiz.findOne({ question: quizData.question });
    if (exists) {
      skipped.push({
        question: quizData.question,
        reason: "الكويز موجود بالفعل",
      });
      continue;
    }

    const quiz = new Quiz({
      ...quizData,
      timesAnswered: quizData.timesAnswered || 0,
      lastAnsweredAt: quizData.lastAnsweredAt || null,
    });

    await quiz.save();
    inserted.push(quiz);
  }

  res.status(201).json({
    message: "تمت المعالجة",
    addedCount: inserted.length,
    skippedCount: skipped.length,
    skipped,
  });
});


/**
 * @desc Update a quiz
 * @route PUT /api/quizzes/:id
 * @access Private
 */
const updateQuiz = asyncHandler(async (req, res) => {
  const { error } = updateQuizValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    return res.status(404).json({ message: "الكويز غير موجود" });
  }

  // التحديث بناءً على القيم اللي جاية من الـ body
  Object.assign(quiz, req.body);

  const updatedQuiz = await quiz.save();
  res.status(200).json(updatedQuiz);
});

/**
 * @desc Delete a quiz
 * @route DELETE /api/quizzes/:id
 * @access Private
 */
const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);
  if (!quiz) {
    return res.status(404).json({ message: "الكويز غير موجود" });
  }
  res.status(200).json({ message: "تم حذف الكويز بنجاح" });
});

/**
 * @desc Get all unique quiz rules with question count
 * @route GET /api/quizzes/rules
 * @access Private
 */
const getAllRules = asyncHandler(async (req, res) => {
  const rules = await Quiz.aggregate([
    {
      $group: {
        _id: "$rule",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        rule: "$_id",
        count: 1,
        _id: 0,
      },
    },
    {
      $sort: { count: -1 }, // ✅ ترتيب تنازلي حسب عدد الأسئلة
    },
  ]);

  res.status(200).json(rules);
});

module.exports = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  createManyQuizzes,
  updateQuiz,
  deleteQuiz,
  getAllRules,
};
