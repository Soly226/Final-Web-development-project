import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Import all models
import Student from '../models/Student.js';
import Instructor from '../models/Instructor.js';
import Admin from '../models/Admin.js';
import Course from '../models/Course.js';
import CoursePrerequisite from '../models/CoursePrerequisite.js';
import Enrollment from '../models/Enrollment.js';
import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Quiz from '../models/Quiz.js';
import QuizSubmission from '../models/QuizSubmission.js';
import Material from '../models/Material.js';
import EmailTemplate from '../models/EmailTemplate.js';
import SystemLog from '../models/SystemLog.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for comprehensive seeding...');

    // Clear existing data
    await Promise.all([
      Student.deleteMany(),
      Instructor.deleteMany(),
      Admin.deleteMany(),
      Course.deleteMany(),
      CoursePrerequisite.deleteMany(),
      Enrollment.deleteMany(),
      Assignment.deleteMany(),
      AssignmentSubmission.deleteMany(),
      Quiz.deleteMany(),
      QuizSubmission.deleteMany(),
      Material.deleteMany(),
      EmailTemplate.deleteMany(),
      SystemLog.deleteMany()
    ]);

    console.log('Cleared all existing collections.');

    // 1. Create Admins
    const admin1 = await Admin.create({
      admin_id: 'ADM001',
      full_name: 'Super Admin',
      username: 'admin',
      email: 'admin@educore.com',
      password: 'password123',
      permissions: ['all']
    });

    // 2. Create Instructors
    const instructor1 = await Instructor.create({
      instructor_id: 'INST001',
      full_name: 'Dr. Alan Turing',
      username: 'aturing',
      email: 'turing@educore.com',
      password: 'password123',
      department: 'Computer Science',
      role: 'head_of_department'
    });

    const instructor2 = await Instructor.create({
      instructor_id: 'INST002',
      full_name: 'Grace Hopper',
      username: 'ghopper',
      email: 'hopper@educore.com',
      password: 'password123',
      department: 'Computer Science',
      role: 'instructor'
    });

    // 3. Create Courses
    const course1 = await Course.create({
      course_id: 'C001',
      course_code: 'CS101',
      course_name: 'Introduction to Programming',
      description: 'Basics of programming using Python.',
      credit_hours: 3,
      department: 'Computer Science'
    });

    const course2 = await Course.create({
      course_id: 'C002',
      course_code: 'CS102',
      course_name: 'Problem Solving',
      description: 'Advanced logic and problem solving.',
      credit_hours: 3,
      department: 'Computer Science',
      prerequisite_course_id: course1._id,
      assigned_instructors: [instructor1._id]
    });

    // 4. Create Course Prerequisites
    await CoursePrerequisite.create({
      prerequisite_id: 'PR001',
      course_id: course2._id,
      required_course_id: course1._id
    });

    // 5. Create Students
    const student1 = await Student.create({
      student_id: 'ST001',
      full_name: 'John Doe',
      username: 'jdoe',
      email: 'john@student.com',
      password: 'password123',
      department: 'Computer Science',
      level: 'Year 1',
      GPA: 3.8,
      enrolled_courses: [course1._id, course2._id]
    });

    // Update Course with enrolled student
    await Course.findByIdAndUpdate(course1._id, { $push: { enrolled_students: student1._id } });
    await Course.findByIdAndUpdate(course2._id, { $push: { enrolled_students: student1._id } });

    // 6. Create Enrollments
    await Enrollment.create({
      enrollment_id: 'ENR001',
      student_id: student1._id,
      course_id: course1._id,
      semester: 'Fall 2024',
      status: 'completed',
      final_grade: 'A'
    });

    await Enrollment.create({
      enrollment_id: 'ENR002',
      student_id: student1._id,
      course_id: course2._id,
      semester: 'Spring 2025',
      status: 'active'
    });

    // 7. Create Assignments
    const assignment1 = await Assignment.create({
      assignment_id: 'ASG001',
      course_id: course2._id,
      instructor_id: instructor1._id,
      title: 'Logic Puzzles',
      description: 'Solve the set of logic puzzles using recursion.',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      total_marks: 100
    });

    // 8. Create Assignment Submissions
    await AssignmentSubmission.create({
      submission_id: 'SUB001',
      assignment_id: assignment1._id,
      student_id: student1._id,
      uploaded_file: '/uploads/logic_puzzles_jdoe.pdf',
      grade: 95,
      feedback: 'Excellent work on the recursive solutions.'
    });

    // 9. Create Quizzes
    const quiz1 = await Quiz.create({
      quiz_id: 'QZ001',
      course_id: course1._id,
      instructor_id: instructor2._id,
      title: 'Python Basics Quiz',
      duration: 30,
      total_marks: 50
    });

    // 10. Create Quiz Submissions
    await QuizSubmission.create({
      submission_id: 'QSUB001',
      quiz_id: quiz1._id,
      student_id: student1._id,
      answers: { q1: 'print()', q2: 'def', q3: 'indentation' },
      grade: 48
    });

    // 11. Create Materials
    await Material.create({
      material_id: 'MAT001',
      course_id: course1._id,
      instructor_id: instructor2._id,
      title: 'Python Syntax Guide',
      file_url: '/materials/python_syntax.pdf'
    });

    // 12. Create Email Templates
    await EmailTemplate.create({
      name: 'Welcome Email',
      subject: 'Welcome to EduCore LMS',
      body: 'Hello {{name}}, welcome to our platform! Your student ID is {{student_id}}.',
      variables: ['name', 'student_id'],
      updatedBy: admin1._id
    });

    // 13. Create Logs
    await SystemLog.create([
      { level: 'info', message: 'Database populated with comprehensive seed data', source: 'Seeder' },
      { level: 'info', message: 'Admin user ADM001 created', source: 'Auth' }
    ]);



    console.log('Database seeded successfully with all requested entities!');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
