const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const Material = require('../models/Material');
const Enrollment = require('../models/Enrollment');
const Notification = require('../models/Notification');
const Instructor = require('../models/Instructor');
const mongoose = require('mongoose');
const TeachingTask = require('../models/TeachingTask');

// --- Course Management for Instructors ---

const getInstructorCourses = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const { mockCourses } = require('./mockData');
      const courses = mockCourses.filter(c => 
        c.assigned_instructors.some(inst => inst._id.toString() === req.user._id.toString())
      );
      return res.json(courses);
    }
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
const createAssignment = async (req, res) => {
  const { course_id, title, description, deadline, total_marks } = req.body;

  try {
    if (mongoose.connection.readyState !== 1) {
      const { mockAssignments, mockCourses } = require('./mockData');
      const course = mockCourses.find(c => c._id === course_id);
      if (!course) {
        return res.status(404).json({ message: 'Course not found (mock mode)' });
      }
      const newAssignment = {
        _id: 'mock_a_' + Date.now(),
        assignment_id: `ASG-${Date.now()}`,
        course_id,
        instructor_id: req.user._id.toString(),
        title,
        description,
        deadline: deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        total_marks: Number(total_marks) || 100,
        status: 'Open',
        created_at: new Date()
      };
      mockAssignments.push(newAssignment);
      return res.status(201).json(newAssignment);
    }

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
      total_marks,
      status: 'Open'
    });

    // Find active student enrollments for this course and notify them
    const enrollments = await Enrollment.find({ course_id, status: 'active' });
    if (enrollments.length > 0) {
      const notifications = enrollments.map((e) => ({
        user: e.student_id,
        userModel: 'Student',
        type: 'assignment',
        title: 'New Assignment Published',
        message: `A new assignment "${title}" has been published in course ${course.course_name || 'your course'}.`,
      }));
      await Notification.insertMany(notifications);
    }

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get assignments for instructor
// @route   GET /api/instructor/assignments
// @access  Private/Instructor
const getInstructorAssignments = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const { mockAssignments, mockCourses, mockSubmissions, mockStudents } = require('./mockData');
      const assignedCourseIds = mockCourses
        .filter(c => c.assigned_instructors.some(inst => inst._id.toString() === req.user._id.toString()))
        .map(c => c._id);
      
      const filtered = mockAssignments.filter(a => 
        a.instructor_id.toString() === req.user._id.toString() || assignedCourseIds.includes(a.course_id)
      );
      
      const populated = filtered.map(a => {
        const course = mockCourses.find(c => c._id === a.course_id);
        const submissionsForAsg = mockSubmissions.filter(s => s.assignment_id === a._id);
        const enrolledStudents = mockStudents.filter(s => s.enrolled_courses.includes(a.course_id));
        
        return {
          ...a,
          course_id: {
            _id: a.course_id,
            course_name: course ? course.course_name : 'Unknown Course',
            course_code: course ? course.course_code : ''
          },
          submittedCount: submissionsForAsg.length,
          totalStudentsCount: enrolledStudents.length
        };
      });
      return res.json(populated);
    }

    const courses = await Course.find({ assigned_instructors: req.user._id });
    const courseIds = courses.map(c => c._id);

    const assignments = await Assignment.find({
      $or: [
        { instructor_id: req.user._id },
        { course_id: { $in: courseIds } }
      ]
    }).populate('course_id', 'course_name course_code').sort({ created_at: -1 });

    const populated = await Promise.all(assignments.map(async (a) => {
      const submittedCount = await AssignmentSubmission.countDocuments({ assignment_id: a._id });
      const totalStudentsCount = await Student.countDocuments({ enrolled_courses: a.course_id });
      return {
        ...a.toObject(),
        submittedCount,
        totalStudentsCount
      };
    }));

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle assignment status (Open/Closed)
// @route   PUT /api/instructor/assignments/:id/status
// @access  Private/Instructor
const toggleAssignmentStatus = async (req, res) => {
  const { id } = req.params;
  try {
    if (mongoose.connection.readyState !== 1) {
      const { mockAssignments } = require('./mockData');
      const idx = mockAssignments.findIndex(a => a._id === id);
      if (idx === -1) {
        return res.status(404).json({ message: 'Assignment not found (mock mode)' });
      }
      mockAssignments[idx].status = mockAssignments[idx].status === 'Open' ? 'Closed' : 'Open';
      return res.json({ message: `Status updated to ${mockAssignments[idx].status}`, assignment: mockAssignments[idx] });
    }

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    assignment.status = assignment.status === 'Open' ? 'Closed' : 'Open';
    await assignment.save();

    res.json({ message: `Status updated to ${assignment.status}`, assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get submissions and roster status for an assignment
// @route   GET /api/instructor/assignments/:id/submissions
// @access  Private/Instructor
const getAssignmentSubmissions = async (req, res) => {
  const { id } = req.params;
  try {
    if (mongoose.connection.readyState !== 1) {
      const { mockAssignments, mockStudents, mockSubmissions } = require('./mockData');
      const assignment = mockAssignments.find(a => a._id === id);
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found (mock mode)' });
      }

      // Find all students enrolled in this course
      const enrolledStudents = mockStudents.filter(s => s.enrolled_courses.includes(assignment.course_id));

      const roster = enrolledStudents.map(student => {
        const submission = mockSubmissions.find(s => s.assignment_id === id && s.student_id === student._id);
        return {
          student_id: {
            _id: student._id,
            student_id: student.student_id,
            full_name: student.full_name,
            email: student.email
          },
          status: submission ? 'Submitted' : 'Not Submitted',
          submission_date: submission ? submission.submission_date : null,
          uploaded_file: submission ? submission.uploaded_file : null,
          grade: submission ? submission.grade : null,
          feedback: submission ? submission.feedback : null,
          submission_id: submission ? submission._id : null
        };
      });

      return res.json(roster);
    }

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Find all students enrolled in this course
    const enrolledStudents = await Student.find({ enrolled_courses: assignment.course_id }, 'full_name student_id email');

    // Find all submissions for this assignment
    const submissions = await AssignmentSubmission.find({ assignment_id: id });

    // Map roster
    const roster = enrolledStudents.map(student => {
      const sub = submissions.find(s => s.student_id.toString() === student._id.toString());
      return {
        student_id: {
          _id: student._id,
          student_id: student.student_id,
          full_name: student.full_name,
          email: student.email
        },
        status: sub ? 'Submitted' : 'Not Submitted',
        submission_date: sub ? sub.submission_date : null,
        uploaded_file: sub ? sub.uploaded_file : null,
        grade: sub ? sub.grade : null,
        feedback: sub ? sub.feedback : null,
        submission_id: sub ? sub._id : null
      };
    });

    res.json(roster);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grade an assignment submission
// @route   PUT /api/instructor/submissions/:id/grade
// @access  Private/Instructor
const gradeSubmission = async (req, res) => {
  const { grade, feedback } = req.body;
  const { id } = req.params;

  try {
    if (mongoose.connection.readyState !== 1) {
      const { mockSubmissions } = require('./mockData');
      const subIdx = mockSubmissions.findIndex(s => s._id === id);
      if (subIdx === -1) {
        return res.status(404).json({ message: 'Submission not found (mock mode)' });
      }

      mockSubmissions[subIdx].grade = Number(grade);
      mockSubmissions[subIdx].feedback = feedback;
      return res.json(mockSubmissions[subIdx]);
    }

    const submission = await AssignmentSubmission.findById(id).populate('assignment_id');
    if (!submission || submission.assignment_id.instructor_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    const updatedSubmission = await submission.save();

    // Create a notification for the student
    await Notification.create({
      user: submission.student_id,
      userModel: 'Student',
      type: 'grade',
      title: 'Assignment Graded',
      message: `Your submission for "${submission.assignment_id.title}" has been graded: ${grade}/${submission.assignment_id.total_marks || ''} marks.`,
    });

    res.json(updatedSubmission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Quiz Management ---

// @desc    Create a quiz
// @route   POST /api/instructor/quizzes
// @access  Private/Instructor
const createQuiz = async (req, res) => {
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
const uploadMaterial = async (req, res) => {
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

// @desc    Get course materials (lectures)
// @route   GET /api/instructor/courses/:courseId/materials
// @access  Private/Instructor
const getCourseMaterials = async (req, res) => {
  const { courseId } = req.params;
  try {
    if (mongoose.connection.readyState !== 1) {
      const { mockMaterials } = require('./mockData');
      const filtered = mockMaterials.filter(m => m.course_id === courseId);
      return res.json(filtered);
    }
    const materials = await Material.find({ course_id: courseId });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add course material (lecture)
// @route   POST /api/instructor/courses/:courseId/materials
// @access  Private/Instructor
const addCourseMaterial = async (req, res) => {
  const { courseId } = req.params;
  const { title, file_url, file_type, week, duration, status } = req.body;
  
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      const { mockMaterials } = require('./mockData');
      const newMaterial = {
        _id: 'mock_m_' + Date.now(),
        course_id: courseId,
        title,
        file_url: file_url || '',
        file_type: file_type || 'pdf',
        week: Number(week) || 1,
        duration: duration || 'TBD',
        status: status || 'Published',
        upload_date: new Date()
      };
      mockMaterials.push(newMaterial);
      return res.status(201).json({ message: 'Lecture added successfully (mock mode)', material: newMaterial });
    }

    const material = await Material.create({
      material_id: `MAT-${Date.now()}`,
      course_id: courseId,
      instructor_id: req.user._id,
      title,
      file_url: file_url || '',
      file_type: file_type || 'pdf',
      week: Number(week) || 1,
      duration: duration || 'TBD',
      status: status || 'Published'
    });

    res.status(201).json({ message: 'Lecture added successfully', material });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a course material (lecture)
// @route   DELETE /api/instructor/materials/:id
// @access  Private/Instructor
const deleteCourseMaterial = async (req, res) => {
  const { id } = req.params;
  try {
    if (mongoose.connection.readyState !== 1) {
      const { mockMaterials } = require('./mockData');
      const idx = mockMaterials.findIndex(m => m._id === id);
      if (idx !== -1) mockMaterials.splice(idx, 1);
      return res.json({ message: 'Lecture deleted successfully (mock mode)' });
    }
    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    if (material.instructor_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this material' });
    }
    await Material.findByIdAndDelete(id);
    res.json({ message: 'Lecture deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
  deleteCourseMaterial
};
