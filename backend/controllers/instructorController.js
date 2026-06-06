const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const Material = require('../models/Material');
const Enrollment = require('../models/Enrollment');
const Notification = require('../models/Notification');
const Student = require('../models/Student');
const Instructor = require('../models/Instructor');
const CoursePost = require('../models/CoursePost');

// --- Course Management for Instructors ---

// @desc    Get courses assigned to the instructor
// @route   GET /api/instructor/courses
// @access  Private/Instructor
const getInstructorCourses = async (req, res) => {
  try {
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

// @desc    Get all assignments for instructor's courses (with submission counts)
// @route   GET /api/instructor/assignments
// @access  Private/Instructor
const getInstructorAssignments = async (req, res) => {
  try {
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
      const totalStudentsCount = await Enrollment.countDocuments({ course_id: a.course_id, status: 'active' });
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
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.instructor_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this assignment' });
    }

    assignment.status = assignment.status === 'Open' ? 'Closed' : 'Open';
    await assignment.save();

    res.json({ message: `Status updated to ${assignment.status}`, assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get submissions and full roster status for an assignment
// @route   GET /api/instructor/assignments/:id/submissions
// @access  Private/Instructor
const getAssignmentSubmissions = async (req, res) => {
  const { id } = req.params;
  try {
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.instructor_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find all active enrollments for this course
    const enrollments = await Enrollment.find({ course_id: assignment.course_id, status: 'active' })
      .populate('student_id', 'full_name student_id email');

    // Find all submissions for this assignment
    const submissions = await AssignmentSubmission.find({ assignment_id: id });

    // Map full roster with submission status
    const roster = enrollments.map(enrollment => {
      const student = enrollment.student_id;
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

  try {
    const submission = await AssignmentSubmission.findById(req.params.id).populate('assignment_id');
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

// @desc    Upload course material (legacy generic endpoint)
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
    const materials = await Material.find({ course_id: courseId }).sort({ week: 1, upload_date: 1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a course material (lecture)
// @route   POST /api/instructor/courses/:courseId/materials
// @access  Private/Instructor
const addCourseMaterial = async (req, res) => {
  const { courseId } = req.params;
  const { title, file_url, file_type, week, duration, status } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const course = await Course.findOne({ _id: courseId, assigned_instructors: req.user._id });
    if (!course) {
      return res.status(403).json({ message: 'Not authorized to add materials to this course' });
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
    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    if (material.instructor_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this material' });
    }
    await Material.findByIdAndDelete(id);
    res.json({ message: 'Lecture deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get instructor profile details
// @route   GET /api/instructor/profile
// @access  Private/Instructor
const getInstructorProfile = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.user._id).select('-password');
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor profile not found' });
    }
    res.json(instructor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update instructor profile details
// @route   PUT /api/instructor/profile
// @access  Private/Instructor
const updateInstructorProfile = async (req, res) => {
  const { full_name, bio, office_hours, office_location, phone } = req.body;
  try {
    const instructor = await Instructor.findById(req.user._id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor profile not found' });
    }

    if (full_name) instructor.full_name = full_name;
    if (bio !== undefined) instructor.bio = bio;
    if (office_hours !== undefined) instructor.office_hours = office_hours;
    if (office_location !== undefined) instructor.office_location = office_location;
    if (phone !== undefined) instructor.phone = phone;

    await instructor.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: instructor._id,
        name: instructor.full_name,
        full_name: instructor.full_name,
        email: instructor.email,
        role: instructor.role,
        department: instructor.department,
        bio: instructor.bio,
        office_hours: instructor.office_hours,
        office_location: instructor.office_location,
        phone: instructor.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get course stream posts
// @route   GET /api/instructor/courses/:courseId/stream
// @access  Private/Instructor
const getCourseStream = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findOne({ _id: courseId, assigned_instructors: req.user._id });
    if (!course) {
      return res.status(401).json({ message: 'Not authorized to view this course stream' });
    }

    const posts = await CoursePost.find({ course_id: courseId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create course stream post
// @route   POST /api/instructor/courses/:courseId/stream
// @access  Private/Instructor
const createCourseStreamPost = async (req, res) => {
  const { courseId } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Post content cannot be empty' });
  }

  try {
    const course = await Course.findOne({ _id: courseId, assigned_instructors: req.user._id });
    if (!course) {
      return res.status(401).json({ message: 'Not authorized to post in this course stream' });
    }

    const post = await CoursePost.create({
      course_id: courseId,
      sender: req.user._id,
      senderModel: 'Instructor',
      senderName: req.user.full_name || req.user.name || 'Instructor',
      content
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get global stream posts across all instructor's courses
// @route   GET /api/instructor/stream
// @access  Private/Instructor
const getGlobalStream = async (req, res) => {
  try {
    const courses = await Course.find({ assigned_instructors: req.user._id });
    const courseIds = courses.map(c => c._id);

    const posts = await CoursePost.find({ course_id: { $in: courseIds } })
      .sort({ createdAt: -1 })
      .populate('course_id', 'course_name course_code');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new course and assign the current instructor
// @route   POST /api/instructor/courses
// @access  Private/Instructor
const createInstructorCourse = async (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Course title is required' });
  }

  try {
    const timestamp = Date.now();
    const course_id = `CR-${timestamp}`;
    const course_code = `CS-${timestamp.toString().slice(-4)}`;

    const course = await Course.create({
      course_id,
      course_code,
      course_name: title,
      description: description || '',
      credit_hours: 3,
      department: req.user.department || 'Computer Science',
      assigned_instructors: [req.user._id]
    });

    await Instructor.findByIdAndUpdate(req.user._id, {
      $addToSet: { assigned_courses: course._id }
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analytics for instructor dashboard
// @route   GET /api/instructor/analytics
// @access  Private/Instructor
const getInstructorAnalytics = async (req, res) => {
  try {
    const courses = await Course.find({ assigned_instructors: req.user._id });
    const courseIds = courses.map(c => c._id);

    // 1. Total unique students
    const enrollments = await Enrollment.find({ course_id: { $in: courseIds }, status: 'active' });
    const uniqueStudentIds = [...new Set(enrollments.map(e => e.student_id.toString()))];
    const totalStudents = uniqueStudentIds.length;

    // 2. Average Completion and Course Completion
    const assignments = await Assignment.find({ course_id: { $in: courseIds } });
    const assignmentIds = assignments.map(a => a._id);
    const submissions = await AssignmentSubmission.find({ assignment_id: { $in: assignmentIds } });

    let totalExpectedSubmissions = 0;
    const completionByCourse = [];

    for (const course of courses) {
      const courseEnrollmentsCount = enrollments.filter(e => e.course_id.toString() === course._id.toString()).length;
      const courseAssignments = assignments.filter(a => a.course_id.toString() === course._id.toString());
      const courseAssignmentIds = courseAssignments.map(a => a._id);
      const courseSubmissionsCount = submissions.filter(s => courseAssignmentIds.some(id => id.toString() === s.assignment_id.toString())).length;

      const expected = courseEnrollmentsCount * courseAssignments.length;
      totalExpectedSubmissions += expected;

      const completionPct = expected > 0 ? Math.round((courseSubmissionsCount / expected) * 100) : 100;
      completionByCourse.push({
        course: course.course_name,
        completion: completionPct
      });
    }

    const avgCompletion = totalExpectedSubmissions > 0
      ? Math.round((submissions.length / totalExpectedSubmissions) * 100)
      : 100;

    // 3. Average Grade
    const gradedSubmissions = submissions.filter(s => s.grade !== undefined && s.grade !== null);
    let avgGradeLetter = 'N/A';
    if (gradedSubmissions.length > 0) {
      let sumPct = 0;
      let validGradesCount = 0;
      for (const sub of gradedSubmissions) {
        const asg = assignments.find(a => a._id.toString() === sub.assignment_id.toString());
        if (asg && asg.total_marks > 0) {
          sumPct += (sub.grade / asg.total_marks) * 100;
          validGradesCount++;
        }
      }
      if (validGradesCount > 0) {
        const avgPct = sumPct / validGradesCount;
        if (avgPct >= 93) avgGradeLetter = 'A';
        else if (avgPct >= 90) avgGradeLetter = 'A-';
        else if (avgPct >= 87) avgGradeLetter = 'B+';
        else if (avgPct >= 83) avgGradeLetter = 'B';
        else if (avgPct >= 80) avgGradeLetter = 'B-';
        else if (avgPct >= 77) avgGradeLetter = 'C+';
        else if (avgPct >= 73) avgGradeLetter = 'C';
        else if (avgPct >= 70) avgGradeLetter = 'C-';
        else if (avgPct >= 67) avgGradeLetter = 'D+';
        else if (avgPct >= 63) avgGradeLetter = 'D';
        else if (avgPct >= 60) avgGradeLetter = 'D-';
        else avgGradeLetter = 'F';
      }
    }

    // 4. Weekly Activity (Submissions in the last 7 days)
    const weeklyActivity = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayName = daysOfWeek[d.getDay()];
      
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const daySubmissionsCount = submissions.filter(s => {
        const subDate = new Date(s.submission_date);
        return subDate >= startOfDay && subDate <= endOfDay;
      }).length;

      weeklyActivity.push({
        day: dayName,
        count: daySubmissionsCount
      });
    }

    const maxCount = Math.max(...weeklyActivity.map(w => w.count));
    const weeklyActivityScaled = weeklyActivity.map(w => ({
      day: w.day,
      height: maxCount > 0 ? `${Math.max(10, Math.round((w.count / maxCount) * 100))}%` : '10%'
    }));

    res.json({
      totalStudents,
      avgCompletion,
      avgGrade: avgGradeLetter,
      weeklyActivity: weeklyActivityScaled,
      completionByCourse
    });

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
  deleteCourseMaterial,
  getInstructorProfile,
  updateInstructorProfile,
  getCourseStream,
  createCourseStreamPost,
  getGlobalStream,
  createInstructorCourse,
  getInstructorAnalytics
};
