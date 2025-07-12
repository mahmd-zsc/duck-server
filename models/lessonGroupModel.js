const mongoose = require("mongoose");

const lessonGroupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    level: {
      type: String, // مثال: "A1", "A2", "B1"
      trim: true,
    },
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// التحقق من اتصال MongoDB قبل تعريف الموديل
if (mongoose.connection.readyState === 1) {
  console.log("MongoDB connection is ready");
} else {
  console.warn("MongoDB connection is not ready yet");
}

// تصدير الموديل باستخدام CommonJS
const LessonGroup = mongoose.model("LessonGroup", lessonGroupSchema);
module.exports = LessonGroup;
