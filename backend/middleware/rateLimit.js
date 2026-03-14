const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_REQUESTS = 100;
const MAX_STORE_SIZE = 1000;
const REQUESTS_BETWEEN_CLEANUP = 100;

const createRateLimiter = ({
  windowMs = DEFAULT_WINDOW_MS,
  max = DEFAULT_MAX_REQUESTS
} = {}) => {
  const store = new Map();
  let requestCounter = 0;
  let lastCleanup = 0;

  return (req, res, next) => {
    const now = Date.now();
    const forwardedFor = req.headers['x-forwarded-for'];
    const forwardedIp = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : typeof forwardedFor === 'string'
        ? forwardedFor.split(',')[0].trim()
        : undefined;
    const key = forwardedIp || req.ip || req.socket.remoteAddress;
    if (!key) {
      return res.status(400).json({
        success: false,
        message: 'Unable to determine client IP for rate limiting.'
      });
    }

    requestCounter += 1;

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

    if (
      store.size > MAX_STORE_SIZE &&
      (requestCounter % REQUESTS_BETWEEN_CLEANUP === 0 || now - lastCleanup > windowMs)
    ) {
      for (const [storedKey, storedEntry] of store.entries()) {
        if (storedEntry.resetTime <= now) {
          store.delete(storedKey);
        }
      }
      lastCleanup = now;
      requestCounter = 0;
    }

    return next();
  };
};

const adminRateLimiter = createRateLimiter();

module.exports = {
  createRateLimiter,
  adminRateLimiter
};
