const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const https = require('https');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const courseRoutes = require('./routes/courseRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const studentRoutes = require('./routes/studentRoutes');
const rosterRoutes = require('./routes/rosterRoutes');
const userRoutes = require('./routes/userRoutes');
const hodRoutes = require('./routes/hodRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { setCsrfCookie, verifyCsrf } = require('./middleware/csrfMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Custom Security Headers (Clickjacking, MIME Sniffing, XSS Defenses)
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.removeHeader('X-Powered-By');
  next();
});

// CSRF Protection
app.use(setCsrfCookie);
app.use(verifyCsrf);

// Serve uploaded files (logos, etc.) as static assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api', rosterRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/instructor/department', hodRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/student', studentRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('EduCore LMS Backend API is running...');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Function to start HTTP and HTTPS servers
const startServers = () => {
  // Start HTTP Server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // Start HTTPS Server if certificates are present
  const keyPath = path.join(__dirname, 'certs', 'key.pem');
  const certPath = path.join(__dirname, 'certs', 'cert.pem');
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    const sslOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    };
    const HTTPS_PORT = process.env.HTTPS_PORT || 5443;
    https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
      console.log(`HTTPS Server is running on port ${HTTPS_PORT}`);
    });
  } else {
    console.log('SSL Certificates not found. HTTPS server disabled.');
  }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 2000
})
  .then(() => {
    console.log('Connected to MongoDB');
    startServers();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message || err);
    console.log('Starting server WITHOUT database. Data endpoints will fail.');
    startServers();
  });
