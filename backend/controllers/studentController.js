import Student from '../models/Student.js';
import Course from '../models/Course.js';
import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Material from '../models/Material.js';
import Announcement from '../models/Announcement.js';
import Enrollment from '../models/Enrollment.js';

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

    // Verify enrollment
    const enrolled = await Enrollment.findOne({ course_id: courseId, student_id: req.user._id, status: 'active' });
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

    // Verify enrollment
    const enrolled = await Enrollment.findOne({ course_id: courseId, student_id: req.user._id, status: 'active' });
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

    // Verify enrollment
    const enrolled = await Enrollment.findOne({ course_id: courseId, student_id: req.user._id, status: 'active' });
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
  res.status(501).json({ message: 'Student grades endpoint not implemented yet' });
};

export const getMyCalendar = async (req, res) => {
  res.status(501).json({ message: 'Student calendar endpoint not implemented yet' });
};


export const getAssignmentSubmission = async (req, res) => {
  res.status(501).json({ message: 'Assignment submission endpoint not implemented yet' });
};
