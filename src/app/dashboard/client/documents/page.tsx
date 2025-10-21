'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentUploadZone } from '@/components/documents/DocumentUploadZone';
import { DocumentsList } from '@/components/documents/DocumentsList';
import { Upload, FolderOpen, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ClientDocumentsPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['client-documents'],
    queryFn: async () => {
      const response = await fetch('/api/client/documents');
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load documents. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Documents</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Upload and manage your tax documents
          </p>
        </div>

        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Upload your tax documents securely. Documents are organized by tax year and can be
            downloaded anytime. Note: You cannot delete documents once uploaded - please contact
            your tax preparer if you need to remove a document.
          </AlertDescription>
        </Alert>

        {/* Tabs */}
        <Tabs defaultValue="upload" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="view">
              <FolderOpen className="w-4 h-4 mr-2" />
              My Documents
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <DocumentUploadZone onUploadComplete={() => refetch()} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* View Documents Tab */}
          <TabsContent value="view" className="space-y-4">
            <DocumentsList
              documentsByYear={data?.documentsByYear || {}}
              stats={data?.stats}
              onRefresh={() => refetch()}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
