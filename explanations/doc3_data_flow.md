# EduCore LMS – Data Flow Documentation
### How Variables, Functions, and State Connect Across the Full Stack

---

## Overview: The Safe Data Pipeline

Every user action follows a secure path:

```
[React Page Component] → [apiClient (withCredentials)] → [Express Router]
                                                               │
[React State Update]   ← [apiClient Axios Response]    ← [Global Error Handler]
                                                               │
                                                 [Controller Action (Mongoose)]
                                                               │
                                                   [Validation Middleware]
                                                               │
                                                      [Auth/Role Middleware]
```

This document traces **each variable and function** along that pipeline for every major feature.

---

## 1. Authentication Flow (HttpOnly Cookie Strategy)

We transitioned from the insecure local-storage token pattern to a secure, stateless session cookie strategy.

### 1.1 Login

**Frontend trigger:** User clicks "Login" on `LoginPage.jsx`.

1. **Local React State**:
   - `email` (string) and `password` (string) are captured by `useState('')` and bound to input fields.
2. **Context Dispatch**:
   - `handleSubmit(e)` calls `login(email, password)` from `AuthContext.jsx`.
3. **HTTP Client Call**:
   - Instead of a raw Axios instance, we call `apiClient.post('/api/auth/login', { email, password })`.
   - `apiClient.js` is pre-configured with `withCredentials: true`, which tells the browser to store cookies returned by the server.
   - Dynamic Base URL resolves to `https://localhost:5443` (if TLS is active) or `http://localhost:5000`.

**Backend Receives `POST /api/auth/login`**:
- Router routes to `authController.loginUser(req, res)`:
  - `req.body.email` and `req.body.password` are extracted.
  - Tries finding a match in `Admin`, then `Instructor`, then `Student`.
  - Compares the password against the bcrypt hash: `await bcrypt.compare(password, user.password)`.
  - If a match is found:
    - Generates a JWT token: `generateToken(user._id, role)`.
    - Sets the cookie: `setCookieToken(res, token)`
      ```javascript
      res.cookie('jwt', token, {
        httpOnly: true, // Invisible to JavaScript, prevents XSS
        sameSite: 'strict', // Sent only on same-site requests, prevents CSRF
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
      });
      ```
    - Sends user info **without** the token:
      ```json
      {
        "_id": "603f9a72e8174c10c8fb1034",
        "name": "Super Admin",
        "email": "admin@educore.com",
        "role": "admin"
      }
      ```

**Response Handled by Frontend**:
- `AuthContext.jsx` receives the user JSON data.
- Stores `user` object in state and saves safe metadata (name, email, role) to `localStorage` (no token is stored client-side).
- Redirects user to `/admin`.

---

### 1.2 Cookie Propagation on Protected Routes

Every API call to `/api/admin/*` or `/api/courses/*` uses `apiClient`.

```javascript
// In any admin page component:
const { data } = await apiClient.get('/api/admin/logs');
// Because withCredentials: true is configured, the browser automatically attaches
// the 'jwt' cookie in the request headers behind the scenes.
```

**Backend Intercepts with `protect` Middleware (`authMiddleware.js`)**:
- Extracts token: `req.cookies.jwt`
- Decodes it: `jwt.verify(token, process.env.JWT_SECRET)`
- Retrieves user record: `req.user = await Admin.findById(decoded.id).select('-password')`
- Runs `admin(req, res, next)` to verify `req.user.role === 'admin'`.
- Passes execution to the controller function if authorized.

---

## 2. File Upload Data Flow (Logo Upload)

**Component:** `SystemSettingsPage.jsx`

```
[File Select] → [FileReader Preview] → [FormData Object] → [apiClient.post]
                                                                 │
[State: logoUrl] ← [res.data.logoUrl] ← [Database Save] ← [Multer Middleware]
```

1. **Frontend Selection**:
   - Admin chooses an image using `<input type="file" onChange={handleFileChange} />`.
   - Local state `previewUrl` is set using `URL.createObjectURL(file)` to display a live thumbnail.
2. **Form Submission**:
   - `handleSave` creates a standard browser `FormData` object:
     ```javascript
     const formData = new FormData();
     formData.append('logo', file); // 'logo' matches backend Multer field
     ```
   - Dispatches `apiClient.post('/api/admin/upload/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } })`.
3. **Backend Upload Stream**:
   - `POST /api/admin/upload/logo` is routed through `uploadLogo` middleware (`uploadMiddleware.js` built on `multer`).
   - Multer checks parameters (file type `image/*`, size limit <= 2MB).
   - Saves the file to `backend/uploads/` with a unique hash filename.
   - Appends `req.file` to the request object.
4. **Backend Controller**:
   - `uploadLogoFile(req, res)` extracts `req.file.filename`.
   - Saves the static URL to database settings:
     ```javascript
     settings.logoUrl = `/uploads/${req.file.filename}`;
     await settings.save();
     ```
   - Returns the updated setting document containing `{ logoUrl: "/uploads/xyz.jpg" }`.
5. **Static File Serving**:
   - `server.js` serves files statically: `app.use('/uploads', express.static(path.join(__dirname, 'uploads')))`
   - Frontend reads the returned `logoUrl` and renders: `<img src={`http://localhost:5000${settings.logoUrl}`} />`.

---

## 3. Data Validation Flow

**Example Endpoint:** `PUT /api/admin/settings`

1. **Frontend Input Guard**:
   - Local form state triggers validation rules. For example, SMTP Port is verified:
     `if (smtpPort < 1 || smtpPort > 65535) setError('Port must be between 1 and 65535')`
   - Form submit button is disabled if `errors` exist.
2. **HTTP Payload Dispatch**:
   - Form inputs are sent to the server.
3. **Backend Middleware Interception**:
   - `updateSettingsValidationRules` (`validationMiddleware.js`) intercepts:
     ```javascript
     body('smtpPort').optional().isInt({ min: 1, max: 65535 })
     ```
   - If values violate rules, `validateRequest` catches it:
     ```javascript
     const errors = validationResult(req);
     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
     ```
   - Stops execution and returns error JSON to client without calling the controller.

---

## 4. Global Error Pipeline

```
[Controller Throw Exception] → [errorMiddleware.js] → [res.status(code).json()]
```

If an endpoint experiences a database crash or logical error:
1. The controller catches the exception and passes it to the next function: `catch (err) { next(err) }` or it bubble-throws.
2. The global `errorHandler` middleware catches it.
3. Sets status code (default `500` if not set).
4. Returns a standard structure:
   ```json
   {
     "message": "A database connection timeout occurred.",
     "stack": "...stack trace only shown in development mode..."
   }
   ```
5. Ensures server doesn't crash and prevents security leaks from exposing raw backend stack traces in production.

---

## 5. Pagination Data Flow

**Component:** `SystemLogsPage.jsx` or User list tables.

1. **Query Formulation**:
   - Page state `page` is initialized to `1`.
   - Request sent: `apiClient.get('/api/admin/logs?page=1&limit=50')`.
2. **Backend Query Processing**:
   - `getSystemLogs` extracts parameters: `req.query.page` (1) and `req.query.limit` (50).
   - Computes skip index: `const skip = (page - 1) * limit`.
   - Performs parallel MongoDB queries:
     ```javascript
     const [logs, total] = await Promise.all([
       SystemLog.find({}).sort({ timestamp: -1 }).skip(skip).limit(limit),
       SystemLog.countDocuments()
     ]);
     ```
   - Returns payload containing paginated logs alongside a `pagination` envelope:
     ```json
     {
       "data": [...logs],
       "pagination": {
         "total": 128,
         "page": 1,
         "limit": 50,
         "totalPages": 3
       }
     }
     ```
3. **Frontend Render**:
   - Stores logs in state. Renders pagination buttons enabling page increment/decrement.
