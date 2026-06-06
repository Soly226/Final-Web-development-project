// Shared in-memory mock data to allow real-time changes to persist across portal components in offline/mock mode

let mockHODProfile = {
  _id: 'mock_inst_001',
  full_name: 'Dr. Alan Turing',
  email: 'aturing@educore.com',
  role: 'head_of_department',
  department: 'Computer Science',
  bio: 'Ph.D. in Computer Science. Research focus on distributed systems and cryptography.',
  office_hours: 'Mon/Wed 2:00 PM - 4:00 PM',
  office_location: 'Building 4, Room 402',
  phone: '+1 (555) 019-2834'
};

let mockCourses = [
  {
    _id: 'mock_c_001',
    course_id: 'C001',
    course_code: 'CS101',
    course_name: 'Introduction to Programming',
    description: 'Basics of programming using Python.',
    credit_hours: 3,
    department: 'Computer Science',
    assigned_instructors: [
      { _id: 'mock_inst_002', full_name: 'Grace Hopper', email: 'ghopper@educore.com' }
    ]
  },
  {
    _id: 'mock_c_002',
    course_id: 'C002',
    course_code: 'CS102',
    course_name: 'Problem Solving',
    description: 'Advanced logic and problem solving.',
    credit_hours: 3,
    department: 'Computer Science',
    assigned_instructors: [
      { _id: 'mock_inst_001', full_name: 'Dr. Alan Turing', email: 'aturing@educore.com' }
    ]
  },
  {
    _id: 'mock_c_003',
    course_id: 'C003',
    course_code: 'CS201',
    course_name: 'Data Structures and Algorithms',
    description: 'Understanding stacks, queues, trees, and complexity analysis.',
    credit_hours: 3,
    department: 'Computer Science',
    assigned_instructors: [
      { _id: 'mock_inst_002', full_name: 'Grace Hopper', email: 'ghopper@educore.com' }
    ]
  },
  {
    _id: 'mock_c_005',
    course_id: 'C005',
    course_code: 'CS301',
    course_name: 'Artificial Intelligence',
    description: 'Foundations of state-space search, heuristics, and machine learning.',
    credit_hours: 4,
    department: 'Computer Science',
    assigned_instructors: []
  }
];

let mockInstructors = [
  {
    _id: 'mock_inst_001',
    instructor_id: 'INST001',
    full_name: 'Dr. Alan Turing',
    email: 'aturing@educore.com',
    role: 'head_of_department',
    department: 'Computer Science',
    assigned_courses: [
      { _id: 'mock_c_002', course_code: 'CS102', course_name: 'Problem Solving', credit_hours: 3 }
    ],
    workload: {
      courseCount: 1,
      totalCredits: 3,
      totalStudents: 89
    }
  },
  {
    _id: 'mock_inst_002',
    instructor_id: 'INST002',
    full_name: 'Grace Hopper',
    email: 'ghopper@educore.com',
    role: 'instructor',
    department: 'Computer Science',
    assigned_courses: [
      { _id: 'mock_c_001', course_code: 'CS101', course_name: 'Introduction to Programming', credit_hours: 3 },
      { _id: 'mock_c_003', course_code: 'CS201', course_name: 'Data Structures and Algorithms', credit_hours: 3 }
    ],
    workload: {
      courseCount: 2,
      totalCredits: 6,
      totalStudents: 124
    }
  }
];

let mockTasks = [
  {
    _id: 'mock_task_001',
    course_id: 'mock_c_001',
    course_name: 'Introduction to Programming',
    course_code: 'CS101',
    instructor_id: 'mock_inst_002',
    doctor_name: 'Grace Hopper',
    year: 'Freshman',
    specialization: 'Software Engineering',
    created_at: new Date()
  },
  {
    _id: 'mock_task_002',
    course_id: 'mock_c_005',
    course_name: 'Artificial Intelligence',
    course_code: 'CS301',
    instructor_id: 'mock_inst_001',
    doctor_name: 'Dr. Alan Turing',
    year: 'Senior',
    specialization: 'AI',
    created_at: new Date()
  }
];

let mockMaterials = [
  { _id: 'mock_m_001', course_id: 'mock_c_001', title: 'HTML Fundamentals', week: 1, duration: '24 min', status: 'Published' },
  { _id: 'mock_m_002', course_id: 'mock_c_001', title: 'CSS Layouts', week: 2, duration: '31 min', status: 'Published' },
  { _id: 'mock_m_003', course_id: 'mock_c_001', title: 'JavaScript Basics', week: 3, duration: '40 min', status: 'Draft' },
  { _id: 'mock_m_004', course_id: 'mock_c_002', title: 'Logic Gates & Truth Tables', week: 1, duration: '35 min', status: 'Published' },
  { _id: 'mock_m_005', course_id: 'mock_c_005', title: 'Neural Networks Basics', week: 1, duration: '45 min', status: 'Published' }
];

let mockStudents = [
  { _id: 'mock_stud_001', student_id: 'S001', full_name: 'John Doe', email: 'jdoe@student.com', enrolled_courses: ['mock_c_001', 'mock_c_002'] },
  { _id: 'mock_stud_002', student_id: 'S002', full_name: 'Jane Smith', email: 'jsmith@student.com', enrolled_courses: ['mock_c_001', 'mock_c_003'] },
  { _id: 'mock_stud_003', student_id: 'S003', full_name: 'Alice Johnson', email: 'ajohnson@student.com', enrolled_courses: ['mock_c_002'] }
];

let mockAssignments = [
  { _id: 'mock_a_001', assignment_id: 'ASG-1', course_id: 'mock_c_001', instructor_id: 'mock_inst_002', title: 'HTML Portfolio', description: 'Build a responsive personal website portfolio showing your projects and contact form.', deadline: '2026-06-15T23:59:00.000Z', total_marks: 100, status: 'Closed', created_at: new Date('2026-06-01') },
  { _id: 'mock_a_002', assignment_id: 'ASG-2', course_id: 'mock_c_001', instructor_id: 'mock_inst_002', title: 'CSS Challenge', description: 'Create a purely CSS-based landing page with custom grid grids and animations.', deadline: '2026-06-22T23:59:00.000Z', total_marks: 100, status: 'Open', created_at: new Date('2026-06-03') },
  { _id: 'mock_a_003', assignment_id: 'ASG-3', course_id: 'mock_c_002', instructor_id: 'mock_inst_001', title: 'JS Quiz', description: 'Practice loops, conditionals, and ES6 array methods.', deadline: '2026-06-20T23:59:00.000Z', total_marks: 50, status: 'Open', created_at: new Date('2026-06-04') }
];

let mockSubmissions = [
  { _id: 'mock_sub_001', submission_id: 'SUB-1', assignment_id: 'mock_a_001', student_id: 'mock_stud_001', uploaded_file: '/uploads/submissions/portfolio_jdoe.zip', submission_date: new Date('2026-06-10T12:00:00Z'), grade: 90, feedback: 'Excellent responsive structure!' },
  { _id: 'mock_sub_002', submission_id: 'SUB-2', assignment_id: 'mock_a_001', student_id: 'mock_stud_002', uploaded_file: '/uploads/submissions/portfolio_jsmith.zip', submission_date: new Date('2026-06-12T14:30:00Z') }
];

module.exports = {
  mockHODProfile,
  mockCourses,
  mockInstructors,
  mockTasks,
  mockMaterials,
  mockStudents,
  mockAssignments,
  mockSubmissions
};
