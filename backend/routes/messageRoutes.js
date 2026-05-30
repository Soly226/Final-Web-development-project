import express from 'express';
import Message from '../models/Message.js';
import Student from '../models/Student.js';
import Instructor from '../models/Instructor.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/authMiddleware.js';

/**
 * Message Routes
 *
 * Adapted from Basel's baselbranch (CommonJS) into ES Modules.
 * Uses the existing `protect` HTTPOnly-cookie middleware instead of Basel's
 * header-based auth, and maps sender/receiver to role-based models.
 *
 * Routes:
 *  GET    /api/messages                     — Get all messages received by the logged-in user
 *  GET    /api/messages/sent                — Get all messages sent by the logged-in user
 *  GET    /api/messages/search-recipients   — Search for message recipients by name (students/instructors only)
 *  POST   /api/messages                     — Send a new message
 *  PUT    /api/messages/:id/read            — Mark a message as read
 *  DELETE /api/messages/:id                 — Delete a message (sender or receiver)
 *
 * Access restrictions:
 *  - Admin users are blocked from all routes (they have no peer-chat system).
 *  - No message may target an Admin receiver.
 */
const router = express.Router();

// Helper: derive the model name from the user's role on the JWT
const roleToModel = (role) => {
  if (role === 'admin') return 'Admin';
  if (role === 'instructor') return 'Instructor';
  return 'Student';
};

// Guard: block admin users from the entire messaging system
const blockAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    return res.status(403).json({ message: 'Admins do not have a peer messaging system.' });
  }
  next();
};

// @desc    Search for message recipients by full_name (students + instructors only)
// @route   GET /api/messages/search-recipients?q=<name>
// @access  Private (Student, Instructor only)
router.get('/search-recipients', protect, blockAdmin, async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q || q.length < 2) {
    return res.json([]);
  }

  const regex = new RegExp(q, 'i');
  const callerId = req.user._id.toString();

  try {
    const [students, instructors] = await Promise.all([
      Student.find({ full_name: regex }).select('_id full_name email'),
      Instructor.find({ full_name: regex }).select('_id full_name email'),
    ]);

    // Combine and label, excluding the caller themselves
    const results = [
      ...students
        .filter((s) => s._id.toString() !== callerId)
        .map((s) => ({ _id: s._id, full_name: s.full_name, email: s.email, role: 'Student' })),
      ...instructors
        .filter((i) => i._id.toString() !== callerId)
        .map((i) => ({ _id: i._id, full_name: i.full_name, email: i.email, role: 'Instructor' })),
    ];

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error during recipient search.' });
  }
});

// @desc    Get all received messages for the logged-in user
// @route   GET /api/messages
// @access  Private (Student, Instructor only)
router.get('/', protect, blockAdmin, async (req, res) => {
  try {
    const messages = await Message.find({
      receiver: req.user._id,
      receiverModel: roleToModel(req.user.role),
    })
      .populate('sender', 'full_name email name')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all sent messages for the logged-in user
// @route   GET /api/messages/sent
// @access  Private (Student, Instructor only)
router.get('/sent', protect, blockAdmin, async (req, res) => {
  try {
    const messages = await Message.find({
      sender: req.user._id,
      senderModel: roleToModel(req.user.role),
    })
      .populate('receiver', 'full_name email name')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private (Student, Instructor only)
router.post('/', protect, blockAdmin, async (req, res) => {
  const { receiverId, receiverModel, subject, content } = req.body;

  if (!receiverId || !receiverModel || !content) {
    return res.status(400).json({ message: 'receiverId, receiverModel, and content are required' });
  }

  // Admins cannot be recipients
  if (receiverModel === 'Admin') {
    return res.status(400).json({ message: 'You cannot send messages to an admin. Please contact the university office directly.' });
  }

  if (!['Student', 'Instructor'].includes(receiverModel)) {
    return res.status(400).json({ message: 'Invalid receiverModel. Must be Student or Instructor.' });
  }

  try {
    const message = await Message.create({
      sender: req.user._id,
      senderModel: roleToModel(req.user.role),
      receiver: receiverId,
      receiverModel,
      subject: subject || '',
      content,
    });

    // Create a notification for the recipient
    await Notification.create({
      user: receiverId,
      userModel: receiverModel,
      type: 'message',
      title: 'New Message',
      message: `You received a message from ${req.user.full_name || req.user.name || 'a user'}: "${content.length > 50 ? content.substring(0, 50) + '...' : content}"`
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Mark a message as read
// @route   PUT /api/messages/:id/read
// @access  Private (receiver only)
router.put('/:id/read', protect, blockAdmin, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    // Only the receiver can mark as read
    if (message.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    message.read = true;
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private (sender or receiver)
router.delete('/:id', protect, blockAdmin, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    const userId = req.user._id.toString();
    const isSender = message.sender.toString() === userId;
    const isReceiver = message.receiver.toString() === userId;

    if (!isSender && !isReceiver) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
