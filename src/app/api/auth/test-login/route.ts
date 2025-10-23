import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { handleAPIError } from '@/lib/api-error-handler';
import { clerkClient } from '@clerk/nextjs/server';

/**
 * Test Login API Route
 *
 * This endpoint provides a simple email/password authentication
 * for testing purposes. It validates credentials against predefined
 * test accounts and returns user information.
 *
 * ⚠️ WARNING: This is for development/testing ONLY
 * Do NOT use in production without proper authentication system
 */

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Test accounts with different roles
// In production, this would query a database with hashed passwords
const TEST_ACCOUNTS = [
  {
    email: 'admin@test.com',
    password: 'admin123',
    role: 'super_admin',
    name: 'Test Admin',
    redirectUrl: '/dashboard/admin',
  },
  {
    email: 'preparer@test.com',
    password: 'preparer123',
    role: 'tax_preparer',
    name: 'Test Preparer',
    redirectUrl: '/dashboard/tax-preparer',
  },
  {
    email: 'affiliate@test.com',
    password: 'affiliate123',
    role: 'affiliate',
    name: 'Test Affiliate',
    redirectUrl: '/dashboard/affiliate',
  },
  {
    email: 'client@test.com',
    password: 'client123',
    role: 'client',
    name: 'Test Client',
    redirectUrl: '/dashboard/client',
  },
  {
    email: 'lead@test.com',
    password: 'lead123',
    role: 'lead',
    name: 'Test Lead',
    redirectUrl: '/dashboard/lead',
  },
];

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const validatedData = loginSchema.parse(body);

    logger.info('Test login attempt', { email: validatedData.email });

    // Find matching test account
    const account = TEST_ACCOUNTS.find(
      (acc) => acc.email === validatedData.email && acc.password === validatedData.password
    );

    if (!account) {
      logger.warn('Test login failed - invalid credentials', {
        email: validatedData.email,
      });

      return NextResponse.json(
        {
          error: 'Invalid email or password',
          message: 'Check test accounts or use valid credentials',
        },
        { status: 401 }
      );
    }

    // Try to find Clerk user with this email
    let clerkUser = null;
    try {
      const clerk = await clerkClient();
      const users = await clerk.users.getUserList({
        emailAddress: [validatedData.email],
      });

      if (users.data.length > 0) {
        clerkUser = users.data[0];
        logger.info('Found Clerk user for test account', {
          email: validatedData.email,
          clerkUserId: clerkUser.id,
        });
      }
    } catch {
      logger.warn('Could not fetch Clerk user (expected in test)', {
        email: validatedData.email,
      });
    }

    // Successful authentication
    logger.info('Test login successful', {
      email: validatedData.email,
      role: account.role,
      hasClerkUser: !!clerkUser,
    });

    // In a real system, you would:
    // 1. Create a session token (JWT)
    // 2. Set an HTTP-only cookie
    // 3. Return the token to the client

    // For testing, we return user info directly
    return NextResponse.json({
      success: true,
      user: {
        email: account.email,
        name: account.name,
        role: account.role,
        clerkUserId: clerkUser?.id || null,
      },
      redirectUrl: account.redirectUrl,
      message: `Successfully authenticated as ${account.role}`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return handleAPIError(error);
  }
}

// GET endpoint to list available test accounts (development only)
export async function GET() {
  // Only expose this in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
  }

  return NextResponse.json({
    message: 'Test authentication accounts',
    accounts: TEST_ACCOUNTS.map((acc) => ({
      email: acc.email,
      role: acc.role,
      name: acc.name,
      // Don't expose passwords in response, even for test accounts
      passwordHint: 'Use the password shown in the test login UI',
    })),
    note: '⚠️ These are test accounts for development only',
  });
}
