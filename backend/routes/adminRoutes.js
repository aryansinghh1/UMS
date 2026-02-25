const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  updateUserRole,
  getSystemStats,
  adminCreateCourse,
  deleteUser,
  adminCreateUser,
  assignCourseToFaculty
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Protect all routes below
router.use(protect);
router.use(authorize('admin'));

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.post('/users', adminCreateUser);
router.put(
  "/courses/:courseId/assign",
  protect,
  authorize("admin"),
  assignCourseToFaculty
);

// System Stats
router.get('/stats', getSystemStats);

// ✅ Correct Course Creation Route
router.post('/courses', adminCreateCourse);

module.exports = router;