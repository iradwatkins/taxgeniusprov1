import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from 'ioredis';

// Create Redis client for rate limiting
// Using local Redis instance with ioredis
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// ============ Rate Limiters for Different Endpoints ============

// AI Content Generation: 10 requests per minute per user (AC17)
export const aiContentRateLimit = new Ratelimit({
  redis: redis as any,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
  prefix: 'ratelimit:ai-content',
});

// General API: 100 requests per minute per IP
export const apiRateLimit = new Ratelimit({
  redis: redis as any,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: 'ratelimit:api',
});

// Authentication endpoints: 10 requests per minute per IP (prevent brute force)
export const authRateLimit = new Ratelimit({
  redis: redis as any,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
  prefix: 'ratelimit:auth',
});

// Document operations: 30 requests per minute per user
export const documentRateLimit = new Ratelimit({
  redis: redis as any,
  limiter: Ratelimit.slidingWindow(30, '1 m'),
  analytics: true,
  prefix: 'ratelimit:document',
});

// Upload endpoints: 20 uploads per hour per user (prevent abuse)
export const uploadRateLimit = new Ratelimit({
  redis: redis as any,
  limiter: Ratelimit.slidingWindow(20, '60 m'),
  analytics: true,
  prefix: 'ratelimit:upload',
});

// Payment webhooks: 1000 requests per minute (high throughput for Square)
export const webhookRateLimit = new Ratelimit({
  redis: redis as any,
  limiter: Ratelimit.slidingWindow(1000, '1 m'),
  analytics: true,
  prefix: 'ratelimit:webhook',
});

// Referral tracking: 200 events per minute per IP
export const trackingRateLimit = new Ratelimit({
  redis: redis as any,
  limiter: Ratelimit.slidingWindow(200, '1 m'),
  analytics: true,
  prefix: 'ratelimit:tracking',
});

// ============ Helper Functions ============

/**
 * Get client IP address from request headers
 */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return 'anonymous';
}

/**
 * Get user-specific identifier (for authenticated requests)
 */
export function getUserIdentifier(userId: string, ip?: string): string {
  return ip ? `${userId}:${ip}` : userId;
}

/**
 * Check rate limit for a specific limiter
 */
export async function checkRateLimit(identifier: string, limiter: Ratelimit = aiContentRateLimit) {
  const { success, limit, reset, remaining } = await limiter.limit(identifier);

  return {
    success,
    limit,
    reset,
    remaining,
    retryAfter: success ? 0 : Math.ceil((reset - Date.now()) / 1000), // seconds until reset
  };
}

/**
 * Create rate limit headers for response
 */
export function getRateLimitHeaders(result: {
  limit: number;
  remaining: number;
  reset: number;
}): HeadersInit {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };
}
