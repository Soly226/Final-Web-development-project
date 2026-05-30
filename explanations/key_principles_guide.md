# EduCore LMS — Key Principles & Ideas Guide
### Master the Software Engineering Concepts Behind Your Code

This document outlines the core software engineering patterns, security practices, and database principles implemented in this project. Use it to explain *why* the codebase is written this way during your discussion.

---

## 🏛️ 1. Architecture Patterns

### Model-View-Controller (MVC)
* **What it is**: Separation of concerns by separating the application into three components:
  - **Model**: Database schemas defining the shape of your data (`backend/models/`).
  - **View**: The React SPA frontend UI rendered to the user (`frontend/src/pages/`).
  - **Controller**: Code that handles HTTP requests, processes logic, and queries Models (`backend/controllers/`).
* **Why it matters**: If you change the database schema or the UI design, you only change the Model or the View, leaving the business logic in the Controllers intact.

### Decoupled SPA & REST API
* **What it is**: The frontend (Vite React app) and the backend (Express server) are completely independent. They communicate solely through JSON payloads sent over HTTP/HTTPS.
* **Why it matters**: The backend could be replaced with Python/Go, or the frontend could be replaced with an iOS/Android application, and they would still work as long as the API endpoints remain identical.

---

## 🔒 2. Security Principles (Defense-in-Depth)

### Stateless Session Authentication via JWT
* **What it is**: The server does not keep a record of who is logged in. Instead, it signs a JSON Web Token (JWT) with a private key. The browser presents this token on every request, and the server verifies it cryptographically.
* **Why it matters**: The server does not use database memory to track sessions, making it highly scalable.

### XSS (Cross-Site Scripting) Mitigation
* **What it is**: Storing sensitive data like JWTs in `localStorage` is vulnerable to theft if an attacker injects a malicious script. Storing the token in a cookie with the `httpOnly` flag blocks client-side JavaScript access.
* **Why it matters**: Even if an attacker executes malicious JS on your page, they cannot extract your JWT token because `document.cookie` returns empty.

### CSRF (Cross-Site Request Forgery) Mitigation
* **What it is**: If a user is logged in, a malicious site could trick the browser into sending a request to our backend with the session cookie. Configuring the cookie with `SameSite: strict` ensures the browser only sends it when navigating directly on our site.
* **Why it matters**: Prevents unauthorized requests from external origins.

---

## 🛡️ 3. Data Integrity & Validation

### Dual-Layer Input Validation
* **What it is**: Validating inputs on both the frontend (browser) and the backend (API).
* **Why it matters**: 
  - **Frontend validation** provides a fast, user-friendly UI experience (highlights error fields without page reloads).
  - **Backend validation** is the ultimate gatekeeper. Attackers can bypass frontend UI logic by sending requests directly using Postman/curl. Backend validation (`express-validator`) ensures only sanitized, structured data is written to MongoDB.

### File Upload Constraints
* **What it is**: Restricting file uploads via Multer using:
  - **Size filtering**: Limiting file uploads to <= 2MB.
  - **MIME filtering**: Restricting uploads strictly to image types (`image/*`).
* **Why it matters**: Prevents Denial of Service (DoS) attacks (by uploading massive files that fill up disk space) and blocks execution vulnerabilities (by uploading malicious `.exe` or `.js` scripts pretending to be images).

---

## 🗄️ 4. Database & Query Performance

### DB-Level Aggregation vs. Memory Processing
* **What it is**: Utilizing MongoDB pipelines (`$group`, `$sort`, `$limit`) inside [`adminController.getAdminReports`](file:///c:/Users/Dell/Desktop/web_project/backend/controllers/adminController.js) instead of querying all documents and calculating counts/trends in Node.js memory.
* **Why it matters**: Minimizes network traffic and server CPU usage. Performing aggregations directly in the database is exponentially faster.

### Limit-Offset Pagination
* **What it is**: Querying only a slice of database collections (e.g. `skip(skip).limit(limit)`) on endpoints like system logs and student lists.
* **Why it matters**: Keeps API responses fast regardless of database size. A database with 10 million log entries will load just as fast as one with 10 entries when loading 20 items per page.
