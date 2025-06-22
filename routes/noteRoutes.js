const express = require("express");
const router = express.Router();
const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getArchivedNotes,
  toggleArchiveNote,
} = require("../controllers/noteController");


// Route: Get all notes
router.get("/", getAllNotes);

// Route: Get single note by ID
router.get("/:id", getNoteById);

// Route: Create a new note
router.post("/", createNote);

// Route: Update a note by ID
router.put("/:id", updateNote);

// Route: Delete a note by ID
router.delete("/:id", deleteNote);

// Route: Get all archived notes
router.get("/archived/list", getArchivedNotes);

// Route: Toggle archive status
router.patch("/:id/archive", toggleArchiveNote);

module.exports = router;
