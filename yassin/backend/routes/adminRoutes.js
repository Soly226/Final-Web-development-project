const express = require('express');
const { 
  getSystemLogs, 
  getPlatformAnalytics, 
  getSystemSettings,
  updateSystemSettings,
  createSystemBroadcast,
  getEmailTemplates,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  getAdminReports,
  uploadLogoFile,
  getLogoUrl
} = require('../controllers/adminController');
const { uploadLogo } = require('../middleware/uploadMiddleware');
const {
  getStudents,
  createStudent,
  getInstructors,
  createInstructor,
  getAdmins,
  createAdmin,
  deleteUser,
  getAllUsers,
  updateUser
} = require('../controllers/userManagementController');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  updateSettingsValidationRules,
  createBroadcastValidationRules,
  createEmailTemplateValidationRules,
  updateEmailTemplateValidationRules,
  createStudentValidationRules,
  createInstructorValidationRules,
  createAdminValidationRules,
  validateRequest
} = require('../middleware/validationMiddleware');

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
router.delete('/email-templates/:id', deleteEmailTemplate);
router.get('/reports', getAdminReports);

// File Upload Routes
router.post('/upload/logo', uploadLogo, uploadLogoFile);
router.get('/logo', getLogoUrl);

// User Management Routes
router.get('/users', getAllUsers);
router.get('/users/students', getStudents);
router.post('/users/students', createStudentValidationRules, validateRequest, createStudent);
router.get('/users/instructors', getInstructors);
router.post('/users/instructors', createInstructorValidationRules, validateRequest, createInstructor);
router.get('/users/admins', getAdmins);
router.post('/users/admins', createAdminValidationRules, validateRequest, createAdmin);
router.put('/users/:type/:id', updateUser);
router.delete('/users/:type/:id', deleteUser);

module.exports = router;
