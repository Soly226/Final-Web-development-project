# EduCore LMS — Learning Management System

Welcome to the **EduCore LMS** project repository. This system is a dynamic, highly responsive web application designed to manage course registrations, prerequisite logic, grading metrics, email templates, and system configuration for an educational institution.

The application is split into a **React SPA frontend** and a **Node/Express backend REST API** powered by a **MongoDB** database.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017`

### 1. Database Seeding & Setup
We provide a comprehensive seeder script that clears previous mock data and populates the database with real admins, instructors, students, courses, grades, prerequisites, and system settings.

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Configure your Environment Variables
# Create a .env file (or verify the existing one):
PORT=5000
MONGODB_URI=mongodb://localhost:27017/educore
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
FRONTEND_URL=https://localhost:5173

# 4. Generate SSL Certificates (Optional manual step, done automatically at boot)
node certs/generate-certs.js

# 5. Seed the database with core accounts and data
npm run seed
```

### 2. Start the Backend Server
```bash
# In the backend directory:
npm run dev
```
*The server will start on secure HTTPS port `5000` by default. SSL certificates are auto-generated on startup if missing.*

### 3. Start the Frontend Application
```bash
# 1. Open a new terminal and navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Launch the development server
npm run dev
```
*Open your browser and navigate to `https://localhost:5173`.*

> [!IMPORTANT]
> **Trusting local self-signed certificates**:
> Since these certificates are self-signed for `localhost`, you will see a security connection warning.
> 1. Visit `https://localhost:5173` in your browser. Click **Advanced** and choose **Proceed to localhost (unsafe)**.
> 2. Visit `https://localhost:5000` in your browser. Click **Advanced** and choose **Proceed to localhost (unsafe)**. **If you skip this step, your browser will silently block all API requests from the frontend to the backend.**

---

## 🔑 Seeding Account Credentials

The following accounts are created by the seeder script. Use them to log in:

### Admin Credentials
- **Email**: `admin@educore.com`
- **Password**: `password123`
- **Role**: `admin` (Full administrative privileges)

### Instructor Credentials
- **Email**: `turing@educore.com` (Head of Department)
- **Password**: `password123`
- **Email**: `hopper@educore.com` (Instructor)
- **Password**: `password123`

### Student Credentials
- **Email**: `john@student.com`
- **Password**: `password123`
- **Role**: `student` (Has active enrollments, completed courses, and a GPA of 3.8)

---

## 🛡️ Key Architectures & Implementations

### 1. Session Authentication & Security
- **HttpOnly Cookies**: Moving away from storing JWT tokens in vulnerable client-side `localStorage`, the authentication system sets JWTs in an `httpOnly` secure cookie (`jwt`).
- **XSS & CSRF Mitigation**: The token is invisible to client-side JavaScript (`document.cookie` cannot read it), preventing cross-site scripting (XSS) token extraction.
- **Axios API Client**: All frontend requests go through `frontend/src/lib/apiClient.js` which is pre-configured with `withCredentials: true`, sending and receiving the authentication cookie automatically.

### 2. File Upload (Logo)
- **Multer Middleware**: Integrates single-file image uploads on `POST /api/admin/upload/logo`.
- **Storage**: Files are saved to `backend/uploads/` and served statically.
- **Frontend Integration**: Admins can upload a PNG/JPG logo in System Settings, which shows an immediate preview and saves the static path in `SystemSetting.logoUrl`.

### 3. Data Validation Layer
- **Backend**: Built with `express-validator`. Validation chains inspect fields for structure, type, and range (e.g. SMTP port: 1-65535, password: >=6 characters, template names: no spaces).
- **Frontend**: Inline red validation indicators disable form saves until criteria are met, alerting the user immediately before network calls.

### 4. Global Error Handling
- **404 Catch-All**: Express catches all unmatched routes and returns a formatted JSON `404 Not Found` response.
- **Global Error Handler**: Middleware intercepts throw statements, standardizes the JSON structure (`{ message: "..." }`), and prevents developer stack-traces from exposing vulnerability points in production.

### 5. HTTPS Support
- **TLS Generation**: Uses the `selfsigned` library to dynamically generate localhost certificate (`cert.pem`) and private key (`key.pem`) files on backend server startup.
- **HTTPS Enforcement**: Runs the primary Express server over HTTPS on port `5000` by default. The Vite dev server also loads these certificates to run over HTTPS on port `5173`.
