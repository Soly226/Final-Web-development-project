import Student from '../models/Student.js';
import Course from '../models/Course.js';

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
  res.status(501).json({ message: 'Student courses endpoint not implemented yet' });
};

export const getMyGrades = async (req, res) => {
  res.status(501).json({ message: 'Student grades endpoint not implemented yet' });
};

export const getMyCalendar = async (req, res) => {
  res.status(501).json({ message: 'Student calendar endpoint not implemented yet' });
};

export const getCourseAssignments = async (req, res) => {
  res.status(501).json({ message: 'Course assignments endpoint not implemented yet' });
};

export const getCourseLectures = async (req, res) => {
  res.status(501).json({ message: 'Course lectures endpoint not implemented yet' });
};

export const getCourseStream = async (req, res) => {
  res.status(501).json({ message: 'Course stream endpoint not implemented yet' });
};

export const getAssignmentSubmission = async (req, res) => {
  res.status(501).json({ message: 'Assignment submission endpoint not implemented yet' });
};
