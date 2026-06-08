const mongoose = require('mongoose');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');

// @desc    Get classmate list for a specific course (Student-facing view)
// @route   GET /api/student/courses/:courseId/students
// @access  Private/Student
const getClassmates = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId } = req.params;
    const search = req.query.search?.trim();

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Verify the student is enrolled in this course
    const isEnrolled = await Student.findOne({ _id: studentId, enrolled_courses: courseId });
    if (!isEnrolled) {
      return res.status(403).json({ message: 'You are not enrolled in this course.' });
    }

    // Build query filter
    const filter = {
      enrolled_courses: courseId,
      _id: { $ne: studentId }
    };

    if (search) {
      filter.$or = [
        { full_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const classmates = await Student.find(filter)
      .select('full_name email department student_id profileImage')
      .sort({ full_name: 1 });

    res.json(classmates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get full roster for a specific course (Instructor/Admin-facing view)
// @route   GET /api/courses/:courseId/students
// @access  Private/Instructor/Admin
const getCourseRoster = async (req, res) => {
  try {
    const { courseId } = req.params;
    const search = req.query.search?.trim();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Build student query filter
    const filter = { enrolled_courses: courseId };

    if (search) {
      filter.$or = [
        { full_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { student_id: { $regex: search, $options: 'i' } }
      ];
    }

    // Run paginated query
    const [students, total] = await Promise.all([
      Student.find(filter)
        .select('-password')
        .sort({ full_name: 1 })
        .skip(skip)
        .limit(limit),
      Student.countDocuments(filter)
    ]);

    // Fetch enrollment dates
    const enrollments = await Enrollment.find({
      course_id: courseId,
      student_id: { $in: students.map(s => s._id) }
    });

    const enrollmentMap = new Map(
      enrollments.map(e => [e.student_id.toString(), e.createdAt])
    );

    const studentsWithJoinDate = students.map(student => ({
      ...student.toObject(),
      joinedAt: enrollmentMap.get(student._id.toString()) || student.created_at || student.createdAt
    }));

    res.json({
      success: true,
      data: {
        students: studentsWithJoinDate,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll a student by email or student ID
// @route   POST /api/courses/:courseId/students
// @access  Private/Instructor/Admin
const enrollStudentByRoster = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { identifier } = req.body; // Can be email or student_id string (e.g. 2024-8891)

    if (!identifier) {
      return res.status(400).json({ message: 'Student Email or Student ID is required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Find the student by email or student_id
    const student = await Student.findOne({
      $or: [
        { email: identifier.trim().toLowerCase() },
        { student_id: identifier.trim() }
      ]
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found. Please check the email or ID.' });
    }

    // Check if already enrolled in this course
    const isEnrolled = course.enrolled_students.includes(student._id);
    if (isEnrolled) {
      return res.status(400).json({ message: 'Student is already enrolled in this course.' });
    }

    // Create enrollment document
    const enrollment = await Enrollment.create({
      enrollment_id: `ENR-${Date.now()}`,
      student_id: student._id,
      course_id: courseId,
      semester: 'Spring 2026',
      status: 'active'
    });

    // Update Course and Student enrolled lists
    await Course.findByIdAndUpdate(courseId, { $addToSet: { enrolled_students: student._id } });
    await Student.findByIdAndUpdate(student._id, { $addToSet: { enrolled_courses: courseId } });

    res.status(201).json({
      success: true,
      message: `${student.full_name} has been enrolled successfully.`,
      data: {
        student: {
          _id: student._id,
          full_name: student.full_name,
          email: student.email,
          student_id: student.student_id,
          department: student.department
        },
        joinedAt: enrollment.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove a student from the course
// @route   DELETE /api/courses/:courseId/students/:studentId
// @access  Private/Instructor/Admin
const removeStudentFromRoster = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: 'Invalid Course ID or Student ID.' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Verify student is actually enrolled
    const isEnrolled = course.enrolled_students.includes(studentId);
    if (!isEnrolled) {
      return res.status(404).json({ message: 'Student is not enrolled in this course.' });
    }

    // Remove from Course
    course.enrolled_students = course.enrolled_students.filter(id => id.toString() !== studentId);
    await course.save();

    // Remove from Student
    await Student.findByIdAndUpdate(studentId, { $pull: { enrolled_courses: courseId } });

    // Delete enrollment document
    await Enrollment.findOneAndDelete({ student_id: studentId, course_id: courseId });

    res.json({
      success: true,
      message: 'Student has been removed from the course.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getClassmates,
  getCourseRoster,
  enrollStudentByRoster,
  removeStudentFromRoster
};
