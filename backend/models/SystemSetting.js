import mongoose from 'mongoose';

const systemSettingSchema = new mongoose.Schema({
  platformName: { type: String, default: 'EduCore LMS' },
  primaryLanguage: { type: String, default: 'English (US)' },
  twoFactorEnabled: { type: Boolean, default: false },
  sessionTimeoutMinutes: { type: Number, default: 30 },
  maxLoginAttempts: { type: Number, default: 5 },
  smtpHost: { type: String, default: '' },
  smtpPort: { type: Number, default: 587 },
  logoUrl:  { type: String, default: '' }
}, {
  timestamps: true
});

const SystemSetting = mongoose.model('SystemSetting', systemSettingSchema);
export default SystemSetting;
