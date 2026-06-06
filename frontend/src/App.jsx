import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';
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
import CourseManagementPage from './pages/admin/CourseManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';

// Magdy's Student Pages
import StudentDashboard from './pages/StudentDashboard';
import MyCoursesGridView from './pages/MyCoursesGridView';
import MyGrades from './pages/MyGrades';
import AcademicCalendarView from './pages/AcademicCalendarView';
import AssignmentDetails from './pages/AssignmentDetails';
import StudentProfileView from './pages/StudentProfileView';
import InsideCourseAssignments from './pages/course/InsideCourseAssignments';
import InsideCourseGradesTab from './pages/course/InsideCourseGradesTab';
import StudentInsideCourseStream from './pages/course/InsideCourseStream';
import StudentInsideCourseLectures from './pages/course/InsideCourseLectures';
import InsideCourseStudents from './pages/course/InsideCourseStudents';
import CourseRegistration from './pages/CourseRegistration';
import AssignmentsListPage from './pages/AssignmentsListPage';

// Seliem's Instructor Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorAssignmentPanel from './pages/instructor/InstructorAssignmentPanel';
import CreateCourseStep1 from './pages/instructor/CreateCourseStep1';
import CreateCourseStep2 from './pages/instructor/CreateCourseStep2';
import InsideCourseLectures from './pages/instructor/InsideCourseLectures';
import InsideCourseStream from './pages/instructor/InsideCourseStream';
import InstructorGlobalStreamPage from './pages/instructor/InstructorGlobalStreamPage';
import InstructorProfilePage from './pages/instructor/InstructorProfilePage';
import InstructorAnalytics from './pages/instructor/InstructorAnalytics';
import InstructorCourseRoster from './pages/instructor/InstructorCourseRoster';
import InstructorRosterPage from './pages/instructor/InstructorRosterPage';
import DepartmentHeadDashboard from './pages/instructor/DepartmentHeadDashboard';

const Unauthorized = () => <div className="p-8"><h1>403 - Unauthorized</h1><p>You do not have access to this page.</p></div>;
const Placeholder = ({ name }) => <div className="p-8 text-center"><h1>{name}</h1><p>This module is currently being migrated by another colleague.</p></div>;

const ALL_ROLES = ['admin', 'instructor', 'student'];

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <SettingsProvider>
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
            <Route path="/admin/courses" element={<CourseManagementPage />} />
          </Route>

          {/* Shared Communication Routes — Students and Instructors only; Admins have no peer chat */}
          <Route element={<ProtectedRoute allowedRoles={['student', 'instructor', 'head_of_department']} />}>
            <Route path="/messages" element={<MessagesInboxPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>

          {/* Instructor Routes */}
          <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route path="/instructor/create" element={<CreateCourseStep1 />} />
            <Route path="/instructor/create/step2" element={<CreateCourseStep2 />} />
            <Route path="/instructor/assignments" element={<InstructorAssignmentPanel />} />
            <Route path="/instructor/global-stream" element={<InstructorGlobalStreamPage />} />
            <Route path="/instructor/profile" element={<InstructorProfilePage />} />
            <Route path="/instructor/analytics" element={<InstructorAnalytics />} />
            <Route path="/instructor/course/:id" element={<InsideCourseLectures />} />
            <Route path="/instructor/course/:id/lectures" element={<InsideCourseLectures />} />
            <Route path="/instructor/course/:id/stream" element={<InsideCourseStream />} />
            <Route path="/instructor/course/:id/students" element={<InstructorCourseRoster />} />
            <Route path="/instructor/roster" element={<InstructorRosterPage />} />
          </Route>

          {/* Head of Department Routes */}
          <Route element={<ProtectedRoute allowedRoles={['head_of_department']} />}>
            <Route path="/department-head" element={<DepartmentHeadDashboard />} />
          </Route>

          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/my-courses" element={<MyCoursesGridView />} />
            <Route path="/assignments" element={<AssignmentsListPage />} />
            <Route path="/grades" element={<MyGrades />} />
            <Route path="/calendar" element={<AcademicCalendarView />} />
            <Route path="/assignment/:id" element={<AssignmentDetails />} />
            <Route path="/student/profile" element={<StudentProfileView />} />
            <Route path="/student/course/:id/assignments" element={<InsideCourseAssignments />} />
            <Route path="/student/course/:id/grades" element={<InsideCourseGradesTab />} />
            <Route path="/student/course/:id/stream" element={<StudentInsideCourseStream />} />
            <Route path="/student/course/:id/lectures" element={<StudentInsideCourseLectures />} />
            <Route path="/student/course/:id/students" element={<InsideCourseStudents />} />
            <Route path="/course-registration" element={<CourseRegistration />} />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
        </SettingsProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
