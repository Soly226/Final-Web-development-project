import mongoose from 'mongoose';

const quizSubmissionSchema = new mongoose.Schema({
  submission_id: { type: String, unique: true, required: true },
  quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  answers: { type: mongoose.Schema.Types.Mixed }, // flexible object for Q&A pairs
  grade: { type: Number },
  submitted_at: { type: Date, default: Date.now }
});

const QuizSubmission = mongoose.model('QuizSubmission', quizSubmissionSchema);
export default QuizSubmission;
