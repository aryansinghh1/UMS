const User = require("../models/User");
const Course = require("../models/Course");

/**
 * @desc    Get all users with optional role filtering
 * @route   GET /api/admin/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    console.log("Query role:", req.query.role);

    const { role } = req.query;
    const query = role ? { role } : {};

    const users = await User.find(query).select("-password");

    console.log("Users found:", users.length);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @desc    Admin creates a course and assigns it to a verified faculty member
 * @route   POST /api/admin/courses
 */
exports.adminCreateCourse = async (req, res) => {
  try {
    const { title, courseCode, credits, description, department, faculty } = req.body;

    console.log("📝 Course creation request:", req.body);

    if (!title || !courseCode || !faculty) {
      return res.status(400).json({
        message: "Title, Course Code and Faculty are required",
      });
    }

    const existing = await Course.findOne({
      courseCode: courseCode.toUpperCase(),
    });

    if (existing) {
      return res.status(400).json({
        message: "Course code already exists",
      });
    }

    const facultyUser = await User.findOne({
      _id: faculty,
      role: "faculty",
    });

    if (!facultyUser) {
      return res.status(400).json({
        message: "Invalid faculty selected",
      });
    }

    const course = await Course.create({
      title,
      courseCode: courseCode.toUpperCase(),
      credits,
      description,
      department,
      faculty,
    });

    console.log("✅ Course created:", course._id);

    res.status(201).json(course);
  } catch (error) {
    console.error("❌ Course creation error:", error);
    res.status(500).json({
      message: "Server Error: Course creation failed",
    });
  }
};

/**
 * @desc    Update user role
 * @route   PUT /api/admin/users/:id/role
 */
exports.updateUserRole = async (req, res) => {
  try {
    const validRoles = ["student", "faculty", "admin"];

    if (!validRoles.includes(req.body.role)) {
      return res.status(400).json({ message: "Invalid role type" });
    }

    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = req.body.role;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin deleting themselves
    if (userToDelete._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    await userToDelete.deleteOne();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get system statistics
 * @route   GET /api/admin/stats
 */
exports.getSystemStats = async (req, res) => {
  try {
    const studentCount = await User.countDocuments({
      role: "student",
    });

    const facultyCount = await User.countDocuments({
      role: "faculty",
    });

    const courseCount = await Course.countDocuments();

    const enrollmentStats = await Course.aggregate([
      {
        $project: {
          numberOfStudents: {
            $size: { $ifNull: ["$enrolledStudents", []] },
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$numberOfStudents" },
        },
      },
    ]);

    res.json({
      students: studentCount,
      faculty: facultyCount,
      courses: courseCount,
      totalEnrollments:
        enrollmentStats.length > 0 ? enrollmentStats[0].total : 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching analytics",
    });
  }
};

/**
 * @desc Admin creates a new user
 * @route POST /api/admin/users
 */
exports.adminCreateUser = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password, // Will be hashed by pre-save hook
      role,
      department,
    });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Assign course to faculty
// @route PUT /api/admin/courses/:courseId/assign
exports.assignCourseToFaculty = async (req, res) => {
  try {
    const { facultyId } = req.body;

    const faculty = await User.findOne({
      _id: facultyId,
      role: "faculty",
    });

    if (!faculty) {
      return res.status(400).json({
        message: "Invalid faculty selected",
      });
    }

    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    course.faculty = facultyId;
    await course.save();

    res.json({
      message: "Course assigned successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
