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
  res.cookie('jwt', token, {
    httpOnly: true,          // Not accessible via document.cookie — blocks XSS
    sameSite: 'strict',      // Only sent for same-site requests — blocks CSRF
    secure: process.env.NODE_ENV === 'production', // HTTPS-only in production
    maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
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
      role = 'instructor';
    }

    if (!user) {
      user = await Student.findOne({ email });
      role = 'student';
    }

    if (!user) {
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
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  res.json({ message: 'Logged out successfully' });
};

// @desc    Mock login for development
// @route   POST /api/auth/mock-login
// @access  Public
const mockLoginUser = async (req, res) => {
  const { email } = req.body;

  try {
    let user = null;
    let role = 'admin';

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      user = await Admin.findOne({ email });
      if (!user) {
        user = await Instructor.findOne({ email });
        role = user ? user.role : 'instructor';
      }
      if (!user) {
        user = await Student.findOne({ email });
        role = 'student';
      }
    }

    // Auto-create developer test users if they are not in the DB
    if (!user) {
      if (email === 'turing@educore.com') {
        user = {
          _id: 'mock_turing_id',
          full_name: 'Dr. Alan Turing',
          email: 'turing@educore.com',
          username: 'turing',
          instructor_id: 'INST-TURING',
          role: 'head_of_department'
        };
        role = 'head_of_department';
        if (mongoose.connection.readyState === 1) {
          const hashedPassword = await bcrypt.hash('password123', 10);
          user = await Instructor.create({
            ...user,
            password: hashedPassword
          });
        }
      } else if (email === 'ghopper@educore.com') {
        user = {
          _id: 'mock_ghopper_id',
          full_name: 'Grace Hopper',
          email: 'ghopper@educore.com',
          username: 'ghopper',
          instructor_id: 'INST-HOPPER',
          role: 'instructor'
        };
        role = 'instructor';
        if (mongoose.connection.readyState === 1) {
          const hashedPassword = await bcrypt.hash('password123', 10);
          user = await Instructor.create({
            ...user,
            password: hashedPassword
          });
        }
      } else if (email === 'admin@educore.com') {
        user = {
          _id: 'mock_admin_id',
          full_name: 'Super Admin',
          email: 'admin@educore.com',
          username: 'admin',
          admin_id: 'ADM-ADMIN'
        };
        role = 'admin';
        if (mongoose.connection.readyState === 1) {
          const hashedPassword = await bcrypt.hash('password123', 10);
          user = await Admin.create({
            ...user,
            password: hashedPassword
          });
        }
      } else if (email === 'jdoe@student.com') {
        user = {
          _id: 'mock_jdoe_id',
          full_name: 'John Doe',
          email: 'jdoe@student.com',
          username: 'jdoe',
          student_id: 'ST-JDOE'
        };
        role = 'student';
        if (mongoose.connection.readyState === 1) {
          const hashedPassword = await bcrypt.hash('password123', 10);
          user = await Student.create({
            ...user,
            password: hashedPassword
          });
        }
      }
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure we use the user's defined role if available
    const finalRole = user.role || role;

    const token = generateToken(user._id, finalRole);
    setCookieToken(res, token);

    res.json({
      _id: user._id,
      name: user.full_name,
      email: user.email,
      role: finalRole,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify current session JWT token
// @route   GET /api/auth/me
// @access  Private
const checkSession = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      // Offline mode checkSession fallback
      let full_name = 'Mock User';
      let email = 'mock@educore.com';
      let username = 'mockuser';
      
      if (decoded.role === 'head_of_department') {
        full_name = 'Dr. Alan Turing';
        email = 'turing@educore.com';
        username = 'turing';
      } else if (decoded.role === 'instructor') {
        full_name = 'Grace Hopper';
        email = 'ghopper@educore.com';
        username = 'ghopper';
      } else if (decoded.role === 'admin') {
        full_name = 'Super Admin';
        email = 'admin@educore.com';
        username = 'admin';
      } else if (decoded.role === 'student') {
        full_name = 'John Doe';
        email = 'jdoe@student.com';
        username = 'jdoe';
      }

      return res.json({
        _id: decoded.id,
        name: full_name,
        email: email,
        role: decoded.role,
      });
    }

    let user = await Admin.findById(decoded.id);
    let role = 'admin';

    if (!user) {
      user = await Instructor.findById(decoded.id);
      role = user ? user.role : 'instructor';
    }

    if (!user) {
      user = await Student.findById(decoded.id);
      role = 'student';
    }

    if (!user) {
      return res.status(401).json({ message: 'Session user not found' });
    }

    res.json({
      _id: user._id,
      name: user.full_name,
      email: user.email,
      role: user.role || role,
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid session token' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  mockLoginUser,
  checkSession
};


