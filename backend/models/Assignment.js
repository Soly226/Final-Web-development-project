import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  assignment_id: { type: String, unique: true, required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  instructor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  total_marks: { type: Number, required: true },
  created_at: { type: Date, default: Date.now }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
