import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getMyProfile,
  getMyCourses,
  getMyGrades,
  getMyCalendar,
  getCourseAssignments,
  getCourseLectures,
  getCourseStream,
  getAssignmentSubmission,
} from '../controllers/studentController.js';

const router = express.Router();

// Protect all student routes (requires authentication)
router.use(protect);

// Student profile and dashboard data
router.get('/me', getMyProfile);
router.get('/me/courses', getMyCourses);
router.get('/me/grades', getMyGrades);
router.get('/me/calendar', getMyCalendar);

// Course content for enrolled students
router.get('/courses/:id/assignments', getCourseAssignments);
router.get('/courses/:id/lectures', getCourseLectures);
router.get('/courses/:id/stream', getCourseStream);

// Assignment details for the current student
router.get('/assignments/:id/submission', getAssignmentSubmission);

export default router;
