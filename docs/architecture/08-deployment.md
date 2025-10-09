# Tax Genius Platform - Deployment Architecture

**Version:** 3.0 FINAL
**Date:** October 9, 2025
**Status:** Active - Single Source of Truth
**Part:** 8 of 11

[↑ Back to Architecture Index](./README.md)

---

## 11. Deployment Architecture

### 11.1 Production Deployment (PM2)

```bash
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'taxgeniuspro',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3005,
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }],
};

# Commands
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 11.2 Nginx Configuration

```nginx
# /etc/nginx/sites-available/taxgeniuspro.tax
server {
    listen 80;
    server_name taxgeniuspro.tax www.taxgeniuspro.tax;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name taxgeniuspro.tax www.taxgeniuspro.tax;

    ssl_certificate /etc/letsencrypt/live/taxgeniuspro.tax/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/taxgeniuspro.tax/privkey.pem;

    location / {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # MinIO access
    location /storage/ {
        proxy_pass http://localhost:9000/;
    }
}
```

---

## Deployment Process

### Initial Setup

```bash
#!/bin/bash
# scripts/deploy-initial.sh

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Clone repository
cd /root/websites
git clone https://github.com/yourusername/taxgeniuspro.git
cd taxgeniuspro

# Install dependencies
npm ci

# Build application
npm run build

# Setup database
npx prisma migrate deploy
npx prisma generate

# Configure PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
sudo cp nginx.conf /etc/nginx/sites-available/taxgeniuspro.tax
sudo ln -s /etc/nginx/sites-available/taxgeniuspro.tax /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL
sudo certbot --nginx -d taxgeniuspro.tax -d www.taxgeniuspro.tax

# Setup MinIO (if not already running)
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
sudo mv minio /usr/local/bin/
mkdir -p ~/minio/data

# Start MinIO
pm2 start minio -- server ~/minio/data --console-address ":9001"
pm2 save

echo "Deployment complete!"
```

### Continuous Deployment

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "Starting deployment..."

# Navigate to project directory
cd /root/websites/taxgeniuspro

# Pull latest changes
git pull origin main

# Install dependencies
npm ci

# Run database migrations
npx prisma migrate deploy
npx prisma generate

# Build application
npm run build

# Restart PM2 process
pm2 restart taxgeniuspro

# Wait for app to start
sleep 5

# Check if app is running
pm2 status taxgeniuspro

# Check health endpoint
curl -f http://localhost:3005/api/health || exit 1

echo "Deployment successful!"
```

---

## GitHub Actions CI/CD

### Automated Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build

      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /root/websites/taxgeniuspro
            git pull origin main
            npm ci
            npx prisma migrate deploy
            npx prisma generate
            npm run build
            pm2 restart taxgeniuspro
            curl -f http://localhost:3005/api/health

      - name: Notify deployment status
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Environment Configuration

### Production Environment Variables

```bash
# .env.production
# Database
DATABASE_URL="postgresql://taxgenius:secure_password@localhost:5432/taxgenius_prod"
REDIS_URL="redis://localhost:6379"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_xxxxx"
CLERK_SECRET_KEY="sk_live_xxxxx"
CLERK_WEBHOOK_SECRET="whsec_xxxxx"

# Email (Resend)
RESEND_API_KEY="re_xxxxx"
RESEND_WEBHOOK_SECRET="whsec_xxxxx"

# Storage (MinIO)
MINIO_ENDPOINT="http://localhost:9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="secure_secret_key"

# Payments (Square)
SQUARE_ACCESS_TOKEN="sq0atp-xxxxx"
SQUARE_LOCATION_ID="xxxxx"
SQUARE_WEBHOOK_SIGNATURE_KEY="xxxxx"

# AI (Gemini)
GEMINI_API_KEY="xxxxx"

# Encryption
ENCRYPTION_KEY="xxxxx" # 64-char hex string (generate with: openssl rand -hex 32)

# App Config
NEXT_PUBLIC_APP_URL="https://taxgeniuspro.tax"
NODE_ENV="production"
PORT="3005"
```

### Generate Encryption Key

```bash
# Generate a secure encryption key
openssl rand -hex 32
```

---

## Database Management

### Backup Strategy

```bash
#!/bin/bash
# scripts/backup-database.sh

BACKUP_DIR="/backups/postgresql"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/taxgenius_$TIMESTAMP.sql.gz"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create backup
pg_dump -U postgres taxgenius_prod | gzip > $BACKUP_FILE

# Upload to external storage (optional)
# aws s3 cp $BACKUP_FILE s3://backups/taxgenius/

# Remove old backups (keep last 30 days)
find $BACKUP_DIR -name "taxgenius_*.sql.gz" -mtime +30 -delete

echo "Database backup completed: $BACKUP_FILE"
```

### Restore Database

```bash
#!/bin/bash
# scripts/restore-database.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./restore-database.sh <backup_file>"
  exit 1
fi

# Stop application
pm2 stop taxgeniuspro

# Restore database
gunzip < $BACKUP_FILE | psql -U postgres taxgenius_prod

# Restart application
pm2 start taxgeniuspro

echo "Database restored from: $BACKUP_FILE"
```

---

## Monitoring & Health Checks

### PM2 Monitoring

```bash
# View application logs
pm2 logs taxgeniuspro

# Monitor resources
pm2 monit

# View process status
pm2 status

# Restart on failure
pm2 start ecosystem.config.js --watch
```

### Health Check Script

```bash
#!/bin/bash
# scripts/health-check.sh

HEALTH_URL="http://localhost:3005/api/health"
MAX_RETRIES=3
RETRY_DELAY=5

for i in $(seq 1 $MAX_RETRIES); do
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

  if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "Health check passed"
    exit 0
  else
    echo "Health check failed (attempt $i/$MAX_RETRIES)"
    sleep $RETRY_DELAY
  fi
done

echo "Health check failed after $MAX_RETRIES attempts"
pm2 restart taxgeniuspro
exit 1
```

---

## SSL Certificate Management

### Automatic Renewal

```bash
# Setup automatic SSL renewal
sudo certbot renew --dry-run

# Add to crontab for automatic renewal
sudo crontab -e

# Add this line:
0 3 * * * certbot renew --quiet --post-hook "systemctl reload nginx"
```

---

## Rollback Procedure

### Quick Rollback Script

```bash
#!/bin/bash
# scripts/rollback.sh

PREVIOUS_COMMIT=$1

if [ -z "$PREVIOUS_COMMIT" ]; then
  echo "Usage: ./rollback.sh <commit_hash>"
  exit 1
fi

cd /root/websites/taxgeniuspro

# Stop application
pm2 stop taxgeniuspro

# Rollback to previous commit
git reset --hard $PREVIOUS_COMMIT

# Install dependencies
npm ci

# Rollback database (if needed)
# npx prisma migrate resolve --rolled-back <migration_name>

# Build application
npm run build

# Restart application
pm2 start taxgeniuspro

# Verify health
sleep 5
curl -f http://localhost:3005/api/health

echo "Rollback completed to commit: $PREVIOUS_COMMIT"
```

---

## Appendix: Environment Variables

### Complete Environment Variable Template

```bash
# .env.local template

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/taxgenius"
REDIS_URL="redis://localhost:6379"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_xxxxx"
CLERK_SECRET_KEY="sk_live_xxxxx"
CLERK_WEBHOOK_SECRET="whsec_xxxxx"

# Email (Resend)
RESEND_API_KEY="re_xxxxx"

# Storage (MinIO)
MINIO_ENDPOINT="http://localhost:9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"

# Payments (Square)
SQUARE_ACCESS_TOKEN="sq0atp-xxxxx"
SQUARE_LOCATION_ID="xxxxx"
SQUARE_WEBHOOK_SIGNATURE_KEY="xxxxx"

# AI (Gemini)
GEMINI_API_KEY="xxxxx"

# Encryption
ENCRYPTION_KEY="xxxxx" # 64-char hex string

# App Config
NEXT_PUBLIC_APP_URL="https://taxgeniuspro.tax"
NODE_ENV="production"
PORT="3005"
```

### Deployment Checklist

- [ ] PostgreSQL database running and migrated
- [ ] Redis server running
- [ ] MinIO server running with buckets created
- [ ] Clerk application configured with webhooks
- [ ] Resend domain verified and API key obtained
- [ ] Square application configured with webhooks
- [ ] SSL certificates installed and auto-renewal configured
- [ ] PM2 configured and set to auto-start on boot
- [ ] Nginx configured and tested
- [ ] Environment variables set
- [ ] Database backups scheduled
- [ ] Monitoring and alerting configured

---

## Related Documentation

- [Overview](./01-overview.md) - System architecture
- [Security Architecture](./07-security.md) - Security configuration
- [Monitoring & Observability](./11-monitoring.md) - Application monitoring
- [Performance Optimization](./09-performance.md) - Performance tuning

---

**Navigation:**
[← Previous: Security Architecture](./07-security.md) | [Next: Performance Optimization →](./09-performance.md)

---

**Document Version:** 3.0 FINAL
**Last Updated:** October 9, 2025
**Next Review:** November 9, 2025
**Maintained By:** Development Team
