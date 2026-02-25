const express = require('express');
const router = express.Router();
const { 
  createCourse, 
  getCourses, 
  enrollCourse, 
  getCourseStudents,
  searchCourses,
  getMyCourses,
  getFacultyCourses,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getCourses)
  .post(protect, authorize('admin', 'faculty'), createCourse);

// ✅ IMPORTANT: Place specific routes BEFORE dynamic routes
router.get("/my", protect, authorize("student"), getMyCourses);
router.get("/search", protect, searchCourses);

// Dynamic routes
router.get('/:id/students', protect, getCourseStudents);
router.post("/:id/enroll", protect, authorize("student"), enrollCourse);
router.get(
  "/faculty",
  protect,
  authorize("faculty"),
  getFacultyCourses
);

module.exports = router;