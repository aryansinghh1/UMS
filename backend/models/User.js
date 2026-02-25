const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true, // Automatically converts to lowercase
      trim: true, // Removes accidental spaces
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "faculty", "admin"],
      default: "student",
    },
    department: {
      type: String,
      default: "General",
    },
    rollNumber: {
      type: String,
      unique: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// --- MIDDLEWARE: Hash password before saving to DB ---
// We removed (next) from the function arguments below to fix your error
userSchema.pre("save", async function () {
  // 1. If password isn't being changed, just stop here
  if (!this.isModified("password")) {
    return;
  }

  // 2. Generate salt and hash the password
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // In async functions, just finishing the execution is enough—no next() needed!
  } catch (error) {
    throw new Error("Password hashing failed");
  }
});

// --- METHOD: Compare entered password with hashed password ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Uses bcrypt to safely compare the plain text with the hash
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
