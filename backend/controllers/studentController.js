const mongoose = require('mongoose');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Student = require('../models/Student');
const Material = require('../models/Material');
const CoursePost = require('../models/CoursePost');
const Enrollment = require('../models/Enrollment');
const Notification = require('../models/Notification');

// @desc    Get all assignments for courses enrolled by the active student
// @route   GET /api/student/assignments
// @access  Private/Student
const getStudentAssignments = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Find the student and their enrolled courses
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const enrolledCourseIds = student.enrolled_courses || [];

    // Fetch all assignments for these courses
    const assignments = await Assignment.find({ course_id: { $in: enrolledCourseIds } })
      .populate('course_id', 'course_name course_code')
      .populate('instructor_id', 'full_name')
      .sort({ deadline: 1 });

    // Fetch all submissions by this student
    const submissions = await AssignmentSubmission.find({ student_id: studentId });

    // Combine them
    const result = assignments.map((assignment) => {
      const submission = submissions.find(
        (s) => s.assignment_id.toString() === assignment._id.toString()
      );

      return {
        _id: assignment._id,
        assignment_id: assignment.assignment_id,
        title: assignment.title,
        description: assignment.description,
        deadline: assignment.deadline,
        total_marks: assignment.total_marks,
        course: {
          _id: assignment.course_id?._id,
          name: assignment.course_id?.course_name || 'Unknown',
          code: assignment.course_id?.course_code || 'Unknown',
        },
        instructor: assignment.instructor_id?.full_name || 'Unknown',
        submission: submission
          ? {
              _id: submission._id,
              submission_id: submission.submission_id,
              uploaded_file: submission.uploaded_file,
              submission_date: submission.submission_date,
              grade: submission.grade,
              feedback: submission.feedback,
              status: submission.grade !== undefined && submission.grade !== null ? 'Graded' : 'Submitted',
            }
          : {
              status: new Date(assignment.deadline) < new Date() ? 'Overdue' : 'Not Submitted',
            },
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get detailed info of a single assignment
// @route   GET /api/student/assignments/:id
// @access  Private/Student
const getStudentAssignmentById = async (req, res) => {
  try {
    const studentId = req.user._id;
    const assignmentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const assignment = await Assignment.findById(assignmentId)
      .populate('course_id', 'course_name course_code')
      .populate('instructor_id', 'full_name');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Verify student is enrolled in the course
    const student = await Student.findOne({ _id: studentId, enrolled_courses: assignment.course_id?._id });
    if (!student) {
      return res.status(403).json({ message: 'You are not enrolled in the course for this assignment' });
    }

    const submission = await AssignmentSubmission.findOne({
      assignment_id: assignmentId,
      student_id: studentId,
    });

    res.json({
      _id: assignment._id,
      assignment_id: assignment.assignment_id,
      title: assignment.title,
      description: assignment.description,
      deadline: assignment.deadline,
      total_marks: assignment.total_marks,
      course: {
        _id: assignment.course_id?._id,
        name: assignment.course_id?.course_name || 'Unknown',
        code: assignment.course_id?.course_code || 'Unknown',
      },
      instructor: assignment.instructor_id?.full_name || 'Unknown',
      submission: submission
        ? {
            _id: submission._id,
            submission_id: submission.submission_id,
            uploaded_file: submission.uploaded_file,
            submission_date: submission.submission_date,
            grade: submission.grade,
            feedback: submission.feedback,
            status: submission.grade !== undefined && submission.grade !== null ? 'Graded' : 'Submitted',
          }
        : {
            status: new Date(assignment.deadline) < new Date() ? 'Overdue' : 'Not Submitted',
          },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit an assignment
// @route   POST /api/student/assignments/:id/submit
// @access  Private/Student
const submitAssignment = async (req, res) => {
  try {
    const studentId = req.user._id;
    const assignmentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if enrolled
    const isEnrolled = await Student.findOne({ _id: studentId, enrolled_courses: assignment.course_id });
    if (!isEnrolled) {
      return res.status(403).json({ message: 'You are not enrolled in the course for this assignment' });
    }

    // Handle real file upload path or body fallback
    let uploadedFilePath = 'mock_file_submission.pdf';
    if (req.file) {
      uploadedFilePath = `/uploads/submissions/${req.file.filename}`;
    } else if (req.body.uploaded_file) {
      uploadedFilePath = req.body.uploaded_file;
    }

    // Check if submission already exists
    let submission = await AssignmentSubmission.findOne({
      assignment_id: assignmentId,
      student_id: studentId,
    });

    if (submission) {
      // Update existing submission
      submission.uploaded_file = uploadedFilePath;
      submission.submission_date = Date.now();
      await submission.save();
    } else {
      // Create new submission
      submission = await AssignmentSubmission.create({
        submission_id: `SUB-${Date.now()}`,
        assignment_id: assignmentId,
        student_id: studentId,
        uploaded_file: uploadedFilePath,
        submission_date: Date.now(),
      });
    }

    // Create notification for the instructor who assigned this
    await Notification.create({
      user: assignment.instructor_id,
      userModel: 'Instructor',
      type: 'assignment',
      title: 'New Assignment Submission',
      message: `${isEnrolled.full_name} submitted their work for "${assignment.title}".`
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all grades (submissions) for student
// @route   GET /api/student/grades
// @access  Private/Student
const getStudentGrades = async (req, res) => {
  try {
    const studentId = req.user._id;

    const submissions = await AssignmentSubmission.find({ student_id: studentId })
      .populate({
        path: 'assignment_id',
        populate: [
          { path: 'course_id', select: 'course_name course_code' },
          { path: 'instructor_id', select: 'full_name' }
        ]
      })
      .sort({ submission_date: -1 });

    const grades = submissions.map((sub) => {
      const assignment = sub.assignment_id || {};
      const course = assignment.course_id || {};
      const instructor = assignment.instructor_id || {};

      let letterGrade = 'F';
      if (sub.grade !== undefined && sub.grade !== null) {
        const pct = (sub.grade / (assignment.total_marks || 100)) * 100;
        if (pct >= 90) letterGrade = 'A';
        else if (pct >= 80) letterGrade = 'B';
        else if (pct >= 70) letterGrade = 'C';
        else if (pct >= 60) letterGrade = 'D';
      }

      return {
        id: sub._id,
        name: assignment.title || 'Unknown Assignment',
        course: course.course_name || 'Unknown Course',
        score: sub.grade || 0,
        total: assignment.total_marks || 100,
        grade: letterGrade,
        status: sub.grade !== undefined && sub.grade !== null ? 'Graded' : 'Submitted',
        feedback: sub.feedback || 'No feedback provided yet.',
        instructor: instructor.full_name || 'Instructor',
      };
    });

    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all assignments for a specific course
// @route   GET /api/student/courses/:courseId/assignments
// @access  Private/Student
const getCourseAssignments = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Check if enrolled
    const student = await Student.findOne({ _id: studentId, enrolled_courses: courseId });
    if (!student) {
      return res.status(403).json({ message: 'You are not enrolled in this course.' });
    }

    const assignments = await Assignment.find({ course_id: courseId })
      .populate('course_id', 'course_name course_code')
      .populate('instructor_id', 'full_name')
      .sort({ deadline: 1 });

    const submissions = await AssignmentSubmission.find({ student_id: studentId, assignment_id: { $in: assignments.map(a => a._id) } });

    const result = assignments.map((assignment) => {
      const submission = submissions.find(
        (s) => s.assignment_id.toString() === assignment._id.toString()
      );

      return {
        _id: assignment._id,
        assignment_id: assignment.assignment_id,
        title: assignment.title,
        description: assignment.description,
        deadline: assignment.deadline,
        total_marks: assignment.total_marks,
        course: {
          _id: assignment.course_id?._id,
          name: assignment.course_id?.course_name || 'Unknown',
          code: assignment.course_id?.course_code || 'Unknown',
        },
        instructor: assignment.instructor_id?.full_name || 'Unknown',
        submission: submission
          ? {
              _id: submission._id,
              submission_id: submission.submission_id,
              uploaded_file: submission.uploaded_file,
              submission_date: submission.submission_date,
              grade: submission.grade,
              feedback: submission.feedback,
              status: submission.grade !== undefined && submission.grade !== null ? 'Graded' : 'Submitted',
            }
          : {
              status: new Date(assignment.deadline) < new Date() ? 'Overdue' : 'Not Submitted',
            },
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all grades for a specific course
// @route   GET /api/student/courses/:courseId/grades
// @access  Private/Student
const getCourseGrades = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Check if enrolled
    const student = await Student.findOne({ _id: studentId, enrolled_courses: courseId });
    if (!student) {
      return res.status(403).json({ message: 'You are not enrolled in this course.' });
    }

    const assignments = await Assignment.find({ course_id: courseId });
    const submissions = await AssignmentSubmission.find({
      student_id: studentId,
      assignment_id: { $in: assignments.map(a => a._id) }
    }).populate('assignment_id');

    const grades = submissions.map((sub) => {
      const assignment = sub.assignment_id || {};
      let letterGrade = 'F';
      if (sub.grade !== undefined && sub.grade !== null) {
        const pct = (sub.grade / (assignment.total_marks || 100)) * 100;
        if (pct >= 90) letterGrade = 'A';
        else if (pct >= 80) letterGrade = 'B';
        else if (pct >= 70) letterGrade = 'C';
        else if (pct >= 60) letterGrade = 'D';
      }

      return {
        id: sub._id,
        name: assignment.title || 'Unknown Assignment',
        score: sub.grade,
        total: assignment.total_marks || 100,
        grade: letterGrade,
        status: sub.grade !== undefined && sub.grade !== null ? 'Graded' : 'Submitted',
        feedback: sub.feedback || 'No feedback provided.',
        weight: '25%', // Visual weight fallback
      };
    });

    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all lectures/material for a specific course
// @route   GET /api/student/courses/:courseId/lectures
// @access  Private/Student
const getCourseLectures = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Check if enrolled
    const student = await Student.findOne({ _id: studentId, enrolled_courses: courseId });
    if (!student) {
      return res.status(403).json({ message: 'You are not enrolled in this course.' });
    }

    const lectures = await Material.find({ course_id: courseId })
      .populate('instructor_id', 'full_name')
      .sort({ upload_date: 1 });

    res.json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get course stream activity/posts
// @route   GET /api/student/courses/:courseId/stream
// @access  Private/Student
const getCourseStream = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Check if enrolled
    const isEnrolled = await Student.findOne({ _id: studentId, enrolled_courses: courseId });
    if (!isEnrolled) {
      return res.status(403).json({ message: 'You are not enrolled in this course.' });
    }

    const posts = await CoursePost.find({ course_id: courseId })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create course stream post
// @route   POST /api/student/courses/:courseId/stream
// @access  Private/Student
const createCourseStreamPost = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Post content cannot be empty.' });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Check if enrolled
    const student = await Student.findOne({ _id: studentId, enrolled_courses: courseId });
    if (!student) {
      return res.status(403).json({ message: 'You are not enrolled in this course.' });
    }

    const post = await CoursePost.create({
      course_id: courseId,
      sender: studentId,
      senderModel: 'Student',
      senderName: student.full_name,
      content,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all available courses for registration (evaluated with prerequisite & dept restrictions)
// @route   GET /api/student/available-courses
// @access  Private/Student
const getAvailableCourses = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get current student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Fetch all courses
    const allCourses = await Course.find({})
      .populate('prerequisite_course_id', 'course_name course_code')
      .populate('assigned_instructors', 'full_name');

    // Fetch all enrollments of the student
    const enrollments = await Enrollment.find({ student_id: studentId });

    // Evaluate eligibility
    const coursesWithEligibility = allCourses.map((course) => {
      const userEnrollment = enrollments.find(e => e.course_id.toString() === course._id.toString());
      
      let status = 'eligible';
      let reason = '';

      if (userEnrollment) {
        if (userEnrollment.status === 'active') {
          status = 'enrolled';
          reason = 'Already enrolled in this course.';
        } else if (userEnrollment.status === 'completed') {
          status = 'completed';
          reason = 'You have already completed this course.';
        }
      }

      // Check department restriction (case-insensitive)
      if (status === 'eligible' && course.department && student.department) {
        const studentDept = student.department.trim().toLowerCase();
        const courseDept = course.department.trim().toLowerCase();
        
        // Allow if department matches, or if either is empty/all, or contains the name
        if (studentDept !== courseDept && !courseDept.includes(studentDept) && !studentDept.includes(courseDept)) {
          status = 'restricted';
          reason = `Restricted to ${course.department} students.`;
        }
      }

      // Check prerequisites
      if (status === 'eligible' && course.prerequisite_course_id) {
        const prereqEnrollment = enrollments.find(
          e => e.course_id.toString() === course.prerequisite_course_id._id.toString() && e.status === 'completed'
        );

        if (!prereqEnrollment) {
          status = 'missing_prerequisite';
          reason = `Requires completing ${course.prerequisite_course_id.course_code}: ${course.prerequisite_course_id.course_name}.`;
        }
      }

      return {
        _id: course._id,
        course_id: course.course_id,
        course_code: course.course_code,
        course_name: course.course_name,
        description: course.description,
        credit_hours: course.credit_hours,
        department: course.department,
        prerequisite: course.prerequisite_course_id
          ? {
              code: course.prerequisite_course_id.course_code,
              name: course.prerequisite_course_id.course_name,
            }
          : null,
        instructors: course.assigned_instructors.map(i => i.full_name),
        eligibility: {
          status,
          reason,
        },
      };
    });

    res.json(coursesWithEligibility);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register for a course
// @route   POST /api/student/register-course/:courseId
// @access  Private/Student
const registerCourse = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // 1. Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ student_id: studentId, course_id: courseId, status: 'active' });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'You are already enrolled in this course.' });
    }

    // 2. Check department restriction
    if (course.department && student.department) {
      const studentDept = student.department.trim().toLowerCase();
      const courseDept = course.department.trim().toLowerCase();
      if (studentDept !== courseDept && !courseDept.includes(studentDept) && !studentDept.includes(courseDept)) {
        return res.status(400).json({ message: `Registration blocked: course restricted to ${course.department} students.` });
      }
    }

    // 3. Check prerequisite
    if (course.prerequisite_course_id) {
      const completedPrereq = await Enrollment.findOne({
        student_id: studentId,
        course_id: course.prerequisite_course_id,
        status: 'completed',
      });
      if (!completedPrereq) {
        return res.status(400).json({ message: 'Registration blocked: prerequisite course has not been completed.' });
      }
    }

    // Create Enrollment
    const enrollment = await Enrollment.create({
      enrollment_id: `ENR-${Date.now()}`,
      student_id: studentId,
      course_id: courseId,
      semester: 'Spring 2026',
      status: 'active',
    });

    // Update Course and Student models
    await Course.findByIdAndUpdate(courseId, { $addToSet: { enrolled_students: studentId } });
    await Student.findByIdAndUpdate(studentId, { $addToSet: { enrolled_courses: courseId } });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student enrolled courses
// @route   GET /api/student/enrolled-courses
// @access  Private/Student
const getStudentEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user._id;
    const student = await Student.findById(studentId).populate({
      path: 'enrolled_courses',
      populate: { path: 'assigned_instructors', select: 'full_name' }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.json(student.enrolled_courses || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current student profile
// @route   GET /api/student/me
// @access  Private/Student
const getMyProfile = async (req, res) => {
  try {
    const studentId = req.user._id;
    const student = await Student.findById(studentId)
      .select('-password')
      .populate('enrolled_courses', 'course_name course_code');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update current student profile
// @route   PUT /api/student/me
// @access  Private/Student
const updateMyProfile = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { username, email, department, level } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (username) student.username = username;
    if (email) student.email = email;
    if (department) student.department = department;
    if (level) student.level = level;

    await student.save();

    res.json({
      message: 'Profile updated successfully',
      student: {
        _id: student._id,
        full_name: student.full_name,
        username: student.username,
        email: student.email,
        department: student.department,
        level: student.level,
        GPA: student.GPA,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
  updateMyProfile
};
