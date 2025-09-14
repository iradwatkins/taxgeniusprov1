import { Lucia } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { prisma } from './db';
import { cookies } from 'next/headers';
import { cache } from 'react';
import type { Session, User } from 'lucia';

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    }
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      emailVerified: attributes.emailVerified
    };
  }
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
  emailVerified: Date | null;
}

export const validateRequest = cache(
  async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null
      };
    }

    const result = await lucia.validateSession(sessionId);

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
    } catch {
      // Next.js throws when you attempt to set cookie when rendering page
    }

    return result;
  }
);

export async function getUser() {
  const { user } = await validateRequest();
  return user;
}

export async function requireAuth() {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireRole(requiredRole: 'CLIENT' | 'REFERRER' | 'PREPARER' | 'ADMIN') {
  const user = await requireAuth();

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  });

  if (!profile || profile.role !== requiredRole) {
    throw new Error('Insufficient permissions');
  }

  return { user, profile };
}