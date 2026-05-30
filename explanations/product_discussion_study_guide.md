# EduCore LMS — Product Discussion Study Guide

### Master Your Web Project Architecture, Security, and Codebase

Use this comprehensive guide to prepare for your product discussion. It covers every technical decision, architecture details, and how the modules you built interact, enabling you to speak fluently and confidently.

---


## 💡 1. The Core Pitch: What Is EduCore LMS?

EduCore LMS is a modern, modular **Learning Management System** built on a decoupled, full-stack JavaScript architecture.

- **Frontend**: Single Page Application (SPA) built using **React 18** and **Vite** (for fast build times), styled with responsive **Tailwind CSS**.
- **Backend**: **Node.js** with the **Express** framework, creating a RESTful API.
- **Database**: **MongoDB** utilizing **Mongoose** for Object Data Modeling (ODM) to enforce data structures and schemas.

---

## 🔒 2. Authentication & Security (Your Strongest Shield)

_If asked about security, this is your flagship feature._

### The Old Pattern (LocalStorage) vs. The New Pattern (HttpOnly Cookies)

- **Previously**: JWT tokens were returned in JSON and stored in `localStorage` on the frontend. If the site suffered a Cross-Site Scripting (XSS) vulnerability (e.g. if a third-party script was compromised), an attacker could run `localStorage.getItem('user')` and steal the token.
- **Now (HttpOnly Cookies)**:
  - When you login, the backend generates a JWT and sends it using `res.cookie('jwt', token, { httpOnly: true })`.
  - `httpOnly: true` means frontend JavaScript **cannot** access or read the cookie. It is stored securely in the browser's protected storage.
  - `sameSite: 'strict'` ensures the cookie is only attached to requests originating from our domain, eliminating Cross-Site Request Forgery (CSRF) vulnerability.
  - The frontend client (`apiClient.js`) is configured with `withCredentials: true`, which automatically attaches this cookie to every API call.
  - The frontend `AuthContext` only stores non-sensitive metadata (user's name, email, and role) for UI rendering.

---

## 🌐 3. Network Architecture & HTTPS

_Explain how the web application communicates securely._

### Centralized Axios Client (`apiClient.js`)

Instead of importing raw Axios and duplicating URLs, we use a single instance located at [apiClient.js](file:///c:/Users/Dell/Desktop/web_project/frontend/src/lib/apiClient.js):

- **Base URL Protocol Negotiation**: It checks Vite's environment variable or falls back to:
  `window.location.protocol === 'https:' ? 'https://localhost:5443' : 'http://localhost:5000'`
- **Automatic transport**: Sets `withCredentials: true` globally so cookie handshakes occur automatically on every route.

### Localhost HTTPS Support

- **TLS Generation**: The script `backend/certs/generate-certs.js` uses the `selfsigned` npm package to generate private keys (`key.pem`) and certificates (`cert.pem`) programmatically.
- **Dual Server Bootstrapping**: `server.js` listens on port `5000` (HTTP) and dynamically provisions an HTTPS listener on port `5443` if the certificate files are present.

---

## 🧱 4. The Request Pipeline: Flow of Data

_Be ready to trace a request end-to-end. Let's trace changing system settings:_

1. **User Action**: The admin types a new SMTP Host on the settings screen and clicks "Save".
2. **Frontend Validation**: React state checks if the form fields conform to local constraints.
3. **HTTP Dispatch**: The frontend calls `apiClient.put('/api/admin/settings', settings)`. The browser automatically appends the `jwt` session cookie.
4. **Backend Security Layer**:
   - `protect` middleware reads the cookie, verifies the JWT signature, and attaches the user document to `req.user`.
   - `admin` middleware checks `req.user.role === 'admin'`. If not, returns `401 Unauthorized`.
5. **Backend Input validation**:
   - `updateSettingsValidationRules` schema (`validationMiddleware.js`) checks that `smtpPort` is between `1` and `65535`.
   - If validation fails, Express stops and returns a `400 Bad Request` containing formatting errors.
6. **Controller Execution**:
   - `updateSystemSettings` in `adminController.js` runs.
   - Finds the settings record: `await SystemSetting.findOne({})`.
   - Modifies fields and runs `await settings.save()`.
   - Creates a audit log entry: `await SystemLog.create(...)`.
7. **JSON Response**: The backend returns the updated settings document as JSON, and the frontend updates its state to display a success toast.

---

## 📁 5. Essential Codebase Files & Roles

| File                | Path                                                                                                              | Key Role                                                                              |
| :------------------ | :---------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| **Server Entry**    | [`server.js`](file:///c:/Users/Dell/Desktop/web_project/backend/server.js)                                        | Loads middleware, runs DB connections, starts HTTP (5000) & HTTPS (5443) servers.     |
| **API Client**      | [`apiClient.js`](file:///c:/Users/Dell/Desktop/web_project/frontend/src/lib/apiClient.js)                         | Configures CORS cookie transport and switches URL ports dynamically.                  |
| **Auth Context**    | [`AuthContext.jsx`](file:///c:/Users/Dell/Desktop/web_project/frontend/src/context/AuthContext.jsx)               | Handles login, logout, and stores logged-in user profile metadata.                    |
| **Input Checker**   | [`validationMiddleware.js`](file:///c:/Users/Dell/Desktop/web_project/backend/middleware/validationMiddleware.js) | Enforces rules on requests (auth, settings, templates, broadcasts, user management).  |
| **File Uploader**   | [`uploadMiddleware.js`](file:///c:/Users/Dell/Desktop/web_project/backend/middleware/uploadMiddleware.js)         | Configures Multer storage, controls image mime-types, and sets file size limits.      |
| **Safety Boundary** | [`errorMiddleware.js`](file:///c:/Users/Dell/Desktop/web_project/backend/middleware/errorMiddleware.js)           | Custom global handler which hides system crash trace details in production.           |
| **Seeder Script**   | [`seedData.js`](file:///c:/Users/Dell/Desktop/web_project/backend/utils/seedData.js)                              | Resets the DB and generates clean admins, instructors, students, courses, and grades. |

---

## 🎙️ 6. How to Answer Tough Questions (Cheat Sheet)

#### "Why did you choose MongoDB over SQL?"

> _"We chose MongoDB for its document-oriented model. Entities like Courses have dynamic configurations (prerequisites, enrolled students list) which fit nicely into nested document arrays. For schema rules, we used Mongoose on the application layer, giving us the benefits of schemas with the flexibility of NoSQL."_

#### "How do you handle API security?"

> _"First, all endpoints are locked behind a double guard (`protect` + `admin` middleware). Second, we enforce HttpOnly cookies for session tokens to block XSS vector access. Third, we whitelisted CORS domains. Finally, we added a complete input validation layer using `express-validator` on the backend and custom form validation states on the frontend."_

#### "Why did you implement programmatic self-signed certificates instead of normal certs?"

> _"In local development, you don't have access to dynamic DNS or domain ownership to provision Let's Encrypt certificates. Implementing programmatic certificate generation (`selfsigned` package) lets us simulate TLS/HTTPS locally, allowing us to build and test secure cookies in an HTTPS-like sandbox before staging deployment."_

#### "How does your prerequisite checking logic work?"

> _"During student course enrollment, the controller retrieves the course metadata. If `prerequisite_course_id` exists, the controller runs a query in the `Enrollment` collection checking if the student has an enrollment for that specific prerequisite course with a status of `'completed'`. If not found, enrollment is rejected."_
