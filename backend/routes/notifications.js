const express = require('express');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// Get notifications for user
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create notification (internal use, but for testing)
router.post('/', auth, async (req, res) => {
  if (req.user.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (notification.user.toString() !== req.user.user.id) return res.status(403).json({ message: 'Access denied' });
    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (notification.user.toString() !== req.user.user.id) return res.status(403).json({ message: 'Access denied' });
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;