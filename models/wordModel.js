const mongoose = require("mongoose");
const joi = require("joi");

// تعريف الـ Schema بتاع الكلمة
const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: [true, "الكلمة مطلوبة"],
    unique: true,
    maxlength: [30, "الكلمة لازم تكون أقل من 30 حرف"],
  },
  meaning: {
    type: String,
    required: [true, "المعنى مطلوب"],
  },
  pronunciation: {
    type: String,
    required: false,
    trim: true,
  },
  plural: {
    type: String,
    required: false,
    trim: true,
  },
  incorrectPlurals: {
    type: [String],
    required: false,
  },
  article: {
    type: String,
    required: false,
    enum: ["der", "die", "das"],
  },
  examples: {
    type: [
      {
        sentence: { type: String, required: true },
        meaning: { type: String, required: true },
      },
    ],
    required: [true, "أمثلة مطلوبة"],
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: "لازم يكون في أمثلة للكلمة",
    },
  },
  type: {
    type: String,
    enum: [
      "noun",
      "verb",
      "adjective",
      "pronoun",
      "adverb",
      "pronouns",
      "konjunktion",
    ],
    required: [true, "نوع الكلمة مطلوب"],
  },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: [true, "المستوى مطلوب"],
  },
  isReviewed: {
    type: Boolean,
    default: false,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  synonyms: {
    type: [
      {
        word: { type: String, required: true },
        meaning: { type: String, required: true },
      },
    ],
    required: false,
  },
  antonyms: {
    type: [
      {
        word: { type: String, required: true },
        meaning: { type: String, required: true },
      },
    ],
    required: false,
  },
});

// تعريف الـ Joi validation
const createWordValidation = (word) => {
  const schema = joi.object({
    word: joi.string().required().trim().max(30),
    meaning: joi.string().required().trim(),
    pronunciation: joi.string().optional().trim(),
    plural: joi.string().optional().trim(),
    incorrectPlurals: joi.array().items(joi.string()).optional(),
    article: joi.string().valid("der", "die", "das").optional(),
    examples: joi
      .array()
      .items(
        joi.object({
          sentence: joi.string().required(),
          meaning: joi.string().required(),
        })
      )
      .required(),
    type: joi
      .string()
      .valid(
        "noun",
        "verb",
        "adjective",
        "pronoun",
        "adverb",
        "pronouns",
        "konjunktion"
      )
      .required(),
    level: joi
      .string()
      .valid("beginner", "intermediate", "advanced")
      .required(),
    isReviewed: joi.boolean().optional(),
    reviewCount: joi.number().optional(),
    synonyms: joi
      .array()
      .items(
        joi.object({
          word: joi.string().required(),
          meaning: joi.string().required(),
        })
      )
      .optional(),
    antonyms: joi
      .array()
      .items(
        joi.object({
          word: joi.string().required(),
          meaning: joi.string().required(),
        })
      )
      .optional(),
  });

  return schema.validate(word);
};

const updateWordValidation = (word) => {
  const schema = joi.object({
    word: joi.string().trim().max(30), // الكلمة هتكون اختيارية
    meaning: joi.string().trim(), // المعنى اختيارى
    pronunciation: joi.string().optional().trim(),
    plural: joi.string().optional().trim(),
    incorrectPlurals: joi.array().items(joi.string()).optional(),
    article: joi.string().valid("der", "die", "das").optional(), // الأداة اختيارية
    examples: joi
      .array()
      .items(
        joi.object({
          sentence: joi.string().required(),
          meaning: joi.string().required(),
        })
      )
      .optional(),
    type: joi
      .string()
      .valid(
        "noun",
        "verb",
        "adjective",
        "pronoun",
        "adverb",
        "pronouns",
        "konjunktion"
      )
      .optional(),
    level: joi
      .string()
      .valid("beginner", "intermediate", "advanced")
      .optional(),
    isReviewed: joi.boolean().optional(),
    reviewCount: joi.number().optional(),
    synonyms: joi
      .array()
      .items(
        joi.object({
          word: joi.string().required(),
          meaning: joi.string().required(),
        })
      )
      .optional(),
    antonyms: joi
      .array()
      .items(
        joi.object({
          word: joi.string().required(),
          meaning: joi.string().required(),
        })
      )
      .optional(),
  });

  return schema.validate(word);
};

const Word = mongoose.model("Word", wordSchema);

module.exports = { Word, createWordValidation, updateWordValidation };
