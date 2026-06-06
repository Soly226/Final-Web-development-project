# EduCore LMS – Developer Documentation
### Admin Module: Functions, Architecture & User Flow

---

## 1. Tech Stack Overview

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | UI framework and development environment |
| **Styling** | Tailwind CSS + twMerge | Utility-first styling and theme system |
| **Routing** | React Router v6 | Client-side routing and layout nesting |
| **HTTP Client** | Axios | Shared client with HttpOnly credentials config |
| **Auth State** | React Context API | User state wrapper (safely strips tokens) |
| **Backend** | Node.js + Express.js | Core REST API server |
| **Database** | MongoDB (via Mongoose) | NoSQL database and schema management |
| **Auth** | JWT (jsonwebtoken) | Stateless session tokens (HttpOnly cookie delivery) |
| **Security** | bcryptjs & selfsigned | Password hashing and self-signed TLS generation |

---

## 2. Updated Project Directory Structure

```
web_project/
├── backend/
│   ├── server.js                 ← Express entry point (HTTPS:5000)
│   ├── .env                      ← Secret variables (PORT, MONGODB_URI, JWT_SECRET, FRONTEND_URL)
│   ├── certs/
│   │   ├── generate-certs.js     ← TLS certificate generator script
│   │   ├── key.pem               ← SSL Private Key (Generated)
│   │   └── cert.pem              ← SSL Certificate (Generated)
│   ├── controllers/
│   │   ├── adminController.js    ← Admin settings, broadcasts, email templates, reports
│   │   ├── authController.js     ← Register, Login (HttpOnly cookie setters), Logout
│   │   ├── courseController.js   ← Course CRUD & Enrollment logic
│   │   └── userManagementController.js ← Students, Instructors, Admins paginated CRUD
│   ├── middleware/
│   │   ├── authMiddleware.js     ← Reads cookie, extracts role, protects routes
│   │   ├── errorMiddleware.js    ← Catch-all 404 + global 500 error handlers
│   │   ├── uploadMiddleware.js   ← Multer middleware config for file upload
│   │   └── validationMiddleware.js ← express-validator schemas for all inputs
│   └── routes/
│       ├── adminRoutes.js        ← Admin core routes + user management routes
│       ├── authRoutes.js         ← Authentication routes
│       └── courseRoutes.js       ← Course catalogue routes
└── frontend/
    └── src/
        ├── App.jsx               ← Protected route declarations
        ├── main.jsx              ← React DOM mount
        ├── lib/
        │   └── apiClient.js      ← Shared Axios instance with withCredentials
        ├── context/
        │   └── AuthContext.jsx   ← Auth state provider (no client token storage)
        └── pages/admin/
            ├── AdminDashboard.jsx
            ├── SystemLogsPage.jsx
            ├── SystemSettingsPage.jsx
            ├── EmailTemplatesPage.jsx
            ├── AdminReportsPage.jsx
            └── CourseManagementPage.jsx
```

---

## 3. Backend – Function Reference

### 3.1 `server.js` — Bootstrapping
- Registers `cookieParser()` to read secure incoming cookie headers.
- Serves the `uploads/` folder as a static route: `app.use('/uploads', express.static(...))`.
- Binds routes: `/api/auth`, `/api/admin`, `/api/courses`.
- Connects to MongoDB, automatically checks for/generates self-signed SSL certificates in `certs/` on boot if missing, and starts the primary server over HTTPS on `PORT` (5000).

### 3.2 `authMiddleware.js` — Role and Session Guard
- **`protect(req, res, next)`**:
  - Extracts the JWT token from `req.cookies.jwt` (cookie-based session). Fallbacks to the standard `Authorization: Bearer <token>` header if needed for compatibility.
  - Verifies the signature with `jwt.verify()`.
  - Attaches the decoded user document to `req.user`.
- **`admin(req, res, next)`**:
  - Verifies that `req.user.role === 'admin'`.
- **`studentOnly(req, res, next)`**:
  - Verifies that `req.user.role === 'student'`.

### 3.3 `authController.js` — Authentication Controllers
- **`setCookieToken(res, token)`**:
  - Helper to inject the token inside an HttpOnly, SameSite strict cookie for secure session tracking.
- **`loginUser(req, res)`**:
  - Validates credentials, sets the session cookie, and returns the user object without token details.
- **`logoutUser(req, res)`**:
  - Clears the `'jwt'` cookie: `res.clearCookie('jwt')` to end the session.

### 3.4 `adminController.js` — Settings & Reporting
- **`getPlatformAnalytics(req, res)`**:
  - Returns count summaries querying MongoDB collections dynamically, and fetches actual database storage footprint.
- **`uploadLogoFile(req, res)`**:
  - Captures uploaded files from `req.file` (handled by Multer), saves the filename to `SystemSetting.logoUrl`, and returns the setting document.
- **`getAdminReports(req, res)`**:
  - Aggregates GPA letter grade averages, semester trends, and top courses dynamically.

### 3.5 `userManagementController.js` — User Lists CRUD
- Handles paginated lookups for `Student`, `Instructor`, and `Admin` models.
- Handles creation (`createStudent`, `createInstructor`, `createAdmin`) and deletion (`deleteUser`).

### 3.6 `validationMiddleware.js` — Validation Chains
- Validates payload requirements using `express-validator`.
- Covers signup, login, settings updates, broadcasts, email templates, and user management creation.

---

## 4. Frontend – Function Reference

### 4.1 `apiClient.js` — Shared HTTP Client
- Centrally configures `withCredentials: true` to tell the browser to automatically include the HttpOnly cookie in request headers.
- Defaults backend base URL to `https://localhost:5000` to interact with the HTTPS backend server.

### 4.2 `AuthContext.jsx` — State Controller
- Manages user login/registration. Stores user meta objects (name, email, role) in `localStorage` for page reload persistence.
- Never stores tokens client-side, mitigating XSS extraction vectors.
- Calls the `/api/auth/logout` endpoint on logout to clear the cookie on the server.
