const mongoose = require("mongoose");

const lessonGroupSchema = new mongoose.Schema({
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
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model("LessonGroup", lessonGroupSchema);
