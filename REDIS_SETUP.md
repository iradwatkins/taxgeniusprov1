# Redis & Upstash Configuration Guide

## Current Status

✅ **Rate limiting is working** with in-memory fallback
⏳ **Redis/Upstash not configured** - performance optimization pending

## Why Redis/Upstash?

Redis provides:

- **Distributed rate limiting** across multiple server instances
- **Caching** for faster API responses
- **Session storage** for better scalability
- **Analytics data** for rate limit metrics

## Quick Setup (5 minutes)

### Option 1: Upstash Redis (Recommended - Free Tier)

1. **Create Upstash Account**
   - Go to https://upstash.com
   - Sign up for free account
   - Create a new Redis database

2. **Get Credentials**
   - Copy your database URL and token
   - You'll get two values:
     - `UPSTASH_REDIS_REST_URL`
     - `UPSTASH_REDIS_REST_TOKEN`

3. **Add to Environment Files**

   Edit `.env.local`:

   ```bash
   # Upstash Redis (for rate limiting & caching)
   UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-token-here

   # Alternative: Local Redis URL
   REDIS_URL=redis://localhost:6379
   ```

4. **Restart Application**
   ```bash
   pm2 restart taxgeniuspro
   ```

### Option 2: Local Redis

1. **Install Redis**

   ```bash
   sudo apt update
   sudo apt install redis-server
   sudo systemctl start redis
   sudo systemctl enable redis
   ```

2. **Add to Environment**

   ```bash
   REDIS_URL=redis://localhost:6379
   ```

3. **Restart Application**
   ```bash
   pm2 restart taxgeniuspro
   ```

## What Happens Without Redis?

✅ **Application works fine** - automatic in-memory fallback
⚠️ **Rate limiting** works but resets on server restart
⚠️ **No distributed limiting** across multiple servers
⚠️ **No caching** - slightly slower API responses

## Features Currently Using Rate Limiting

### With In-Memory Fallback (Current)

- ✅ AI Content Generation: 10 req/min
- ✅ General API: 100 req/min
- ✅ Authentication: 10 req/min
- ✅ Document Operations: 30 req/min
- ✅ File Uploads: 20/hour
- ✅ Webhooks: 1000 req/min
- ✅ Tracking: 200 req/min

### What Improves With Redis

- 🚀 Rate limits persist across restarts
- 🚀 Works across multiple server instances
- 🚀 Analytics and monitoring
- 🚀 Better performance under load

## Verification

After adding Redis credentials:

```bash
# Check logs for successful connection
pm2 logs taxgeniuspro | grep -i redis

# You should see:
# ✅ "Redis connected successfully"
# ❌ "Redis connection failed, using in-memory store"
```

## Cost

- **Upstash Free Tier**:
  - 10,000 commands/day
  - 256 MB storage
  - Perfect for small-medium traffic

- **Local Redis**:
  - Free
  - Requires server maintenance
  - Good for development

## Need Help?

1. Upstash Documentation: https://upstash.com/docs/redis
2. Check logs: `pm2 logs taxgeniuspro`
3. Test connection: `redis-cli ping` (local Redis)

---

**Priority Level**: Medium
**Impact**: Performance optimization
**Estimated Time**: 5 minutes
**Required**: No (works without it)
