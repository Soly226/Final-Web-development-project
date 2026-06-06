const Course = require('../models/Course');
const Instructor = require('../models/Instructor');
const TeachingTask = require('../models/TeachingTask');

// Helper to check if user is HOD
const checkHOD = (req) => {
  return req.user && req.user.role === 'head_of_department';
};

// @desc    Get all courses in HOD's department
// @route   GET /api/instructor/department/courses
// @access  Private/HOD
const getDepartmentCourses = async (req, res) => {
  if (!checkHOD(req)) {
    return res.status(403).json({ message: 'Not authorized: HOD access only' });
  }

  const dept = req.user.department || 'Computer Science';

  try {
    const courses = await Course.find({ department: dept })
      .populate('assigned_instructors', 'full_name email role');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all instructors in HOD's department and workload details
// @route   GET /api/instructor/department/instructors
// @access  Private/HOD
const getDepartmentInstructors = async (req, res) => {
  if (!checkHOD(req)) {
    return res.status(403).json({ message: 'Not authorized: HOD access only' });
  }

  const dept = req.user.department || 'Computer Science';

  try {
    const instructors = await Instructor.find({ department: dept }).select('-password');
    const result = [];

    for (let inst of instructors) {
      const courses = await Course.find({ assigned_instructors: inst._id });
      let totalCredits = 0;
      let totalStudents = 0;

      courses.forEach(c => {
        totalCredits += c.credit_hours || 0;
        totalStudents += c.enrolled_students ? c.enrolled_students.length : 0;
      });

      result.push({
        ...inst.toObject(),
        assigned_courses: courses,
        workload: {
          courseCount: courses.length,
          totalCredits,
          totalStudents
        }
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign instructor to course
// @route   POST /api/instructor/department/courses/:courseId/assign
// @access  Private/HOD
const assignInstructorToCourse = async (req, res) => {
  if (!checkHOD(req)) {
    return res.status(403).json({ message: 'Not authorized: HOD access only' });
  }

  const { instructorId } = req.body;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course || course.department !== req.user.department) {
      return res.status(404).json({ message: 'Course not found in your department' });
    }

    const instructor = await Instructor.findById(instructorId);
    if (!instructor || instructor.department !== req.user.department) {
      return res.status(404).json({ message: 'Instructor not found in your department' });
    }

    if (!course.assigned_instructors.includes(instructorId)) {
      course.assigned_instructors.push(instructorId);
      await course.save();
    }

    if (!instructor.assigned_courses.includes(courseId)) {
      instructor.assigned_courses.push(courseId);
      await instructor.save();
    }

    res.json({ message: `Successfully assigned ${instructor.full_name} to ${course.course_name}.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove instructor from course
// @route   POST /api/instructor/department/courses/:courseId/remove
// @access  Private/HOD
const removeInstructorFromCourse = async (req, res) => {
  if (!checkHOD(req)) {
    return res.status(403).json({ message: 'Not authorized: HOD access only' });
  }

  const { instructorId } = req.body;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course || course.department !== req.user.department) {
      return res.status(404).json({ message: 'Course not found in your department' });
    }

    course.assigned_instructors = course.assigned_instructors.filter(
      id => id.toString() !== instructorId.toString()
    );
    await course.save();

    const instructor = await Instructor.findById(instructorId);
    if (instructor) {
      instructor.assigned_courses = instructor.assigned_courses.filter(
        id => id.toString() !== courseId.toString()
      );
      await instructor.save();
    }

    res.json({ message: `Successfully removed instructor from ${course.course_name}.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all specialized teaching tasks
// @route   GET /api/instructor/department/tasks
// @access  Private/HOD
const getTeachingTasks = async (req, res) => {
  if (!checkHOD(req)) {
    return res.status(403).json({ message: 'Not authorized: HOD access only' });
  }
  try {
    const tasks = await TeachingTask.find()
      .populate('course_id', 'course_name course_code')
      .populate('instructor_id', 'full_name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign a specialized teaching task
// @route   POST /api/instructor/department/tasks
// @access  Private/HOD
const createTeachingTask = async (req, res) => {
  if (!checkHOD(req)) {
    return res.status(403).json({ message: 'Not authorized: HOD access only' });
  }
  const { courseId, instructorId, year, specialization } = req.body;
  if (!courseId || !instructorId || !year || !specialization) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  try {
    const course = await Course.findById(courseId);
    const instructor = await Instructor.findById(instructorId);
    if (!course || !instructor) {
      return res.status(404).json({ message: 'Course or Instructor not found' });
    }

    // Link in DB if not already assigned
    if (!course.assigned_instructors.includes(instructorId)) {
      course.assigned_instructors.push(instructorId);
      await course.save();
    }
    if (!instructor.assigned_courses.includes(courseId)) {
      instructor.assigned_courses.push(courseId);
      await instructor.save();
    }

    const task = await TeachingTask.create({
      course_id: courseId,
      course_name: course.course_name,
      course_code: course.course_code,
      instructor_id: instructorId,
      doctor_name: instructor.full_name,
      year,
      specialization
    });

    res.status(201).json({ message: 'Teaching task assigned successfully', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a teaching task
// @route   DELETE /api/instructor/department/tasks/:id
// @access  Private/HOD
const deleteTeachingTask = async (req, res) => {
  if (!checkHOD(req)) {
    return res.status(403).json({ message: 'Not authorized: HOD access only' });
  }
  const { id } = req.params;
  try {
    const task = await TeachingTask.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: 'Teaching task not found' });
    }
    res.json({ message: 'Teaching task removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current logged in HOD's own profile
// @route   GET /api/instructor/department/profile
// @access  Private/HOD
const getHODProfile = async (req, res) => {
  if (!checkHOD(req)) {
    return res.status(403).json({ message: 'Not authorized: HOD access only' });
  }

  try {
    const hod = await Instructor.findById(req.user._id).select('-password');
    if (!hod) {
      return res.status(404).json({ message: 'HOD profile not found' });
    }
    res.json(hod);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update current logged in HOD's own profile
// @route   PUT /api/instructor/department/profile
// @access  Private/HOD
const updateHODProfile = async (req, res) => {
  if (!checkHOD(req)) {
    return res.status(403).json({ message: 'Not authorized: HOD access only' });
  }

  const { full_name, bio, office_hours, office_location, phone } = req.body;

  try {
    const hod = await Instructor.findById(req.user._id);
    if (!hod) {
      return res.status(404).json({ message: 'HOD profile not found' });
    }

    if (full_name) hod.full_name = full_name;
    if (bio !== undefined) hod.bio = bio;
    if (office_hours !== undefined) hod.office_hours = office_hours;
    if (office_location !== undefined) hod.office_location = office_location;
    if (phone !== undefined) hod.phone = phone;

    await hod.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: hod._id,
        full_name: hod.full_name,
        email: hod.email,
        role: hod.role,
        department: hod.department,
        bio: hod.bio,
        office_hours: hod.office_hours,
        office_location: hod.office_location,
        phone: hod.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDepartmentCourses,
  getDepartmentInstructors,
  assignInstructorToCourse,
  removeInstructorFromCourse,
  getTeachingTasks,
  createTeachingTask,
  deleteTeachingTask,
  getHODProfile,
  updateHODProfile
};
