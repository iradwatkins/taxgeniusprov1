# Storage

**Parent:** [Tech Stack](./README.md)
**Last Updated:** October 9, 2025

---

## Overview

The Tax Genius platform uses MinIO for self-hosted S3-compatible object storage, replacing Cloudflare R2. This provides better cost control, data sovereignty, and no egress fees.

---

## Storage Stack

### MinIO

| Technology | Version | Status | Purpose |
|------------|---------|--------|---------|
| **MinIO** | Latest | 🔄 Setting up | S3-compatible object storage |
| **@aws-sdk/client-s3** | 3.888.0+ | ✅ Active | S3 client (works with MinIO) |
| **@aws-sdk/s3-request-presigner** | 3.888.0+ | ✅ Active | Presigned URLs |
| **Cloudflare R2** | N/A | ⚠️ Deprecated | Being replaced by MinIO |

**Key Features:**
- ✅ S3-compatible API
- ✅ Self-hosted (data sovereignty)
- ✅ No egress fees
- ✅ High performance
- ✅ Multi-tenancy support
- ✅ Built-in encryption
- ✅ Versioning support
- ✅ Web console included

---

## MinIO Setup

### Installation on VPS

```bash
# Download MinIO server
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
sudo mv minio /usr/local/bin/

# Create MinIO user
sudo useradd -r minio-user -s /sbin/nologin

# Create data directory
sudo mkdir -p /mnt/data/minio
sudo chown minio-user:minio-user /mnt/data/minio

# Create MinIO systemd service
sudo nano /etc/systemd/system/minio.service
```

**MinIO systemd service:**
```ini
[Unit]
Description=MinIO
Documentation=https://docs.min.io
Wants=network-online.target
After=network-online.target
AssertFileIsExecutable=/usr/local/bin/minio

[Service]
WorkingDirectory=/usr/local/

User=minio-user
Group=minio-user

EnvironmentFile=/etc/default/minio
ExecStartPre=/bin/bash -c "if [ -z \"${MINIO_VOLUMES}\" ]; then echo \"Variable MINIO_VOLUMES not set in /etc/default/minio\"; exit 1; fi"
ExecStart=/usr/local/bin/minio server $MINIO_OPTS $MINIO_VOLUMES

# Let systemd restart this service always
Restart=always

# Specifies the maximum file descriptor number that can be opened by this process
LimitNOFILE=65536

# Specifies the maximum number of threads this process can create
TasksMax=infinity

# Disable timeout logic and wait until process is stopped
TimeoutStopSec=infinity
SendSIGKILL=no

[Install]
WantedBy=multi-user.target
```

**MinIO environment configuration:**
```bash
# Create environment file
sudo nano /etc/default/minio
```

```env
# Volume to be used for MinIO server.
MINIO_VOLUMES="/mnt/data/minio"

# Use if you want to run MinIO on a custom port.
MINIO_OPTS="--console-address :9001"

# Root user for the server.
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=your_secure_password_here

# Set to enable MinIO to use HTTPS
# MINIO_OPTS="--certs-dir /etc/minio/certs"
```

**Start MinIO:**
```bash
# Enable and start MinIO service
sudo systemctl enable minio
sudo systemctl start minio

# Check status
sudo systemctl status minio

# View logs
sudo journalctl -u minio -f
```

**Access MinIO Console:**
- Console: `http://72.60.28.175:9001`
- API: `http://72.60.28.175:9000`

---

## Nginx Reverse Proxy

Configure Nginx to proxy MinIO through your domain:

```nginx
# MinIO API
server {
    listen 80;
    server_name storage.taxgeniuspro.tax;

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
    }
}

# MinIO Console
server {
    listen 80;
    server_name console.storage.taxgeniuspro.tax;

    location / {
        proxy_pass http://localhost:9001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support for console
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

**Enable SSL with Let's Encrypt:**
```bash
sudo certbot --nginx -d storage.taxgeniuspro.tax
sudo certbot --nginx -d console.storage.taxgeniuspro.tax
```

---

## Bucket Structure

### Buckets

Create the following buckets in MinIO:

1. **tax-documents**
   - Purpose: Client tax documents, W-2s, 1099s, etc.
   - Access: Private
   - Versioning: Enabled
   - Retention: 7 years (IRS requirement)
   - Lifecycle: Archive after 3 years

2. **profile-images**
   - Purpose: User profile photos
   - Access: Public read, private write
   - Versioning: Disabled
   - Lifecycle: Delete after 90 days of inactivity

3. **marketing-assets**
   - Purpose: Marketing materials, landing page images
   - Access: Public read
   - Versioning: Enabled
   - CDN: Enabled

**Create buckets via MinIO Console or CLI:**

```bash
# Install MinIO client
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/

# Configure MinIO client
mc alias set myminio http://localhost:9000 minioadmin your_password

# Create buckets
mc mb myminio/tax-documents
mc mb myminio/profile-images
mc mb myminio/marketing-assets

# Set bucket policies
mc policy set private myminio/tax-documents
mc policy set download myminio/profile-images
mc policy set download myminio/marketing-assets

# Enable versioning
mc version enable myminio/tax-documents
mc version enable myminio/marketing-assets
```

---

## S3 Client Configuration

### AWS SDK with MinIO

The AWS SDK for JavaScript v3 works seamlessly with MinIO:

```typescript
// lib/storage.ts
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT, // http://storage.taxgeniuspro.tax
  region: 'us-east-1', // MinIO doesn't use regions, but SDK requires it
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true, // Required for MinIO
});

export { s3Client };
```

**Environment Variables:**
```env
MINIO_ENDPOINT=https://storage.taxgeniuspro.tax
MINIO_ACCESS_KEY=your_access_key
MINIO_SECRET_KEY=your_secret_key
```

---

## File Upload

### Server-Side Upload

```typescript
// lib/storage/upload.ts
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './client';
import { randomUUID } from 'node:crypto';

export async function uploadFile(
  file: File,
  bucket: string,
  folder: string = ''
): Promise<string> {
  const fileExtension = file.name.split('.').pop();
  const fileName = `${folder}${randomUUID()}.${fileExtension}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
    Metadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
    },
  });

  await s3Client.send(command);

  return fileName;
}

// Usage example
export async function uploadTaxDocument(
  file: File,
  userId: string
): Promise<string> {
  return uploadFile(file, 'tax-documents', `${userId}/`);
}

export async function uploadProfileImage(
  file: File,
  userId: string
): Promise<string> {
  return uploadFile(file, 'profile-images', `${userId}/`);
}
```

### Client-Side Upload with Presigned URLs

```typescript
// app/api/upload/presigned-url/route.ts
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/lib/storage/client';
import { auth } from '@clerk/nextjs/server';
import { randomUUID } from 'node:crypto';

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { fileName, fileType, bucket } = await req.json();

  const fileExtension = fileName.split('.').pop();
  const key = `${userId}/${randomUUID()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600, // 1 hour
  });

  return Response.json({ uploadUrl, key });
}
```

**Client-side usage:**
```typescript
// components/file-upload.tsx
async function handleFileUpload(file: File) {
  // Get presigned URL
  const response = await fetch('/api/upload/presigned-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      bucket: 'tax-documents',
    }),
  });

  const { uploadUrl, key } = await response.json();

  // Upload directly to MinIO
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  return key;
}
```

---

## File Download

### Presigned Download URLs

```typescript
// lib/storage/download.ts
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './client';

export async function getDownloadUrl(
  bucket: string,
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

// API route
// app/api/documents/[id]/download/route.ts
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const document = await prisma.document.findUnique({
    where: { id: params.id },
  });

  if (!document || document.userId !== userId) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  const downloadUrl = await getDownloadUrl(
    'tax-documents',
    document.storageKey
  );

  return Response.json({ downloadUrl });
}
```

---

## Migration from Cloudflare R2

### Migration Steps

1. **Export data from R2:**
```bash
# Install Rclone
curl https://rclone.org/install.sh | sudo bash

# Configure R2
rclone config

# Sync R2 to MinIO
rclone sync r2:tax-documents minio:tax-documents
rclone sync r2:profile-images minio:profile-images
rclone sync r2:marketing-assets minio:marketing-assets
```

2. **Update application configuration:**
```typescript
// Update MINIO_ENDPOINT in .env
MINIO_ENDPOINT=https://storage.taxgeniuspro.tax

// Test connection
npm run test:storage
```

3. **Verify data integrity:**
```bash
# Compare file counts
mc ls --recursive minio/tax-documents | wc -l
```

4. **Update database references:**
```sql
-- If storage keys need updating
UPDATE documents
SET storage_key = REPLACE(storage_key, 'old-prefix', 'new-prefix');
```

5. **Remove R2 credentials:**
```bash
# Remove from .env
# R2_ACCOUNT_ID=...
# R2_ACCESS_KEY_ID=...
# R2_SECRET_ACCESS_KEY=...
```

---

## Backup Strategy

### Automated Backups

```bash
# Create backup script
sudo nano /usr/local/bin/backup-minio.sh
```

```bash
#!/bin/bash

BACKUP_DIR="/mnt/backups/minio"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup each bucket
mc mirror minio/tax-documents "$BACKUP_DIR/$DATE/tax-documents"
mc mirror minio/profile-images "$BACKUP_DIR/$DATE/profile-images"
mc mirror minio/marketing-assets "$BACKUP_DIR/$DATE/marketing-assets"

# Remove backups older than 30 days
find "$BACKUP_DIR" -type d -mtime +30 -exec rm -rf {} \;
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-minio.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
0 2 * * * /usr/local/bin/backup-minio.sh
```

---

## Performance Optimization

### Best Practices

1. **Use presigned URLs for uploads/downloads**
   - Reduces server load
   - Better performance
   - Direct client-to-storage transfer

2. **Enable compression for text files**
```typescript
const command = new PutObjectCommand({
  Bucket: 'tax-documents',
  Key: 'document.pdf',
  Body: buffer,
  ContentEncoding: 'gzip', // For compressed content
});
```

3. **Set appropriate cache headers**
```typescript
const command = new PutObjectCommand({
  Bucket: 'marketing-assets',
  Key: 'logo.png',
  Body: buffer,
  CacheControl: 'public, max-age=31536000', // 1 year
});
```

4. **Use multipart uploads for large files**
```typescript
import { Upload } from '@aws-sdk/lib-storage';

const upload = new Upload({
  client: s3Client,
  params: {
    Bucket: 'tax-documents',
    Key: 'large-file.pdf',
    Body: file,
  },
  queueSize: 4, // Concurrent parts
  partSize: 5 * 1024 * 1024, // 5MB parts
});

await upload.done();
```

---

## Security

### Access Control

1. **Private by default**
   - All buckets are private by default
   - Use presigned URLs for temporary access

2. **IAM policies**
   - Create separate access keys for different services
   - Restrict bucket access per service

3. **Encryption**
   - Enable server-side encryption
   - Use HTTPS for all transfers

4. **Audit logging**
   - Enable MinIO audit logs
   - Monitor access patterns

---

## Cost Comparison

### MinIO vs. Cloudflare R2

| Feature | MinIO (Self-hosted) | Cloudflare R2 |
|---------|---------------------|---------------|
| **Storage Cost** | $0 (included in VPS) | $0.015/GB/month |
| **Egress Cost** | $0 | $0 |
| **Operations** | $0 | $0.36/million |
| **Setup Complexity** | Higher | Lower |
| **Data Sovereignty** | Full control | Third-party |
| **Performance** | Local network | CDN edge |

**Estimated Monthly Savings:**
- 100GB storage: ~$1.50/mo
- 1 million operations: ~$0.36/mo
- **Total:** $1.86/mo (minimal, but better control)

**Main Benefits:**
- ✅ Data sovereignty (important for tax documents)
- ✅ No egress fees
- ✅ Better for compliance (HIPAA, SOC 2)
- ✅ Full control over infrastructure

---

## Related Documentation

- [Tech Stack Overview](./README.md)
- [Infrastructure Setup](./infrastructure.md)
- [Development Workflow](./development.md)
- [Architecture](../architecture/README.md)

---

**Document Status:** ✅ Active
