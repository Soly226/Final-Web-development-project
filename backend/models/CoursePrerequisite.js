import mongoose from 'mongoose';

const coursePrerequisiteSchema = new mongoose.Schema({
  prerequisite_id: { type: String, unique: true, required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  required_course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }
});

const CoursePrerequisite = mongoose.model('CoursePrerequisite', coursePrerequisiteSchema);
export default CoursePrerequisite;
