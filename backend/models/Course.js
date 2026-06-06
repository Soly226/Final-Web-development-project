const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  course_id: { type: String, unique: true, required: true },
  course_code: { type: String, unique: true, required: true },
  course_name: { type: String, required: true },
  description: { type: String },
  credit_hours: { type: Number, required: true },
  department: { type: String, required: true },
  prerequisite_course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  assigned_instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' }],
  enrolled_students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
