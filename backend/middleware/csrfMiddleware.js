const crypto = require('crypto');

// Helper to generate a secure random CSRF token
const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Middleware to ensure a client has a CSRF cookie
const setCsrfCookie = (req, res, next) => {
  if (!req.cookies['csrf-token']) {
    const token = generateCsrfToken();
    res.cookie('csrf-token', token, {
      httpOnly: false, // Must be accessible to frontend JavaScript to read and send in request headers
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
  }
  next();
};

// Middleware to verify CSRF token on state-changing requests
const verifyCsrf = (req, res, next) => {
  // Safe HTTP methods do not modify server state and are exempt
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // Exempt auth routes (login, register, logout) since they establish the session
  const path = req.originalUrl || req.url;
  if (path.startsWith('/api/auth/login') || path.startsWith('/api/auth/register') || path.startsWith('/api/auth/logout')) {
    return next();
  }

  const cookieToken = req.cookies['csrf-token'];
  const headerToken = req.headers['x-csrf-token'];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ message: 'CSRF validation failed: Token mismatch or missing.' });
  }

  next();
};

module.exports = {
  generateCsrfToken,
  setCsrfCookie,
  verifyCsrf
};
