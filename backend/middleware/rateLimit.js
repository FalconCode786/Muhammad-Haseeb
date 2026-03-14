const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_REQUESTS = 100;
const MAX_STORE_SIZE = 1000;
const CLEANUP_INTERVAL = 100;

const createRateLimiter = ({
  windowMs = DEFAULT_WINDOW_MS,
  max = DEFAULT_MAX_REQUESTS
} = {}) => {
  const store = new Map();
  let requestCounter = 0;

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

    requestCounter += 1;
    if (store.size > MAX_STORE_SIZE && requestCounter % CLEANUP_INTERVAL === 0) {
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
