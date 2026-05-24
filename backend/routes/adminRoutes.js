import express from 'express';
import { 
  getSystemLogs, 
  getPlatformAnalytics, 
  getSystemSettings,
  updateSystemSettings,
  createSystemBroadcast,
  getEmailTemplates,
  createEmailTemplate,
  updateEmailTemplate, 
  getAdminReports 
} from '../controllers/adminController.js';
import {
  getStudents,
  createStudent,
  getInstructors,
  createInstructor,
  getAdmins,
  createAdmin,
  deleteUser
} from '../controllers/userManagementController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  updateSettingsValidationRules,
  createBroadcastValidationRules,
  createEmailTemplateValidationRules,
  updateEmailTemplateValidationRules,
  validateRequest
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/logs', getSystemLogs);
router.get('/analytics', getPlatformAnalytics);
router.get('/settings', getSystemSettings);
router.put('/settings', updateSettingsValidationRules, validateRequest, updateSystemSettings);
router.post('/broadcast', createBroadcastValidationRules, validateRequest, createSystemBroadcast);
router.get('/email-templates', getEmailTemplates);
router.post('/email-templates', createEmailTemplateValidationRules, validateRequest, createEmailTemplate);
router.put('/email-templates/:id', updateEmailTemplateValidationRules, validateRequest, updateEmailTemplate);
router.get('/reports', getAdminReports);

// User Management Routes
router.get('/users/students', getStudents);
router.post('/users/students', createStudent);
router.get('/users/instructors', getInstructors);
router.post('/users/instructors', createInstructor);
router.get('/users/admins', getAdmins);
router.post('/users/admins', createAdmin);
router.delete('/users/:type/:id', deleteUser);

export default router;
