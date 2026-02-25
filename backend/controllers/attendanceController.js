const Attendance = require("../models/Attendance");

// ================================
// MARK ATTENDANCE (Faculty)
// ================================
exports.markAttendance = async (req, res) => {
  const { courseId, records } = req.body;

  try {
    if (!courseId || !records || records.length === 0) {
      return res.status(400).json({ message: "Course and records required" });
    }

    const attendanceData = records.map((record) => ({
      course: courseId,
      student: record.studentId,
      status: record.status, // must be "present" or "absent"
    }));

    await Attendance.insertMany(attendanceData);

    res.json({ message: "Attendance marked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================================
// GET STUDENT ATTENDANCE
// ================================
exports.getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      student: req.user._id,
    })
      .populate("course")
      .sort({ createdAt: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================================
// GET COURSE ATTENDANCE (Faculty)
// ================================
exports.getCourseAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      course: req.params.courseId,
    })
      .populate("student")
      .sort({ createdAt: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};