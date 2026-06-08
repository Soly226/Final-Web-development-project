const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const instructorSchema = new mongoose.Schema({
  instructor_id: { type: String, unique: true, required: true },
  full_name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  department: { type: String },
  role: { type: String, enum: ['instructor', 'head_of_department'], default: 'instructor' },
  assigned_courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  isActive: { type: Boolean, default: true },
  profileImage: { type: String, default: null },
  initials: { type: String },
  // HOD-specific profile fields
  bio: { type: String, default: '' },
  office_hours: { type: String, default: '' },
  office_location: { type: String, default: '' },
  phone: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
});

instructorSchema.pre('save', async function(next) {
  if (!this.initials && this.full_name) {
    this.initials = this.full_name
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Instructor = mongoose.model('Instructor', instructorSchema);
module.exports = Instructor;
