import Course from '../models/Course.js';
import CoursePrerequisite from '../models/CoursePrerequisite.js';
import Enrollment from '../models/Enrollment.js';
import Student from '../models/Student.js';
import Instructor from '../models/Instructor.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).populate('assigned_instructors', 'full_name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Private
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('assigned_instructors', 'full_name email')
      .populate('enrolled_students', 'full_name student_id');
    
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req, res) => {
  const { course_id, course_code, course_name, description, credit_hours, department } = req.body;

  try {
    const courseExists = await Course.findOne({ $or: [{ course_id }, { course_code }] });

    if (courseExists) {
      return res.status(400).json({ message: 'Course with this ID or Code already exists' });
    }

    const course = await Course.create({
      course_id,
      course_code,
      course_name,
      description,
      credit_hours,
      department
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      course.course_name = req.body.course_name || course.course_name;
      course.description = req.body.description || course.description;
      course.credit_hours = req.body.credit_hours || course.credit_hours;
      course.department = req.body.department || course.department;

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      await Course.deleteOne({ _id: course._id });
      // Also remove prerequisites associated with this course
      await CoursePrerequisite.deleteMany({ $or: [{ course_id: course._id }, { required_course_id: course._id }] });
      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add course prerequisite
// @route   POST /api/courses/:id/prerequisites
// @access  Private/Admin
export const addPrerequisite = async (req, res) => {
  const { required_course_id } = req.body;
  const course_id = req.params.id;

  try {
    if (course_id === required_course_id) {
      return res.status(400).json({ message: 'A course cannot be its own prerequisite' });
    }

    const course = await Course.findById(course_id);
    const requiredCourse = await Course.findById(required_course_id);

    if (!course || !requiredCourse) {
      return res.status(404).json({ message: 'One or both courses not found' });
    }

    const existingPrereq = await CoursePrerequisite.findOne({ course_id, required_course_id });
    if (existingPrereq) {
      return res.status(400).json({ message: 'Prerequisite already exists' });
    }

    const prerequisite = await CoursePrerequisite.create({
      prerequisite_id: `PR-${Date.now()}`,
      course_id,
      required_course_id
    });

    // Update the Course model as well if needed (some schemas have it redundant)
    course.prerequisite_course_id = required_course_id;
    await course.save();

    res.status(201).json(prerequisite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll student in course
// @route   POST /api/courses/:id/enroll
// @access  Private/Admin
export const enrollStudent = async (req, res) => {
  const { student_id, semester } = req.body;
  const course_id = req.params.id;

  try {
    const course = await Course.findById(course_id);
    const student = await Student.findById(student_id);

    if (!course || !student) {
      return res.status(404).json({ message: 'Course or Student not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ student_id, course_id, status: 'active' });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Student is already actively enrolled in this course' });
    }

    // Check prerequisites (Simple check)
    if (course.prerequisite_course_id) {
      const completedPrereq = await Enrollment.findOne({ 
        student_id, 
        course_id: course.prerequisite_course_id, 
        status: 'completed' 
      });
      if (!completedPrereq) {
        return res.status(400).json({ message: 'Prerequisite not met' });
      }
    }

    const enrollment = await Enrollment.create({
      enrollment_id: `ENR-${Date.now()}`,
      student_id,
      course_id,
      semester,
      status: 'active'
    });

    // Update Course and Student models
    await Course.findByIdAndUpdate(course_id, { $addToSet: { enrolled_students: student_id } });
    await Student.findByIdAndUpdate(student_id, { $addToSet: { enrolled_courses: course_id } });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign instructor to course
// @route   POST /api/courses/:id/assign-instructor
// @access  Private/Admin
export const assignInstructor = async (req, res) => {
  const { instructor_id } = req.body;
  const course_id = req.params.id;

  try {
    const course = await Course.findById(course_id);
    const instructor = await Instructor.findById(instructor_id);

    if (!course || !instructor) {
      return res.status(404).json({ message: 'Course or Instructor not found' });
    }

    await Course.findByIdAndUpdate(course_id, { $addToSet: { assigned_instructors: instructor_id } });
    await Instructor.findByIdAndUpdate(instructor_id, { $addToSet: { assigned_courses: course_id } });

    res.json({ message: 'Instructor assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
