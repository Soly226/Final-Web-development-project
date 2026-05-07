import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import LandingPage from './pages/LandingPage';

// Basel's Pages
import MessagesInboxPage from './pages/messages/MessagesInboxPage';
import NotificationsPage from './pages/notifications/NotificationsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import SystemLogsPage from './pages/admin/SystemLogsPage';
import SystemSettingsPage from './pages/admin/SystemSettingsPage';
import EmailTemplatesPage from './pages/admin/EmailTemplatesPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import UserManagementPage from './pages/admin/UserManagementPage';

// Magdy's Student Pages
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

// Seliem's Instructor Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorAssignmentPanel from './pages/instructor/InstructorAssignmentPanel';
import CreateCourseStep1 from './pages/instructor/CreateCourseStep1';
import CreateCourseStep2 from './pages/instructor/CreateCourseStep2';
import InsideCourseLectures from './pages/instructor/InsideCourseLectures';
import InsideCourseStream from './pages/instructor/InsideCourseStream';
import InsideCourseStudents from './pages/instructor/InsideCourseStudents';
import InstructorGlobalStreamPage from './pages/instructor/InstructorGlobalStreamPage';
import InstructorProfilePage from './pages/instructor/InstructorProfilePage';

// Remaining Placeholders
const Unauthorized = () => <div className="p-8"><h1>403 - Unauthorized</h1><p>You do not have access to this page.</p></div>;

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
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/logs" element={<SystemLogsPage />} />
          <Route path="/admin/settings" element={<SystemSettingsPage />} />
          <Route path="/admin/templates" element={<EmailTemplatesPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
        </Route>

        {/* Instructor Routes */}
        <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
          <Route path="/instructor" element={<InstructorDashboard />} />
          <Route path="/instructor/assignments" element={<InstructorAssignmentPanel />} />
          <Route path="/instructor/stream" element={<InstructorGlobalStreamPage />} />
          <Route path="/instructor/profile" element={<InstructorProfilePage />} />
          <Route path="/instructor/create" element={<CreateCourseStep1 />} />
          <Route path="/instructor/create/step2" element={<CreateCourseStep2 />} />
          <Route path="/instructor/course/:id" element={<InsideCourseLectures />} />
          <Route path="/instructor/course/:id/stream" element={<InsideCourseStream />} />
          <Route path="/instructor/course/:id/students" element={<InsideCourseStudents />} />
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<MyCoursesPage />} />
          <Route path="/student/grades" element={<MyGradesPage />} />
          <Route path="/student/calendar" element={<AcademicCalendarPage />} />
          <Route path="/student/assignments/:id" element={<AssignmentDetailsPage />} />
          <Route path="/student/course/:id/assignments" element={<InsideCourseAssignmentsPage />} />
          <Route path="/student/course/:id/grades" element={<InsideCourseGradesPage />} />
          <Route path="/student/course/:id/lectures" element={<InsideCourseLecturesPage />} />
          <Route path="/student/course/:id/stream" element={<InsideCourseStreamPage />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
        </Route>

        {/* Communication Routes — accessible to all authenticated roles */}
        <Route element={<ProtectedRoute allowedRoles={ALL_ROLES} />}>
          <Route path="/messages" element={<MessagesInboxPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
