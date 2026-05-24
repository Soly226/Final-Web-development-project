import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import LandingPage from './pages/LandingPage';

// Basel's Pages (Commented out until migrated)
// import MessagesInboxPage from './pages/messages/MessagesInboxPage';
// import NotificationsPage from './pages/notifications/NotificationsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import SystemLogsPage from './pages/admin/SystemLogsPage';
import SystemSettingsPage from './pages/admin/SystemSettingsPage';
import EmailTemplatesPage from './pages/admin/EmailTemplatesPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import CourseManagementPage from './pages/admin/CourseManagementPage';
// import UserManagementPage from './pages/admin/UserManagementPage'; // Missing

// Magdy's Student Pages (Commented out until migrated)
/*
import StudentDashboard from './pages/student/StudentDashboard';
import MyCoursesPage from './pages/student/MyCoursesPage';
import MyGradesPage from './pages/student/MyGradesPage';
import AcademicCalendarPage from './pages/student/AcademicCalendarPage';
import AssignmentDetailsPage from './pages/student/AssignmentDetailsPage';
import InsideCourseAssignmentsPage from './pages/student/InsideCourseAssignmentsPage';
import InsideCourseGradesPage from './pages/student/InsideCourseGradesPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import InsideCourseLecturesPage from './pages/student/InsideCourseLecturesPage';
import InsideCourseStreamPage from './pages/student/InsideCourseStreamPage';
*/

// Seliem's Instructor Pages (Commented out until migrated)
/*
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorAssignmentPanel from './pages/instructor/InstructorAssignmentPanel';
import CreateCourseStep1 from './pages/instructor/CreateCourseStep1';
import CreateCourseStep2 from './pages/instructor/CreateCourseStep2';
import InsideCourseLectures from './pages/instructor/InsideCourseLectures';
import InsideCourseStream from './pages/instructor/InsideCourseStream';
import InsideCourseStudents from './pages/instructor/InsideCourseStudents';
import InstructorGlobalStreamPage from './pages/instructor/InstructorGlobalStreamPage';
import InstructorProfilePage from './pages/instructor/InstructorProfilePage';
*/

const Unauthorized = () => <div className="p-8"><h1>403 - Unauthorized</h1><p>You do not have access to this page.</p></div>;
const Placeholder = ({ name }) => <div className="p-8 text-center"><h1>{name}</h1><p>This module is currently being migrated by another colleague.</p></div>;

const ALL_ROLES = ['admin', 'instructor', 'student'];

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Placeholder name="User Management" />} />
          <Route path="/admin/logs" element={<SystemLogsPage />} />
          <Route path="/admin/settings" element={<SystemSettingsPage />} />
          <Route path="/admin/templates" element={<EmailTemplatesPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/courses" element={<CourseManagementPage />} />
        </Route>

        {/* Placeholder Routes for other colleagues */}
        <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
          <Route path="/instructor" element={<Placeholder name="Instructor Dashboard" />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student" element={<Placeholder name="Student Dashboard" />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
