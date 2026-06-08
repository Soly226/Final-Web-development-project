const Admin = require('../models/Admin');
const Instructor = require('../models/Instructor');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// Helper: set the JWT in a secure httpOnly cookie
const setCookieToken = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('jwt', token, {
    httpOnly: true,          // Not accessible via document.cookie — blocks XSS
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction, // HTTPS-only in production; required with SameSite=None
    maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role, ...otherData } = req.body;

  try {
    const adminExists = await Admin.findOne({ email });
    const instructorExists = await Instructor.findOne({ email });
    const studentExists = await Student.findOne({ email });

    if (adminExists || instructorExists || studentExists) {
      return res.status(400).json({ message: 'user already exists' });
    }

    let user = null;

    if (role === 'admin') {
      return res.status(400).json({ message: 'Admin registration is not allowed via this route' });
    } else if (role === 'instructor') {
      user = await Instructor.create({ full_name: name, username: name, instructor_id: `INST${Date.now()}`, email, password, role: 'instructor', ...otherData });
    } else {
      user = await Student.create({ full_name: name, username: name, student_id: `ST${Date.now()}`, email, password, ...otherData });
    }

    if (user) {
      const token = generateToken(user._id, role || 'student');
      setCookieToken(res, token);

      // Return only non-sensitive user data — token stays in httpOnly cookie
      res.status(201).json({
        _id: user._id,
        name: user.full_name,
        email: user.email,
        role: role || 'student',
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
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Admin.findOne({ email });
    let role = 'admin';

    if (!user) {
      user = await Instructor.findOne({ email });
      // Respect HOD vs instructor role stored on the model
      role = user ? (user.role || 'instructor') : 'instructor';
    }

    if (!user) {
      user = await Student.findOne({ email });
      role = 'student';
    }

    if (!user || user.isActive === false) {
       return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = generateToken(user._id, role);
      setCookieToken(res, token);

      // Return only non-sensitive user data — token stays in httpOnly cookie
      res.json({
        _id: user._id,
        name: user.full_name,
        email: user.email,
        role: role,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user — clears httpOnly JWT cookie server-side
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.json({ message: 'Logged out successfully' });
};

// @desc    Get current user profile (session verification)
// @route   GET /api/auth/me
// @access  Private
const checkSession = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;
    if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.id).select('-password');
    } else if (decoded.role === 'instructor' || decoded.role === 'head_of_department') {
      user = await Instructor.findById(decoded.id).select('-password');
    } else {
      user = await Student.findById(decoded.id).select('-password');
    }

    if (!user || user.isActive === false) {
      return res.status(401).json({ message: 'User not found or deactivated' });
    }

    res.json({
      _id: user._id,
      name: user.full_name,
      email: user.email,
      role: decoded.role,
    });
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token validation failed' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  checkSession
};
