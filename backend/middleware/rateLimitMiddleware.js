const ipRequestCounts = new Map();

/**
 * Simple in-memory rate-limiter middleware to prevent brute-force attacks on sensitive endpoints.
 * 
 * @param {Object} options Configuration options
 * @param {number} options.windowMs Time window in milliseconds (e.g. 15 * 60 * 1000 for 15 minutes)
 * @param {number} options.maxRequests Max requests allowed within the windowMs
 * @param {string} options.message Error message returned on throttling
 */
const rateLimiter = ({ windowMs, maxRequests, message }) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!ipRequestCounts.has(ip)) {
      ipRequestCounts.set(ip, []);
    }

    const requests = ipRequestCounts.get(ip);
    // Filter out request timestamps older than the window
    const activeRequests = requests.filter(timestamp => now - timestamp < windowMs);
    
    if (activeRequests.length >= maxRequests) {
      return res.status(429).json({ 
        message: message || 'Too many requests from this IP. Please try again later.' 
      });
    }

    activeRequests.push(now);
    ipRequestCounts.set(ip, activeRequests);
    next();
  };
};

module.exports = {
  rateLimiter
};
