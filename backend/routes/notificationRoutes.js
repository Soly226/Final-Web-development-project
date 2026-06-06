const express = require('express');
const Notification = require('../models/Notification');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * Notification Routes
 *
 * Adapted from Basel's baselbranch (CommonJS) into ES Modules.
 * Uses the existing `protect` HTTPOnly-cookie middleware.
 *
 * Routes:
 *  GET    /api/notifications           — Get all notifications for the logged-in user
 *  POST   /api/notifications           — Create a notification (admin only, for testing/broadcasting)
 *  PUT    /api/notifications/:id/read  — Mark a notification as read
 *  PUT    /api/notifications/read-all  — Mark all notifications as read
 *  DELETE /api/notifications/:id       — Delete a notification
 */
const router = express.Router();

// Helper: derive the model name from the user's role on the JWT
const roleToModel = (role) => {
  if (role === 'admin') return 'Admin';
  if (role === 'instructor') return 'Instructor';
  return 'Student';
};

// @desc    Get all notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
      userModel: roleToModel(req.user.role),
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a notification (admin only, e.g., broadcasts)
// @route   POST /api/notifications
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { userId, userModel, type, title, message } = req.body;

  if (!userId || !userModel || !type) {
    return res.status(400).json({ message: 'userId, userModel, and type are required' });
  }

  if (!['Student', 'Instructor', 'Admin'].includes(userModel)) {
    return res.status(400).json({ message: 'Invalid userModel. Must be Student, Instructor, or Admin' });
  }

  try {
    const notification = await Notification.create({ user: userId, userModel, type, title, message });
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Mark all notifications as read for the logged-in user
// @route   PUT /api/notifications/read-all
// @access  Private
router.put('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, userModel: roleToModel(req.user.role), read: false },
      { $set: { read: true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private (owner only)
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
