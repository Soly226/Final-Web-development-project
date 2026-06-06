const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  admin_id: { type: String, unique: true, required: true },
  full_name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  permissions: { type: [String], default: ['all'] },
  isActive: { type: Boolean, default: true },
  profileImage: { type: String, default: null },
  initials: { type: String },
  created_at: { type: Date, default: Date.now }
});

adminSchema.pre('save', async function(next) {
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

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
