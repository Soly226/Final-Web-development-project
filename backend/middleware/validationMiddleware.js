import { body, param, validationResult } from 'express-validator';

// Middleware to check validation results and return formatting errors if any
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Authentication Validations
export const registerValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .trim()
    .isIn(['admin', 'instructor', 'student']).withMessage('Role must be admin, instructor, or student')
];

export const loginValidationRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Admin System Settings Validations
export const updateSettingsValidationRules = [
  body('platformName')
    .optional()
    .trim()
    .notEmpty().withMessage('Platform name cannot be empty')
    .isString().withMessage('Platform name must be a string'),
  body('primaryLanguage')
    .optional()
    .trim()
    .notEmpty().withMessage('Primary language cannot be empty')
    .isString().withMessage('Primary language must be a string'),
  body('twoFactorEnabled')
    .optional()
    .isBoolean().withMessage('twoFactorEnabled must be a boolean value'),
  body('sessionTimeoutMinutes')
    .optional()
    .isInt({ min: 1, max: 1440 }).withMessage('Session timeout must be an integer between 1 and 1440 minutes'),
  body('maxLoginAttempts')
    .optional()
    .isInt({ min: 1, max: 20 }).withMessage('Max login attempts must be an integer between 1 and 20'),
  body('smtpHost')
    .optional()
    .trim()
    .isString().withMessage('SMTP host must be a string'),
  body('smtpPort')
    .optional()
    .isInt({ min: 1, max: 65535 }).withMessage('SMTP port must be a valid port number (1-65535)')
];

// Admin Broadcast Validations
export const createBroadcastValidationRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Broadcast title is required')
    .isString().withMessage('Title must be a string')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('content')
    .trim()
    .notEmpty().withMessage('Broadcast content is required')
    .isString().withMessage('Content must be a string')
    .isLength({ max: 1000 }).withMessage('Content cannot exceed 1000 characters'),
  body('targetRole')
    .optional()
    .trim()
    .isIn(['all', 'admin', 'instructor', 'student']).withMessage('Target role must be all, admin, instructor, or student')
];

// Admin Email Template Validations
export const createEmailTemplateValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Template name is required')
    .isString().withMessage('Template name must be a string')
    .custom(value => !/\s/.test(value)).withMessage('Template name cannot contain spaces'),
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isString().withMessage('Subject must be a string'),
  body('body')
    .trim()
    .notEmpty().withMessage('Body content is required')
    .isString().withMessage('Body must be a string'),
  body('variables')
    .optional()
    .isArray().withMessage('Variables must be an array of strings')
];

export const updateEmailTemplateValidationRules = [
  param('id')
    .isMongoId().withMessage('Invalid template ID format'),
  body('subject')
    .optional()
    .trim()
    .notEmpty().withMessage('Subject cannot be empty if provided')
    .isString().withMessage('Subject must be a string'),
  body('body')
    .optional()
    .trim()
    .notEmpty().withMessage('Body cannot be empty if provided')
    .isString().withMessage('Body must be a string')
];

// User Management Validations
export const createStudentValidationRules = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('department')
    .optional()
    .trim()
    .isString().withMessage('Department must be a string'),
  body('level')
    .optional()
    .trim()
    .isString().withMessage('Level must be a string')
];

export const createInstructorValidationRules = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('department')
    .optional()
    .trim()
    .isString().withMessage('Department must be a string'),
  body('role')
    .optional()
    .trim()
    .isIn(['instructor', 'head_of_department']).withMessage('Role must be instructor or head_of_department')
];

export const createAdminValidationRules = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('permissions')
    .optional()
    .isArray().withMessage('Permissions must be an array of strings')
];

