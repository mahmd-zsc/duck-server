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
    "incorrectPlurals",
    "article",
    "examples",
    "type",
    "level",
    "isReviewed",
    "reviewCount",
    "synonyms",
    "antonyms",
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

module.exports = {
  createWord,
  getWordById,
  getAllWords,
  updateWord,
  deleteWord,
};
