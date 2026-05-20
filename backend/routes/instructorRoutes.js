import express from 'express';
import {
  getInstructorCourses,
  createAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
  createQuiz,
  uploadMaterial
} from '../controllers/instructorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to ensure user is an instructor or HOD
const instructorOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'instructor' || req.user.role === 'head_of_department')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an instructor' });
  }
};

router.use(protect);
router.use(instructorOnly);

router.get('/courses', getInstructorCourses);
router.post('/assignments', createAssignment);
router.get('/assignments/:id/submissions', getAssignmentSubmissions);
router.put('/submissions/:id/grade', gradeSubmission);
router.post('/quizzes', createQuiz);
router.post('/materials', uploadMaterial);

export default router;
