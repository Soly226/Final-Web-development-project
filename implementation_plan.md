# Project Summary & Team Distribution Plan: EduCore LMS

## Project Roles & Page Count

| Role | Page Count | Primary Responsibility |
| :--- | :---: | :--- |
| **Administrator** | 6 | Platform management, system monitoring, and global settings. |
| **Instructor** | 9 | Course creation, content delivery, and student assessment. |
| **Student** | 9 | Course participation, material consumption, and grade tracking. |
| **Guest/Common** | 5 | Authentication, onboarding, and communication. |
| **Total** | **29** | |

---

## Feature List by Role

### 🛡️ Administrator Features
- **Platform Analytics**: Monitor user growth, course activity, and system storage.
- **User Governance**: Create, edit, and deactivate user accounts (Students/Instructors).
- **System Audit**: View real-time logs of system events and security alerts.
- **Configuration Management**: Manage global LMS settings and branding.
- **Communications Tool**: Build and broadcast system-wide email templates.
- **Reporting Engine**: Generate data-driven reports for institutional review.

### 🎓 Instructor Features
- **Course Wizard**: Structured step-by-step creation of academic courses.
- **Analytical Insights**: Track student engagement and performance curves.
- **Assignment Engine**: Create, distribute, and track submissions for assignments.
- **Content Management**: Upload and organize lectures, videos, and reading materials.
- **Gradebook Control**: Manage and release grades to students.
- **Roster Management**: Oversee student enrollments and progress within courses.

### ✍️ Student Features
- **Personal Learning Hub**: View upcoming tasks, progress bars, and course shortcuts.
- **Enrollment Browser**: Manage active and upcoming course subscriptions.
- **Work Tracking**: Interactive calendar for lectures and deadlines.
- **Grading Portal**: Private view of academic performance and feedback.
- **Submission Portal**: Upload work and track submission status.
- **Course Interaction**: Consume content and participate in course-specific streams.

---

## 👥 Team Distribution Plan

Based on the team's strengths and work styles, the project is divided into specialized modules:

### 🚀 Jonathan - **Architecture & Admin Core**
*Focus: Security, Logic-Heavy Core, and High-Impact Modules.*
- **System Core**: Login/Register logic and JWT/Session management.
- **Admin Hub**: `admin_dashboard`, `system_logs_admin`, and `system_settings`.
- **Logic Engine**: `email_template_editor` (requires complex UI logic) and `admin_reports`.
- **Infrastructure**: Shared UI components and Design System architecture.

### 🛠️ Seliem - **Instructor Suite & Course Management**
*Focus: Feature-rich modules requiring high output and attention to detail.*
- **Course Creation**: `create_course_step_1` and `create_course_step_2`.
- **Course Content**: `inside_course_lectures` and `inside_course_stream`.
- **Instructor Control**: `instructor_analytics_dashboard` and `instructor_assignment_panel`.
- **Shared Course UI**: Standardizing the "Inside Course" experience across roles.

### 🧱 Magdy - **Student Workspace & Performance**
*Focus: High-volume feature implementation and daily-use student tools.*
- **Student Hub**: `student_dashboard` and `my_courses_grid_view`.
- **Academic Tools**: `my_grades`, `academic_calendar_view`, and `assignment_details`.
- **Evaluation**: `inside_course_assignments` and `inside_course_grades_tab`.
- **Student Lifecycle**: `student_profile_view`.

### 🛏️ Basel - **Communication & Messaging**
*Focus: Independent, stable modules with lower frequency of logic changes.*
- **Communication Hub**: `messages_inbox` and `notifications_view`.
- **Public Surface**: `landing_page` (static/marketing focus).
- **Documentation**: Maintaining the Project Requirements Document based on team updates.

### 🧩 Yassin - **User Management & Roster Support**
*Focus: Repetitive, structured modules with high predictability and clear patterns.*
- **CRUD Operations**: `user_management` (simple create/read/update/delete flows).
- **Roster Utility**: `inside_course_students`.
- **Basic UI**: Assisting Seliem and Magdy with routine component styling and redundant page layouts.

---

## Verification Plan

### Manual Verification
- **Role Permissions**: Verify that Jonathan's Admin pages are inaccessible to Yassin's Student roles.
- **Course Flow**: Test Seliem's Course Wizard followed by Magdy's Student enrollment flow.
- **Messaging**: Verify Basel's Inbox correctly alerts users via Jonathan's notification system.
