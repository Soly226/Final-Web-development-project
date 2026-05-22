const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// Get messages for user
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user.user.id }).populate('sender', 'name email');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/', auth, async (req, res) => {
  const { receiver, subject, content } = req.body;
  try {
    const message = new Message({ sender: req.user.user.id, receiver, subject, content });
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (message.receiver.toString() !== req.user.user.id) return res.status(403).json({ message: 'Access denied' });
    message.read = true;
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete message
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (message.sender.toString() !== req.user.user.id && message.receiver.toString() !== req.user.user.id) return res.status(403).json({ message: 'Access denied' });
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;