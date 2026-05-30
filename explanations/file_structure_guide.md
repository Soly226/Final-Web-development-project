# EduCore LMS — Codebase File Structure Guide
### Navigate Your Code Like a Pro in Front of the Professor

Use this guide to look up the exact files, functions, and internal file layouts. If the professor asks: *"Where does X happen?"*, you can immediately answer: *"It's in [file-name], inside the [function-name] function, which is located in the [top/middle/bottom] section of the file."*

---

## 📂 1. Backend File Structure & Internal Layouts

### 🖥️ `server.js` (Root Entry Point)
* **Location**: `backend/server.js`
* **Internal Structure**:
  - **Top (Imports)**: Express, CORS, dotenv, Mongoose, cookie-parser, route files, and error middleware.
  - **Middle (Middleware)**: Registers `cors()`, `express.json()`, `cookieParser()`, and serves `/uploads` statically.
  - **Routes mounting**: Binds `/api/auth`, `/api/admin`, `/api/courses` routing groups.
  - **Bottom (Server Bootstrapping)**: Connects to MongoDB, starts the HTTP server (`port 5000`), and checks for SSL files to launch the HTTPS server (`port 5443`).

---

### 🛡️ Controllers (`backend/controllers/`)

#### [`authController.js`](file:///c:/Users/Dell/Desktop/web_project/backend/controllers/authController.js) (Authentication Logic)
- **Top**: Imports models (`Admin`, `Instructor`, `Student`), JWT, and bcrypt.
- **Top-Middle (Helpers)**:
  - `generateToken(id, role)`: Returns a signed JWT.
  - `setCookieToken(res, token)`: Sets the JWT in an `httpOnly`, `sameSite: strict` cookie.
- **Middle**:
  - `registerUser(req, res)`: Registers a user based on role, hashes password via hooks.
  - `loginUser(req, res)`: Authenticates credentials, sets session cookie, returns profile info.
- **Bottom**:
  - `logoutUser(req, res)`: Clears the `jwt` cookie.

#### [`adminController.js`](file:///c:/Users/Dell/Desktop/web_project/backend/controllers/adminController.js) (Admin Features)
- **Top**: Imports Mongoose, models (`SystemSetting`, `SystemLog`, `EmailTemplate`, `Announcement`, `Instructor`, `Course`, `Enrollment`).
- **Middle (System Settings & Logs)**:
  - `getSystemLogs`: Paginated system logs.
  - `getPlatformAnalytics`: Counts users and checks DB storage size.
  - `getSystemSettings` & `updateSystemSettings`: Singleton configurations.
- **Middle-Bottom (Broadcasts & Templates)**:
  - `createSystemBroadcast`: Saves system-wide announcements.
  - `getEmailTemplates`, `createEmailTemplate`, `updateEmailTemplate`, `deleteEmailTemplate`: CRUD endpoints for email templates.
- **Bottom (Reports & Uploads)**:
  - `getAdminReports`: Aggregates trends, popular courses, and GPA averages.
  - `uploadLogoFile`: Saves the uploaded logo file path to system settings.

#### [`userManagementController.js`](file:///c:/Users/Dell/Desktop/web_project/backend/controllers/userManagementController.js) (User Lists CRUD)
- **Top**: Imports Mongoose, models (`Student`, `Instructor`, `Admin`).
- **Middle**:
  - `getStudents`, `createStudent`: Paginated retrieval and creation of student models.
  - `getInstructors`, `createInstructor`: Paginated retrieval and creation of instructor models.
  - `getAdmins`, `createAdmin`: Paginated retrieval and creation of admin models.
- **Bottom**:
  - `deleteUser`: Route parameter controller to delete user based on type (`/users/:type/:id`).

---

### ⚙️ Middleware (`backend/middleware/`)

#### [`authMiddleware.js`](file:///c:/Users/Dell/Desktop/web_project/backend/middleware/authMiddleware.js) (Token verification)
- **Top**: Imports JWT, Mongoose, and Admin model.
- **Middle**: `protect(req, res, next)`: Reads `req.cookies.jwt` first (falls back to Authorization header), verifies, retrieves user, and attaches to `req.user`.
- **Bottom**: `admin(req, res, next)`: Verifies role is `admin`.

#### [`validationMiddleware.js`](file:///c:/Users/Dell/Desktop/web_project/backend/middleware/validationMiddleware.js) (Input Sanitizers)
- **Top**: Imports `express-validator` elements, defines the `validateRequest` response collector.
- **Middle**: Authentication rules (`registerValidationRules`, `loginValidationRules`).
- **Middle-Bottom**: Settings, broadcast, template validation rules.
- **Bottom**: User management creation validation rules (`createStudentValidationRules`, `createInstructorValidationRules`, `createAdminValidationRules`).

#### [`errorMiddleware.js`](file:///c:/Users/Dell/Desktop/web_project/backend/middleware/errorMiddleware.js) (Error catching)
- **Top**: `notFound(req, res, next)`: Middleware creating a `404 Not Found` error.
- **Bottom**: `errorHandler(err, req, res, next)`: Standardizes the error JSON and strips stack trace if not in development mode.

#### [`uploadMiddleware.js`](file:///c:/Users/Dell/Desktop/web_project/backend/middleware/uploadMiddleware.js) (File Upload config)
- **Top**: Imports Multer, Path, FS.
- **Middle**: Defines `storage` (destined to `uploads/` with hashed filenames) and file validation filters.
- **Bottom**: Exports `uploadLogo = multer({ ... }).single('logo')`.

---

### 🛣️ Routes (`backend/routes/`)
- [`authRoutes.js`](file:///c:/Users/Dell/Desktop/web_project/backend/routes/authRoutes.js): Maps public endpoints (`/login`, `/register`, `/logout`) to `authController`.
- [`adminRoutes.js`](file:///c:/Users/Dell/Desktop/web_project/backend/routes/adminRoutes.js): Secures all endpoints under `protect` + `admin` middleware. Maps settings, email templates, reports, logs, uploads, and user management routes to their controllers.

---

## 📂 2. Frontend File Structure & Internal Layouts

### 🌐 API client & Session (`frontend/src/`)

#### [`apiClient.js`](file:///c:/Users/Dell/Desktop/web_project/frontend/src/lib/apiClient.js)
- **Layout**: Exports a single, default Axios client configured with `withCredentials: true` and dynamic URL resolution (`5443` HTTPS or `5000` HTTP).

#### [`AuthContext.jsx`](file:///c:/Users/Dell/Desktop/web_project/frontend/src/context/AuthContext.jsx)
- **Top**: Imports apiClient, context hooks, React hooks.
- **Middle**:
  - Initializes `user` state by reading `localStorage` (non-sensitive profile properties only).
  - `login` and `register` call `apiClient`, populates state, sets metadata storage.
  - `logout` calls backend logout endpoint, wipes context state, and empties storage.
- **Bottom**: Exports `AuthProvider` and `useAuth()` custom hook.

---

### 🎨 Admin Pages (`frontend/src/pages/admin/`)

#### [`SystemSettingsPage.jsx`](file:///c:/Users/Dell/Desktop/web_project/frontend/src/pages/admin/SystemSettingsPage.jsx)
- **Top**: Component state variables for active tab (`general`, `email`, `broadcast`), settings form fields, validations, and previews.
- **Middle (Effects & Handlers)**:
  - `fetchSettings` retrieves settings, `handleSave` PUTs settings forms (using `FormData` if a file is attached).
  - `handleBroadcast` dispatches system-wide target announcements.
- **Bottom (JSX Render)**: Form fields with inline validation displays (SMTP ports, platform name bounds) and file upload previews.

#### [`EmailTemplatesPage.jsx`](file:///c:/Users/Dell/Desktop/web_project/frontend/src/pages/admin/EmailTemplatesPage.jsx)
- **Top**: State variables for selected template, editor text contents, and modal states.
- **Middle**:
  - `fetchTemplates` GETs email templates.
  - `handleCreate`, `handleUpdate`, `handleDelete` manage templates CRUD.
- **Bottom (JSX Render)**: Left side renders template items with DELETE buttons; right side renders template body editor and placeholder variable markers (e.g. `{{student_name}}`).
