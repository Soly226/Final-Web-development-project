import mongoose from 'mongoose';
import SystemLog from '../models/SystemLog.js';
import Admin from '../models/Admin.js';
import Instructor from '../models/Instructor.js';
import Student from '../models/Student.js';
import EmailTemplate from '../models/EmailTemplate.js';
import SystemSetting from '../models/SystemSetting.js';
import Announcement from '../models/Announcement.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

// @desc    Get system logs
// @route   GET /api/admin/logs
// @access  Private/Admin
export const getSystemLogs = async (req, res) => {
  try {
    const logs = await SystemLog.find({}).sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get platform analytics (summary)
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getPlatformAnalytics = async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    const instructorCount = await Instructor.countDocuments();
    const studentCount = await Student.countDocuments();
    const userCount = adminCount + instructorCount + studentCount;
    const courseCount = await Course.countDocuments();

    // Fetch storage size from DB stats dynamically
    let systemStorage = '0.1 GB';
    try {
      if (mongoose.connection && mongoose.connection.db) {
        const stats = await mongoose.connection.db.stats();
        const sizeInBytes = stats.storageSize || stats.dataSize || 0;
        if (sizeInBytes > 0) {
          if (sizeInBytes < 1024 * 1024) {
            systemStorage = `${(sizeInBytes / 1024).toFixed(1)} KB`;
          } else if (sizeInBytes < 1024 * 1024 * 1024) {
            systemStorage = `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
          } else {
            systemStorage = `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
          }
        }
      }
    } catch (dbErr) {
      console.warn('Could not query DB stats, falling back to document count estimation:', dbErr.message);
      // Fallback estimate based on count of documents across some schemas
      const totalDocs = userCount + courseCount + await SystemLog.countDocuments() + await Enrollment.countDocuments();
      const estimatedBytes = totalDocs * 1024; // assume avg 1KB per document
      systemStorage = `${(estimatedBytes / 1024).toFixed(1)} KB`;
    }
    
    res.json({
      totalUsers: userCount,
      instructors: instructorCount,
      students: studentCount,
      activeCourses: courseCount,
      systemStorage: systemStorage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSetting.findOne({});
    if (!settings) {
      settings = await SystemSetting.create({}); // Create defaults if none exist
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateSystemSettings = async (req, res) => {
  const { platformName, primaryLanguage, twoFactorEnabled, sessionTimeoutMinutes, maxLoginAttempts, smtpHost, smtpPort } = req.body;
  
  try {
    let settings = await SystemSetting.findOne({});
    if (!settings) {
      settings = new SystemSetting({});
    }
    
    settings.platformName = platformName !== undefined ? platformName : settings.platformName;
    settings.primaryLanguage = primaryLanguage !== undefined ? primaryLanguage : settings.primaryLanguage;
    settings.twoFactorEnabled = twoFactorEnabled !== undefined ? twoFactorEnabled : settings.twoFactorEnabled;
    settings.sessionTimeoutMinutes = sessionTimeoutMinutes !== undefined ? sessionTimeoutMinutes : settings.sessionTimeoutMinutes;
    settings.maxLoginAttempts = maxLoginAttempts !== undefined ? maxLoginAttempts : settings.maxLoginAttempts;
    settings.smtpHost = smtpHost !== undefined ? smtpHost : settings.smtpHost;
    settings.smtpPort = smtpPort !== undefined ? smtpPort : settings.smtpPort;

    await settings.save();

    // Log the change
    await SystemLog.create({
      level: 'info',
      message: `System settings updated by ${req.user.full_name || 'Admin'}`,
      source: 'Admin Module',
      metadata: { platformName }
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a system broadcast announcement
// @route   POST /api/admin/broadcast
// @access  Private/Admin
export const createSystemBroadcast = async (req, res) => {
  const { title, content, targetRole } = req.body;
  
  try {
    const announcement = await Announcement.create({
      title,
      content,
      sender: req.user._id,
      targetRole: targetRole || 'all'
    });

    await SystemLog.create({
      level: 'info',
      message: `System broadcast sent: ${title}`,
      source: 'Admin Module',
      metadata: { targetRole }
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all email templates
// @route   GET /api/admin/email-templates
// @access  Private/Admin
export const getEmailTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplate.find({});
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new email template
// @route   POST /api/admin/email-templates
// @access  Private/Admin
export const createEmailTemplate = async (req, res) => {
  const { name, subject, body, variables } = req.body;

  if (!name || !subject || !body) {
    return res.status(400).json({ message: 'Name, subject, and body are required.' });
  }

  try {
    const existing = await EmailTemplate.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'A template with this name already exists.' });
    }

    const template = await EmailTemplate.create({
      name,
      subject,
      body,
      variables: variables || [],
      updatedBy: req.user._id,
    });

    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an email template
// @route   PUT /api/admin/email-templates/:id
// @access  Private/Admin
export const updateEmailTemplate = async (req, res) => {
  const { subject, body } = req.body;
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (template) {
      template.subject = subject || template.subject;
      template.body = body || template.body;
      template.updatedBy = req.user._id;
      template.updatedAt = Date.now();
      
      const updatedTemplate = await template.save();
      res.json(updatedTemplate);
    } else {
      res.status(404).json({ message: 'Template not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get advanced admin reports
// @route   GET /api/admin/reports
// @access  Private/Admin
export const getAdminReports = async (req, res) => {
  try {
    // 1. Total Enrollments
    const totalEnrollments = await Enrollment.countDocuments();

    // 2. Completion Rate
    const completedCount = await Enrollment.countDocuments({ status: 'completed' });
    const completionRate = totalEnrollments > 0 ? (completedCount / totalEnrollments) * 100 : 0;

    // 3. Average Grade
    const gradedEnrollments = await Enrollment.find({ final_grade: { $exists: true, $ne: null } });
    const gradeMap = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0 };
    const reverseGradeMap = ['F', 'D', 'C', 'B', 'A'];
    let totalPoints = 0;
    let gradedCount = 0;
    gradedEnrollments.forEach(e => {
      if (e.final_grade) {
        const cleanGrade = e.final_grade.trim().toUpperCase().charAt(0);
        if (gradeMap[cleanGrade] !== undefined) {
          totalPoints += gradeMap[cleanGrade];
          gradedCount++;
        }
      }
    });
    const avgPoints = gradedCount > 0 ? Math.round(totalPoints / gradedCount) : 4; // defaults to A (index 4) if none graded
    const averageGrade = reverseGradeMap[avgPoints] || 'A';

    // 4. Instructors Count
    const instructorCount = await Instructor.countDocuments();

    // 5. Semester Enrollment Trends
    const semesterTrendsAgg = await Enrollment.aggregate([
      { $group: { _id: '$semester', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    const trends = semesterTrendsAgg.map(item => ({
      semester: item._id,
      count: item.count
    }));

    // 6. Popular Courses
    const popularCoursesAgg = await Enrollment.aggregate([
      { $group: { _id: '$course_id', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);
    const popularCourses = [];
    for (const item of popularCoursesAgg) {
      const course = await Course.findById(item._id);
      if (course) {
        popularCourses.push({
          name: course.course_name,
          code: course.course_code,
          count: item.count
        });
      }
    }

    res.json({
      totalEnrollments,
      completionRate: Math.round(completionRate * 10) / 10,
      averageGrade,
      instructorCount,
      trends,
      popularCourses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
