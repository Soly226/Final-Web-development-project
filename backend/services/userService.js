const Student = require('../models/Student');
const Instructor = require('../models/Instructor');
const Admin = require('../models/Admin');

/**
 * Service to handle aggregated queries across Student, Instructor, and Admin models
 */
const getAggregatedUsers = async ({ search = '', role = 'All Roles', page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const searchQuery = search
    ? {
        $or: [
          { full_name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } }
        ]
      }
    : {};

  let students = [];
  let instructors = [];
  let admins = [];

  if (role === 'All Roles' || role === 'Student') {
    students = await Student.find(searchQuery).select('-password');
  }
  if (role === 'All Roles' || role === 'Instructor') {
    instructors = await Instructor.find(searchQuery).select('-password');
  }
  if (role === 'All Roles' || role === 'Admin') {
    admins = await Admin.find(searchQuery).select('-password');
  }

  const allUsers = [
    ...students.map(s => ({
      _id: s._id,
      id: s.student_id,
      name: s.full_name,
      email: s.email,
      role: 'Student',
      status: s.isActive === false ? 'Inactive' : 'Active',
      lastActivity: 'Active student',
      department: s.department,
      level: s.level
    })),
    ...instructors.map(inst => ({
      _id: inst._id,
      id: inst.instructor_id,
      name: inst.full_name,
      email: inst.email,
      role: 'Instructor',
      status: inst.isActive === false ? 'Inactive' : 'Active',
      lastActivity: inst.role === 'head_of_department' ? 'Head of Department' : 'Instructor',
      department: inst.department
    })),
    ...admins.map(a => ({
      _id: a._id,
      id: a.admin_id,
      name: a.full_name,
      email: a.email,
      role: 'Admin',
      status: a.isActive === false ? 'Inactive' : 'Active',
      lastActivity: 'Administrator'
    }))
  ];

  // Sort by name
  allUsers.sort((a, b) => a.name.localeCompare(b.name));

  const total = allUsers.length;
  const paginatedUsers = allUsers.slice(skip, skip + limit);

  return {
    users: paginatedUsers,
    total,
    totalPages: Math.ceil(total / limit)
  };
};

module.exports = {
  getAggregatedUsers
};
