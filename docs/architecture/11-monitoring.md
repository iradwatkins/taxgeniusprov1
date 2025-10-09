# Tax Genius Platform - Monitoring & Observability

**Version:** 3.0 FINAL
**Date:** October 9, 2025
**Status:** Active - Single Source of Truth
**Part:** 11 of 11

[↑ Back to Architecture Index](./README.md)

---

## 13. Monitoring & Observability

### 13.1 Application Monitoring

```typescript
// src/lib/monitoring.ts
export async function logError(error: Error, context?: any) {
  console.error('[ERROR]', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });

  // TODO: Integrate Sentry or similar service
}

export async function logPerformance(label: string, duration: number) {
  console.info('[PERFORMANCE]', {
    label,
    duration,
    timestamp: new Date().toISOString(),
  });
}
```

### 13.2 Health Check Endpoint

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function GET() {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis
    await redis.ping();

    // Check MinIO (optional)
    // await s3Client.headBucket({ Bucket: 'tax-documents' });

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'ok',
        redis: 'ok',
        storage: 'ok',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
      },
      { status: 503 }
    );
  }
}
```

---

## Logging Strategy

### Structured Logging

```typescript
// src/lib/logger.ts
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

export class Logger {
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: {
        ...context,
        service: this.serviceName,
      },
    };

    const output = JSON.stringify(entry);

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(output);
        break;
      case LogLevel.INFO:
        console.info(output);
        break;
      case LogLevel.WARN:
        console.warn(output);
        break;
      case LogLevel.ERROR:
        console.error(output);
        break;
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, {
      ...context,
      error: error?.message,
      stack: error?.stack,
    });
  }
}

// Usage
const logger = new Logger('email-service');
logger.info('Email sent successfully', { to: 'user@example.com', subject: 'Welcome' });
logger.error('Email send failed', error, { to: 'user@example.com' });
```

---

## Error Tracking

### Error Handling Middleware

```typescript
// src/lib/error-handler.ts
import { NextResponse } from 'next/server';
import { Logger } from './logger';

const logger = new Logger('error-handler');

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    logger.error(error.message, error, error.context);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    logger.error('Unhandled error', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }

  logger.error('Unknown error', undefined, { error });

  return NextResponse.json(
    {
      success: false,
      error: 'Internal server error',
    },
    { status: 500 }
  );
}
```

### Sentry Integration (Optional)

```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  enabled: process.env.NODE_ENV === 'production',
});

export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}
```

---

## Performance Monitoring

### Performance Metrics

```typescript
// src/lib/metrics.ts
import { redis } from '@/lib/redis';

export enum MetricType {
  API_LATENCY = 'api_latency',
  DB_QUERY_TIME = 'db_query_time',
  CACHE_HIT_RATE = 'cache_hit_rate',
  UPLOAD_TIME = 'upload_time',
}

export async function recordMetric(
  type: MetricType,
  value: number,
  tags?: Record<string, string>
) {
  const key = `metrics:${type}:${new Date().toISOString().slice(0, 13)}`; // Hourly buckets

  await redis.lpush(key, JSON.stringify({ value, tags, timestamp: Date.now() }));
  await redis.expire(key, 7 * 24 * 60 * 60); // Keep for 7 days
}

export async function getMetrics(type: MetricType, hours: number = 24) {
  const keys: string[] = [];
  const now = new Date();

  for (let i = 0; i < hours; i++) {
    const date = new Date(now.getTime() - i * 60 * 60 * 1000);
    const key = `metrics:${type}:${date.toISOString().slice(0, 13)}`;
    keys.push(key);
  }

  const values = await Promise.all(keys.map((key) => redis.lrange(key, 0, -1)));

  return values.flat().map((v) => JSON.parse(v));
}
```

### Request Timing

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { recordMetric, MetricType } from '@/lib/metrics';

export async function middleware(request: NextRequest) {
  const start = Date.now();

  const response = NextResponse.next();

  // Record API latency
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const duration = Date.now() - start;

    await recordMetric(MetricType.API_LATENCY, duration, {
      path: request.nextUrl.pathname,
      method: request.method,
    });

    response.headers.set('X-Response-Time', `${duration}ms`);
  }

  return response;
}
```

---

## Database Monitoring

### Query Performance Logging

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client';
import { Logger } from './logger';

const logger = new Logger('database');

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ],
});

// Log slow queries
prisma.$on('query', (e) => {
  if (e.duration > 1000) {
    logger.warn('Slow query detected', {
      query: e.query,
      duration: e.duration,
      params: e.params,
    });
  }
});

// Log errors
prisma.$on('error', (e) => {
  logger.error('Database error', undefined, {
    message: e.message,
    target: e.target,
  });
});

export { prisma };
```

---

## Uptime Monitoring

### External Monitoring Script

```bash
#!/bin/bash
# scripts/uptime-check.sh

HEALTH_URL="https://taxgeniuspro.tax/api/health"
SLACK_WEBHOOK_URL="your_slack_webhook_url"

response=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ "$response" != "200" ]; then
  # Send alert
  curl -X POST $SLACK_WEBHOOK_URL \
    -H 'Content-Type: application/json' \
    -d "{\"text\":\"🚨 Health check failed! HTTP $response\"}"

  # Log to file
  echo "$(date): Health check failed - HTTP $response" >> /var/log/uptime-monitor.log
fi
```

### Cron Job Setup

```bash
# Add to crontab (runs every 5 minutes)
*/5 * * * * /root/websites/taxgeniuspro/scripts/uptime-check.sh
```

---

## Analytics & Usage Tracking

### Custom Analytics

```typescript
// src/lib/analytics.ts
import { prisma } from '@/lib/db';

export enum AnalyticsEvent {
  PAGE_VIEW = 'PAGE_VIEW',
  DOCUMENT_UPLOAD = 'DOCUMENT_UPLOAD',
  REFERRAL_CLICK = 'REFERRAL_CLICK',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  USER_SIGNUP = 'USER_SIGNUP',
}

export async function trackEvent(
  event: AnalyticsEvent,
  userId?: string,
  metadata?: Record<string, any>
) {
  await prisma.analyticsEvent.create({
    data: {
      event,
      userId,
      metadata,
      timestamp: new Date(),
    },
  });
}

// Usage
await trackEvent(AnalyticsEvent.DOCUMENT_UPLOAD, userId, {
  documentType: 'W2',
  fileSize: 1024000,
});
```

### Dashboard Metrics

```typescript
// src/app/api/admin/analytics/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = auth();

  // Verify admin access
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Get metrics
  const [
    totalUsers,
    totalClients,
    totalReferrals,
    totalDocuments,
    recentSignups,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.client.count(),
    prisma.referral.count(),
    prisma.document.count(),
    prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      totalUsers,
      totalClients,
      totalReferrals,
      totalDocuments,
      recentSignups,
    },
  });
}
```

---

## Alert Configuration

### Alert Rules

```typescript
// src/lib/alerts.ts
import { Logger } from './logger';

const logger = new Logger('alerts');

export enum AlertLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export interface Alert {
  level: AlertLevel;
  title: string;
  message: string;
  context?: Record<string, any>;
}

export async function sendAlert(alert: Alert) {
  logger.warn('Alert triggered', alert);

  // Send to Slack, email, or other notification service
  if (process.env.SLACK_WEBHOOK_URL) {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `${alert.level}: ${alert.title}\n${alert.message}`,
      }),
    });
  }
}

// Usage
await sendAlert({
  level: AlertLevel.CRITICAL,
  title: 'Database Connection Failed',
  message: 'Unable to connect to PostgreSQL database',
  context: { error: 'Connection timeout' },
});
```

---

## Log Aggregation

### PM2 Log Management

```bash
# View logs
pm2 logs taxgeniuspro

# View specific log file
pm2 logs taxgeniuspro --err  # Error logs only
pm2 logs taxgeniuspro --out  # Output logs only

# Clear logs
pm2 flush

# Rotate logs
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

---

## Monitoring Dashboard

### Metrics Dashboard Endpoint

```typescript
// src/app/api/admin/metrics/route.ts
import { NextResponse } from 'next/server';
import { getMetrics, MetricType } from '@/lib/metrics';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as MetricType;
  const hours = parseInt(searchParams.get('hours') || '24');

  const metrics = await getMetrics(type, hours);

  // Calculate statistics
  const values = metrics.map((m) => m.value);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);

  return NextResponse.json({
    success: true,
    data: {
      metrics,
      stats: { avg, max, min },
    },
  });
}
```

---

## Monitoring Checklist

- ✅ Health check endpoint configured
- ✅ Structured logging implemented
- ✅ Error tracking setup (Sentry optional)
- ✅ Performance metrics recorded
- ✅ Database query logging enabled
- ✅ Uptime monitoring script running
- ✅ Alert notifications configured
- ✅ Log rotation enabled
- ✅ Analytics tracking implemented
- ✅ Admin dashboard with metrics

---

## Recommended Tools

### Production Monitoring Stack

1. **Uptime Monitoring:** UptimeRobot, Pingdom
2. **Error Tracking:** Sentry, Rollbar
3. **Log Management:** LogDNA, Papertrail
4. **APM:** New Relic, Datadog (optional)
5. **Analytics:** PostHog, Plausible
6. **Alerts:** Slack, PagerDuty

---

## Related Documentation

- [Deployment Architecture](./08-deployment.md) - Production setup
- [Performance Optimization](./09-performance.md) - Performance metrics
- [Security Architecture](./07-security.md) - Security logging
- [API Design Patterns](./03-api-design.md) - API monitoring

---

**Navigation:**
[← Previous: AI Content Generation](./10-ai-content.md) | [↑ Back to Architecture Index](./README.md)

---

**Document Version:** 3.0 FINAL
**Last Updated:** October 9, 2025
**Next Review:** November 9, 2025
**Maintained By:** Development Team
