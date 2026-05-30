import mongoose from 'mongoose';

/**
 * Notification Model
 *
 * Uses Mongoose's `refPath` dynamic referencing to support the `user` field
 * referencing any of the three user types (Student, Instructor, Admin).
 *
 * Author integration: adapted from Basel's baselbranch implementation.
 */
const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'userModel',
    },
    userModel: {
      type: String,
      required: true,
      enum: ['Student', 'Instructor', 'Admin'],
    },
    type: {
      type: String,
      enum: ['message', 'assignment', 'announcement', 'grade'],
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
