const express = require('express');
const {
  getInstructorCourses,
  createAssignment,
  getInstructorAssignments,
  toggleAssignmentStatus,
  getAssignmentSubmissions,
  gradeSubmission,
  createQuiz,
  uploadMaterial
} = require('../controllers/instructorController');
const { protect } = require('../middleware/authMiddleware');
const { uploadFile } = require('../middleware/uploadMiddleware');

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
router.get('/assignments', getInstructorAssignments);
router.post('/assignments', createAssignment);
router.put('/assignments/:id/status', toggleAssignmentStatus);
router.get('/assignments/:id/submissions', getAssignmentSubmissions);
router.put('/submissions/:id/grade', gradeSubmission);
router.post('/quizzes', createQuiz);
router.post('/materials', uploadMaterial);

router.post('/upload-file', uploadFile, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ fileUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;
