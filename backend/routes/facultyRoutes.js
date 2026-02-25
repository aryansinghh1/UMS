const express = require('express');
const router = express.Router();
const User = require('../models/User'); //
const Attendance = require('../models/Attendance');
const { protect, authorize } = require('../middleware/authMiddleware'); //
const { getFacultyCourses } = require("../controllers/courseController");

// @route   GET /api/faculty/students/:dept
// @access  Private/Faculty
router.get('/students/:dept', protect, authorize('faculty'), async (req, res) => {
  try {
    // We only fetch active students from the specific department
    const students = await User.find({ 
      role: 'student', 
      department: req.params.dept 
    }).select('name rollNumber email department');

    if (!students || students.length === 0) {
        return res.status(200).json([]); // Return empty array instead of error
    }

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching students" });
  }
});

router.get("/courses", protect, authorize("faculty"), getFacultyCourses);

// @route   POST /api/faculty/attendance
router.post('/attendance', protect, authorize('faculty'), async (req, res) => {
  const { records, department, date } = req.body;
  
  if (!records || records.length === 0) {
      return res.status(400).json({ message: "No attendance records provided" });
  }

  try {
    const newAttendance = await Attendance.create({
      records,
      department,
      date: date || new Date(),
      faculty: req.user._id // Provided by 'protect' middleware
    });
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;