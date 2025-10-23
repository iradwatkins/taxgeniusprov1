import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { MobileHubClient } from '@/components/mobile-hub/MobileHubClient';
import { getUserPermissions, UserRole } from '@/lib/permissions';

export const metadata = {
  title: 'My Hub | TaxGeniusPro',
  description: 'Your mobile command center',
};

export default async function MobileHubPage() {
  const user = await currentUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/auth/login?redirect=/mobile-hub');
  }

  // Get user role
  const role = (user.publicMetadata?.role as UserRole) || 'client';
  const permissions = getUserPermissions(role, user.publicMetadata?.permissions as any);

  // Get user profile data
  const userProfile = {
    id: user.id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.emailAddresses[0]?.emailAddress || '',
    imageUrl: user.imageUrl,
    role,
  };

  return <MobileHubClient user={userProfile} permissions={permissions} />;
}
