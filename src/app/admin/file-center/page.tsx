import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { getUserPermissions, UserRole } from '@/lib/permissions';
import { FileManager } from '@/components/file-manager/FileManager';

export default async function FileCenterPage() {
  const user = await currentUser();
  if (!user) redirect('/auth/login');

  const role = user.publicMetadata?.role as UserRole | undefined;
  const customPermissions = user.publicMetadata?.permissions as any;
  const permissions = getUserPermissions(role || 'client', customPermissions);

  if (!permissions.clientFileCenter) redirect('/forbidden');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Client File Centers</h1>
          <p className="text-muted-foreground mt-1">
            Secure document storage and management for all clients
          </p>
        </div>

        {/* File Manager */}
        <FileManager
          showTree={true}
          allowUpload={true}
          allowFolderCreate={true}
          allowDelete={true}
          allowMove={true}
          allowShare={true}
        />
      </div>
    </div>
  );
}
