import SystemLog from '../models/SystemLog.js';
import User from '../models/User.js';
import EmailTemplate from '../models/EmailTemplate.js';

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
    const userCount = await User.countDocuments();
    const instructorCount = await User.countDocuments({ role: 'instructor' });
    const studentCount = await User.countDocuments({ role: 'student' });
    
    // In a real app, we'd count courses, enrollments, etc.
    res.json({
      totalUsers: userCount,
      instructors: instructorCount,
      students: studentCount,
      activeCourses: 0, // Placeholder
      systemStorage: '45.2 GB', // Placeholder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateSystemSettings = async (req, res) => {
  const { siteName, maintenanceMode } = req.body;
  
  try {
    // Log the change
    await SystemLog.create({
      level: 'info',
      message: `System settings updated by ${req.user.name}`,
      source: 'Admin Module',
      metadata: { siteName, maintenanceMode }
    });

    res.json({ message: 'Settings updated successfully' });
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
    // In a real app, this would perform complex aggregations
    const reportData = {
      userGrowth: [
        { month: 'Jan', count: 400 },
        { month: 'Feb', count: 600 },
        { month: 'Mar', count: 800 },
        { month: 'Apr', count: 1200 },
      ],
      courseActivity: [
        { category: 'Science', active: 120 },
        { category: 'Arts', active: 80 },
        { category: 'Tech', active: 250 },
      ],
      systemHealth: 'Optimal',
      lastBackup: new Date().toISOString(),
    };
    
    res.json(reportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
