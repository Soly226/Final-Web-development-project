import Enrollment from '../models/Enrollment.js';

export const ensureStudentEnrolled = async (courseId, studentId) => {
  return await Enrollment.findOne({
    course_id: courseId,
    student_id: studentId,
    status: 'active',
  });
};
