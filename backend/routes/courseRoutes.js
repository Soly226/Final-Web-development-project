const express = require('express');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addPrerequisite,
  enrollStudent,
  assignInstructor
} = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getCourses)
  .post(protect, admin, createCourse);

router.route('/:id')
  .get(protect, getCourseById)
  .put(protect, admin, updateCourse)
  .delete(protect, admin, deleteCourse);

router.post('/:id/prerequisites', protect, admin, addPrerequisite);
router.post('/:id/enroll', protect, admin, enrollStudent);
router.post('/:id/assign-instructor', protect, admin, assignInstructor);

module.exports = router;
