const rateLimit = ({ windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests' } = {}) => {
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'global';
    const entry = hits.get(key) || { count: 0, start: now };

    if (now - entry.start > windowMs) {
      entry.count = 0;
      entry.start = now;
    }

    entry.count += 1;
    hits.set(key, entry);

    if (entry.count > max) {
      return res.status(429).json({
        success: false,
        message
      });
    }

    return next();
  };
};

module.exports = {
  rateLimit
};
