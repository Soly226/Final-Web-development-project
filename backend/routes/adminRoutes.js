import express from 'express';
import { 
  getSystemLogs, 
  getPlatformAnalytics, 
  updateSystemSettings,
  getEmailTemplates, 
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

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/logs', getSystemLogs);
router.get('/analytics', getPlatformAnalytics);
router.put('/settings', updateSystemSettings);
router.get('/email-templates', getEmailTemplates);
router.put('/email-templates/:id', updateEmailTemplate);
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
