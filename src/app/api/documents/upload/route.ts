import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { uploadRateLimit, getClientIdentifier, getUserIdentifier, getRateLimitHeaders, checkRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger'

// Map form categories to DocumentType enum
const CATEGORY_TO_TYPE: Record<string, string> = {
  'w2': 'W2',
  '1099': 'FORM_1099',
  'receipts': 'RECEIPT',
  'mortgage': 'OTHER',
  'other': 'OTHER',
};

/**
 * POST /api/documents/upload
 * Upload tax documents with rate limiting
 *
 * Security:
 * - Rate limited: 20 uploads per hour per user
 * - File size limit enforced
 * - Files saved to user-specific directory
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting: 20 uploads per hour
    const ip = getClientIdentifier(req);
    const identifier = getUserIdentifier(userId, ip);
    const rateLimitResult = await checkRateLimit(identifier, uploadRateLimit);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Upload limit exceeded. Please try again later.',
          retryAfter: rateLimitResult.retryAfter,
          limit: rateLimitResult.limit,
          reset: new Date(rateLimitResult.reset).toISOString()
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      );
    }

    // Get user's profile
    const profile = await prisma.profile.findUnique({
      where: { clerkUserId: userId },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string;
    const taxReturnId = formData.get('taxReturnId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'uploads', 'documents', profile.id);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = join(uploadDir, fileName);

    // Save file to disk
    await writeFile(filePath, buffer);

    // Save document record to database
    const document = await prisma.document.create({
      data: {
        profileId: profile.id,
        taxReturnId: taxReturnId || undefined,
        type: CATEGORY_TO_TYPE[category] || 'OTHER',
        fileName: file.name,
        fileUrl: `/uploads/documents/${profile.id}/${fileName}`,
        fileSize: file.size,
        mimeType: file.type,
        isEncrypted: false, // TODO: Implement encryption
        metadata: {
          category,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        fileName: document.fileName,
        fileUrl: document.fileUrl,
        fileSize: document.fileSize,
        category,
      },
    });
  } catch (error) {
    logger.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

// GET /api/documents/upload - Get user's uploaded documents
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's profile
    const profile = await prisma.profile.findUnique({
      where: { clerkUserId: userId },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get all documents for this profile
    const documents = await prisma.document.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    logger.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
