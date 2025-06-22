const mongoose = require("mongoose");
const joi = require("joi");

// تعريف الـ Schema بتاع الكويز
const quizSchema = new mongoose.Schema(
  {
    pronunciation: {
      type: String,
      required: false,
      trim: true,
    },
    type: {
      type: String,
      enum: ["translation"],
      default: "translation",
      required: true,
    },
    question: {
      type: String,
      required: [true, "السؤال مطلوب"],
    },
    options: {
      type: [String],
      required: [true, "الاختيارات مطلوبة"],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length === 4;
        },
        message: "لازم يكون فيه 4 اختيارات بالضبط",
      },
    },
    answer: {
      type: String,
      required: [true, "الإجابة الصحيحة مطلوبة"],
    },
    meaning: {
      type: String,
      required: [true, "معنى الكلمة مطلوب"],
    },
    rule: {
      type: String,
      required: [true, "القاعدة الخاصة بالسؤال مطلوبة"],
      trim: true,
    },
    timesAnswered: {
      type: Number,
      default: 0,
    },
    lastAnsweredAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

// ✅ Joi validation لإنشاء كويز
const createQuizValidation = (quiz) => {
  const schema = joi.object({
    pronunciation: joi.string().optional().trim(),
    type: joi.string().valid("translation").required(),
    question: joi.string().required().trim(),
    options: joi.array().items(joi.string()).length(4).required(),
    answer: joi.string().required(),
    meaning: joi.string().required().trim(),
    rule: joi.string().required().trim(),
    timesAnswered: joi.number().optional(),
    lastAnsweredAt: joi.date().optional(),
  });

  return schema.validate(quiz);
};

// ✅ Joi validation لتحديث كويز
const updateQuizValidation = (quiz) => {
  const schema = joi.object({
    pronunciation: joi.string().optional().trim(),
    type: joi.string().valid("translation").optional(),
    question: joi.string().optional().trim(),
    options: joi.array().items(joi.string()).length(4).optional(),
    answer: joi.string().optional(),
    meaning: joi.string().optional().trim(),
    rule: joi.string().optional().trim(),
    timesAnswered: joi.number().optional(),
    lastAnsweredAt: joi.date().optional(),
  });

  return schema.validate(quiz);
};

// إنشاء موديل Mongoose
const Quiz = mongoose.model("Quiz", quizSchema);

// تصدير الموديل والدوال
module.exports = { Quiz, createQuizValidation, updateQuizValidation };
