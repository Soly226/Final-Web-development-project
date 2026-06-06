const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  material_id: { type: String, unique: true, required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  instructor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
  title: { type: String, required: true },
  file_url: { type: String, default: '' },
  file_type: { type: String, enum: ['pdf', 'mp4', 'link'], default: 'pdf' },
  week: { type: Number, default: 1 },
  duration: { type: String, default: 'TBD' },
  status: { type: String, enum: ['Published', 'Draft'], default: 'Published' },
  upload_date: { type: Date, default: Date.now }
});

const Material = mongoose.model('Material', materialSchema);
module.exports = Material;
