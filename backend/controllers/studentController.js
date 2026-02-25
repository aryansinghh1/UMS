exports.getStudentAttendance = async (req, res) => {
  const records = await Attendance.find({ student: req.user._id });

  const total = records.length;
  const present = records.filter(r => r.status === "present").length;

  const percentage = total === 0 ? 0 : ((present / total) * 100).toFixed(2);

  res.json({ records, percentage });
};