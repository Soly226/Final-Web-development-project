import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema({
  student_id: { type: String, unique: true, required: true },
  full_name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  department: { type: String },
  level: { type: String }, // level/year
  GPA: { type: Number, default: 0 },
  enrolled_courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  created_at: { type: Date, default: Date.now }
});

studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
