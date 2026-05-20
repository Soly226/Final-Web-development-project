import mongoose from 'mongoose';

const assignmentSubmissionSchema = new mongoose.Schema({
  submission_id: { type: String, unique: true, required: true },
  assignment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  uploaded_file: { type: String },
  submission_date: { type: Date, default: Date.now },
  grade: { type: Number },
  feedback: { type: String }
});

const AssignmentSubmission = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
export default AssignmentSubmission;
