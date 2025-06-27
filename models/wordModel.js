const mongoose = require("mongoose");
const joi = require("joi");

// تعريف الـ Schema بتاع الكلمة
const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: [true, "الكلمة مطلوبة"],
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
  pluralPronunciation: {
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
        _id: false,
        sentence: { type: String, required: true },
        meaning: { type: String, required: true },
        pronunciation: { type: String, required: false },
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
  isReviewed: {
    type: Boolean,
    default: false,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  isHard: {
    type: Boolean,
    default: false,
  },
  lastReviewed: {
    type: Date,
    required: false,
  },
  synonyms: {
    type: [
      {
        _id: false,
        word: { type: String, required: true },
        meaning: { type: String, required: true },
        pronunciation: { type: String, required: false },
      },
    ],
    required: false,
  },
  antonyms: {
    type: [
      {
        _id: false,
        word: { type: String, required: true },
        meaning: { type: String, required: true },
        pronunciation: { type: String, required: false },
      },
    ],
    required: false,
  },
  conjugation: {
    type: {
      infinitive: { type: String, required: false },
      present: {
        ich: { type: String, required: false },
        du: { type: String, required: false },
        er: { type: String, required: false },
        sieShe: { type: String, required: false },
        es: { type: String, required: false },
        wir: { type: String, required: false },
        ihr: { type: String, required: false },
        sieThey: { type: String, required: false },
        Sie: { type: String, required: false },
      },
      past: {
        ich: { type: String, required: false },
        du: { type: String, required: false },
        er: { type: String, required: false },
        sieShe: { type: String, required: false },
        es: { type: String, required: false },
        wir: { type: String, required: false },
        ihr: { type: String, required: false },
        sieThey: { type: String, required: false },
        Sie: { type: String, required: false },
      },
    },
    required: false,
  },
});

// ✅ أضف الـ compound index على word + meaning
wordSchema.index({ word: 1, meaning: 1 }, { unique: true });

// Joi validation
const createWordValidation = (word) => {
  const schema = joi.object({
    word: joi.string().required().trim().max(30),
    meaning: joi.string().required().trim(),
    pronunciation: joi.string().optional().trim(),
    plural: joi.string().optional().trim(),
    pluralPronunciation: joi.string().optional().trim(),
    incorrectPlurals: joi.array().items(joi.string()).optional(),
    article: joi.string().valid("der", "die", "das").optional(),
    examples: joi
      .array()
      .items(
        joi.object({
          sentence: joi.string().required(),
          meaning: joi.string().required(),
          pronunciation: joi.string().optional(),
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
    isReviewed: joi.boolean().optional(),
    reviewCount: joi.number().optional(),
    isHard: joi.boolean().optional(),
    lastReviewed: joi.date().optional(),
    synonyms: joi
      .array()
      .items(
        joi.object({
          word: joi.string().required(),
          meaning: joi.string().required(),
          pronunciation: joi.string().optional(),
        })
      )
      .optional(),
    antonyms: joi
      .array()
      .items(
        joi.object({
          word: joi.string().required(),
          meaning: joi.string().required(),
          pronunciation: joi.string().optional(),
        })
      )
      .optional(),
    conjugation: joi
      .object({
        infinitive: joi.string().optional(),
        present: joi
          .object({
            ich: joi.string().optional(),
            du: joi.string().optional(),
            er: joi.string().optional(),
            sieShe: joi.string().optional(),
            es: joi.string().optional(),
            wir: joi.string().optional(),
            ihr: joi.string().optional(),
            sieThey: joi.string().optional(),
            Sie: joi.string().optional(),
          })
          .optional(),
        past: joi
          .object({
            ich: joi.string().optional(),
            du: joi.string().optional(),
            er: joi.string().optional(),
            sieShe: joi.string().optional(),
            es: joi.string().optional(),
            wir: joi.string().optional(),
            ihr: joi.string().optional(),
            sieThey: joi.string().optional(),
            Sie: joi.string().optional(),
          })
          .optional(),
      })
      .optional(),
  });

  return schema.validate(word);
};

const updateWordValidation = (word) => {
  const schema = joi.object({
    word: joi.string().trim().max(30),
    meaning: joi.string().trim(),
    pronunciation: joi.string().optional().trim(),
    plural: joi.string().optional().trim(),
    pluralPronunciation: joi.string().optional().trim(),
    incorrectPlurals: joi.array().items(joi.string()).optional(),
    article: joi.string().valid("der", "die", "das").optional(),
    examples: joi
      .array()
      .items(
        joi.object({
          sentence: joi.string().required(),
          meaning: joi.string().required(),
          pronunciation: joi.string().optional(),
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
    isReviewed: joi.boolean().optional(),
    reviewCount: joi.number().optional(),
    isHard: joi.boolean().optional(),
    lastReviewed: joi.date().optional(),
    synonyms: joi
      .array()
      .items(
        joi.object({
          word: joi.string().required(),
          meaning: joi.string().required(),
          pronunciation: joi.string().optional(),
        })
      )
      .optional(),
    antonyms: joi
      .array()
      .items(
        joi.object({
          word: joi.string().required(),
          meaning: joi.string().required(),
          pronunciation: joi.string().optional(),
        })
      )
      .optional(),
    conjugation: joi
      .object({
        infinitive: joi.string().optional(),
        present: joi
          .object({
            ich: joi.string().optional(),
            du: joi.string().optional(),
            er: joi.string().optional(),
            sieShe: joi.string().optional(),
            es: joi.string().optional(),
            wir: joi.string().optional(),
            ihr: joi.string().optional(),
            sieThey: joi.string().optional(),
            Sie: joi.string().optional(),
          })
          .optional(),
        past: joi
          .object({
            ich: joi.string().optional(),
            du: joi.string().optional(),
            er: joi.string().optional(),
            sieShe: joi.string().optional(),
            es: joi.string().optional(),
            wir: joi.string().optional(),
            ihr: joi.string().optional(),
            sieThey: joi.string().optional(),
            Sie: joi.string().optional(),
          })
          .optional(),
      })
      .optional(),
  });

  return schema.validate(word);
};

const Word = mongoose.model("Word", wordSchema);

module.exports = { Word, createWordValidation, updateWordValidation };
