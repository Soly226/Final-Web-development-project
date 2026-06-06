const express = require('express');
const { body, param } = require('express-validator');
const {
  getStudentAssignments,
  getStudentAssignmentById,
  submitAssignment,
  getStudentGrades,
  getCourseAssignments,
  getCourseGrades,
  getCourseLectures,
  getCourseStream,
  createCourseStreamPost,
  getAvailableCourses,
  registerCourse,
  getStudentEnrolledCourses,
  getMyProfile,
  updateMyProfile,
} = require('../controllers/studentController');
const { protect, studentOnly } = require('../middleware/authMiddleware');
const { uploadAssignment } = require('../middleware/uploadMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

// Guard all student-facing routes under protect and studentOnly middleware
router.use(protect);
router.use(studentOnly);

// Student profile endpoints
router.get('/me', getMyProfile);
router.put(
  '/me',
  [
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be between 3 and 20 characters')
      .escape(),
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Must be a valid email address')
      .normalizeEmail(),
    body('department')
      .optional()
      .trim()
      .isString()
      .withMessage('Department must be a string')
      .escape(),
    body('level')
      .optional()
      .trim()
      .isString()
      .withMessage('Level must be a string')
      .escape(),
  ],
  validateRequest,
  updateMyProfile
);

router.get('/assignments', getStudentAssignments);
router.get(
  '/assignments/:id',
  [param('id').isMongoId().withMessage('Invalid assignment ID')],
  validateRequest,
  getStudentAssignmentById
);

// Real file upload: accept single file upload named 'uploaded_file'
router.post(
  '/assignments/:id/submit',
  [param('id').isMongoId().withMessage('Invalid assignment ID')],
  validateRequest,
  uploadAssignment,
  submitAssignment
);

router.get('/grades', getStudentGrades);

// Course registration routes
router.get('/available-courses', getAvailableCourses);
router.post(
  '/register-course/:courseId',
  [param('courseId').isMongoId().withMessage('Invalid course ID')],
  validateRequest,
  registerCourse
);
router.get('/enrolled-courses', getStudentEnrolledCourses);

// Course-specific tab details routes
router.get(
  '/courses/:courseId/assignments',
  [param('courseId').isMongoId().withMessage('Invalid course ID')],
  validateRequest,
  getCourseAssignments
);
router.get(
  '/courses/:courseId/grades',
  [param('courseId').isMongoId().withMessage('Invalid course ID')],
  validateRequest,
  getCourseGrades
);
router.get(
  '/courses/:courseId/lectures',
  [param('courseId').isMongoId().withMessage('Invalid course ID')],
  validateRequest,
  getCourseLectures
);
router.get(
  '/courses/:courseId/stream',
  [param('courseId').isMongoId().withMessage('Invalid course ID')],
  validateRequest,
  getCourseStream
);
router.post(
  '/courses/:courseId/stream',
  [
    param('courseId').isMongoId().withMessage('Invalid course ID'),
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Post content cannot be empty')
      .isLength({ max: 500 })
      .withMessage('Post content cannot exceed 500 characters')
      .escape(),
  ],
  validateRequest,
  createCourseStreamPost
);

module.exports = router;
