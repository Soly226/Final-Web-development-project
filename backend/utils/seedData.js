const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Import all models
const Student = require('../models/Student');
const Instructor = require('../models/Instructor');
const Admin = require('../models/Admin');
const Course = require('../models/Course');
const CoursePrerequisite = require('../models/CoursePrerequisite');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const Material = require('../models/Material');
const EmailTemplate = require('../models/EmailTemplate');
const SystemLog = require('../models/SystemLog');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const CoursePost = require('../models/CoursePost');
const Announcement = require('../models/Announcement');
const SystemSetting = require('../models/SystemSetting');

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
      SystemLog.deleteMany(),
      Message.deleteMany(),
      Notification.deleteMany(),
      CoursePost.deleteMany(),
      Announcement.deleteMany(),
      SystemSetting.deleteMany()
    ]);

    console.log('Cleared all existing collections.');

    // Ensure uploads directory exists and write mock files so download check works
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const mockFiles = [
      'logic_puzzles_jdoe.pdf',
      'logic_puzzles_bjohnson.pdf',
      'syntax_homework_jsmith.pdf',
      'syntax_homework_bjohnson.pdf',
      'python_syntax.pdf',
      'recursion_cheat_sheet.pdf',
      'big_o_guide.pdf'
    ];

    mockFiles.forEach(file => {
      const filePath = path.join(uploadDir, file);
      fs.writeFileSync(filePath, `%PDF-1.4 Mock PDF content for testing downloads of ${file}`);
      console.log(`Generated mock file: ${file}`);
    });

    // 1. Create Admins
    const admin1 = await Admin.create({
      admin_id: 'ADM001',
      full_name: 'Super Admin',
      username: 'admin',
      email: 'admin@educore.com',
      password: 'password123',
      permissions: ['all']
    });

    const admin2 = await Admin.create({
      admin_id: 'ADM002',
      full_name: 'Secondary Admin',
      username: 'secadmin',
      email: 'secadmin@educore.com',
      password: 'password123',
      permissions: ['user_management', 'course_management']
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

    const course3 = await Course.create({
      course_id: 'C003',
      course_code: 'CS201',
      course_name: 'Data Structures and Algorithms',
      description: 'Understanding stacks, queues, trees, and complexity analysis.',
      credit_hours: 3,
      department: 'Computer Science',
      prerequisite_course_id: course1._id,
      assigned_instructors: [instructor2._id]
    });

    const course4 = await Course.create({
      course_id: 'C004',
      course_code: 'EE101',
      course_name: 'Introduction to Electrical Engineering',
      description: 'Basic circuit analysis, voltage, current, and Ohm\'s law.',
      credit_hours: 3,
      department: 'Electrical Engineering',
      assigned_instructors: [instructor1._id]
    });

    const course5 = await Course.create({
      course_id: 'C005',
      course_code: 'CS301',
      course_name: 'Artificial Intelligence',
      description: 'Foundations of state-space search, heuristics, and machine learning.',
      credit_hours: 4,
      department: 'Computer Science',
      prerequisite_course_id: course3._id,
      assigned_instructors: [instructor2._id]
    });

    // Update assigned courses on Instructors
    await Instructor.findByIdAndUpdate(instructor1._id, { $addToSet: { assigned_courses: [course2._id, course4._id] } });
    await Instructor.findByIdAndUpdate(instructor2._id, { $addToSet: { assigned_courses: [course3._id, course5._id] } });

    // 4. Create Course Prerequisites links
    await CoursePrerequisite.create({
      prerequisite_id: 'PR001',
      course_id: course2._id,
      required_course_id: course1._id
    });

    await CoursePrerequisite.create({
      prerequisite_id: 'PR002',
      course_id: course3._id,
      required_course_id: course1._id
    });

    await CoursePrerequisite.create({
      prerequisite_id: 'PR003',
      course_id: course5._id,
      required_course_id: course3._id
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

    const student2 = await Student.create({
      student_id: 'ST002',
      full_name: 'Jane Smith',
      username: 'jsmith',
      email: 'jane@student.com',
      password: 'password123',
      department: 'Computer Science',
      level: 'Year 1',
      GPA: 3.5,
      enrolled_courses: [course1._id, course3._id]
    });

    const student3 = await Student.create({
      student_id: 'ST003',
      full_name: 'Bob Johnson',
      username: 'bjohnson',
      email: 'bob@student.com',
      password: 'password123',
      department: 'Computer Science',
      level: 'Year 2',
      GPA: 3.2,
      enrolled_courses: [course1._id, course2._id, course3._id]
    });

    // Update Course with enrolled students
    await Course.findByIdAndUpdate(course1._id, { $addToSet: { enrolled_students: [student1._id, student2._id, student3._id] } });
    await Course.findByIdAndUpdate(course2._id, { $addToSet: { enrolled_students: [student1._id, student3._id] } });
    await Course.findByIdAndUpdate(course3._id, { $addToSet: { enrolled_students: [student2._id, student3._id] } });

    // 6. Create Enrollments
    // Student 1
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

    // Student 2
    await Enrollment.create({
      enrollment_id: 'ENR003',
      student_id: student2._id,
      course_id: course1._id,
      semester: 'Fall 2024',
      status: 'completed',
      final_grade: 'B'
    });
    await Enrollment.create({
      enrollment_id: 'ENR004',
      student_id: student2._id,
      course_id: course3._id,
      semester: 'Spring 2025',
      status: 'active'
    });

    // Student 3
    await Enrollment.create({
      enrollment_id: 'ENR005',
      student_id: student3._id,
      course_id: course1._id,
      semester: 'Fall 2024',
      status: 'completed',
      final_grade: 'C'
    });
    await Enrollment.create({
      enrollment_id: 'ENR006',
      student_id: student3._id,
      course_id: course2._id,
      semester: 'Spring 2025',
      status: 'active'
    });
    await Enrollment.create({
      enrollment_id: 'ENR007',
      student_id: student3._id,
      course_id: course3._id,
      semester: 'Spring 2025',
      status: 'active'
    });

    // 7. Create System settings
    await SystemSetting.create({
      platformName: 'EduCore LMS',
      primaryLanguage: 'English',
      twoFactorEnabled: false,
      sessionTimeoutMinutes: 60,
      maxLoginAttempts: 5,
      smtpHost: 'smtp.educore.com',
      smtpPort: 587
    });

    // 8. Create Assignments
    const assignment1 = await Assignment.create({
      assignment_id: 'ASG001',
      course_id: course2._id,
      instructor_id: instructor1._id,
      title: 'Logic Puzzles',
      description: 'Solve the set of logic puzzles using recursion.',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      total_marks: 100
    });

    const assignment2 = await Assignment.create({
      assignment_id: 'ASG002',
      course_id: course2._id,
      instructor_id: instructor1._id,
      title: 'Recursion Lab',
      description: 'Implement fibonacci and factorial using tail recursion.',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      total_marks: 50
    });

    const assignment3 = await Assignment.create({
      assignment_id: 'ASG003',
      course_id: course1._id,
      instructor_id: instructor2._id,
      title: 'Syntax Homework',
      description: 'Correct syntax errors in the provided script.',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      total_marks: 20
    });

    const assignment4 = await Assignment.create({
      assignment_id: 'ASG004',
      course_id: course3._id,
      instructor_id: instructor2._id,
      title: 'Stack and Queue Implementation',
      description: 'Code stack and queue models from scratch without native array helpers.',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      total_marks: 100
    });

    // 9. Create Assignment Submissions (Mocking uploaded file downloadability)
    await AssignmentSubmission.create({
      submission_id: 'SUB001',
      assignment_id: assignment1._id,
      student_id: student1._id,
      uploaded_file: '/uploads/logic_puzzles_jdoe.pdf',
      submission_date: Date.now(),
      grade: 95,
      feedback: 'Excellent work on the recursive solutions.'
    });

    await AssignmentSubmission.create({
      submission_id: 'SUB002',
      assignment_id: assignment1._id,
      student_id: student3._id,
      uploaded_file: '/uploads/logic_puzzles_bjohnson.pdf',
      submission_date: Date.now()
      // Graded by instructor during test
    });

    await AssignmentSubmission.create({
      submission_id: 'SUB003',
      assignment_id: assignment3._id,
      student_id: student2._id,
      uploaded_file: '/uploads/syntax_homework_jsmith.pdf',
      submission_date: Date.now(),
      grade: 18,
      feedback: 'Good job, but check formatting next time.'
    });

    await AssignmentSubmission.create({
      submission_id: 'SUB004',
      assignment_id: assignment3._id,
      student_id: student3._id,
      uploaded_file: '/uploads/syntax_homework_bjohnson.pdf',
      submission_date: Date.now()
      // Graded by instructor during test
    });

    // 10. Create Quizzes
    const quiz1 = await Quiz.create({
      quiz_id: 'QZ001',
      course_id: course1._id,
      instructor_id: instructor2._id,
      title: 'Python Basics Quiz',
      duration: 30,
      total_marks: 50
    });

    // 11. Create Quiz Submissions
    await QuizSubmission.create({
      submission_id: 'QSUB001',
      quiz_id: quiz1._id,
      student_id: student1._id,
      answers: { q1: 'print()', q2: 'def', q3: 'indentation' },
      grade: 48
    });

    await QuizSubmission.create({
      submission_id: 'QSUB002',
      quiz_id: quiz1._id,
      student_id: student2._id,
      answers: { q1: 'print()', q2: 'def', q3: 'braces' },
      grade: 42
    });

    // 12. Create Materials
    await Material.create({
      material_id: 'MAT001',
      course_id: course1._id,
      instructor_id: instructor2._id,
      title: 'Python Syntax Guide',
      file_url: '/uploads/python_syntax.pdf'
    });

    await Material.create({
      material_id: 'MAT002',
      course_id: course2._id,
      instructor_id: instructor1._id,
      title: 'Recursion Cheat Sheet',
      file_url: '/uploads/recursion_cheat_sheet.pdf'
    });

    await Material.create({
      material_id: 'MAT003',
      course_id: course3._id,
      instructor_id: instructor2._id,
      title: 'Big O Notation Guide',
      file_url: '/uploads/big_o_guide.pdf'
    });

    // 13. Create peer-to-peer and student-instructor Messages
    await Message.create([
      {
        sender: student1._id,
        senderModel: 'Student',
        receiver: student2._id,
        receiverModel: 'Student',
        subject: 'Study Group',
        content: 'Hi Jane, do you want to study for the Data Structures exam together?',
        read: true
      },
      {
        sender: student2._id,
        senderModel: 'Student',
        receiver: student1._id,
        receiverModel: 'Student',
        subject: 'Re: Study Group',
        content: 'Sure John! Let\'s meet at the library tomorrow at 2 PM.',
        read: false
      },
      {
        sender: student1._id,
        senderModel: 'Student',
        receiver: instructor1._id,
        receiverModel: 'Instructor',
        subject: 'Question about Logic Puzzles',
        content: 'Dear Dr. Alan, I have a quick question about question 3 in the Logic Puzzles assignment. Can I use helper functions?',
        read: true
      },
      {
        sender: instructor1._id,
        senderModel: 'Instructor',
        receiver: student1._id,
        receiverModel: 'Student',
        subject: 'Re: Question about Logic Puzzles',
        content: 'Hello John, yes, you are allowed to define private helper functions. Good luck!',
        read: false
      },
      {
        sender: student3._id,
        senderModel: 'Student',
        receiver: student1._id,
        receiverModel: 'Student',
        subject: 'Missing Lecture Notes',
        content: 'Hey John, did you attend the CS101 class yesterday? Can I copy your syntax guide notes?',
        read: false
      }
    ]);

    // 14. Create Notifications
    await Notification.create([
      {
        user: student1._id,
        userModel: 'Student',
        type: 'grade',
        title: 'Assignment Graded',
        message: 'Your submission for "Logic Puzzles" has been graded: 95/100 marks.',
        read: true
      },
      {
        user: student1._id,
        userModel: 'Student',
        type: 'message',
        title: 'New Message',
        message: 'You received a message from Jane Smith: "Sure John! Let\'s meet at the library..."',
        read: false
      },
      {
        user: student1._id,
        userModel: 'Student',
        type: 'message',
        title: 'New Message',
        message: 'You received a message from Dr. Alan Turing: "Hello John, yes, you are allowed..."',
        read: false
      },
      {
        user: student2._id,
        userModel: 'Student',
        type: 'message',
        title: 'New Message',
        message: 'You received a message from John Doe: "Hi Jane, do you want to study for..."',
        read: true
      },
      {
        user: instructor1._id,
        userModel: 'Instructor',
        type: 'message',
        title: 'New Message',
        message: 'You received a message from John Doe: "Dear Dr. Alan, I have a quick..."',
        read: true
      }
    ]);

    // 15. Create Course Stream posts (CoursePost)
    await CoursePost.create([
      {
        course_id: course2._id,
        sender: instructor1._id,
        senderModel: 'Instructor',
        senderName: instructor1.full_name,
        content: 'Welcome to Problem Solving! Please check the syllabus and prepare your IDE.'
      },
      {
        course_id: course2._id,
        sender: student1._id,
        senderModel: 'Student',
        senderName: student1.full_name,
        content: 'Does anyone want to team up for the logic challenge next week?'
      },
      {
        course_id: course2._id,
        sender: student3._id,
        senderModel: 'Student',
        senderName: student3.full_name,
        content: 'I\'m down! Let\'s do it.'
      },
      {
        course_id: course3._id,
        sender: instructor2._id,
        senderModel: 'Instructor',
        senderName: instructor2.full_name,
        content: 'Please note that the deadline for Stack and Queue implementation has been extended to Friday.'
      }
    ]);

    // 16. Create Email Templates
    await EmailTemplate.create({
      name: 'Welcome Email',
      subject: 'Welcome to EduCore LMS',
      body: 'Hello {{name}}, welcome to our platform! Your student ID is {{student_id}}.',
      variables: ['name', 'student_id'],
      updatedBy: admin1._id
    });

    // 17. Create Logs
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
