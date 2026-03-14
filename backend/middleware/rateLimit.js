const createRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 100 } = {}) => {
  const store = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key =
      req.ip ||
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress ||
      'unknown';

    const entry = store.get(key);
    if (!entry || entry.resetTime <= now) {
      store.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      const retryAfterSeconds = Math.ceil((entry.resetTime - now) / 1000);
      res.set('Retry-After', retryAfterSeconds.toString());
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }

    if (store.size > 1000) {
      for (const [storedKey, storedEntry] of store.entries()) {
        if (storedEntry.resetTime <= now) {
          store.delete(storedKey);
        }
      }
    }

    return next();
  };
};

const adminRateLimiter = createRateLimiter();

module.exports = {
  createRateLimiter,
  adminRateLimiter
};
