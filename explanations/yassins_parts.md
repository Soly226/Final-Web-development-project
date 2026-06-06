# Yassin's (Jane's) Modules: User Governance

This document explains what Yassin's (Jane's) parts of the application do and how they function.

## 👥 1. User Management Panel
- **What it does**: Provides a dashboard for administrators to view all users (Students, Instructors, and Admins), filter them by role, search for individuals, and manage accounts.
- **Key Files**: 
  - `frontend/src/pages/admin/UserManagementPage.jsx` (List views, filter controls, and modals)
  - `backend/controllers/userManagementController.js` (Handles API request actions)
  - `backend/services/userService.js` (Handles query processing)
- **How it works**:
  - **Fetch & Search**: Queries a consolidated API endpoint to fetch users matching search terms and role filters.
    - **New Update**: Decoupled the query logic into a service class (`userService.js`) to adhere to standard MVC routing layers.
    - **New Update**: Implemented a responsive shimmering loader grid to indicate data loading states.
  - **Create**: Sends form data to add a new account to the appropriate model/collection (Student, Instructor, Admin).
  - **Edit/Deactivate**: Allows modifying personal details or disabling accounts to restrict platform access.
    - **New Update**: Changed database deletion to a secure soft-delete (setting the account status to inactive) instead of hard-deleting the records, protecting database reference logs from breaking.
    - **New Update**: Wrapped deactivations in a transactional rollback logic structure that automatically reverts the user deactivation if removing enrollment or course associations fails, safeguarding database integrity.
    - **New Update**: Integrated global Toast Context alerts to replace old local alert component instances and added modal fading transitions.

## 👥 2. Course Roster & Classmates Roster Support
- **What it does**: Provides views for students to see their classmates and instructors, and for instructors to manage the student roster (view, search, enroll, and unenroll students).
- **Key Files**: 
  - `frontend/src/pages/course/InsideCourseStudents.jsx` (Student classmates list with search and instructor details)
  - `frontend/src/pages/instructor/InstructorCourseRoster.jsx` (Instructor roster dashboard with enrollment actions)
  - `backend/controllers/rosterController.js` (Roster management backend controllers)
  - `backend/routes/rosterRoutes.js` (Roster endpoint routing)
- **How it works**:
  - **Student View**: Renders the active instructors and classmate peers. Supports quick search and redirects to Basel's private messaging inbox.
  - **Instructor View**: Integrates with Seliem's sidebar layout. Loads paginated and searchable rosters from the database, allows enrolling new students by entering their Email or Student ID, and allows unenrolling students with confirmation safeguards.

## 📁 Complete File Inventory
The following files are owned/authored by Yassin (Jane):
- **Backend Controllers, Services, & Routes**:
  - `backend/controllers/userManagementController.js`
  - `backend/services/userService.js`
  - `backend/controllers/rosterController.js`
  - `backend/routes/rosterRoutes.js`
  - `backend/routes/adminRoutes.js` (Shared admin route logic for user management)
- **Backend Models**:
  - `backend/models/Student.js`
  - `backend/models/Instructor.js`
- **Frontend Pages & Components**:
  - `frontend/src/pages/admin/UserManagementPage.jsx`
  - `frontend/src/pages/admin/UserManagementPage.data.js`
  - `frontend/src/hooks/pages/admin/UserManagementPage.hooks.js`
  - `frontend/src/styles/pages/admin/UserManagementPage.css`
  - `frontend/src/pages/course/InsideCourseStudents.jsx`
  - `frontend/src/pages/instructor/InstructorCourseRoster.jsx`

