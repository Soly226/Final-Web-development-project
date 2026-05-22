# LMS Backend API

This is the backend API for the Learning Management System (LMS) built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization (Admin, Instructor, Student roles)
- Course management
- Messaging system
- Notifications
- User management

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies: `npm install`
4. Create a `.env` file with the following variables:
   ```
   MONGO_URI=mongodb://localhost:27017/lms
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```
5. Start MongoDB
6. Run the server: `npm start` or `npm run dev` for development

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (instructor/admin)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/:id/enroll` - Enroll in course

### Messages
- `GET /api/messages` - Get user's messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark message as read
- `DELETE /api/messages/:id` - Delete message

### Notifications
- `GET /api/notifications` - Get user's notifications
- `POST /api/notifications` - Create notification (admin only)
- `PUT /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification

## Troubleshooting

- Ensure MongoDB is running on the default port.
- Check that the JWT_SECRET is set in .env.
- For CORS issues, ensure the frontend is running on a different port or configure CORS accordingly.