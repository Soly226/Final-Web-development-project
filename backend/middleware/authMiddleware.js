const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Instructor = require('../models/Instructor');
const Student = require('../models/Student');

const protect = async (req, res, next) => {
  let token;

  // 1. Prefer httpOnly cookie (XSS-safe)
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // 2. Fall back to Authorization: Bearer header (backward-compatible)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = null;
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      if (decoded.role === 'admin') {
        user = await Admin.findById(decoded.id).select('-password');
      } else if (decoded.role === 'instructor' || decoded.role === 'head_of_department') {
        user = await Instructor.findById(decoded.id).select('-password');
      } else {
        user = await Student.findById(decoded.id).select('-password');
      }

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
    } else {
      // Offline mode mock user object creation
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

      user = {
        _id: decoded.id,
        full_name,
        email,
        username,
        role: decoded.role
      };
    }

    req.user = user;
    req.user.role = decoded.role;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

const studentOnly = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a student' });
  }
};

module.exports = {
  protect,
  admin,
  studentOnly
};


