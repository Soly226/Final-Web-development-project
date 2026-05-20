import Course from '../models/Course.js';
import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Quiz from '../models/Quiz.js';
import QuizSubmission from '../models/QuizSubmission.js';
import Material from '../models/Material.js';

// --- Course Management for Instructors ---

// @desc    Get courses assigned to the instructor
// @route   GET /api/instructor/courses
// @access  Private/Instructor
export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ assigned_instructors: req.user._id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Assignment Management ---

// @desc    Create an assignment
// @route   POST /api/instructor/assignments
// @access  Private/Instructor
export const createAssignment = async (req, res) => {
  const { course_id, title, description, deadline, total_marks } = req.body;

  try {
    // Check if instructor is assigned to the course
    const course = await Course.findOne({ _id: course_id, assigned_instructors: req.user._id });
    if (!course) {
      return res.status(401).json({ message: 'Not authorized to create assignments for this course' });
    }

    const assignment = await Assignment.create({
      assignment_id: `ASG-${Date.now()}`,
      course_id,
      instructor_id: req.user._id,
      title,
      description,
      deadline,
      total_marks
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get submissions for an assignment
// @route   GET /api/instructor/assignments/:id/submissions
// @access  Private/Instructor
export const getAssignmentSubmissions = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment || assignment.instructor_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const submissions = await AssignmentSubmission.find({ assignment_id: req.params.id })
      .populate('student_id', 'full_name student_id');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grade an assignment submission
// @route   PUT /api/instructor/submissions/:id/grade
// @access  Private/Instructor
export const gradeSubmission = async (req, res) => {
  const { grade, feedback } = req.body;

  try {
    const submission = await AssignmentSubmission.findById(req.params.id).populate('assignment_id');
    if (!submission || submission.assignment_id.instructor_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    const updatedSubmission = await submission.save();

    res.json(updatedSubmission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Quiz Management ---

// @desc    Create a quiz
// @route   POST /api/instructor/quizzes
// @access  Private/Instructor
export const createQuiz = async (req, res) => {
  const { course_id, title, duration, total_marks } = req.body;

  try {
    const course = await Course.findOne({ _id: course_id, assigned_instructors: req.user._id });
    if (!course) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const quiz = await Quiz.create({
      quiz_id: `QZ-${Date.now()}`,
      course_id,
      instructor_id: req.user._id,
      title,
      duration,
      total_marks
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Material Management ---

// @desc    Upload course material
// @route   POST /api/instructor/materials
// @access  Private/Instructor
export const uploadMaterial = async (req, res) => {
  const { course_id, title, file_url } = req.body;

  try {
    const course = await Course.findOne({ _id: course_id, assigned_instructors: req.user._id });
    if (!course) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const material = await Material.create({
      material_id: `MAT-${Date.now()}`,
      course_id,
      instructor_id: req.user._id,
      title,
      file_url
    });

    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
