const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lectures: [{
    title: String,
    content: String,
    videoUrl: String,
  }],
  assignments: [{
    title: String,
    description: String,
    dueDate: Date,
    submissions: [{
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      submission: String,
      grade: Number,
    }],
  }],
  stream: [{
    type: { type: String, enum: ['announcement', 'discussion'] },
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);