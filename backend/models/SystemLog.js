import mongoose from 'mongoose';

const systemLogSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['info', 'warning', 'error'],
    default: 'info',
  },
  message: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    type: Object,
  }
});

const SystemLog = mongoose.model('SystemLog', systemLogSchema);

export default SystemLog;
