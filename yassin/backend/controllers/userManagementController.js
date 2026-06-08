const Student = require('../models/Student');
const Instructor = require('../models/Instructor');
const Admin = require('../models/Admin');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const bcrypt = require('bcryptjs');
const { getAggregatedUsers } = require('../services/userService');

// --- Student Management ---

// @desc    Get all students (paginated)
// @route   GET /api/admin/users/students?page=1&limit=20
// @access  Private/Admin
const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find({ isActive: { $ne: false } }).select('-password').skip(skip).limit(limit),
      Student.countDocuments({ isActive: { $ne: false } })
    ]);

    res.json({
      data: students,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new student
// @route   POST /api/admin/users/students
// @access  Private/Admin
const createStudent = async (req, res) => {
  const { full_name, username, email, password, department, level } = req.body;

  try {
    const studentExists = await Student.findOne({ $or: [{ email }, { username }] });

    if (studentExists) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    const student = await Student.create({
      student_id: `ST-${Date.now()}`,
      full_name,
      username,
      email,
      password, // Password hashing handled by pre-save hook
      department,
      level
    });

    res.status(201).json({
      _id: student._id,
      student_id: student.student_id,
      full_name: student.full_name,
      email: student.email,
      department: student.department
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Instructor Management ---

// @desc    Get all instructors (paginated)
// @route   GET /api/admin/users/instructors?page=1&limit=20
// @access  Private/Admin
const getInstructors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [instructors, total] = await Promise.all([
      Instructor.find({ isActive: { $ne: false } }).select('-password').skip(skip).limit(limit),
      Instructor.countDocuments({ isActive: { $ne: false } })
    ]);

    res.json({
      data: instructors,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new instructor/HOD
// @route   POST /api/admin/users/instructors
// @access  Private/Admin
const createInstructor = async (req, res) => {
  const { full_name, username, email, password, department, role } = req.body;

  try {
    const instructorExists = await Instructor.findOne({ $or: [{ email }, { username }] });

    if (instructorExists) {
      return res.status(400).json({ message: 'Instructor already exists' });
    }

    const instructor = await Instructor.create({
      instructor_id: `INST-${Date.now()}`,
      full_name,
      username,
      email,
      password,
      department,
      role: role || 'instructor' // role can be 'instructor' or 'head_of_department'
    });

    res.status(201).json({
      _id: instructor._id,
      instructor_id: instructor.instructor_id,
      full_name: instructor.full_name,
      email: instructor.email,
      role: instructor.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Admin Management ---

// @desc    Get all admins (paginated)
// @route   GET /api/admin/users/admins?page=1&limit=20
// @access  Private/Admin
const getAdmins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [admins, total] = await Promise.all([
      Admin.find({ isActive: { $ne: false } }).select('-password').skip(skip).limit(limit),
      Admin.countDocuments({ isActive: { $ne: false } })
    ]);

    res.json({
      data: admins,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new admin
// @route   POST /api/admin/users/admins
// @access  Private/Admin
const createAdmin = async (req, res) => {
  const { full_name, username, email, password, permissions } = req.body;

  try {
    const adminExists = await Admin.findOne({ $or: [{ email }, { username }] });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await Admin.create({
      admin_id: `ADM-${Date.now()}`,
      full_name,
      username,
      email,
      password,
      permissions: permissions || ['all']
    });

    res.status(201).json({
      _id: admin._id,
      admin_id: admin.admin_id,
      full_name: admin.full_name,
      email: admin.email,
      permissions: admin.permissions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Generic User Update/Delete (Internal Logic) ---

const deleteUser = async (req, res) => {
  const { id, type } = req.params; // type: student, instructor, admin

  try {
    let result;
    const lowercaseType = type.toLowerCase();

    if (lowercaseType === 'student') {
      // Step 1: Update Student status
      result = await Student.findByIdAndUpdate(id, { isActive: false }, { new: true });
      if (!result) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Step 2: Update all active enrollments of the student
      try {
        await Enrollment.updateMany({ student_id: id, status: 'active' }, { status: 'inactive' });
      } catch (err) {
        // Rollback Student state change on failure to preserve data integrity
        await Student.findByIdAndUpdate(id, { isActive: true });
        throw new Error('Failed to update student enrollments. Changes rolled back.');
      }

    } else if (lowercaseType === 'instructor') {
      // Step 1: Update Instructor status
      result = await Instructor.findByIdAndUpdate(id, { isActive: false }, { new: true });
      if (!result) {
        return res.status(404).json({ message: 'Instructor not found' });
      }

      // Step 2: Remove instructor from all courses' assigned list
      try {
        await Course.updateMany(
          { assigned_instructors: id },
          { $pull: { assigned_instructors: id } }
        );
      } catch (err) {
        // Rollback Instructor state change on failure to preserve data integrity
        await Instructor.findByIdAndUpdate(id, { isActive: true });
        throw new Error('Failed to remove instructor from courses. Changes rolled back.');
      }

    } else if (lowercaseType === 'admin') {
      result = await Admin.findByIdAndUpdate(id, { isActive: false }, { new: true });
      if (!result) {
        return res.status(404).json({ message: 'Admin not found' });
      }
    }

    res.json({ message: 'User deactivated successfully (soft-deleted with transaction safety)' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users across all roles (paginated and filtered)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const role = req.query.role || 'All Roles';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getAggregatedUsers({ search, role, page, limit });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user details
// @route   PUT /api/admin/users/:type/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  const { id, type } = req.params; // type: student, instructor, admin
  const { full_name, email, department, level } = req.body;

  try {
    let result;
    const lowercaseType = type.toLowerCase();
    if (lowercaseType === 'student') {
      result = await Student.findByIdAndUpdate(id, { full_name, email, department, level }, { new: true });
    } else if (lowercaseType === 'instructor') {
      result = await Instructor.findByIdAndUpdate(id, { full_name, email, department }, { new: true });
    } else if (lowercaseType === 'admin') {
      result = await Admin.findByIdAndUpdate(id, { full_name, email }, { new: true });
    }

    if (result) {
      res.json({ message: 'User updated successfully', data: result });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudents,
  createStudent,
  getInstructors,
  createInstructor,
  getAdmins,
  createAdmin,
  deleteUser,
  getAllUsers,
  updateUser
};
