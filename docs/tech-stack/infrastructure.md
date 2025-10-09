# Infrastructure

**Parent:** [Tech Stack](./README.md)
**Last Updated:** October 9, 2025

---

## Overview

The Tax Genius platform is hosted on a self-managed VPS with Nginx reverse proxy, PM2 process management, and automated SSL certificate management via Let's Encrypt.

---

## Hosting Architecture

### Server Details

| Component | Technology | Status | Details |
|-----------|-----------|--------|---------|
| **Hosting** | Self-hosted VPS | ✅ Active | 72.60.28.175:3005 |
| **Process Manager** | PM2 | ✅ Active | Process monitoring, restart |
| **Reverse Proxy** | Nginx | ✅ Active | SSL termination, routing |
| **SSL** | Let's Encrypt | ✅ Active | Auto-renewal via certbot |
| **DNS** | Cloudflare | ✅ Active | DNS management |

**Server Specifications:**
- **IP Address:** 72.60.28.175
- **OS:** Ubuntu 22.04 LTS
- **RAM:** 16GB+
- **CPU:** 8 cores
- **Storage:** 500GB+ SSD
- **Application Port:** 3005 (dedicated)
- **Network:** 1Gbps uplink

---

## VPS Setup

### Initial Server Configuration

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl git build-essential

# Install Node.js (v20 LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # v20.x.x
npm --version   # 10.x.x

# Install PM2 globally
sudo npm install -g pm2

# Configure firewall
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 3005  # Application (optional, for direct access)
sudo ufw enable
```

---

## PM2 Process Management

### PM2 Configuration

Create PM2 ecosystem file:

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'taxgeniuspro',
      script: 'npm',
      args: 'start',
      cwd: '/root/websites/taxgeniuspro',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3005,
      },
      error_file: '/var/log/pm2/taxgeniuspro-error.log',
      out_file: '/var/log/pm2/taxgeniuspro-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
```

### PM2 Commands

```bash
# Start application
pm2 start ecosystem.config.js

# View status
pm2 status

# View logs
pm2 logs taxgeniuspro

# View logs (follow)
pm2 logs taxgeniuspro --lines 100

# Restart application
pm2 restart taxgeniuspro

# Stop application
pm2 stop taxgeniuspro

# Delete application
pm2 delete taxgeniuspro

# Monitor resources
pm2 monit

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command
```

### PM2 Log Management

```bash
# Create log directory
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Setup log rotation
pm2 install pm2-logrotate

# Configure log rotation (keep 30 days of logs)
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

---

## Nginx Reverse Proxy

### Nginx Installation

```bash
# Install Nginx
sudo apt install -y nginx

# Enable Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Check status
sudo systemctl status nginx
```

### Nginx Configuration

Create site configuration:

```bash
sudo nano /etc/nginx/sites-available/taxgeniuspro
```

```nginx
# HTTP - Redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name taxgeniuspro.tax www.taxgeniuspro.tax;

    return 301 https://$server_name$request_uri;
}

# HTTPS - Main application
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name taxgeniuspro.tax www.taxgeniuspro.tax;

    # SSL Configuration (managed by certbot)
    ssl_certificate /etc/letsencrypt/live/taxgeniuspro.tax/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/taxgeniuspro.tax/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Client body size (for file uploads)
    client_max_body_size 100M;

    # Timeouts
    proxy_connect_timeout 600;
    proxy_send_timeout 600;
    proxy_read_timeout 600;
    send_timeout 600;

    # Proxy settings
    location / {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Next.js static files
    location /_next/static {
        proxy_pass http://localhost:3005;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    # Public static files
    location /public {
        proxy_pass http://localhost:3005;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Access and error logs
    access_log /var/log/nginx/taxgeniuspro_access.log;
    error_log /var/log/nginx/taxgeniuspro_error.log;
}
```

**Enable the site:**
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/taxgeniuspro /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Rate Limiting

Add rate limiting to protect against DDoS:

```nginx
# Add to http block in /etc/nginx/nginx.conf
http {
    # Define rate limit zones
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;

    # Include other configs
    include /etc/nginx/sites-enabled/*;
}
```

**Apply rate limits in site config:**
```nginx
# General pages
location / {
    limit_req zone=general burst=20 nodelay;
    proxy_pass http://localhost:3005;
}

# API routes
location /api/ {
    limit_req zone=api burst=50 nodelay;
    proxy_pass http://localhost:3005;
}

# Authentication routes
location /auth/ {
    limit_req zone=auth burst=10 nodelay;
    proxy_pass http://localhost:3005;
}
```

---

## SSL/TLS Configuration

### Let's Encrypt Setup

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d taxgeniuspro.tax -d www.taxgeniuspro.tax

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose redirect option (2)

# Verify auto-renewal
sudo certbot renew --dry-run

# Check certificate expiry
sudo certbot certificates
```

### Automatic Renewal

Certbot automatically adds a renewal cron job. Verify:

```bash
# Check cron job
sudo systemctl list-timers | grep certbot

# Manually test renewal
sudo certbot renew --dry-run

# Force renewal (if needed)
sudo certbot renew --force-renewal
```

### SSL Best Practices

```nginx
# Strong SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
ssl_prefer_server_ciphers off;

# OCSP stapling
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/letsencrypt/live/taxgeniuspro.tax/chain.pem;

# DNS resolver
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

Create deployment workflow:

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
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY }}

      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /root/websites/taxgeniuspro
            git pull origin main
            npm ci
            npm run build
            npx prisma migrate deploy
            pm2 restart taxgeniuspro
            pm2 save

      - name: Verify deployment
        run: |
          sleep 10
          curl -f https://taxgeniuspro.tax || exit 1

      - name: Notify on failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployment failed!'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### GitHub Secrets

Add the following secrets to your GitHub repository:

```
VPS_HOST=72.60.28.175
VPS_USERNAME=root
VPS_SSH_KEY=<your_ssh_private_key>
DATABASE_URL=<your_database_url>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<clerk_key>
SLACK_WEBHOOK=<slack_webhook_url>
```

### Manual Deployment

```bash
# SSH into VPS
ssh root@72.60.28.175

# Navigate to project directory
cd /root/websites/taxgeniuspro

# Pull latest changes
git pull origin main

# Install dependencies
npm ci

# Run database migrations
npx prisma migrate deploy

# Build application
npm run build

# Restart PM2
pm2 restart taxgeniuspro

# Check logs
pm2 logs taxgeniuspro --lines 50
```

---

## Database Hosting

### PostgreSQL Setup

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Create database and user
sudo -u postgres psql

CREATE DATABASE taxgeniuspro;
CREATE USER taxgeniususer WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE taxgeniuspro TO taxgeniususer;
\q

# Configure PostgreSQL for local connections
sudo nano /etc/postgresql/14/main/pg_hba.conf
# Add: local   all   taxgeniususer   md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Redis Setup

```bash
# Install Redis
sudo apt install -y redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: supervised systemd
# Set: maxmemory 256mb
# Set: maxmemory-policy allkeys-lru

# Restart Redis
sudo systemctl enable redis-server
sudo systemctl restart redis-server

# Test Redis
redis-cli ping  # Should return PONG
```

---

## Monitoring & Logging

### System Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Monitor system resources
htop

# Monitor disk I/O
sudo iotop

# Monitor network usage
sudo nethogs
```

### Application Logs

```bash
# View application logs
pm2 logs taxgeniuspro

# View Nginx access logs
sudo tail -f /var/log/nginx/taxgeniuspro_access.log

# View Nginx error logs
sudo tail -f /var/log/nginx/taxgeniuspro_error.log

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# View system logs
sudo journalctl -u nginx -f
sudo journalctl -u postgresql -f
```

### Log Rotation

Nginx logs are automatically rotated. Configure PM2 log rotation:

```bash
# Install PM2 log rotate
pm2 install pm2-logrotate

# Configure
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
```

---

## Backup Strategy

### Automated Backups

Create backup script:

```bash
#!/bin/bash
# /usr/local/bin/backup-taxgeniuspro.sh

BACKUP_DIR="/mnt/backups/taxgeniuspro"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR/$DATE"

# Backup database
pg_dump -U taxgeniususer taxgeniuspro | gzip > "$BACKUP_DIR/$DATE/database.sql.gz"

# Backup uploads (if any)
tar -czf "$BACKUP_DIR/$DATE/uploads.tar.gz" /root/websites/taxgeniuspro/public/uploads

# Backup environment files
cp /root/websites/taxgeniuspro/.env.production "$BACKUP_DIR/$DATE/.env.production"

# Remove backups older than 30 days
find "$BACKUP_DIR" -type d -mtime +30 -exec rm -rf {} \;

echo "Backup completed: $DATE"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-taxgeniuspro.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
0 2 * * * /usr/local/bin/backup-taxgeniuspro.sh >> /var/log/backup.log 2>&1
```

---

## Security Hardening

### SSH Security

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Recommended settings:
PermitRootLogin prohibit-password
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
X11Forwarding no

# Restart SSH
sudo systemctl restart sshd
```

### Fail2Ban

```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Configure Fail2Ban
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[nginx-http-auth]
enabled = true

[nginx-noscript]
enabled = true

[nginx-badbots]
enabled = true
```

```bash
# Restart Fail2Ban
sudo systemctl enable fail2ban
sudo systemctl restart fail2ban

# Check status
sudo fail2ban-client status
```

---

## Deployment Checklist

- [ ] VPS provisioned and configured
- [ ] Node.js 20 LTS installed
- [ ] PM2 installed and configured
- [ ] Nginx installed and configured
- [ ] SSL certificate obtained and configured
- [ ] Firewall (UFW) configured
- [ ] PostgreSQL installed and configured
- [ ] Redis installed and configured
- [ ] Application deployed and running
- [ ] PM2 startup script configured
- [ ] Backups configured and tested
- [ ] Monitoring tools installed
- [ ] Security hardening completed
- [ ] CI/CD pipeline configured
- [ ] DNS records configured
- [ ] SSL auto-renewal tested

---

## Related Documentation

- [Tech Stack Overview](./README.md)
- [Authentication Setup](./authentication.md)
- [Storage Configuration](./storage.md)
- [Development Workflow](./development.md)

---

**Document Status:** ✅ Active
