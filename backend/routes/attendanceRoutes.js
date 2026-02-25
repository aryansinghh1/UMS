const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getStudentAttendance,
  getCourseAttendance,
} = require("../controllers/attendanceController");

const { protect } = require("../middleware/authMiddleware");

router.post("/mark", protect, markAttendance);
router.get("/my", protect, getStudentAttendance);
router.get("/course/:courseId", protect, getCourseAttendance);

module.exports = router;