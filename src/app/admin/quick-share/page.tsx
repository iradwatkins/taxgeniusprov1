/**
 * Quick Share Links Dashboard
 *
 * Allows users to create and manage trackable short links for:
 * - Tax Intake Forms
 * - Contact/Lead Forms
 * - Custom destinations
 *
 * Features:
 * - Create new short links
 * - View all links with analytics
 * - Edit/delete links
 * - Copy links & generate QR codes
 * - Real-time click tracking
 */

import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { getUserPermissions, UserRole } from '@/lib/permissions';
import { QuickShareDashboard } from '@/components/links/QuickShareDashboard';

export default async function QuickShareLinksPage() {
  const user = await currentUser();
  if (!user) redirect('/auth/login');

  const role = user.publicMetadata?.role as UserRole | undefined;
  const customPermissions = user.publicMetadata?.permissions as any;
  const permissions = getUserPermissions(role || 'client', customPermissions);

  if (!permissions.quickShareLinks) redirect('/forbidden');

  return <QuickShareDashboard />;
}
