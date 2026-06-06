const express = require('express');
const {
  getDepartmentCourses,
  getDepartmentInstructors,
  assignInstructorToCourse,
  removeInstructorFromCourse,
  getTeachingTasks,
  createTeachingTask,
  deleteTeachingTask,
  getHODProfile,
  updateHODProfile
} = require('../controllers/hodController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Middleware to ensure user is HOD
const HODOnly = (req, res, next) => {
  if (req.user && req.user.role === 'head_of_department') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized: Head of Department access only.' });
  }
};

router.use(protect);
router.use(HODOnly);

// Route mappings
router.get('/courses', getDepartmentCourses);
router.get('/instructors', getDepartmentInstructors);
router.post('/courses/:courseId/assign', assignInstructorToCourse);
router.post('/courses/:courseId/remove', removeInstructorFromCourse);
router.get('/tasks', getTeachingTasks);
router.post('/tasks', createTeachingTask);
router.delete('/tasks/:id', deleteTeachingTask);
router.get('/profile', getHODProfile);
router.put('/profile', updateHODProfile);

module.exports = router;
