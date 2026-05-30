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
- In `server.js`, we import Node's native `https` module. If the certificates exist on disk, we create an HTTPS server on port `5443` in parallel to the HTTP server:
  ```javascript
  https.createServer(sslOptions, app).listen(5443);
  ```
- The frontend `apiClient.js` dynamically checks if the browser is using HTTPS and connects to `https://localhost:5443` or `http://localhost:5000` accordingly.

---

## Section B — File Uploads & Static Assets

**Q4: How did you implement logo uploading, and what prevents users from uploading malware?**
- **A**: We configured a Multer storage middleware (`uploadMiddleware.js`) which restricts uploads. It verifies:
  1. **File Type**: Restricts files to image mime-types (`image/*`).
  2. **File Size**: Rejects uploads exceeding 2MB.
- Files are saved to `backend/uploads/` with a hashed filename to prevent namespace collisions. The file path is saved in `SystemSetting.logoUrl` and served via static middleware:
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
