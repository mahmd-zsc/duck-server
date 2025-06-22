const mongoose = require("mongoose");
const joi = require("joi");

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Note = mongoose.model("Note", noteSchema);

// Validation for creating a note
const createNoteValidation = (note) => {
  const schema = joi.object({
    content: joi.string().required().min(1).trim(),
  });

  return schema.validate(note);
};

// Validation for updating a note
const updateNoteValidation = (note) => {
  const schema = joi
    .object({
      content: joi.string().min(1).trim(),
      isArchived: joi.boolean(),
    })
    .min(1);

  return schema.validate(note);
};

module.exports = {
  Note,
  createNoteValidation,
  updateNoteValidation,
};
