const express = require('express');
const Announcement = require('../models/Announcement');
const { protect } = require('../middleware/authMiddleware');

/**
 * Announcement Routes (Student/Instructor read access)
 *
 * Allows students and instructors to fetch admin broadcasts so they can
 * display them in the read-only "Announcements" tab of the Messages page.
 * Admins use the /api/admin/broadcast POST endpoint to create announcements;
 * this route only exposes them for consumption.
 *
 * Routes:
 *  GET /api/announcements  — Fetch all announcements relevant to the caller's role
 */
const router = express.Router();

// @desc    Get announcements for the logged-in student or instructor
// @route   GET /api/announcements
// @access  Private (Student, Instructor only)
router.get('/', protect, async (req, res) => {
  // Admins have no need to see announcements in a chatbox
  if (req.user.role === 'admin') {
    return res.status(403).json({ message: 'Admins do not have access to the announcements feed.' });
  }

  try {
    const roleFilter = req.user.role === 'instructor' ? 'instructor' : 'student';

    const announcements = await Announcement.find({
      targetRole: { $in: [roleFilter, 'all'] },
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching announcements.' });
  }
});

module.exports = router;
