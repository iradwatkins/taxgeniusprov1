# Tax Genius Platform - Storage Architecture (MinIO)

**Version:** 3.0 FINAL
**Date:** October 9, 2025
**Status:** Active - Single Source of Truth
**Part:** 4 of 11

[↑ Back to Architecture Index](./README.md)

---

## 7. Storage Architecture (MinIO)

### 7.1 MinIO Configuration

```typescript
// src/lib/storage.ts
import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT!, // http://localhost:9000
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true, // Required for MinIO
});

export async function generateUploadUrl(key: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: 'tax-documents',
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 600 }); // 10 min
}

export async function generateDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: 'tax-documents',
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
}
```

### 7.2 Bucket Structure

```
MinIO Buckets:
├── tax-documents/
│   ├── {organizationId}/
│   │   ├── {clientId}/
│   │   │   ├── {timestamp}-w2.pdf
│   │   │   ├── {timestamp}-1099.pdf
│   │   │   └── {timestamp}-id.jpg
│
├── profile-images/
│   ├── {userId}-{timestamp}.jpg
│
└── marketing-assets/
    ├── posters/
    ├── social-media/
    └── email-templates/
```

---

## Storage Service Implementation

### Complete Storage Service

```typescript
// src/lib/services/storage.service.ts
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { prisma } from '@/lib/db';

const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT!,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,
});

export interface UploadOptions {
  organizationId: string;
  clientId: string;
  filename: string;
  contentType: string;
  documentType?: string;
}

export interface UploadResult {
  uploadUrl: string;
  key: string;
  documentId: string;
}

export async function initiateUpload(options: UploadOptions): Promise<UploadResult> {
  const { organizationId, clientId, filename, contentType, documentType } = options;

  // Generate unique key
  const timestamp = Date.now();
  const key = `${organizationId}/${clientId}/${timestamp}-${filename}`;

  // Generate presigned upload URL
  const command = new PutObjectCommand({
    Bucket: 'tax-documents',
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });

  // Create database record
  const document = await prisma.document.create({
    data: {
      clientId,
      filename,
      minioKey: key,
      mimeType: contentType,
      documentType,
      fileSize: 0, // Will be updated after upload
    },
  });

  return {
    uploadUrl,
    key,
    documentId: document.id,
  };
}

export async function generateDownloadUrl(documentId: string): Promise<string> {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    throw new Error('Document not found');
  }

  const command = new GetObjectCommand({
    Bucket: 'tax-documents',
    Key: document.minioKey,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function deleteDocument(documentId: string): Promise<void> {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    throw new Error('Document not found');
  }

  // Delete from MinIO
  const command = new DeleteObjectCommand({
    Bucket: 'tax-documents',
    Key: document.minioKey,
  });

  await s3Client.send(command);

  // Delete from database
  await prisma.document.delete({
    where: { id: documentId },
  });
}

export async function getDocumentMetadata(key: string) {
  const command = new HeadObjectCommand({
    Bucket: 'tax-documents',
    Key: key,
  });

  return s3Client.send(command);
}
```

---

## Upload Flow

### Client-Side Upload Pattern

```typescript
// src/components/features/DocumentUpload.tsx
'use client';

import { useState } from 'react';

export function DocumentUpload({ clientId, organizationId }) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);

    try {
      // Step 1: Get presigned URL from API
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          clientId,
          filename: file.name,
          contentType: file.type,
        }),
      });

      const { data } = await response.json();

      // Step 2: Upload directly to MinIO
      await fetch(data.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      // Step 3: Confirm upload
      await fetch('/api/documents/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: data.documentId,
          fileSize: file.size,
        }),
      });

      alert('Upload successful!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => handleUpload(e.target.files[0])}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
```

---

## Storage Quotas & Limits

### Plan-Based Storage Limits

```typescript
// src/lib/storage-limits.ts
export const STORAGE_LIMITS = {
  TRIAL: 100, // MB
  STARTER: 1024, // 1 GB
  PROFESSIONAL: 10240, // 10 GB
  ENTERPRISE: 102400, // 100 GB
} as const;

export async function checkStorageQuota(organizationId: string): Promise<boolean> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: {
      subscriptions: {
        where: { status: 'ACTIVE' },
      },
    },
  });

  const limit = STORAGE_LIMITS[org.plan];
  const used = org.subscriptions[0]?.storageUsedMB ?? 0;

  return used < limit;
}

export async function updateStorageUsage(organizationId: string, sizeInBytes: number): Promise<void> {
  const sizeInMB = sizeInBytes / (1024 * 1024);

  await prisma.subscription.updateMany({
    where: {
      organizationId,
      status: 'ACTIVE',
    },
    data: {
      storageUsedMB: {
        increment: sizeInMB,
      },
    },
  });
}
```

---

## Backup Strategy

### MinIO Backup Configuration

```bash
#!/bin/bash
# scripts/backup-minio.sh

MINIO_ENDPOINT="http://localhost:9000"
MINIO_ALIAS="taxgenius"
BACKUP_PATH="/backups/minio/$(date +%Y%m%d)"

# Configure MinIO client
mc alias set $MINIO_ALIAS $MINIO_ENDPOINT $MINIO_ACCESS_KEY $MINIO_SECRET_KEY

# Mirror buckets to backup location
mc mirror $MINIO_ALIAS/tax-documents $BACKUP_PATH/tax-documents
mc mirror $MINIO_ALIAS/profile-images $BACKUP_PATH/profile-images
mc mirror $MINIO_ALIAS/marketing-assets $BACKUP_PATH/marketing-assets

# Compress backup
tar -czf /backups/minio-$(date +%Y%m%d).tar.gz $BACKUP_PATH

# Remove old backups (keep last 30 days)
find /backups -name "minio-*.tar.gz" -mtime +30 -delete
```

---

## Security Considerations

### Access Control

- All uploads use presigned URLs with 10-minute expiration
- Download URLs expire after 1 hour
- Organization-level isolation through key prefixes
- No public access to buckets
- Client credentials never exposed to frontend

### Encryption

- MinIO supports server-side encryption
- Enable encryption at rest for sensitive documents
- TLS/SSL for data in transit

```bash
# Enable encryption in MinIO
mc encrypt set sse-s3 taxgenius/tax-documents
```

---

## Related Documentation

- [Database Schema](./02-database-schema.md) - Document model
- [API Design Patterns](./03-api-design.md) - Upload/download endpoints
- [Security Architecture](./07-security.md) - Access control and encryption
- [Deployment Architecture](./08-deployment.md) - MinIO production setup

---

**Navigation:**
[← Previous: API Design](./03-api-design.md) | [Next: Authentication Flow →](./05-authentication-clerk.md)

---

**Document Version:** 3.0 FINAL
**Last Updated:** October 9, 2025
**Next Review:** November 9, 2025
**Maintained By:** Development Team
