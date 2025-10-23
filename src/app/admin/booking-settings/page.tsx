import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { getUserPermissions, UserRole } from '@/lib/permissions';
import { BookingSettingsClient } from '@/components/admin/BookingSettingsClient';

export default async function BookingSettingsPage() {
  const user = await currentUser();
  if (!user) redirect('/auth/login');

  const role = user.publicMetadata?.role as UserRole | undefined;
  const permissions = getUserPermissions(role || 'client');

  // Only admins can access booking settings
  if (!['admin', 'full'].includes(permissions.users)) {
    redirect('/forbidden');
  }

  return <BookingSettingsClient />;
}
