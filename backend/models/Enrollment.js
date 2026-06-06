const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  enrollment_id: { type: String, unique: true, required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  semester: { type: String, required: true },
  status: { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' },
  final_grade: { type: String }
}, {
  timestamps: true  // Adds createdAt and updatedAt automatically
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment;
