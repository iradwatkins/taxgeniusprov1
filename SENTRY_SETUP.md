# Sentry Error Monitoring Setup Guide

## Current Status

✅ **Sentry SDK installed** and configured
⏳ **Credentials needed** to activate monitoring

## Why Sentry?

Sentry provides:

- **Real-time error alerts** via email/Slack
- **Stack traces** with source maps
- **Performance monitoring** for slow requests
- **User session replay** to see what happened
- **Release tracking** to catch regressions

## Quick Setup (5 minutes)

### 1. Create Sentry Account

1. Go to https://sentry.io
2. Sign up (free for 5,000 errors/month)
3. Create a new project:
   - Choose **Next.js** as platform
   - Name it "TaxGeniusPro"

### 2. Get Your DSN

After creating the project, you'll see a DSN like:

```
https://abc123def456@o123456.ingest.sentry.io/789012
```

### 3. Add to Environment Files

Edit `.env.local`:

```bash
# Sentry Error Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn-here@sentry.io/project-id
SENTRY_DSN=https://your-dsn-here@sentry.io/project-id

# Optional: For source maps (improves stack traces)
SENTRY_ORG=your-organization-slug
SENTRY_PROJECT=taxgeniuspro
SENTRY_AUTH_TOKEN=your-auth-token
```

Copy to `.next/standalone/` (for production):

```bash
cp .env.local .next/standalone/
```

### 4. Restart Application

```bash
npm run build
pm2 restart taxgeniuspro
```

## What's Already Configured

✅ **Client-side monitoring** (`sentry.client.config.ts`)

- Session replay on errors
- 10% sampling for normal sessions
- Full text/media masking for privacy

✅ **Server-side monitoring** (`sentry.server.config.ts`)

- API route error tracking
- 100% trace sampling (adjust for production)
- Debug mode disabled

## Test It Works

### 1. Trigger a Test Error

Visit in browser:

```
https://taxgeniuspro.tax/api/test-sentry-error
```

Or add this temporarily to any page:

```typescript
throw new Error('Test error for Sentry');
```

### 2. Check Sentry Dashboard

- Go to sentry.io
- Navigate to your project
- You should see the error appear within seconds

## Features You Get

### Error Tracking

- Full stack traces
- User context (if authenticated)
- Breadcrumbs (what user did before error)
- Device/browser info

### Performance Monitoring

- Slow API routes
- Database query performance
- External API latency
- Page load times

### Session Replay

- See exactly what user saw when error occurred
- Privacy-safe (text/media masked by default)
- 1.0 error rate (records all error sessions)
- 0.1 normal rate (10% of successful sessions)

## Privacy Configuration

Current settings (in `sentry.client.config.ts`):

```typescript
maskAllText: true,      // Hide all text content
blockAllMedia: true,    // Hide images/videos
```

This ensures sensitive tax data is never sent to Sentry.

## Cost

**Sentry Free Tier**:

- 5,000 errors/month
- 10,000 performance units/month
- 50 replays/month
- Perfect for small-medium sites

**Paid Plans** (if needed):

- Team: $26/month
- Business: $80/month
- Enterprise: Custom

## Production Optimization

For production, consider adjusting sampling rates in `sentry.client.config.ts`:

```typescript
// Lower rates for production to stay in free tier
tracesSampleRate: 0.1,           // 10% of transactions
replaysOnErrorSampleRate: 1.0,   // 100% on errors (keep this)
replaysSessionSampleRate: 0.01,  // 1% of normal sessions
```

## Verification

After setup:

```bash
# Check logs for Sentry initialization
pm2 logs taxgeniuspro | grep -i sentry

# Should NOT see:
# "Missing secretKey" or "DSN not configured"
```

## Troubleshooting

### Common Issues

1. **"Missing DSN"**
   - Add `NEXT_PUBLIC_SENTRY_DSN` to `.env.local`
   - Copy to `.next/standalone/.env.local`
   - Rebuild: `npm run build`

2. **Errors not appearing in Sentry**
   - Check DSN is correct
   - Verify internet connection from server
   - Check Sentry project settings

3. **Too many errors (exceeding quota)**
   - Lower `tracesSampleRate` to 0.1
   - Add error filtering in Sentry dashboard
   - Consider upgrading plan

## Integration with CI/CD

When you deploy, Sentry can track releases:

```bash
# During deployment
npx @sentry/cli releases new $GIT_SHA
npx @sentry/cli releases set-commits $GIT_SHA --auto
npx @sentry/cli releases finalize $GIT_SHA
```

This helps track which deploy introduced which bugs.

## Need Help?

1. Sentry Docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
2. Check logs: `pm2 logs taxgeniuspro --err`
3. Test DSN: `npx @sentry/cli info`

---

**Priority Level**: High (for production)
**Impact**: Error visibility & debugging
**Estimated Time**: 5 minutes
**Required**: Highly recommended
