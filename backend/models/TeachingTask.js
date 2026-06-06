const mongoose = require('mongoose');

const teachingTaskSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  course_name: { type: String, required: true },
  course_code: { type: String, required: true },
  instructor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
  doctor_name: { type: String, required: true },
  year: { 
    type: String, 
    enum: ['Freshman', 'Sophomore', 'Junior', 'Senior'], 
    required: true 
  },
  specialization: { 
    type: String, 
    enum: ['AI', 'Cybersecurity', 'Software Engineering', 'Data Science'], 
    required: true 
  },
  created_at: { type: Date, default: Date.now }
});

const TeachingTask = mongoose.model('TeachingTask', teachingTaskSchema);
module.exports = TeachingTask;
