# Migration 2: AWS S3/R2 → MinIO

**Status:** ⏳ PENDING
**Complexity:** 🟡 Medium
**Duration:** 2-3 days
**Risk:** Medium (requires data migration)

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [MinIO Installation](#minio-installation)
4. [Nginx Configuration](#nginx-configuration)
5. [Bucket Setup](#bucket-setup)
6. [Application Configuration](#application-configuration)
7. [Data Migration](#data-migration)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Rollback Procedure](#rollback-procedure)
11. [Post-Migration](#post-migration)

---

## Overview

### Why MinIO?

- **Self-hosted:** Full control over data and costs
- **S3-compatible:** Same API as AWS S3/Cloudflare R2
- **Cost-effective:** No egress fees, no storage fees
- **Performance:** Local storage on VPS is faster
- **Privacy:** Tax documents stay on our infrastructure

### What's Being Migrated

**Current State:**
- AWS S3 or Cloudflare R2 for object storage
- External dependencies
- Monthly storage costs

**Target State:**
- MinIO running on VPS (72.60.28.175)
- Self-hosted object storage
- No external dependencies for file storage

### Migration Scope

**Buckets to Migrate:**
1. `tax-documents` - Client tax documents (private)
2. `profile-images` - User profile pictures (public)
3. `marketing-assets` - Marketing materials (public, optional)

---

## Prerequisites

### System Requirements

```bash
# Check available disk space
df -h /mnt
# Requirement: At least 50GB free for MinIO data

# Check Docker is installed
docker --version
# Requirement: Docker 20.10 or higher

# Check available memory
free -h
# Requirement: At least 2GB RAM available
```

### Access Requirements

- Root SSH access to VPS: `root@72.60.28.175`
- Nginx installed and configured
- SSL certificate for domain (Let's Encrypt)
- DNS access to create subdomains

---

## MinIO Installation

### Step 1: Create Data Directory

```bash
# SSH to VPS
ssh root@72.60.28.175

# Create MinIO data directory
mkdir -p /mnt/minio/data

# Set permissions
chmod 755 /mnt/minio
chmod 755 /mnt/minio/data
```

### Step 2: Generate Secure Credentials

```bash
# Generate secure password for MinIO
openssl rand -base64 32
# Save output as MINIO_ROOT_PASSWORD
```

### Step 3: Run MinIO Container

```bash
# Run MinIO with Docker
docker run -d \
  --name minio \
  -p 9000:9000 \
  -p 9001:9001 \
  -v /mnt/minio/data:/data \
  -e "MINIO_ROOT_USER=admin" \
  -e "MINIO_ROOT_PASSWORD=<PASTE_GENERATED_PASSWORD>" \
  --restart always \
  minio/minio server /data --console-address ":9001"
```

### Step 4: Verify MinIO is Running

```bash
# Check Docker container
docker ps | grep minio
# Should show: minio container running

# Check health endpoint
curl http://localhost:9000/minio/health/live
# Should return: HTTP 200 OK

# View logs
docker logs minio
# Should show: MinIO started successfully
```

---

## Nginx Configuration

### Step 1: Create DNS Records

Add these A records to your DNS:

```
Type    Name                         Value           TTL
A       storage.taxgeniuspro.tax     72.60.28.175    300
A       minio-console.taxgeniuspro.tax 72.60.28.175  300
```

Wait 5-10 minutes for DNS propagation.

### Step 2: Configure Nginx

**File:** `/etc/nginx/sites-available/taxgeniuspro.tax`

Add these server blocks:

```nginx
# MinIO API (S3-compatible)
server {
    listen 443 ssl http2;
    server_name storage.taxgeniuspro.tax;

    ssl_certificate /etc/letsencrypt/live/taxgeniuspro.tax/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/taxgeniuspro.tax/privkey.pem;

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";

    location / {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # MinIO specific settings
        proxy_buffering off;
        proxy_request_buffering off;
        client_max_body_size 100M;

        # Timeouts for large uploads
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
    }
}

# MinIO Web Console
server {
    listen 443 ssl http2;
    server_name minio-console.taxgeniuspro.tax;

    ssl_certificate /etc/letsencrypt/live/taxgeniuspro.tax/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/taxgeniuspro.tax/privkey.pem;

    location / {
        proxy_pass http://localhost:9001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support for console
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_buffering off;
    }
}
```

### Step 3: Test and Reload Nginx

```bash
# Test configuration
nginx -t
# Should show: syntax is ok

# Reload Nginx
systemctl reload nginx

# Check status
systemctl status nginx
```

### Step 4: Get SSL Certificates

```bash
# Request certificates for MinIO subdomains
certbot --nginx \
  -d storage.taxgeniuspro.tax \
  -d minio-console.taxgeniuspro.tax

# Verify certificates
certbot certificates | grep taxgeniuspro.tax
```

### Step 5: Verify External Access

```bash
# Test from local machine
curl https://storage.taxgeniuspro.tax/minio/health/live
# Should return: HTTP 200 OK

# Access web console
# Open: https://minio-console.taxgeniuspro.tax
# Login: admin / <MINIO_ROOT_PASSWORD>
```

---

## Bucket Setup

### Step 1: Install MinIO Client

```bash
# Download MinIO client
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
mv mc /usr/local/bin/

# Verify installation
mc --version
```

### Step 2: Configure MinIO Alias

```bash
# Add local MinIO server
mc alias set local http://localhost:9000 admin <MINIO_ROOT_PASSWORD>

# Test connection
mc admin info local
# Should show: MinIO server info
```

### Step 3: Create Buckets

```bash
# Create tax-documents bucket (private)
mc mb local/tax-documents
mc ls local/tax-documents

# Create profile-images bucket (public read)
mc mb local/profile-images
mc anonymous set download local/profile-images

# Create marketing-assets bucket (public read, optional)
mc mb local/marketing-assets
mc anonymous set download local/marketing-assets

# List all buckets
mc ls local
```

### Step 4: Set Bucket Policies

**For private buckets (tax-documents):**
```bash
# Default policy is private - no action needed
mc stat local/tax-documents
```

**For public buckets (profile-images):**
```bash
# Allow public downloads
mc anonymous set download local/profile-images

# Verify policy
mc anonymous get local/profile-images
# Should show: download
```

---

## Application Configuration

### Step 1: Update Environment Variables

**File:** `/root/websites/taxgeniuspro/.env.local`

```bash
# MinIO Configuration
MINIO_ENDPOINT="https://storage.taxgeniuspro.tax"
MINIO_PORT="443"
MINIO_USE_SSL="true"
MINIO_ACCESS_KEY="admin"
MINIO_SECRET_KEY="<MINIO_ROOT_PASSWORD>"
MINIO_BUCKET_DOCUMENTS="tax-documents"
MINIO_BUCKET_IMAGES="profile-images"
MINIO_BUCKET_MARKETING="marketing-assets"

# Keep old R2 config for migration script
R2_ENDPOINT="https://xxxxx.r2.cloudflarestorage.com"
R2_ACCESS_KEY="xxxxx"
R2_SECRET_KEY="xxxxx"
```

### Step 2: Update Storage Service

**File:** `src/lib/storage.ts`

```typescript
import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';

// MinIO client (S3-compatible)
const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT!,
  region: 'us-east-1', // MinIO doesn't use regions, but SDK requires it
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true, // CRITICAL for MinIO!
});

/**
 * Generate presigned URL for file upload
 */
export async function generateUploadUrl(
  bucket: string,
  key: string,
  expiresIn: number = 600 // 10 minutes
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Generate presigned URL for file download
 */
export async function generateDownloadUrl(
  bucket: string,
  key: string,
  expiresIn: number = 3600 // 1 hour
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Delete file from bucket
 */
export async function deleteFile(
  bucket: string,
  key: string
): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Get public URL for file (public buckets only)
 */
export function getPublicUrl(bucket: string, key: string): string {
  return `${process.env.MINIO_ENDPOINT}/${bucket}/${key}`;
}
```

---

## Data Migration

### Step 1: Create Migration Script

**File:** `scripts/migrate-storage.ts`

```typescript
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

// Old R2 client
const r2Client = new S3Client({
  endpoint: process.env.R2_ENDPOINT!,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
});

// New MinIO client
const minioClient = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT!,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,
});

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

async function migrateBucket(bucketName: string) {
  console.log(`\n📦 Migrating bucket: ${bucketName}`);
  console.log('─'.repeat(50));

  // List all objects in R2
  const listCommand = new ListObjectsV2Command({ Bucket: bucketName });
  const { Contents } = await r2Client.send(listCommand);

  if (!Contents || Contents.length === 0) {
    console.log(`  ⚠️  No files found in ${bucketName}`);
    return;
  }

  console.log(`  Found ${Contents.length} files to migrate`);

  let migrated = 0;
  let failed = 0;

  for (const object of Contents) {
    const key = object.Key!;
    try {
      // Download from R2
      const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      const { Body, ContentType } = await r2Client.send(getCommand);

      if (!Body) {
        throw new Error('Empty file body');
      }

      // Convert stream to buffer
      const bodyBuffer = await streamToBuffer(Body as Readable);

      // Upload to MinIO
      const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: bodyBuffer,
        ContentType,
      });
      await minioClient.send(putCommand);

      migrated++;
      console.log(`  ✅ ${key} (${object.Size} bytes)`);
    } catch (error) {
      failed++;
      console.error(`  ❌ ${key}: ${error.message}`);
    }
  }

  console.log(`\n  Summary: ${migrated} succeeded, ${failed} failed`);
}

async function migrateAll() {
  console.log('\n🚀 Starting storage migration...\n');

  const buckets = [
    'tax-documents',
    'profile-images',
    'marketing-assets',
  ];

  for (const bucket of buckets) {
    try {
      await migrateBucket(bucket);
    } catch (error) {
      console.error(`\n❌ Failed to migrate ${bucket}:`, error);
    }
  }

  console.log('\n✅ Migration complete!\n');
}

migrateAll().catch(console.error);
```

### Step 2: Run Migration

```bash
# Dry run first (test with one bucket)
# Edit script to only include one bucket
npm run tsx scripts/migrate-storage.ts

# If successful, run full migration
npm run tsx scripts/migrate-storage.ts

# Monitor progress
# Large files may take time
```

### Step 3: Verify Migration

```bash
# List files in MinIO
mc ls local/tax-documents --recursive | wc -l
mc ls local/profile-images --recursive | wc -l

# Compare with source bucket count
# Should match original counts

# Check file sizes
mc du local/tax-documents
mc du local/profile-images
```

### Step 4: Spot-Check Files

```bash
# Download a sample file from MinIO
mc cp local/tax-documents/sample.pdf /tmp/sample.pdf

# Verify it opens correctly
file /tmp/sample.pdf
# Should show: PDF document

# Test presigned URLs work
# Use application to generate download URL
# Verify file downloads in browser
```

---

## Testing

### Testing Checklist

**Basic Operations:**
- [ ] Upload new file to MinIO
- [ ] Download file from MinIO
- [ ] Delete file from MinIO
- [ ] Generate presigned upload URL
- [ ] Generate presigned download URL
- [ ] Presigned URLs expire correctly

**Public Buckets:**
- [ ] Profile images accessible without auth
- [ ] Public URLs work in browser
- [ ] Image displays on user profile

**Private Buckets:**
- [ ] Tax documents require auth
- [ ] Presigned URLs work
- [ ] Unauthorized access blocked

**Large Files:**
- [ ] Upload file > 10MB
- [ ] Upload file > 50MB (if applicable)
- [ ] Download large file
- [ ] No timeout errors

**Error Handling:**
- [ ] Handle invalid bucket name
- [ ] Handle missing file
- [ ] Handle network errors
- [ ] Proper error messages

### Performance Testing

```bash
# Test upload speed
time mc cp /path/to/large-file.pdf local/tax-documents/test.pdf

# Test download speed
time mc cp local/tax-documents/test.pdf /tmp/test.pdf

# Compare with previous R2 speeds
```

---

## Deployment

### Deployment Checklist

- [ ] MinIO running and healthy
- [ ] Nginx configured and SSL working
- [ ] Buckets created with correct policies
- [ ] All files migrated and verified
- [ ] Application code updated
- [ ] Environment variables set
- [ ] Application rebuilt
- [ ] Application restarted
- [ ] End-to-end testing passed
- [ ] Monitoring setup

### Deployment Steps

```bash
# 1. SSH to production
ssh root@72.60.28.175

# 2. Navigate to project
cd /root/websites/taxgeniuspro

# 3. Pull latest code
git pull origin main

# 4. Install dependencies
npm install

# 5. Build application
npm run build

# 6. Restart application
pm2 restart taxgeniuspro

# 7. Monitor logs
pm2 logs taxgeniuspro --lines 50

# 8. Test file operations
# - Upload test file
# - Download test file
# - Verify in MinIO console
```

### Post-Deployment Monitoring

**First Hour:**
- Monitor application logs every 10 minutes
- Check MinIO container logs: `docker logs minio -f`
- Verify no storage errors in application

**First Day:**
- Check logs every hour
- Monitor disk usage: `df -h /mnt/minio/data`
- Verify all file operations work

**First Week:**
- Daily monitoring
- Check MinIO metrics in console
- Verify no data loss

---

## Rollback Procedure

### Emergency Rollback to R2

```bash
# 1. SSH to production
ssh root@72.60.28.175
cd /root/websites/taxgeniuspro

# 2. Revert storage.ts changes
git checkout HEAD~1 -- src/lib/storage.ts

# 3. Update environment variables
nano .env.local
# Comment out MinIO vars
# Uncomment R2 vars

# 4. Rebuild application
npm run build

# 5. Restart application
pm2 restart taxgeniuspro

# 6. Verify R2 works
pm2 logs taxgeniuspro | grep storage
```

### Rollback Impact

- **Data Loss:** None (files remain in both locations)
- **Downtime:** ~2 minutes during restart
- **User Impact:** Brief file access interruption

### When to Rollback

Rollback if:
- File uploads failing consistently
- File downloads timing out
- Data corruption detected
- MinIO container keeps crashing
- Severe performance degradation

---

## Post-Migration

### Monitoring Setup

```bash
# Monitor MinIO disk usage
watch -n 60 'df -h /mnt/minio/data'

# Monitor MinIO container health
watch -n 30 'docker ps | grep minio'

# Set up disk space alert (optional)
# Add cron job to check disk usage
```

### Cleanup (After 2 Weeks)

Once MinIO is confirmed stable:

```bash
# 1. Remove R2 environment variables
nano .env.local
# Delete R2_* variables

# 2. Cancel R2 subscription (if paid)
# Log into Cloudflare dashboard
# Cancel R2 service

# 3. Document in architecture docs
# Migration now complete - architecture docs already updated
```

### Cost Savings

**Before (R2):**
- Storage: ~$0.015/GB/month
- Egress: $0.00/GB (free tier)
- Estimated monthly: $5-20

**After (MinIO):**
- Storage: Included in VPS cost
- Egress: Free (self-hosted)
- Monthly cost: $0

**Annual savings:** ~$60-240

---

## Troubleshooting

### MinIO Container Won't Start

**Symptoms:**
```bash
docker ps | grep minio
# No output
```

**Solution:**
```bash
# Check logs
docker logs minio

# Common issues:
# 1. Port conflict
sudo lsof -i :9000
sudo lsof -i :9001

# 2. Permission issues
sudo chown -R 1000:1000 /mnt/minio/data

# 3. Restart container
docker restart minio
```

### Upload Fails with 413 Error

**Symptom:** "413 Request Entity Too Large"

**Solution:**
```nginx
# Increase client_max_body_size in Nginx
# File: /etc/nginx/sites-available/taxgeniuspro.tax
client_max_body_size 200M;

# Reload Nginx
nginx -t
systemctl reload nginx
```

### Presigned URLs Not Working

**Symptom:** URLs return 403 Forbidden

**Causes:**
1. Wrong bucket policy
2. Expired URL
3. Incorrect signature

**Solution:**
```bash
# Check bucket policy
mc anonymous get local/tax-documents

# Verify credentials in .env.local
echo $MINIO_ACCESS_KEY
echo $MINIO_SECRET_KEY

# Check forcePathStyle is true in storage.ts
grep forcePathStyle src/lib/storage.ts
```

### Slow Upload/Download Speeds

**Symptom:** File operations taking > 30 seconds

**Causes:**
1. Nginx buffering
2. Network issues
3. Disk I/O bottleneck

**Solution:**
```bash
# Check disk I/O
iostat -x 1

# Check network speed
speedtest-cli

# Optimize Nginx (already done in config above)
proxy_buffering off;
proxy_request_buffering off;
```

### Disk Space Running Low

**Symptom:** "No space left on device"

**Solution:**
```bash
# Check disk usage
df -h /mnt/minio/data

# Find large files
du -h /mnt/minio/data | sort -rh | head -20

# Clean up old files (if applicable)
mc rm --recursive --force local/temp-bucket

# Expand disk (if VPS allows)
# Contact VPS provider
```

---

## References

### Documentation
- [MinIO Docs](https://min.io/docs/minio/linux/index.html)
- [AWS S3 SDK Docs](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html)
- [Migration Overview](./README.md)

### Related Files
- `src/lib/storage.ts` - Storage service
- `scripts/migrate-storage.ts` - Migration script
- `/etc/nginx/sites-available/taxgeniuspro.tax` - Nginx config
- `.env.local` - Environment configuration

### External Resources
- MinIO Console: https://minio-console.taxgeniuspro.tax
- MinIO API: https://storage.taxgeniuspro.tax
- MinIO Client Guide: https://min.io/docs/minio/linux/reference/minio-mc.html

---

**Migration Status:** ⏳ Pending
**Previous Migration:** [Resend Email](./01-resend-email.md)
**Next Migration:** [Clerk Auth](./03-clerk-auth.md)
