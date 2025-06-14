const asyncHandler = require("express-async-handler");
const {
  Word,
  createWordValidation,
  updateWordValidation,
} = require("../models/wordModel");
const { Lesson } = require("../models/lessonModel");

/**
 * @desc Create a new word
 * @route POST /api/v1/words
 * @access Private
 */
const createWord = asyncHandler(async (req, res) => {
  const { lessonId, ...wordData } = req.body;
  const { error } = createWordValidation(wordData);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  let word = await Word.findOne({ word: wordData.word });

  if (!word) {
    word = new Word({
      ...wordData,
      isReviewed: wordData.isReviewed || false,
      reviewCount: wordData.reviewCount || 0,
      isHard: wordData.isHard || false,
    });
    await word.save();
  }

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    return res.status(404).json({ message: "الدرس غير موجود" });
  }

  if (!lesson.words.includes(word._id)) {
    lesson.words.push(word._id);
    await lesson.save();
  }

  res.status(200).json(word);
});

/**
 * @desc Get a word by ID
 * @route GET /api/v1/words/:id
 * @access Public
 */
const getWordById = asyncHandler(async (req, res) => {
  const word = await Word.findById(req.params.id);
  if (!word) {
    return res.status(404).json({ message: "الكلمة مش موجودة" });
  }
  res.status(200).json(word);
});

/**
 * @desc Get all words
 * @route GET /api/v1/words
 * @access Public
 */
const getAllWords = asyncHandler(async (req, res) => {
  const words = await Word.find();
  res.status(200).json(words);
});

/**
 * @desc Update a word
 * @route PUT /api/v1/words/:id
 * @access Private
 */
const updateWord = asyncHandler(async (req, res) => {
  const { error } = updateWordValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const word = await Word.findById(req.params.id);
  if (!word) {
    return res.status(404).json({ message: "الكلمة مش موجودة" });
  }

  // تحديث الحقول لو موجودة في req.body، لو مش موجودة يخلي القديم
  const fieldsToUpdate = [
    "word",
    "meaning",
    "pronunciation",
    "plural",
    "pluralPronunciation",
    "incorrectPlurals",
    "article",
    "examples",
    "type",
    "isReviewed",
    "reviewCount",
    "isHard",
    "lastReviewed",
    "synonyms",
    "antonyms",
    "conjugation",
  ];

  fieldsToUpdate.forEach((field) => {
    if (req.body[field] !== undefined) {
      word[field] = req.body[field];
    }
  });

  word.updatedAt = Date.now();

  await word.save();
  res.status(200).json(word);
});

/**
 * @desc Delete a word
 * @route DELETE /api/v1/words/:id
 * @access Private
 */
const deleteWord = asyncHandler(async (req, res) => {
  const word = await Word.findById(req.params.id);
  if (!word) {
    return res.status(404).json({ message: "الكلمة مش موجودة" });
  }

  await word.remove();
  res.status(200).json({ message: "تم حذف الكلمة بنجاح" });
});

/**
 * @desc Mark multiple words as hard (isHard = true)
 * @route PATCH /api/v1/words/batch/mark-hard
 * @access Private
 */
const markWordsAsHard = asyncHandler(async (req, res) => {
  const { wordIds } = req.body;

  if (!Array.isArray(wordIds) || wordIds.length === 0) {
    return res
      .status(400)
      .json({ message: "يجب إرسال مصفوفة تحتوي على معرفات الكلمات" });
  }

  const result = await Word.updateMany(
    { _id: { $in: wordIds }, isHard: { $ne: true } },
    { $set: { isHard: true, updatedAt: Date.now() } }
  );

  res.status(200).json({
    message: `تم تعيين ${result.modifiedCount} كلمة كصعبة`,
  });
});

/**
 * @desc Mark multiple words as easy (isHard = false)
 * @route PATCH /api/v1/words/batch/mark-easy
 * @access Private
 */
const markWordsAsEasy = asyncHandler(async (req, res) => {
  const { wordIds } = req.body;

  if (!Array.isArray(wordIds) || wordIds.length === 0) {
    return res
      .status(400)
      .json({ message: "يجب إرسال مصفوفة تحتوي على معرفات الكلمات" });
  }

  const result = await Word.updateMany(
    { _id: { $in: wordIds }, isHard: true },
    { $set: { isHard: false, updatedAt: Date.now() } }
  );

  res.status(200).json({
    message: `تم تعيين ${result.modifiedCount} كلمة كسهلة`,
  });
});

/**
 * @desc Mark multiple words as reviewed (isReviewed = true)
 * @route PATCH /api/v1/words/mark-reviewed
 * @access Private
 */
const markWordsAsReviewed = asyncHandler(async (req, res) => {
  const { wordIds } = req.body;

  if (!Array.isArray(wordIds) || wordIds.length === 0) {
    return res
      .status(400)
      .json({ message: "لابد من إرسال مصفوفة بها معرفات الكلمات" });
  }

  const result = await Word.updateMany(
    { _id: { $in: wordIds } },
    { $set: { isReviewed: true, updatedAt: Date.now() } }
  );

  res.status(200).json({
    message: `تم تعيين ${result.modifiedCount} كلمة كمراجَعة`,
  });
});

/**
 * @desc Increment review count and update lastReviewed for multiple words
 * @route PATCH /api/v1/words/review-stats
 * @access Private
 */
const updateReviewStats = asyncHandler(async (req, res) => {
  const { wordIds } = req.body;

  if (!Array.isArray(wordIds) || wordIds.length === 0) {
    return res
      .status(400)
      .json({ message: "لابد من إرسال مصفوفة بها معرفات الكلمات" });
  }

  const words = await Word.find({ _id: { $in: wordIds } });

  for (let word of words) {
    word.reviewCount = (word.reviewCount || 0) + 1;
    word.lastReviewed = new Date();
    word.updatedAt = new Date();
    await word.save();
  }

  res.status(200).json({
    message: `تم تحديث ${words.length} كلمة بالمراجعة`,
  });
});

/**
 * @desc    Get all hard words (isHard = true)
 * @route   GET /api/v1/words/hard
 * @access  Public
 */
const getHardWords = asyncHandler(async (req, res) => {
  const words = await Word.find({ isHard: true });
  res.status(200).json(words);
});

/**
 * @desc    Get all unreviewed words (isReviewed = false)
 * @route   GET /api/v1/words/unreviewed
 * @access  Public
 */
const getUnreviewedWords = asyncHandler(async (req, res) => {
  const words = await Word.find({ isReviewed: false });
  res.status(200).json(words);
});

/**
 * @desc    Get words by type (e.g. noun, verb...)
 * @route   GET /api/v1/words/type/:type
 * @access  Public
 */
const getWordsByType = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const words = await Word.find({ type });
  res.status(200).json(words);
});

/**
 * @desc    Search words by word or meaning (partial match)
 * @route   GET /api/v1/words/search?q=someText
 * @access  Public
 */
const searchWords = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ message: "يرجى إدخال كلمة للبحث" });
  }
  const regex = new RegExp(q, "i");
  const words = await Word.find({
    $or: [{ word: regex }, { meaning: regex }],
  });
  res.status(200).json(words);
});

/**
 * @desc    Get the most recent 20 words added
 * @route   GET /api/v1/words/recent
 * @access  Public
 */
const getRecentWords = asyncHandler(async (req, res) => {
  const words = await Word.find().sort({ createdAt: -1 }).limit(20);
  res.status(200).json(words);
});

/**
 * @desc Get the number of hard words
 * @route GET /api/v1/words/hard/count
 * @access Private
 */
const getHardWordsCount = asyncHandler(async (req, res) => {
  const count = await Word.countDocuments({ isHard: true });

  res.status(200).json({
    message: "تم إرجاع عدد الكلمات الصعبة بنجاح",
    count,
  });
});

/**
 * @desc Get words that need review based on custom logic
 * @route GET /api/v1/words/needs-review
 * @access Public
 */
const getWordsNeedingReview = asyncHandler(async (req, res) => {
  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const words = await Word.find({
    $or: [
      { isReviewed: true },
      { reviewCount: { $lt: 3 } },
      {
        lastReviewed: { $exists: true, $lt: new Date(now - THREE_DAYS_MS) },
      },
      {
        lastReviewed: { $exists: false },
      },
    ],
  });

  res.status(200).json({
    count: words.length,
    message: "تم جلب الكلمات اللي محتاجة مراجعة",
    words,
  });
});

module.exports = {
  createWord,
  getWordById,
  getAllWords,
  updateWord,
  deleteWord,
  markWordsAsHard,
  markWordsAsEasy,
  markWordsAsReviewed,
  updateReviewStats,
  getHardWords,
  getRecentWords,
  searchWords,
  getWordsByType,
  getUnreviewedWords,
  getHardWordsCount,
  getWordsNeedingReview,
};
