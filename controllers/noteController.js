const { Note, createNoteValidation, updateNoteValidation } = require("../models/noteModel");
const asyncHandler = require("express-async-handler");

/**
 * @desc Get a single note by ID
 * @route GET /api/notes/:id
 * @access Private
 */
const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(404).json({ message: "الملاحظة غير موجودة" });
  }
  res.status(200).json(note);
});

/**
 * @desc Get all notes
 * @route GET /api/notes
 * @access Private
 */
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
});

/**
 * @desc Create a new note
 * @route POST /api/notes
 * @access Private
 */
const createNote = asyncHandler(async (req, res) => {
  const { error } = createNoteValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { content, isArchived } = req.body;

  const note = new Note({ content, isArchived });
  const savedNote = await note.save();

  res.status(201).json(savedNote);
});

/**
 * @desc Update a note by ID
 * @route PUT /api/notes/:id
 * @access Private
 */
const updateNote = asyncHandler(async (req, res) => {
  const { error } = updateNoteValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(404).json({ message: "الملاحظة غير موجودة" });
  }

  if (req.body.content) note.content = req.body.content;
  if (req.body.isArchived !== undefined) note.isArchived = req.body.isArchived;

  const updatedNote = await note.save();
  res.status(200).json(updatedNote);
});

/**
 * @desc Delete a note by ID
 * @route DELETE /api/notes/:id
 * @access Private
 */
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findByIdAndDelete(req.params.id);
  if (!note) {
    return res.status(404).json({ message: "الملاحظة غير موجودة" });
  }
  res.status(200).json({ message: "تم حذف الملاحظة بنجاح" });
});

/**
 * @desc Get all archived notes
 * @route GET /api/notes/archived
 * @access Private
 */
const getArchivedNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ isArchived: true });
  res.status(200).json(notes);
});

/**
 * @desc Toggle archive state of a note
 * @route PATCH /api/notes/:id/archive
 * @access Private
 */
const toggleArchiveNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(404).json({ message: "الملاحظة غير موجودة" });
  }

  note.isArchived = !note.isArchived;
  const updatedNote = await note.save();

  res.status(200).json(updatedNote);
});

module.exports = {
  getNoteById,
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  getArchivedNotes,
  toggleArchiveNote,
};
