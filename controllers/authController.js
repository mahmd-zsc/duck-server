const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { User, createUserValidation } = require("../models/userModel");

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const register = asyncHandler(async (req, res) => {
  const { error } = createUserValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { username, email, password } = req.body;

  // Check if the username already exists
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return res.status(400).json({ message: "Username already taken" });
  }

  // Check if the email already exists
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({ message: "Email already in use" });
  }

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create a new user
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  // Save the user to the database
  const savedUser = await newUser.save();

  // Generate authentication token
  let token = savedUser.generateAuthToken();

  // Send the response with user details and token
  res.status(201).json({
    id: savedUser._id,
    username: savedUser.username,
    isAdmin: savedUser.isAdmin,
    token,
  });
});

/**
 * @desc Login a user
 * @route POST /api/auth/login
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Check if the password is correct
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  let token = user.generateAuthToken();

  res.status(200).json({
    id: user._id,
    username: user.username,
    isAdmin: user.isAdmin,
    token,
  });
});

// Add other authentication-related controller functions as needed

module.exports = {
  register,
  login,
  // Add other authentication-related controller exports as needed
};
