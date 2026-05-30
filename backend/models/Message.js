import mongoose from 'mongoose';

/**
 * Message Model
 *
 * Uses Mongoose's `refPath` dynamic referencing to support sender/receiver
 * being any of the three user types (Student, Instructor, Admin),
 * without requiring a single unified User model.
 *
 * Author integration: adapted from Basel's baselbranch implementation.
 */
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'senderModel',
    },
    senderModel: {
      type: String,
      required: true,
      enum: ['Student', 'Instructor', 'Admin'],
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'receiverModel',
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ['Student', 'Instructor', 'Admin'],
    },
    subject: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
