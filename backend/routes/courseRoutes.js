import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addPrerequisite,
  enrollStudent,
  assignInstructor
} from '../controllers/courseController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

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

export default router;
