import Admin from '../models/Admin.js';
import Instructor from '../models/Instructor.js';
import Student from '../models/Student.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, role, ...otherData } = req.body;

  try {
    let userExists = null;
    let user = null;

    if (role === 'admin') {
      userExists = await Admin.findOne({ email });
      if (userExists) return res.status(400).json({ message: 'User already exists' });
      user = await Admin.create({ full_name: name, username: name, admin_id: `ADM${Date.now()}`, email, password, ...otherData });
    } else if (role === 'instructor') {
      userExists = await Instructor.findOne({ email });
      if (userExists) return res.status(400).json({ message: 'User already exists' });
      user = await Instructor.create({ full_name: name, username: name, instructor_id: `INST${Date.now()}`, email, password, role: 'instructor', ...otherData });
    } else {
      userExists = await Student.findOne({ email });
      if (userExists) return res.status(400).json({ message: 'User already exists' });
      user = await Student.create({ full_name: name, username: name, student_id: `ST${Date.now()}`, email, password, ...otherData });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.full_name,
        email: user.email,
        role: role || 'student',
        token: generateToken(user._id, role || 'student'),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Admin.findOne({ email });
    let role = 'admin';

    if (!user) {
      user = await Instructor.findOne({ email });
      role = 'instructor';
    }

    if (!user) {
      user = await Student.findOne({ email });
      role = 'student';
    }

    if (!user) {
       return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Since we are using bcrypt, we need to compare the password manually if the compare method isn't on the new models.
    // Wait, let's check if comparePassword is on the new models. It is NOT.
    // So we use bcrypt.compare here.

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json({
        _id: user._id,
        name: user.full_name,
        email: user.email,
        role: role,
        token: generateToken(user._id, role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
