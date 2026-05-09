import express from 'express';
import { 
  getSystemLogs, 
  getPlatformAnalytics, 
  updateSystemSettings,
  getEmailTemplates,
  updateEmailTemplate,
  getAdminReports 
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/logs', getSystemLogs);
router.get('/analytics', getPlatformAnalytics);
router.put('/settings', updateSystemSettings);
router.get('/email-templates', getEmailTemplates);
router.put('/email-templates/:id', updateEmailTemplate);
router.get('/reports', getAdminReports);

export default router;
