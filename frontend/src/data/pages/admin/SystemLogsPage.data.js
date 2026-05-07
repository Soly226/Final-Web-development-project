export const logsData = [
  { id: 1, time: '2023-10-24 14:22:10', level: 'Error', category: 'Auth', message: 'Failed login attempt: multiple incorrect passwords.', user: 'john.doe@edu.com' },
  { id: 2, time: '2023-10-24 13:45:02', level: 'Warning', category: 'System', message: 'CPU spike detected: 85% usage for 5 mins.', user: 'System Process' },
  { id: 3, time: '2023-10-24 13:12:55', level: 'Info', category: 'Course', message: "Course 'Advanced Physics' updated by instructor.", user: 's.miller@faculty.edu' },
  { id: 4, time: '2023-10-24 12:58:30', level: 'Info', category: 'Auth', message: 'New student registration: Alice Brown.', user: 'a.brown@student.edu' },
  { id: 5, time: '2023-10-24 12:45:12', level: 'Info', category: 'System', message: 'Daily database backup completed successfully.', user: 'System Process' },
];

export const levels = ['All Levels', 'Info', 'Warning', 'Error'];
export const categories = ['All Categories', 'Auth', 'Course', 'System'];
