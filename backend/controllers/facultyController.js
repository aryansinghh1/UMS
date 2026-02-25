const Course = require('../models/Course');

// @desc    Get courses assigned to the logged-in faculty
// @route   GET /api/faculty/my-courses
exports.getMyCourses = async (req, res) => {
  try {
    // Find courses where 'faculty' matches the logged-in user's ID
    const courses = await Course.find({ faculty: req.user._id })
      .populate('enrolledStudents', 'name email rollNumber department');
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};