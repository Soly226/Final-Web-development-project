const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const prefix = file.fieldname || 'file';
    cb(null, `${prefix}-${Date.now()}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const uploadLogo = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB max
}).single('logo');

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
}).single('profileImage');

// Setup submission directories and filters for student assignment submissions
const submissionDir = path.join(__dirname, '..', 'uploads', 'submissions');
if (!fs.existsSync(submissionDir)) {
  fs.mkdirSync(submissionDir, { recursive: true });
}

const assignmentStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, submissionDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `submission-${Date.now()}${ext}`);
  },
});

const assignmentFileFilter = (_req, file, cb) => {
  const allowedExtensions = ['.pdf', '.zip', '.doc', '.docx', '.png', '.jpg', '.jpeg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, ZIP, DOC, DOCX, and images are allowed'), false);
  }
};

const uploadAssignment = multer({
  storage: assignmentStorage,
  fileFilter: assignmentFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
}).single('uploaded_file');

// For instructor course material uploads (PDF, MP4, docs, links)
const materialDir = path.join(__dirname, '..', 'uploads', 'materials');
if (!fs.existsSync(materialDir)) {
  fs.mkdirSync(materialDir, { recursive: true });
}

const materialFileFilter = (_req, file, cb) => {
  const allowedExtensions = ['.pdf', '.mp4', '.doc', '.docx', '.ppt', '.pptx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, MP4, DOC, DOCX, PPT, and PPTX files are allowed'), false);
  }
};

const uploadFile = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, materialDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `material-${Date.now()}${ext}`);
    },
  }),
  fileFilter: materialFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max
}).single('file');

module.exports = {
  uploadLogo,
  uploadAvatar,
  uploadAssignment,
  uploadFile
};
