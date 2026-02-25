const Course = require('../models/Course');
const StudentProfile = require('../models/StudentProfile');

// @desc    Create a new course (Admin/Faculty only)
// @route   POST /api/courses
exports.createCourse = async (req, res) => {
  try {
    const { title, code, credits, description, department } = req.body;

    const courseExists = await Course.findOne({ code });
    if (courseExists) return res.status(400).json({ message: 'Course code already exists' });

    const course = await Course.create({
      title,
      code,
      credits,
      description,
      department,
      faculty: req.user._id, // Assumes req.user is populated by protect middleware
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all courses with Faculty info
// @route   GET /api/courses
exports.getCourses = async (req, res) => {
  try {
    console.log("📚 Fetching all courses");
    
    const courses = await Course.find().populate('faculty', 'name email');
    
    console.log("✅ Found", courses.length, "courses");
    res.json(courses);
  } catch (error) {
    console.error("❌ Get courses error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll a student in a course
// @route   POST /api/courses/:id/enroll
exports.enrollCourse = async (req, res) => {
  try {
    console.log("📝 Enrollment request - Student:", req.user._id, "Course:", req.params.id);
    
    const course = await Course.findById(req.params.id);

    if (!course) {
      console.log("❌ Course not found:", req.params.id);
      return res.status(404).json({ message: "Course not found" });
    }

    // Prevent duplicate enrollment
    if (course.enrolledStudents.includes(req.user._id)) {
      console.log("⚠️  Student already enrolled");
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.enrolledStudents.push(req.user._id);
    await course.save();

    console.log("✅ Enrollment successful");
    res.json({ message: "Enrollment successful" });

  } catch (error) {
    console.error("❌ Enrollment error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students enrolled in a course
// @route   GET /api/courses/:id/students
exports.getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('enrolledStudents', 'name email rollNumber department');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course.enrolledStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 SEARCH COURSES
exports.searchCourses = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          name: { $regex: req.query.search, $options: "i" },
        }
      : {};

    const courses = await Course.find(keyword);

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyCourses = async (req, res) => {
  try {
    console.log("📚 Fetching enrolled courses for student:", req.user._id);
    
    const courses = await Course.find({
      enrolledStudents: req.user._id,
    });

    console.log("✅ Found", courses.length, "enrolled courses");
    res.json(courses);
  } catch (error) {
    console.error("❌ Get my courses error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc Get courses assigned to faculty
// @route GET /api/faculty/courses
exports.getFacultyCourses = async (req, res) => {
  try {
    console.log("📚 Fetching courses for faculty:", req.user._id);
    
    const courses = await Course.find({
      faculty: req.user._id,
    }).populate("enrolledStudents", "name email");

    console.log("✅ Found", courses.length, "courses for faculty");
    res.json(courses);

  } catch (error) {
    console.error("❌ Faculty courses error:", error.message);
    res.status(500).json({ message: error.message });
  }
};