const express = require('express');
const {
  getClassmates,
  getCourseRoster,
  enrollStudentByRoster,
  removeStudentFromRoster
} = require('../controllers/rosterController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Helper authorization middleware
const instructorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'instructor' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden. Instructors or Admins only.' });
  }
};

// Route: Student classmates view
// Path will map to GET /api/student/courses/:courseId/students
router.get('/student/courses/:courseId/students', protect, getClassmates);

// Routes: Instructor roster panel views
// Path will map to GET/POST/DELETE /api/courses/:courseId/students
router.route('/courses/:courseId/students')
  .get(protect, instructorOrAdmin, getCourseRoster)
  .post(protect, instructorOrAdmin, enrollStudentByRoster);

router.delete('/courses/:courseId/students/:studentId', protect, instructorOrAdmin, removeStudentFromRoster);

module.exports = router;
