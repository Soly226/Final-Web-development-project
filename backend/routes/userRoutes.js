const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../middleware/uploadMiddleware');
const Student = require('../models/Student');
const Instructor = require('../models/Instructor');
const Admin = require('../models/Admin');

const router = express.Router();

// @desc    Upload profile avatar
// @route   PUT /api/users/profile/avatar
// @access  Private
router.put('/profile/avatar', protect, uploadAvatar, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    let updatedUser = null;

    if (req.user.role === 'admin') {
      updatedUser = await Admin.findByIdAndUpdate(
        req.user._id,
        { profileImage: imageUrl },
        { new: true, select: '-password' }
      );
    } else if (req.user.role === 'instructor') {
      updatedUser = await Instructor.findByIdAndUpdate(
        req.user._id,
        { profileImage: imageUrl },
        { new: true, select: '-password' }
      );
    } else {
      updatedUser = await Student.findByIdAndUpdate(
        req.user._id,
        { profileImage: imageUrl },
        { new: true, select: '-password' }
      );
    }

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      success: true,
      message: 'Profile picture updated successfully.',
      data: {
        profileImage: imageUrl,
        user: updatedUser
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
