import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  material_id: { type: String, unique: true, required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  instructor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
  title: { type: String, required: true },
  file_url: { type: String, required: true },
  upload_date: { type: Date, default: Date.now }
});

const Material = mongoose.model('Material', materialSchema);
export default Material;
