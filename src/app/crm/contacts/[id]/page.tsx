import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { getUserPermissions, UserRole } from '@/lib/permissions';
import ContactDetailClient from './page-client';

export default async function ContactDetailPage({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) redirect('/auth/login');

  const role = user.publicMetadata?.role as UserRole | undefined;
  const permissions = getUserPermissions(role || 'client');

  // Check if user has access to address book (CRM)
  if (!permissions.addressBook) {
    redirect('/forbidden');
  }

  return <ContactDetailClient contactId={params.id} />;
}
