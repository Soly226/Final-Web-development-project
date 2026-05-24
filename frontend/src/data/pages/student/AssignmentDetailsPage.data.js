export const assignmentsData = {
  1: {
    id: 1, title: 'API Integration Lab', course: 'Advanced React 2024', type: 'Lab',
    dueDate: 'April 14, 2026 — 11:59 PM', points: 100, weight: '10%',
    status: 'pending',
    color: 'from-primary to-accent', icon: 'code',
    description: `In this lab, you will build a fully functional weather dashboard that fetches data from a public REST API using React. The goal is to practice data fetching with useEffect, state management with useState, and proper error/loading state handling.\n\nYour application should:\n- Connect to the OpenWeatherMap API (free tier)\n- Display current weather for a user-searched city\n- Show a 5-day forecast with appropriate icons\n- Handle loading and error states gracefully\n- Be responsive across screen sizes`,
    requirements: [
      'Use React functional components with hooks only',
      'Implement proper loading and error states',
      'Handle API errors gracefully (invalid city, network errors)',
      'Style with Tailwind CSS — no inline styles',
      'Include a README with setup instructions',
      'Submit as a GitHub repository link',
    ],
    rubric: [
      { item: 'API Integration & Functionality', points: 40 },
      { item: 'Component Design & Reusability', points: 25 },
      { item: 'Error & Loading State Handling', points: 20 },
      { item: 'Code Quality & Comments', points: 10 },
      { item: 'README Documentation', points: 5 },
    ],
    attachments: [
      { name: 'lab_starter_template.zip', size: '2.4 MB', icon: 'folder_zip' },
      { name: 'api_documentation.pdf', size: '1.1 MB', icon: 'picture_as_pdf' },
    ],
  },
  2: {
    id: 2, title: 'Midterm Quiz #2', course: 'Data Structures & Algorithms', type: 'Quiz',
    dueDate: 'April 15, 2026 — 9:00 AM', points: 50, weight: '15%',
    status: 'pending',
    color: 'from-violet-500 to-purple-500', icon: 'quiz',
    description: 'This quiz covers Binary Search Trees (BST), AVL Trees, and basic graph algorithms (BFS/DFS). You will have 45 minutes to complete 25 multiple-choice questions. The quiz will be available at exactly 9:00 AM and will auto-submit at 9:45 AM.',
    requirements: [
      '25 multiple-choice questions',
      '45 minutes time limit — auto-submits',
      'No collaboration allowed (monitored)',
      'Covers modules 5–8 from the course material',
      'One attempt only',
    ],
    rubric: [
      { item: 'BST Operations & Properties', points: 15 },
      { item: 'AVL Tree Rotations', points: 15 },
      { item: 'BFS / DFS Traversal', points: 15 },
      { item: 'Complexity Analysis', points: 5 },
    ],
    attachments: [
      { name: 'study_guide_modules_5_8.pdf', size: '3.2 MB', icon: 'picture_as_pdf' },
    ],
  },
};

export const statusConfig = {
  pending: { label: 'Not Submitted', color: 'status-pending', icon: 'schedule' },
  submitted: { label: 'Submitted', color: 'status-submitted', icon: 'check_circle' },
  graded: { label: 'Graded', color: 'status-graded', icon: 'grade' },
  late: { label: 'Late', color: 'status-late', icon: 'warning' },
};

export const typeConfig = {
  Lab: 'type-lab',
  Quiz: 'type-quiz',
  Assignment: 'type-assignment',
  Exam: 'type-exam',
};
