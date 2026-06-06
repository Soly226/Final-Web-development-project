# Magdy's Modules: Student Experience

This document explains what Magdy's parts of the application do and how they function.

## 🎓 1. Student Dashboard

- **What it does**: Provides a centralized landing portal for logged-in students to see their active courses, tracking their progress bars, and viewing upcoming assignment due dates.
- **Key Files**:
  - `frontend/src/pages/StudentDashboard.jsx` (Dashboard view)
  - `frontend/src/data/pages/student/StudentDashboard.data.js` (Mock dashboard data)
  - `frontend/src/hooks/pages/student/StudentDashboard.hooks.js` (State and interaction hooks)
- **How it works**:
  - Displays greeting messages and lists of active courses.
  - Dynamically calculates progress based on course lesson counts.
  - Features storage widget panels and side quick-navigation links.

## 📚 2. My Courses Grid & Course Details

- **What it does**: Displays the full catalog of courses the student is enrolled in, allowing them to search, filter by course progress status, and enter a course.
- **Key Files**:
  - `frontend/src/pages/MyCoursesGridView.jsx` (Courses grid view)
  - `frontend/src/pages/course/InsideCourseAssignments.jsx` (Course details and assignments tab)
  - `frontend/src/pages/course/InsideCourseGradesTab.jsx` (Course grades audit tab)
- **How it works**:
  - **Grid & Filters**: Students can toggle between 'All Courses', 'In Progress', 'Completed', and 'Archived' status views.
  - **Inside Course**: Once inside a course, students can view the class stream, browse assignment lists, check grades, and view their classmates/instructors.
  - **Classmates Tab Upgrade**: The classmates list (`InsideCourseStudents.jsx`) within Magdy's Course Details tab navigation has been upgraded with search filtering, instructor detail cards (with direct messaging shortcuts to Basel's inbox), and initials-based fallback avatars.

## 📝 3. Assignment Details

- **What it does**: Lets students drill down into a specific assignment to view the instructions, rubrics, due dates, and submit their files/work.
- **Key Files**:
  - `frontend/src/pages/AssignmentDetails.jsx` (Individual assignment view)
- **How it works**:
  - Displays due date thresholds, status flags (e.g., Submitted, Pending, Late), and a drag-and-drop submission zone to upload project deliverables.

## 📊 4. Grades & Progress Reports

- **What it does**: Displays the student's overall GPA, completed academic credits progress, and a list of graded assignments with instructor feedback.
- **Key Files**:
  - `frontend/src/pages/MyGrades.jsx` (Grades summary dashboard)
- **How it works**:
  - Summarizes academic standing using progress cards.
  - Highlights recent grades with highlighted color codes and collapsible feedback panels showing professor commentary.

## 📅 5. Academic Calendar

- **What it does**: Displays a visual calendar displaying course deadlines, exam schedules, and holiday events.
- **Key Files**:
  - `frontend/src/pages/AcademicCalendarView.jsx` (Visual monthly calendar page)
- **How it works**:
  - Renders a clean grid layout of days in the month with event indicators highlighting assignment deadlines and school holidays.

## 📁 Complete File Inventory

The following files are owned/authored by Magdy:

- **Frontend Pages & Components**:
  - `frontend/src/pages/StudentDashboard.jsx`
  - `frontend/src/pages/StudentProfileView.jsx`
  - `frontend/src/pages/MyCoursesGridView.jsx`
  - `frontend/src/pages/MyGrades.jsx`
  - `frontend/src/pages/AcademicCalendarView.jsx`
  - `frontend/src/pages/AssignmentDetails.jsx`
  - `frontend/src/pages/course/InsideCourseAssignments.jsx`
  - `frontend/src/pages/course/InsideCourseGradesTab.jsx`
- **Frontend Page Data**:
  - `frontend/src/data/pages/student/StudentDashboard.data.js`
  - `frontend/src/data/pages/student/StudentProfilePage.data.js`
  - `frontend/src/data/pages/student/MyCoursesPage.data.js`
  - `frontend/src/data/pages/student/MyGradesPage.data.js`
  - `frontend/src/data/pages/student/AcademicCalendarPage.data.js`
  - `frontend/src/data/pages/student/AssignmentDetailsPage.data.js`
  - `frontend/src/data/pages/student/InsideCourseAssignmentsPage.data.js`
  - `frontend/src/data/pages/student/InsideCourseGradesPage.data.js`
  - `frontend/src/data/pages/student/InsideCourseLecturesPage.data.js`
  - `frontend/src/data/pages/student/InsideCourseStreamPage.data.js`
- **Frontend State Hooks**:
  - `frontend/src/hooks/pages/student/StudentDashboard.hooks.js`
  - `frontend/src/hooks/pages/student/StudentProfilePage.hooks.js`
  - `frontend/src/hooks/pages/student/MyCoursesPage.hooks.js`
  - `frontend/src/hooks/pages/student/MyGradesPage.hooks.js`
  - `frontend/src/hooks/pages/student/AcademicCalendarPage.hooks.js`
  - `frontend/src/hooks/pages/student/AssignmentDetailsPage.hooks.js`
  - `frontend/src/hooks/pages/student/InsideCourseAssignmentsPage.hooks.js`
  - `frontend/src/hooks/pages/student/InsideCourseGradesPage.hooks.js`
  - `frontend/src/hooks/pages/student/InsideCourseLecturesPage.hooks.js`
  - `frontend/src/hooks/pages/student/InsideCourseStreamPage.hooks.js`
- **Frontend CSS Style Sheets**:
  - `frontend/src/styles/pages/student/StudentDashboard.css`
  - `frontend/src/styles/pages/student/StudentProfilePage.css`
  - `frontend/src/styles/pages/student/MyCoursesPage.css`
  - `frontend/src/styles/pages/student/MyGradesPage.css`
  - `frontend/src/styles/pages/student/AcademicCalendarPage.css`
  - `frontend/src/styles/pages/student/AssignmentDetailsPage.css`
  - `frontend/src/styles/pages/student/InsideCourseAssignmentsPage.css`
  - `frontend/src/styles/pages/student/InsideCourseGradesPage.css`
  - `frontend/src/styles/pages/student/InsideCourseLecturesPage.css`
  - `frontend/src/styles/pages/student/InsideCourseStreamPage.css`

# ⚖️ Comparison Report: Local Workspace vs. Magdy's GitHub Branch

This report documents the comparisons, differences, discrepancies, extra functions, and removed functions between the files in the remote **`origin/Magdy's-branch`** on GitHub and the local workspace files in the project folder.

---

## 🛠️ 1. Architecture & Module Systems

| Architectural Aspect        | Remote Branch (`origin/Magdy's-branch`)                                                                                  | Local Workspace (`Jonathans` / Current)                                                                                     |
| :-------------------------- | :----------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| **JS Module System**        | **ES Modules (ESM)**: Uses `import` / `export` and `.js` extensions in imports (e.g., `import express from 'express';`). | **CommonJS**: Uses `require()` and `module.exports` (e.g., `const express = require('express');`).                          |
| **Backend Entry Point**     | Mounted at `/api/students` (plural).                                                                                     | Mounted at `/api/student` (singular).                                                                                       |
| **Frontend Layout**         | Simplistic `StudentLayout` (no desktop sidebar; only top header and bottom nav bar).                                     | Premium `StudentLayout` (collapsible left desktop sidebar, floating mobile bottom nav bar, messages/notifications polling). |
| **API Client Wrapping**     | Custom Axios instance in `apiClient.js` with basic setup.                                                                | Custom Axios instance with extended CSRF verification, credentials, and interceptors.                                       |
| **Router Wrap (`App.jsx`)** | Basic `<Routes>` under `AuthProvider`.                                                                                   | Wrapped in `<ToastProvider>` and `<AuthProvider>` with distinct protected route groups.                                     |

---

## 🔌 2. Backend Differences: Controllers & Routes

### 🔀 Route Endpoints (`backend/routes/studentRoutes.js`)

There is a massive discrepancy in route naming and functionality between the two versions:

| Remote Route (`/api/students/...`) | Local Route (`/api/student/...`)     | Action / Controller Handler                            | Comparison & Status                                                           |
| :--------------------------------- | :----------------------------------- | :----------------------------------------------------- | :---------------------------------------------------------------------------- |
| `GET /me`                          | _None_                               | `getMyProfile`                                         | **Removed in Local**. Local relies on standard auth checks or state.          |
| `GET /me/courses`                  | `GET /enrolled-courses`              | `getMyCourses` / `getStudentEnrolledCourses`           | **Renamed**. Local returns enrolled courses directly.                         |
| `GET /me/grades`                   | `GET /grades`                        | `getMyGrades` / `getStudentGrades`                     | **Renamed & Restructured**. Local calculates letter grades.                   |
| `GET /me/calendar`                 | _None_ (Statically mocked in UI)     | `getMyCalendar`                                        | **Removed in Local**. Calendar events are mocked in local frontend.           |
| `GET /courses/:id/assignments`     | `GET /courses/:courseId/assignments` | `getCourseAssignments`                                 | **Refactored**. Handles verification and submission tracking.                 |
| `GET /courses/:id/lectures`        | `GET /courses/:courseId/lectures`    | `getCourseLectures`                                    | **Refactored**. Fetches materials from database.                              |
| `GET /courses/:id/stream`          | `GET /courses/:courseId/stream`      | `getCourseStream`                                      | **Refactored**. Local stream is based on `CoursePost` posts.                  |
| `GET /assignments/:id/submission`  | `GET /assignments/:id`               | `getAssignmentSubmission` / `getStudentAssignmentById` | **Renamed**. Local returns full details + submission status.                  |
| _None_ (Mocked on remote)          | `POST /assignments/:id/submit`       | `submitAssignment`                                     | **Extra in Local**. Local has active file submission database logic.          |
| _None_ (Mocked on remote)          | `GET /courses/:courseId/grades`      | `getCourseGrades`                                      | **Extra in Local**. Local filters grades by specific course database queries. |
| _None_ (Mocked on remote)          | `POST /courses/:courseId/stream`     | `createCourseStreamPost`                               | **Extra in Local**. Enables students to publish posts to the class feed.      |
| _None_ (Mocked on remote)          | `GET /available-courses`             | `getAvailableCourses`                                  | **Extra in Local**. Fetches eligible courses for registration.                |
| _None_ (Mocked on remote)          | `POST /register-course/:courseId`    | `registerCourse`                                       | **Extra in Local**. Handles student course registration.                      |

### 🧠 Controller Handlers (`backend/controllers/studentController.js`)

- **Enrolled Verification Utility**:
  - **Remote**: Uses a dedicated helper script `backend/utils/studentHelpers.js` (`ensureStudentEnrolled`) which queries the `Enrollment` model.
  - **Local**: Helper file is completely **missing**. The controller performs raw inline checks on the `Student` model:
    `Student.findOne({ _id: studentId, enrolled_courses: courseId })`
- **New Local Functions (Database Connected)**:
  - `registerCourse`: Validates department limitations, checks completed prerequisites from `Enrollment`, and registers a student.
  - `getAvailableCourses`: Loops through all courses, compares department strings, evaluates prerequisites, and marks each course with eligibility status (`eligible`, `restricted`, `missing_prerequisite`, `enrolled`).
  - `createCourseStreamPost`: Creates a new `CoursePost` associated with the course.
  - `submitAssignment`: Updates or creates an `AssignmentSubmission` and links it to the uploaded file.
  - `getStudentAssignmentById`: Fetches specific assignment data and joins it with the student's submission.

---

## 🎨 3. Frontend Page & Layout Differences

### 1. Main Layout (`frontend/src/layouts/StudentLayout.jsx`)

- **Remote**: Displays a header with page title and a "Sign Out" button, plus a floating bottom navigation bar with only 3 links (_Dashboard, Calendar, Profile_).
- **Local**: Built for both desktop and mobile. Features a **permanent desktop sidebar** (8 links: _Dashboard, My Courses, Assignments, Grades, Calendar, Messages, Notifications, Profile_) and a floating bottom bar for smaller screens.
- **Extra Features in Local**:
  - Dynamic unread messages and notifications count badges on icons.
  - **Background Polling**: Checks `/api/notifications` and `/api/messages` every 30 seconds to update counts.
  - Displays logo, page subheader, and user profile avatar with name.

---

### 2. Student Dashboard (`StudentDashboard.jsx`)

- **Remote**: Static page fetching mock data (`StudentDashboard.data.js`). Shows a colored hero banner with overall GPA, a `7-Day Streak` fire badge, Enrolled/Submitted/Pending summary cards, and side-by-side upcoming tasks and recent grades cards.
- **Local**: Completely **dynamic**. Fetches actual courses and assignments from `/api/student/enrolled-courses` and `/api/student/assignments`. Shows active courses in cards and lists unsubmitted pending tasks. Handles loading states via skeleton animations.

---

### 3. Student Profile (`StudentProfileView.jsx` vs `StudentProfilePage.jsx`)

- **Remote**: Highly interactive. Allows entering edit mode to change name, bio, major, and year. Shows "Achievements" badges (e.g., _Perfect Score, Fast Learner_), enrolled course progress cards, recent activity logs, and account options (change password, sign out).
- **Local**: A static mock card showing "Alex Rivera" with personal details (phone, ID, email) and active enrollments. **Lacks** edit forms, badges, activity logs, and account preference buttons.

---

### 4. My Courses Grid (`MyCoursesGridView.jsx` vs `MyCoursesPage.jsx`)

- **Remote**: Features layout toggling between grid and list views. Status filters (_All, In Progress, Completed, Archived_) display item counts. Cards display progress percentage (e.g., _12/15 lessons_) and a "Next Lesson" link preview.
- **Local**: Grid view only. Includes a search bar and a "Register for Courses" button. Cards display the course name, instructors list, credit hours, and an "Enter Course" link. **Lacks** list view toggles and progress status tags.

---

### 5. My Grades (`MyGrades.jsx` vs `MyGradesPage.jsx`)

- **Remote**: Groups assignments by course in expandable cards. Displays overall course averages using an SVG circular ring (`GpaRing`) alongside the letter grade. Expanding a card displays list details (weight, date, score, feedback).
- **Local**: Displays a flat list of recent graded tasks. Includes a search bar and summary cards displaying Current GPA and Completed Credits (e.g., _120/144_).
- **Data Resiliency**: Local queries `/api/student/grades` and, if empty or failed, falls back silently to local mock data.

---

### 6. Academic Calendar (`AcademicCalendarView.jsx` vs `AcademicCalendarPage.jsx`)

- **Remote**: Dynamically calculates the month grid days using standard `Date` math. Month navigation is fully functional. Selecting a date displays that day's specific assignments or exams below. The sidebar displays relative deadlines (e.g., _Due Today, In 3 days_).
- **Local**: Static layout showing a fixed grid for October 2026. Month navigation buttons are non-functional stubs. Selecting a day does not filter events.

---

### 7. Assignment Details (`AssignmentDetails.jsx` vs `AssignmentDetailsPage.jsx`)

- **Remote**: Header features a styled banner with due date, points, and weight. Displays detailedRequirements list and a Grading Rubric table. Submission form takes a **URL link** and a text note.
- **Local**: Simpler header. Displays due date, status, instructor, description, and downloadable brief files. Submission form implements a **drag-and-drop file upload** zone (saving the selected file name to the database).

---

### 8. Course Tabs (Assignments, Grades, Lectures, Stream)

- **Tab Routing**:
  - **Remote**: Navigates tabs by linking directly to page components (`/student/course/:id/...`) with tabs built directly in each page.
  - **Local**: Employs a single shared `<CourseTabNav>` component across pages to switch views.
- **Inside Course Assignments & Grades**:
  - **Remote**: Uses local mock arrays to show grades, weights, and categories.
  - **Local**: Connects to the database API (`/api/student/courses/:id/assignments` and `/api/student/courses/:id/grades`) to pull student-specific scores.
- **Inside Course Lectures**:
  - **Remote**: Displays static video items with durations (e.g., _5:30_) and descriptions.
  - **Local**: Fetches materials from database `/api/student/courses/:id/lectures` and displays downloadable attachments.
- **Inside Course Stream**:
  - **Remote**: Lists static posts with likes, comments, and options. Share area has mock alert triggers.
  - **Local**: Fully operational. Displays posts from the `CoursePost` model, distinguishing between "Instructor" and "Student" senders. Students can write and submit new posts to the live stream.

---

## 💎 4. Features Exclusively Present in Local Workspace

These features exist in your local project but are completely **missing** from Magdy's branch:

1.  **Course Registration System**: A complete `/course-registration` page (`CourseRegistration.jsx`) allowing students to view eligible courses and register.
2.  **Global Assignments List**: An `/assignments` page (`AssignmentsListPage.jsx`) grouping all assignments across enrolled courses in one place.
3.  **Classmates & Instructors Tab**: The classmates list (`InsideCourseStudents.jsx`) within course tabs, allowing students to search for peers and contact instructors.
4.  **Toast Notification System**: Global `ToastContext` and `<ToastProvider>` to display action confirmations.
5.  **Dynamic Headers**: Header notifications and message counts.
