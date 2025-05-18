const mongoose = require("mongoose");
const joi = require("joi");

const lessonSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "عنوان الدرس مطلوب"],
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    color: {
      type: String,
      required: [true, "اللون مطلوب"], // إذا أردت اللون يكون إلزامي
      match: /^#[0-9A-F]{6}$/i, // Regular Expression للتحقق من أن اللون بتنسيق Hex
      default: "#FFFFFF", // اللون الافتراضي لو مفيش لون
    },
    emoji: {
      type: String,
      required: false, // اختياري
      validate: {
        validator: function (v) {
          // تحقق بسيط من أن القيمة إيموجي (هذا ليس كاملاً ولكن يعمل في معظم الحالات)
          const emojiRegex = /\p{Emoji}/u;
          return emojiRegex.test(v);
        },
        message: (props) => `${props.value} ليس إيموجي صالح!`,
      },
    },
    words: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Word", // الربط مع موديل الكلمات
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Model
const Lesson = mongoose.model("Lesson", lessonSchema);

// Validation لـ Create
const createLessonValidation = (data) => {
  const schema = joi.object({
    title: joi.string().trim().required().min(3).max(100),
    level: joi
      .string()
      .valid("beginner", "intermediate", "advanced")
      .required(),
    color: joi
      .string()
      .regex(/^#[0-9A-F]{6}$/i)
      .required(),
    emoji: joi
      .string()
      .regex(/\p{Emoji}/u)
      .optional(),
  });

  return schema.validate(data);
};

// Validation لـ Update
const updateLessonValidation = (data) => {
  const schema = joi.object({
    title: joi.string().trim().min(3).max(100).optional(),
    level: joi
      .string()
      .valid("beginner", "intermediate", "advanced")
      .optional(),
    color: joi
      .string()
      .regex(/^#[0-9A-F]{6}$/i)
      .optional(),
    emoji: joi
      .string()
      .regex(/\p{Emoji}/u)
      .optional(),
    words: joi.array().items(joi.string().hex()).optional(),
  });

  return schema.validate(data);
};

module.exports = {
  Lesson,
  createLessonValidation,
  updateLessonValidation,
};
