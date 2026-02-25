const User = require("../models/User");
const Counter = require("../models/Counter");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};


// =====================================
// REGISTER USER (Auto Roll Generator)
// =====================================
exports.registerUser = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email.toLowerCase().trim();
  const { password, role, department } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ===== Role Prefix =====
    let prefix;
    let userRole = role || "student";

    if (userRole === "student") prefix = "STU";
    else if (userRole === "faculty") prefix = "FAC";
    else if (userRole === "admin") prefix = "ADM";
    else {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    // ===== Get or Create Counter =====
    let counter = await Counter.findOne({ role: userRole });

    if (!counter) {
      counter = await Counter.create({
        role: userRole,
        sequence: 1000,
      });
    }

    counter.sequence += 1;
    await counter.save();

    const rollNumber = prefix + counter.sequence;

    // ===== Create User =====
    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      department,
      rollNumber,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      rollNumber: user.rollNumber,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// =====================================
// LOGIN USER
// =====================================
exports.loginUser = async (req, res) => {
  const email = req.body.email.toLowerCase().trim();
  const password = req.body.password;

  console.log("🔐 Login attempt - Email:", email);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      console.log("❌ Password mismatch for user:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    console.log("✅ Login successful - User:", user.name, "Role:", user.role);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      rollNumber: user.rollNumber,
      token: token,
    });

  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


// =====================================
// RESET PASSWORD
// =====================================
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword; // will be hashed by pre-save hook
    await user.save();

    res.json({
      message: "Password updated successfully! Please login again.",
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};