import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { getUserPermissions, UserRole, type UserPermissions } from '@/lib/permissions';
import CalendarPageClient from './page-client';

export default async function CalendarPage() {
  const user = await currentUser();
  if (!user) redirect('/auth/login');

  const role = user.publicMetadata?.role as UserRole | undefined;
  const customPermissions = user.publicMetadata?.permissions as Partial<UserPermissions> | undefined;
  const permissions = getUserPermissions(role || 'client', customPermissions);

  if (!permissions.calendar) redirect('/forbidden');

  return <CalendarPageClient />;
}
