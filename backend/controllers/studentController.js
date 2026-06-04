import Student from '../models/Student.js';
import Course from '../models/Course.js';
import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Material from '../models/Material.js';
import Announcement from '../models/Announcement.js';
import Enrollment from '../models/Enrollment.js';
import { ensureStudentEnrolled } from '../utils/studentHelpers.js';

export const getMyProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

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

export const getMyCourses = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

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

export const getCourseAssignments = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

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

export const getCourseLectures = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

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

export const getCourseStream = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

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



export const getMyGrades = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

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

export const getMyCalendar = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

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


export const getAssignmentSubmission = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const assignmentId = req.params.id;
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
