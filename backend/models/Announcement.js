import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  targetRole: { type: String, enum: ['all', 'instructor', 'student'], default: 'all' }
}, {
  timestamps: true
});

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
