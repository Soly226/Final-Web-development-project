import Student from '../models/Student.js';
import Instructor from '../models/Instructor.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';

// --- Student Management ---

// @desc    Get all students (paginated)
// @route   GET /api/admin/users/students?page=1&limit=20
// @access  Private/Admin
export const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find({}).select('-password').skip(skip).limit(limit),
      Student.countDocuments()
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
export const createStudent = async (req, res) => {
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
export const getInstructors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [instructors, total] = await Promise.all([
      Instructor.find({}).select('-password').skip(skip).limit(limit),
      Instructor.countDocuments()
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
export const createInstructor = async (req, res) => {
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
export const getAdmins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [admins, total] = await Promise.all([
      Admin.find({}).select('-password').skip(skip).limit(limit),
      Admin.countDocuments()
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
export const createAdmin = async (req, res) => {
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

export const deleteUser = async (req, res) => {
  const { id, type } = req.params; // type: student, instructor, admin

  try {
    let result;
    if (type === 'student') result = await Student.findByIdAndDelete(id);
    else if (type === 'instructor') result = await Instructor.findByIdAndDelete(id);
    else if (type === 'admin') result = await Admin.findByIdAndDelete(id);

    if (result) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
