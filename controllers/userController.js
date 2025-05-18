const { User, createUserValidation, updateUserValidation } = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

/**
 * @desc Get a single user by ID
 * @route GET /api/users/:id
 * @access Private
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password"); // 👈 كده هنشيل الباسورد من الـ response

  if (!user) {
    return res.status(404).json({ message: 'المستخدم غير موجود' });
  }

  res.status(200).json(user);
});

/**
 * @desc Get all users
 * @route GET /api/users
 * @access Private
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

/**
 * @desc Update user details by ID
 * @route PUT /api/users/:id
 * @access Private
 */
const updateUser = asyncHandler(async (req, res) => {
  // Validate incoming data using the Joi schema
  const { error } = updateUserValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'المستخدم غير موجود' });
  }

  // Update user properties
  if (req.body.username) user.username = req.body.username;
  if (req.body.email) user.email = req.body.email;
  if (req.body.password) user.password = await bcrypt.hash(req.body.password, 10);

  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

/**
 * @desc Delete a user by ID
 * @route DELETE /api/users/:id
 * @access Private
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'المستخدم غير موجود' });
  }
  res.status(200).json({ message: 'تم حذف المستخدم بنجاح' });
});

module.exports = { getUserById, getAllUsers, updateUser, deleteUser };
