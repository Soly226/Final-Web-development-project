const express = require('express');
const {
  getInstructorCourses,
  createAssignment,
  getInstructorAssignments,
  toggleAssignmentStatus,
  getAssignmentSubmissions,
  gradeSubmission,
  createQuiz,
  uploadMaterial,
  getCourseMaterials,
  addCourseMaterial,
  deleteCourseMaterial,
  getInstructorProfile,
  updateInstructorProfile,
  getCourseStream,
  createCourseStreamPost,
  getGlobalStream,
  createInstructorCourse,
  getInstructorAnalytics
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

// Analytics route
router.get('/analytics', getInstructorAnalytics);

// Profile routes
router.route('/profile')
  .get(getInstructorProfile)
  .put(updateInstructorProfile);

// Course routes
router.get('/courses', getInstructorCourses);
router.post('/courses', createInstructorCourse);

// Stream routes (Global stream)
router.get('/stream', getGlobalStream);

// Course-specific stream routes
router.route('/courses/:courseId/stream')
  .get(getCourseStream)
  .post(createCourseStreamPost);

// Assignment routes
router.get('/assignments', getInstructorAssignments);
router.post('/assignments', createAssignment);
router.put('/assignments/:id/status', toggleAssignmentStatus);
router.get('/assignments/:id/submissions', getAssignmentSubmissions);
router.put('/submissions/:id/grade', gradeSubmission);

// Quiz routes
router.post('/quizzes', createQuiz);

// Material routes (legacy)
router.post('/materials', uploadMaterial);

// Course-specific material (lecture) routes
router.get('/courses/:courseId/materials', getCourseMaterials);
router.post('/courses/:courseId/materials', addCourseMaterial);
router.delete('/materials/:id', deleteCourseMaterial);

// File upload endpoint for instructor lecture materials
router.post('/upload-file', uploadFile, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ fileUrl: `/uploads/materials/${req.file.filename}` });
});

module.exports = router;
