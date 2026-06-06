const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import all models to register their schemas with Mongoose
const Student = require('./models/Student');
const Instructor = require('./models/Instructor');
const Admin = require('./models/Admin');
const Course = require('./models/Course');
const CoursePrerequisite = require('./models/CoursePrerequisite');
const Enrollment = require('./models/Enrollment');
const Assignment = require('./models/Assignment');
const AssignmentSubmission = require('./models/AssignmentSubmission');
const Quiz = require('./models/Quiz');
const QuizSubmission = require('./models/QuizSubmission');
const Material = require('./models/Material');
const EmailTemplate = require('./models/EmailTemplate');
const SystemLog = require('./models/SystemLog');
const Message = require('./models/Message');
const Notification = require('./models/Notification');
const CoursePost = require('./models/CoursePost');
const Announcement = require('./models/Announcement');
const SystemSetting = require('./models/SystemSetting');

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const email = 'john@student.com';
    const student = await Student.findOne({ email }).populate({
      path: 'enrolled_courses',
      populate: { path: 'assigned_instructors', select: 'full_name' }
    });

    if (!student) {
      console.log('Student not found!');
      process.exit(1);
    }

    console.log('--- STUDENT DETAILS ---');
    console.log(`ID: ${student._id}`);
    console.log(`Name: ${student.full_name}`);
    console.log(`Enrolled Courses count: ${student.enrolled_courses.length}`);
    student.enrolled_courses.forEach(c => {
      console.log(`- Course Code: ${c.course_code} | Name: ${c.course_name}`);
    });

    const enrollments = await Enrollment.find({ student_id: student._id });
    console.log(`\nEnrollment records count: ${enrollments.length}`);
    enrollments.forEach(e => {
      console.log(`- Course ID: ${e.course_id} | Status: ${e.status} | Grade: ${e.final_grade}`);
    });

    const allCourses = await Course.find({})
      .populate('prerequisite_course_id', 'course_name course_code')
      .populate('assigned_instructors', 'full_name');
    console.log(`\nTotal Courses in DB: ${allCourses.length}`);
    allCourses.forEach(c => {
      console.log(`- ${c.course_code}: ${c.course_name}`);
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
