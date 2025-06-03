import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach(key => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });
}, 10 * 60 * 1000);

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
  skipSuccessfulRequests?: boolean;
}

export function createRateLimit(options: RateLimitOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const key = `${clientIP}:${req.route?.path || req.path}`;
    const now = Date.now();
    
    // Initialize or get existing rate limit data
    if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
      rateLimitStore[key] = {
        count: 0,
        resetTime: now + options.windowMs
      };
    }
    
    // Check if limit exceeded
    if (rateLimitStore[key].count >= options.maxRequests) {
      return res.status(429).json({
        error: options.message || 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((rateLimitStore[key].resetTime - now) / 1000)
      });
    }
    
    // Increment counter
    rateLimitStore[key].count++;
    
    // Add headers
    res.set({
      'X-RateLimit-Limit': options.maxRequests.toString(),
      'X-RateLimit-Remaining': Math.max(0, options.maxRequests - rateLimitStore[key].count).toString(),
      'X-RateLimit-Reset': new Date(rateLimitStore[key].resetTime).toISOString()
    });
    
    next();
  };
}

// Predefined rate limiters for different use cases
export const strictRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 requests per 15 minutes
  message: 'Too many form submissions. Please wait before trying again.'
});

export const moderateRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 20, // 20 requests per 15 minutes
  message: 'Request limit exceeded. Please slow down.'
});

export const lenientRateLimit = createRateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 50, // 50 requests per 5 minutes
  message: 'Too many requests. Please wait a moment.'
});

// Bot detection based on request patterns
export function botDetection(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.get('User-Agent') || '';
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /wget/i,
    /curl/i,
    /python/i,
    /requests/i
  ];
  
  // Check for suspicious user agents
  if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
    return res.status(403).json({
      error: 'Access denied. Automated requests not allowed.'
    });
  }
  
  // Check for missing common headers
  if (!req.get('Accept') || !req.get('Accept-Language')) {
    return res.status(403).json({
      error: 'Invalid request headers.'
    });
  }
  
  next();
}

// Validate form submission timing and honeypot
export function validateFormSubmission(req: Request, res: Response, next: NextFunction) {
  const { honeypot, submissionTime, mathAnswer, mathQuestion } = req.body;
  
  // Check honeypot field (should be empty)
  if (honeypot && honeypot.trim() !== '') {
    return res.status(400).json({
      error: 'Invalid form submission.'
    });
  }
  
  // Check submission timing (should take at least 3 seconds)
  if (submissionTime) {
    const timeTaken = Date.now() - parseInt(submissionTime);
    if (timeTaken < 3000) {
      return res.status(400).json({
        error: 'Form submitted too quickly. Please try again.'
      });
    }
  }
  
  // Validate math CAPTCHA
  if (mathAnswer && mathQuestion) {
    const expectedAnswer = mathQuestion.a + mathQuestion.b;
    if (parseInt(mathAnswer) !== expectedAnswer) {
      return res.status(400).json({
        error: 'Security check failed. Please verify the math answer.'
      });
    }
  }
  
  next();
}