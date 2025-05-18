const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const {
  verifyTokenAndAuthorization,
  verifyTokenOnlyUser,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken"); // Import the specified middleware

// Route: Get all users
router.get("/", getAllUsers);

// Route: Get user by ID
// router.get("/:id", getUserById);
router.get("/:id", getUserById);

// Route: Update user by ID
router.put("/:id", updateUser);

// Route: Delete user by ID
router.delete("/:id", deleteUser);

module.exports = router;
