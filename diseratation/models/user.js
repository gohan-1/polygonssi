const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create User Schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Removes whitespace from both ends
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."], // Email validation
    },
  },
  { timestamps: true },
); // Automatically adds `createdAt` and `updatedAt` timestamps

// Create User model
const User = mongoose.model("User", userSchema);

module.exports = { User };
