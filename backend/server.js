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
const generateCertificates = require('./certs/generate-certs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigin = process.env.FRONTEND_URL || 'https://localhost:5173';
    
    if (origin === allowedOrigin || origin.endsWith('.vercel.app') || origin.includes('localhost')) {
      return callback(null, true);
    }
    
    return callback(new Error('CORS policy violation: Origin not allowed'));
  },
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
app.use('/api/instructor/department', hodRoutes);
app.use('/api/instructor', instructorRoutes);
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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Check if we are running in a production environment or on Railway
    const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_STATIC_URL;

    if (isProduction) {
      // In production, platforms like Railway handle SSL termination, so we use a standard HTTP server
      app.listen(PORT, () => {
        console.log(`HTTP Server is running on port ${PORT}`);
      });
    } else {
      // Auto-generate SSL certificates if missing for local development
      const certsDir = path.join(__dirname, 'certs');
      const keyPath = path.join(certsDir, 'key.pem');
      const certPath = path.join(certsDir, 'cert.pem');

      if (!fs.existsSync(certsDir)) {
        fs.mkdirSync(certsDir, { recursive: true });
      }

      if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
        console.log('SSL certificates not found. Generating self-signed SSL certificates...');
        try {
          await generateCertificates(certsDir);
          console.log('SSL Certificates generated successfully.');
        } catch (err) {
          console.error('Error generating self-signed certificates:', err);
        }
      }

      // Start HTTPS Server
      if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
        const sslOptions = {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath)
        };
        https.createServer(sslOptions, app).listen(PORT, () => {
          console.log(`HTTPS Server is running on port ${PORT}`);
        });
      } else {
        console.error('SSL Certificates not found. Starting HTTP fallback server...');
        app.listen(PORT, () => {
          console.log(`Fallback HTTP Server is running on port ${PORT}`);
        });
      }
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
