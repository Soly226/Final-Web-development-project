# Student Backend API Scaffold

This commit adds the scaffold for the student backend API layer.

## Added files

- `backend/routes/studentRoutes.js`
  - Defines student-facing routes for profile, enrolled courses, grades, calendar, course content, and assignment submissions.
  - Currently routes are wired to controller functions.

- `backend/controllers/studentController.js`
  - Adds controller stubs for all student API endpoints.
  - Each handler currently returns `501 Not Implemented` to indicate the endpoint is scaffolded but not yet implemented.

## Modified files

- `backend/server.js`
  - Imports `studentRoutes`.
  - Registers the route under `/api/students`.

## Purpose

This scaffolding creates the new backend structure that the student frontend pages can later consume.
The next commits will implement authentication, real data queries, and endpoint behavior.
