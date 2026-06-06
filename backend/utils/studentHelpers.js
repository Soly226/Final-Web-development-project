const Enrollment = require('../models/Enrollment');

const ensureStudentEnrolled = async (courseId, studentId) => {
  return await Enrollment.findOne({
    course_id: courseId,
    student_id: studentId,
    status: 'active',
  });
};

module.exports = {
  ensureStudentEnrolled
};
