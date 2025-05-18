const mongoose = require("mongoose");
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // You can include additional fields based on your requirements
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash password before saving user
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Check password
userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Auth Token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { email: this.email, id: this.id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_KEY
  );
};

const User = mongoose.model("User", userSchema);

const createUserValidation = (user) => {
  const schema = joi.object({
    username: joi.string().required().trim().min(3).max(10),
    email: joi.string().required().email().trim(),
    password: joi
      .string()
      .required()
      .min(8)
      .max(20)
      .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')),
  });

  return schema.validate(user);
};

const updateUserValidation = (obj) => {
  const schema = joi
    .object({
      username: joi.string().trim().min(3).max(10),
      email: joi.string().email().trim(),
      password: joi.string().min(8).max(20),
      // Add validation for additional properties if needed
    })
    .min(1);

  return schema.validate(obj);
};

module.exports = {
  User,
  createUserValidation,
  updateUserValidation,
};
