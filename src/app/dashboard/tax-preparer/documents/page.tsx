import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { TaxPreparerDocumentsClient } from '@/components/documents/TaxPreparerDocumentsClient';

export const metadata = {
  title: 'Documents | Tax Genius Pro',
  description: 'Manage client documents',
};

async function isTaxPreparer() {
  const user = await currentUser();
  if (!user) return false;
  const role = user.publicMetadata?.role;
  return role === 'TAX_PREPARER' || role === 'ADMIN';
}

export default async function TaxPreparerDocumentsPage() {
  const userIsTaxPreparer = await isTaxPreparer();

  if (!userIsTaxPreparer) {
    redirect('/forbidden');
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Document Library</h1>
        <p className="text-muted-foreground mt-1">View and manage all client documents</p>
      </div>

      <TaxPreparerDocumentsClient />
    </div>
  );
}
