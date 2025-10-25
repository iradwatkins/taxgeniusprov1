import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { QuickShareLanding } from '@/components/quick-share/QuickShareLanding';
import { UserRole } from '@/lib/permissions';

export const metadata = {
  title: 'Quick Share | TaxGeniusPro',
  description: 'Share your referral links quickly and easily',
};

export default async function QuickSharePage() {
  // Get authenticated user
  const user = await currentUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/auth/login');
  }

  // Get user's role
  const role = (user.publicMetadata?.role as UserRole) || 'client';

  return <QuickShareLanding userId={user.id} role={role} firstName={user.firstName || undefined} />;
}
