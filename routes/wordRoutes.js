const express = require("express");
const router = express.Router();
const { createWord, getWordById, getAllWords, updateWord, deleteWord } = require("../controllers/wordController");

// Routes for Words
router.post("/", createWord);
router.get("/:id", getWordById);
router.get("/", getAllWords);
router.put("/:id", updateWord);
router.delete("/:id", deleteWord);

module.exports = router;
