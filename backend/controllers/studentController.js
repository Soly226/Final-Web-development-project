const Student = require('../models/Student');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Material = require('../models/Material');
const Announcement = require('../models/Announcement');
const Enrollment = require('../models/Enrollment');
const { ensureStudentEnrolled } = require('../utils/studentHelpers');

const getMyProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockStudents, mockCourses } = require('./mockData');
      const student = mockStudents.find(s => s._id === req.user._id.toString() || s.email === req.user.email);
      if (!student) return res.status(404).json({ message: 'Student not found (mock mode)' });
      
      const enrolledCourses = mockCourses.filter(c => student.enrolled_courses.includes(c._id));
      return res.json({
        student_id: student.student_id,
        full_name: student.full_name,
        username: student.username || student.full_name.toLowerCase().replace(/\s/g, ''),
        email: student.email,
        department: student.department || 'Computer Science',
        level: student.level || '3',
        GPA: student.GPA || 3.4,
        enrolled_courses: enrolledCourses,
        created_at: new Date()
      });
    }

    const student = await Student.findById(req.user._id)
      .select('-password')
      .populate('enrolled_courses', 'course_name course_code');

    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json({
      student_id: student.student_id,
      full_name: student.full_name,
      username: student.username,
      email: student.email,
      department: student.department,
      level: student.level,
      GPA: student.GPA,
      enrolled_courses: student.enrolled_courses,
      created_at: student.created_at,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyCourses = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockStudents, mockCourses } = require('./mockData');
      const student = mockStudents.find(s => s._id === req.user._id.toString() || s.email === req.user.email);
      if (!student) return res.status(404).json({ message: 'Student not found (mock mode)' });
      
      const enrolledCourses = mockCourses.filter(c => student.enrolled_courses.includes(c._id));
      return res.json(enrolledCourses);
    }

    const student = await Student.findById(req.user._id)
      .select('enrolled_courses')
      .populate({
        path: 'enrolled_courses',
        select: 'course_name course_code department assigned_instructors',
        populate: { path: 'assigned_instructors', select: 'full_name email' }
      });

    if (!student) return res.status(404).json({ message: 'Student not found' });

    const courses = (student.enrolled_courses || []).map((c) => ({
      id: c._id,
      course_name: c.course_name,
      course_code: c.course_code,
      department: c.department,
      instructors: (c.assigned_instructors || []).map(i => ({ id: i._id, full_name: i.full_name, email: i.email })),
    }));

    res.json({ data: courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseAssignments = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockAssignments } = require('./mockData');
      const assignments = mockAssignments.filter(a => a.course_id === courseId);
      return res.json(assignments);
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const enrolled = await ensureStudentEnrolled(courseId, req.user._id);
    if (!enrolled) return res.status(403).json({ message: 'Not enrolled in this course' });

    const assignments = await Assignment.find({ course_id: courseId }).sort({ deadline: 1 });

    // Attach student's submission status for each assignment
    const results = await Promise.all(assignments.map(async (a) => {
      const submission = await AssignmentSubmission.findOne({ assignment_id: a._id, student_id: req.user._id });
      return {
        id: a._id,
        assignment_id: a.assignment_id,
        title: a.title,
        description: a.description,
        deadline: a.deadline,
        total_marks: a.total_marks,
        submission: submission ? { id: submission._id, grade: submission.grade, submitted_at: submission.submission_date } : null,
      };
    }));

    res.json({ data: results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseLectures = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockMaterials } = require('./mockData');
      const lectures = mockMaterials.filter(m => m.course_id === courseId && m.status === 'Published');
      return res.json(lectures);
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const enrolled = await ensureStudentEnrolled(courseId, req.user._id);
    if (!enrolled) return res.status(403).json({ message: 'Not enrolled in this course' });

    const materials = await Material.find({ course_id: courseId }).sort({ upload_date: -1 });
    const data = materials.map(m => ({ id: m._id, title: m.title, file_url: m.file_url, upload_date: m.upload_date }));
    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseStream = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockAssignments } = require('./mockData');
      const announcements = [
        { _id: 'mock_ann_001', title: 'Welcome to the course', content: 'Welcome back students! Prepare for your upcoming lectures and assignments.', createdAt: new Date() }
      ];
      const recentAssignments = mockAssignments.filter(a => a.course_id === courseId);
      return res.json({ announcements, recentAssignments });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const enrolled = await ensureStudentEnrolled(courseId, req.user._id);
    if (!enrolled) return res.status(403).json({ message: 'Not enrolled in this course' });

    const announcements = await Announcement.find({ targetRole: { $in: ['student', 'all'] } })
      .sort({ createdAt: -1 })
      .limit(50);

    const recentAssignments = await Assignment.find({ course_id: courseId }).sort({ created_at: -1 }).limit(10);

    res.json({ announcements, recentAssignments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getMyGrades = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockCourses, mockSubmissions, mockAssignments } = require('./mockData');
      const results = mockCourses.map(c => {
        const assignmentsForCourse = mockAssignments.filter(a => a.course_id === c._id);
        const mappedSubmissions = mockSubmissions
          .filter(s => s.student_id === req.user._id.toString() || s.student_id === 'mock_stud_001')
          .map(s => {
            const assignment = assignmentsForCourse.find(a => a._id === s.assignment_id);
            if (!assignment) return null;
            return {
              assignment_title: assignment.title,
              grade: s.grade,
              max: assignment.total_marks,
              feedback: s.feedback,
              submitted_at: s.submission_date
            };
          }).filter(Boolean);
          
        return {
          course: { id: c._id, course_name: c.course_name, course_code: c.course_code },
          final_grade: 'A',
          assignments: mappedSubmissions
        };
      });
      return res.json({ data: results });
    }

    // Load enrollments for the student to get course context and final_grade
    const enrollments = await Enrollment.find({ student_id: req.user._id }).populate('course_id', 'course_name course_code');

    // Load all submissions by the student and populate assignment -> course
    const submissions = await AssignmentSubmission.find({ student_id: req.user._id }).populate({
      path: 'assignment_id',
      select: 'title course_id total_marks',
      populate: { path: 'course_id', select: 'course_name course_code' }
    });

    // Group submissions by course
    const courseMap = {};
    submissions.forEach((s) => {
      const courseId = s.assignment_id.course_id._id.toString();
      if (!courseMap[courseId]) courseMap[courseId] = [];
      courseMap[courseId].push({
        assignment_title: s.assignment_id.title,
        grade: s.grade,
        max: s.assignment_id.total_marks,
        feedback: s.feedback,
        submitted_at: s.submission_date,
      });
    });

    const results = enrollments.map((e) => {
      const cid = e.course_id._id.toString();
      return {
        course: { id: e.course_id._id, course_name: e.course_id.course_name, course_code: e.course_id.course_code },
        final_grade: e.final_grade || null,
        assignments: courseMap[cid] || [],
      };
    });

    res.json({ data: results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyCalendar = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockAssignments } = require('./mockData');
      const events = mockAssignments.map(a => ({
        type: 'assignment',
        title: a.title,
        course_id: a.course_id,
        when: a.deadline
      }));
      return res.json({ data: events });
    }

    const enrollments = await Enrollment.find({ student_id: req.user._id, status: 'active' });
    const courseIds = enrollments.map(e => e.course_id);

    // Upcoming assignment deadlines
    const now = new Date();
    const assignments = await Assignment.find({ course_id: { $in: courseIds }, deadline: { $gte: now } })
      .select('title course_id deadline')
      .sort({ deadline: 1 })
      .limit(100);

    const events = assignments.map(a => ({
      type: 'assignment',
      title: a.title,
      course_id: a.course_id,
      when: a.deadline,
    }));

    res.json({ data: events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAssignmentSubmission = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const assignmentId = req.params.id;
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockAssignments, mockSubmissions } = require('./mockData');
      const assignment = mockAssignments.find(a => a._id === assignmentId);
      if (!assignment) return res.status(404).json({ message: 'Assignment not found (mock mode)' });
      
      const submission = mockSubmissions.find(s => s.assignment_id === assignmentId && (s.student_id === req.user._id.toString() || s.student_id === 'mock_stud_001'));
      return res.json({
        assignment: { id: assignment._id, title: assignment.title, deadline: assignment.deadline, total_marks: assignment.total_marks },
        submission: submission ? { id: submission._id, grade: submission.grade, feedback: submission.feedback, submitted_at: submission.submission_date, file: submission.uploaded_file } : null,
      });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // Verify enrollment
    const enrolled = await ensureStudentEnrolled(assignment.course_id, req.user._id);
    if (!enrolled) return res.status(403).json({ message: 'Not enrolled in this course' });

    const submission = await AssignmentSubmission.findOne({ assignment_id: assignment._id, student_id: req.user._id });

    res.json({
      assignment: { id: assignment._id, title: assignment.title, deadline: assignment.deadline, total_marks: assignment.total_marks },
      submission: submission ? { id: submission._id, grade: submission.grade, feedback: submission.feedback, submitted_at: submission.submission_date, file: submission.uploaded_file } : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentAssignments = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockAssignments, mockSubmissions, mockStudents } = require('./mockData');
      const student = mockStudents.find(s => s._id === req.user._id.toString() || s.email === req.user.email);
      const courseIds = student ? student.enrolled_courses : ['mock_c_001', 'mock_c_002'];
      const assignments = mockAssignments.filter(a => courseIds.includes(a.course_id));
      const results = assignments.map(a => {
        const submission = mockSubmissions.find(s => s.assignment_id === a._id && (s.student_id === req.user._id.toString() || s.student_id === 'mock_stud_001'));
        return {
          _id: a._id,
          assignment_id: a.assignment_id,
          title: a.title,
          description: a.description,
          deadline: a.deadline,
          total_marks: a.total_marks,
          course_id: a.course_id,
          status: a.status || 'Open',
          submission: submission ? { status: submission.grade !== undefined ? 'Graded' : 'Submitted', grade: submission.grade } : { status: 'Not Submitted' }
        };
      });
      return res.json(results);
    }

    const student = await Student.findById(req.user._id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    const courseIds = student.enrolled_courses || [];
    const assignments = await Assignment.find({ course_id: { $in: courseIds } }).sort({ deadline: 1 });
    
    const results = await Promise.all(assignments.map(async (a) => {
      const submission = await AssignmentSubmission.findOne({ assignment_id: a._id, student_id: req.user._id });
      return {
        _id: a._id,
        assignment_id: a.assignment_id,
        title: a.title,
        description: a.description,
        deadline: a.deadline,
        total_marks: a.total_marks,
        course_id: a.course_id,
        submission: submission ? { status: submission.grade !== undefined ? 'Graded' : 'Submitted', grade: submission.grade } : { status: 'Not Submitted' }
      };
    }));
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitAssignment = async (req, res) => {
  const assignmentId = req.params.id;
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockAssignments, mockSubmissions } = require('./mockData');
      const assignment = mockAssignments.find(a => a._id === assignmentId);
      if (!assignment) return res.status(404).json({ message: 'Assignment not found (mock mode)' });
      if (assignment.status === 'Closed') {
        return res.status(400).json({ message: 'Submissions are closed for this assignment.' });
      }
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'Please upload a file.' });
      }
      let submission = mockSubmissions.find(s => s.assignment_id === assignmentId && s.student_id === req.user._id.toString());
      if (submission) {
        submission.uploaded_file = `/uploads/${file.filename}`;
        submission.submission_date = new Date();
      } else {
        submission = {
          _id: 'mock_sub_' + Date.now(),
          submission_id: 'SUB-' + Date.now(),
          assignment_id: assignmentId,
          student_id: req.user._id.toString(),
          uploaded_file: `/uploads/${file.filename}`,
          submission_date: new Date()
        };
        mockSubmissions.push(submission);
      }
      return res.status(200).json({ message: 'Assignment submitted successfully! (mock mode)', submission });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    
    if (assignment.status === 'Closed') {
      return res.status(400).json({ message: 'Submissions are closed for this assignment.' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Please upload a file.' });
    }

    let submission = await AssignmentSubmission.findOne({ assignment_id: assignmentId, student_id: req.user._id });
    if (submission) {
      submission.uploaded_file = `/uploads/${file.filename}`;
      submission.submission_date = new Date();
      await submission.save();
    } else {
      submission = await AssignmentSubmission.create({
        assignment_id: assignmentId,
        student_id: req.user._id,
        uploaded_file: `/uploads/${file.filename}`,
        submission_date: new Date()
      });
    }

    res.status(200).json({ message: 'Assignment submitted successfully!', submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseGrades = async (req, res) => {
  const courseId = req.params.courseId;
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockAssignments, mockSubmissions } = require('./mockData');
      const assignments = mockAssignments.filter(a => a.course_id === courseId);
      const grades = mockSubmissions
        .filter(s => s.student_id === req.user._id.toString() || s.student_id === 'mock_stud_001')
        .map(s => {
          const assignment = assignments.find(a => a._id === s.assignment_id);
          if (!assignment) return null;
          return {
            assignment_title: assignment.title,
            grade: s.grade,
            max: assignment.total_marks,
            feedback: s.feedback,
            submitted_at: s.submission_date
          };
        }).filter(Boolean);
      return res.json({ data: grades });
    }

    const enrolled = await ensureStudentEnrolled(courseId, req.user._id);
    if (!enrolled) return res.status(403).json({ message: 'Not enrolled in this course' });

    const submissions = await AssignmentSubmission.find({ student_id: req.user._id })
      .populate({
        path: 'assignment_id',
        match: { course_id: courseId },
        select: 'title total_marks'
      });

    const filtered = submissions.filter(s => s.assignment_id !== null);

    const grades = filtered.map(s => ({
      assignment_title: s.assignment_id.title,
      grade: s.grade,
      max: s.assignment_id.total_marks,
      feedback: s.feedback,
      submitted_at: s.submission_date
    }));

    res.json({ data: grades });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCourseStreamPost = async (req, res) => {
  const courseId = req.params.courseId;
  const { content } = req.body;
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const announcement = {
        _id: 'mock_ann_' + Date.now(),
        course_id: courseId,
        student_id: req.user._id,
        title: 'Student Post',
        content,
        targetRole: 'all',
        createdAt: new Date()
      };
      return res.status(201).json({ message: 'Post created successfully! (mock mode)', announcement });
    }

    const enrolled = await ensureStudentEnrolled(courseId, req.user._id);
    if (!enrolled) return res.status(403).json({ message: 'Not enrolled in this course' });

    const announcement = await Announcement.create({
      course_id: courseId,
      instructor_id: null,
      student_id: req.user._id,
      title: 'Student Post',
      content,
      targetRole: 'all',
      createdAt: new Date()
    });

    res.status(201).json({ message: 'Post created successfully!', announcement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailableCourses = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockCourses, mockStudents } = require('./mockData');
      const student = mockStudents.find(s => s._id === req.user._id.toString() || s.email === req.user.email);
      const enrolledIds = student ? student.enrolled_courses : [];
      const courses = mockCourses.filter(c => !enrolledIds.includes(c._id));
      return res.json({ data: courses });
    }

    const student = await Student.findById(req.user._id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const enrolledIds = student.enrolled_courses || [];
    const courses = await Course.find({
      _id: { $nin: enrolledIds },
      department: student.department
    });

    res.json({ data: courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerCourse = async (req, res) => {
  const courseId = req.params.courseId;
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockCourses, mockStudents } = require('./mockData');
      const student = mockStudents.find(s => s._id === req.user._id.toString() || s.email === req.user.email);
      if (!student) return res.status(404).json({ message: 'Student not found (mock mode)' });
      const course = mockCourses.find(c => c._id === courseId);
      if (!course) return res.status(404).json({ message: 'Course not found (mock mode)' });
      if (student.enrolled_courses.includes(courseId)) {
        return res.status(400).json({ message: 'Already registered in this course' });
      }
      student.enrolled_courses.push(courseId);
      return res.json({ message: 'Course registered successfully! (mock mode)', enrolled_courses: student.enrolled_courses });
    }

    const student = await Student.findById(req.user._id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (student.enrolled_courses.includes(courseId)) {
      return res.status(400).json({ message: 'Already registered in this course' });
    }

    student.enrolled_courses.push(courseId);
    await student.save();

    await Enrollment.create({
      student_id: student._id,
      course_id: courseId,
      status: 'active',
      enrollment_date: new Date()
    });

    res.json({ message: 'Course registered successfully!', enrolled_courses: student.enrolled_courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMyProfile = async (req, res) => {
  const { username, email, department, level } = req.body;
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockStudents } = require('./mockData');
      const student = mockStudents.find(s => s._id === req.user._id.toString() || s.email === req.user.email);
      if (!student) return res.status(404).json({ message: 'Student not found (mock mode)' });

      if (username) student.username = username;
      if (email) student.email = email;
      if (department) student.department = department;
      if (level) student.level = level;

      return res.json({
        message: 'Profile updated successfully! (mock mode)',
        student: {
          student_id: student.student_id,
          full_name: student.full_name,
          username: student.username,
          email: student.email,
          department: student.department,
          level: student.level,
          GPA: student.GPA || 3.4
        }
      });
    }

    const student = await Student.findById(req.user._id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (username) student.username = username;
    if (email) student.email = email;
    if (department) student.department = department;
    if (level) student.level = level;

    await student.save();

    res.json({
      message: 'Profile updated successfully!',
      student: {
        student_id: student.student_id,
        full_name: student.full_name,
        username: student.username,
        email: student.email,
        department: student.department,
        level: student.level,
        GPA: student.GPA
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Aliases matching required imports in studentRoutes.js
const getStudentAssignmentById = getAssignmentSubmission;
const getStudentGrades = getMyGrades;
const getStudentEnrolledCourses = getMyCourses;

module.exports = {
  getMyProfile,
  getMyCourses,
  getCourseAssignments,
  getCourseLectures,
  getCourseStream,
  getMyGrades,
  getMyCalendar,
  getAssignmentSubmission,
  getStudentAssignments,
  submitAssignment,
  getCourseGrades,
  createCourseStreamPost,
  getAvailableCourses,
  registerCourse,
  updateMyProfile,
  getStudentAssignmentById,
  getStudentGrades,
  getStudentEnrolledCourses
};

