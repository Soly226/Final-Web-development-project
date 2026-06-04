# Student Backend API Implementation Log

This file documents the incremental work performed to add a student-facing API for the frontend student pages. Each step lists what was done, which files were added or modified, and a short explanation.

---

## Step 1 — Scaffold API structure

What was done:
- Added initial files and registered the new route group so the server exposes a student API mount point.

Added:
- `backend/routes/studentRoutes.js` (placeholder import created; routes will be added in step 2)
- `backend/controllers/studentController.js` (created as a controller file; handlers will be implemented in later steps)

Modified:
- `backend/server.js` — imported `studentRoutes` and mounted it at `app.use('/api/students', studentRoutes)` so the server exposes `/api/students`.

Why:
- Create the top-level scaffold so subsequent commits can wire routes and implement logic without touching server registration.

---

## Step 2 — Add route skeletons

What was done:
- Implemented the explicit route skeletons and added stub controller handlers so the API wiring exists end-to-end (routes -> controllers).

Added/Updated:
- `backend/routes/studentRoutes.js` — defined student-facing route paths and mapped them to controller handler names:
  - `GET /api/students/me`
  - `GET /api/students/me/courses`
  - `GET /api/students/me/grades`
  - `GET /api/students/me/calendar`
  - `GET /api/students/courses/:id/assignments`
  - `GET /api/students/courses/:id/lectures`
  - `GET /api/students/courses/:id/stream`
  - `GET /api/students/assignments/:id/submission`

- `backend/controllers/studentController.js` — added stub handler functions for each route. Each handler currently returns `501 Not Implemented` to clearly indicate the endpoint is scaffolded but not yet implemented.

Why:
- Provide route/controller wiring so the team can implement and test each endpoint incrementally. The stubs return `501` to prevent silent failures and to make it clear which endpoints still need logic.

---

## Next steps (planned commits)

1. Add `protect` middleware to the new routes and update controllers to use `req.user` (authentication/authorization).
2. Implement `getMyProfile` and `getMyCourses` (profile and enrolled-courses queries).
3. Implement course content endpoints (assignments, lectures, stream) and assignment submission lookup.
4. Implement grades and calendar aggregation endpoints.
5. Optional: small model/query helpers or indexes if performance tuning is needed.

Each of the above will be implemented in separate commits so changes are small and reviewable.

---
## Step 3 — Protect routes and implement `getMyProfile`

What was done:
- Added authentication middleware to the student route group so all `/api/students/*` endpoints require a valid token.
- Implemented `getMyProfile` in `backend/controllers/studentController.js` to return the authenticated student's profile and populated enrolled courses.

Modified:
- `backend/routes/studentRoutes.js` — now imports `protect` and calls `router.use(protect)` so all routes are protected.
- `backend/controllers/studentController.js` — implemented `getMyProfile` with a MongoDB query using `req.user._id`, selecting profile fields and populating `enrolled_courses`.

Why:
- Secure endpoints ensure only authenticated students can fetch their own data. Returning populated course info lets frontend pages show course names/code without additional requests.

Next: implement `getMyCourses` and then course content endpoints (assignments, lectures, stream).

---

## Step 4 — Implement enrolled courses (`getMyCourses`)

What was done:
- Implemented `getMyCourses` in `backend/controllers/studentController.js`.
- The handler reads `req.user._id`, loads the student, populates `enrolled_courses` and their `assigned_instructors`, and returns a concise course list.

Modified:
- `backend/controllers/studentController.js` — added `getMyCourses` implementation that returns `[{ id, course_name, course_code, department, instructors }]`.

Why:
- Provide the frontend with the student's enrolled courses so `MyCoursesPage` can display course names and instructor info without additional requests.

Next: implement course content endpoints (`/courses/:id/assignments`, `/courses/:id/lectures`, `/courses/:id/stream`).

---

## Step 5 — Implement course content endpoints

What was done:
- Implemented `getCourseAssignments`, `getCourseLectures`, and `getCourseStream` in `backend/controllers/studentController.js`.

Details:
- `getCourseAssignments`:
  - Verifies the student is enrolled in the requested course.
  - Returns the course assignments sorted by deadline, and for each assignment includes the current student's submission (if any) with grade and submission date.

- `getCourseLectures`:
  - Verifies enrollment and returns course materials (lectures) with title, file URL and upload date.

- `getCourseStream`:
  - Verifies enrollment and returns a combined feed consisting of recent `Announcement` entries (targeted at students/all) and recent assignments for the course.

Why:
- These endpoints power `InsideCourseAssignmentsPage`, `InsideCourseLecturesPage`, and `InsideCourseStreamPage` in the frontend and ensure only enrolled students can access course content.

Next: implement `getAssignmentSubmission`, `getMyGrades`, and `getMyCalendar`.

---

## Step 6 — Implement academic data endpoints

What was done:
- Implemented `getMyGrades`, `getMyCalendar`, and `getAssignmentSubmission` in `backend/controllers/studentController.js`.

Details:
- `getMyGrades`:
  - Loads the student's `Enrollment` documents to get course context and `final_grade`.
  - Loads the student's `AssignmentSubmission` records and groups them by course, returning per-course assignment-level grades and feedback.

- `getMyCalendar`:
  - Collects upcoming assignment deadlines across the student's active enrollments and returns them as calendar events (type, title, course_id, when).

- `getAssignmentSubmission`:
  - Given an assignment ID, verifies the student is enrolled in the assignment's course and returns the assignment details plus the student's submission (if any).

Why:
- These endpoints provide the academic data needed by `MyGradesPage`, `AcademicCalendarPage`, and `AssignmentDetailsPage` so the frontend can present real, student-specific information.

---

## Step 7 — Add student-only enrollment validation and helper reuse

What was done:
- Added `backend/utils/studentHelpers.js` with `ensureStudentEnrolled(courseId, studentId)`.
- Replaced repeated enrollment verification logic in `backend/controllers/studentController.js` with the shared helper.
- Kept route security consistent by ensuring protected student endpoints use `req.user._id` and student enrollment checks before returning course-specific data.

Modified:
- `backend/utils/studentHelpers.js` — created the helper that checks for an active `Enrollment` document matching the student and course.
- `backend/controllers/studentController.js` — updated `getCourseAssignments`, `getCourseLectures`, `getCourseStream`, and `getAssignmentSubmission` to call `ensureStudentEnrolled(...)` instead of repeating the same `Enrollment.findOne(...)` query.

Why:
- Centralized enrollment validation reduces duplicated code and makes the student authorization path easier to maintain.
- This ensures only enrolled students can access course-specific assignments, lectures, stream data, and assignment submission details.


