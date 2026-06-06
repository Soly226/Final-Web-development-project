# EduCore LMS – Professor Viva Preparation
### Tough Questions & Detailed Answers

> **Strategy:** A strict professor will look for gaps between what you claim and what the code actually does. Every answer below is grounded in the **actual implementation** of the Admin module. Use these responses to show deep mastery.

---

## Section A — Security, Session Auth & HTTPS

**Q1: You store JWT tokens in cookies now instead of localStorage. Why is this more secure, and how does the browser send it?**
- **A**: Storing tokens in `localStorage` makes them vulnerable to **XSS (Cross-Site Scripting)** attacks. If a malicious script runs on the frontend, it can read `localStorage.getItem('token')`. By setting the JWT in a cookie with the `httpOnly` flag, JavaScript is completely blocked from reading the cookie.
- The cookie is also configured with `sameSite: 'strict'` to prevent **CSRF (Cross-Site Request Forgery)** attacks.
- To send it on requests, the Axios client (`apiClient.js`) is configured with `withCredentials: true`. This tells the browser to attach the session cookie automatically to cross-origin requests.

**Q2: How does the server clear a user's session if the token is stateless?**
- **A**: Since JWT is stateless, the server cannot destroy it directly. Instead, when the client calls the `POST /api/auth/logout` endpoint, the server responds with `res.clearCookie('jwt')`. This instructs the browser to delete the cookie, ending the session.

**Q3: How does HTTPS work on localhost, and how did you implement it?**
- **A**: We generated self-signed TLS certificates programmatically using the `selfsigned` library. The script `certs/generate-certs.js` creates a 2048-bit RSA private key (`key.pem`) and a certificate (`cert.pem`).
- In `server.js`, we import Node's native `https` module. On server startup, it automatically checks if the certificates are present (generating them dynamically if they are missing) and launches the primary server directly over HTTPS on port `5000`:
  ```javascript
  https.createServer(sslOptions, app).listen(PORT);
  ```
- The frontend `vite.config.js` loads these certificates to run over HTTPS on port `5173`. The Axios API client (`apiClient.js`) is configured to connect to `https://localhost:5000` by default.

---

## Section B — File Uploads & Static Assets

**Q4: How did you implement file uploading, and what prevents users from uploading malware?**
- **A**: We configured Multer storage middlewares (`uploadMiddleware.js`) which restrict uploads based on user roles and contexts:
  1. **Logos & Avatars**: Restricts files to image mime-types (`image/*`) and limits sizes (2MB for logos, 5MB for avatars).
  2. **Assignment Submissions**: Restricts file formats to specific extensions (`.pdf`, `.zip`, `.doc`, `.docx`, and standard images) and enforces a 10MB size limit.
- All files are stored with unique timestamped filenames to prevent namespace collisions. Submissions are saved to `backend/uploads/submissions/` and logo assets are served statically:
  ```javascript
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  ```

**Q5: What happens if an admin uploads a logo and then deletes the system configuration?**
- **A**: The configuration is a singleton (only one settings document exists). The delete handler is not exposed, only updates. If the database is wiped, the uploaded files remain in `backend/uploads/` (orphaned files). In a production environment, we would use an event hook to delete the old file from disk whenever a new logo is uploaded.

---

## Section C — Input Validation & Error Handling

**Q6: What is your backend validation strategy?**
- **A**: We use `express-validator` middleware. Each endpoint has validation rules in `validationMiddleware.js` checking:
  - Input existence and types (e.g., SMTP Host must be a string).
  - Ranges (e.g., SMTP Port must be an integer between 1 and 65535, max login attempts: 1 to 20).
  - Formats (e.g., email address validation and normalization).
- If validation fails, `validateRequest` intercepts the call, returns a `400 Bad Request`, and sends a clean array of error messages without hitting the database or controller logic.

**Q7: How does your global error handling middleware prevent information leakage?**
- **A**: In `server.js`, we registered a global error handler (`errorMiddleware.js`) with 4 parameters: `(err, req, res, next)`.
- When an exception occurs, the handler catches it and returns a standard JSON error: `{ message: err.message }`.
- We check the environment variable: if `process.env.NODE_ENV` is NOT `'development'`, we hide the stack trace (`err.stack`) from the response, ensuring that database structures, filenames, and internal logic are not exposed to users.

---

## Section D — Database Operations & Pagination

**Q8: Why and how is pagination implemented on the backend?**
- **A**: Returning massive lists of logs or users in a single query is a performance bottleneck.
- We added `page` and `limit` query parameters. The backend calculates `const skip = (page - 1) * limit` and queries:
  ```javascript
  const [data, total] = await Promise.all([
    Model.find({}).skip(skip).limit(limit),
    Model.countDocuments()
  ]);
  ```
- This retrieves only the required segment of documents and provides metadata (`totalPages`, `total`) so the frontend can build pagination buttons.

**Q9: What happens when a course with prerequisites is deleted?**
- **A**: In `courseController.js`, `deleteCourse` deletes the course document and runs:
  ```javascript
  await CoursePrerequisite.deleteMany({
    $or: [{ course_id: id }, { required_course_id: id }]
  });
  ```
- This ensures clean referential cleanup for prerequisite linkages.
