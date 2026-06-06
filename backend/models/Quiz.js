const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  quiz_id: { type: String, unique: true, required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  instructor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
  title: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  total_marks: { type: Number, required: true },
  created_at: { type: Date, default: Date.now }
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
