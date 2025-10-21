import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { getUserPermissions, UserRole } from '@/lib/permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  FolderOpen,
  FileText,
  Upload,
  Download,
  Search,
  Filter,
  Trash2,
  Eye,
  Share2,
  Lock,
  Calendar,
  User,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export default async function FileCenterPage() {
  const user = await currentUser();
  if (!user) redirect('/auth/login');

  const role = user.publicMetadata?.role as UserRole | undefined;
  const customPermissions = user.publicMetadata?.permissions as any;
  const permissions = getUserPermissions(role || 'client', customPermissions);

  if (!permissions.clientFileCenter) redirect('/forbidden');

  // Fetch document statistics
  let documentStats: any[] = [];
  let totalDocuments = 0;

  try {
    documentStats = await prisma.document.groupBy({
      by: ['type'],
      _count: true,
    });

    totalDocuments = await prisma.document.count();
  } catch (error) {
    logger.error('Error fetching document statistics:', error);
    // Continue with empty data - will show "0 documents" message
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FolderOpen className="w-8 h-8" />
              Client File Centers
            </h1>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </div>
          <p className="text-muted-foreground">
            Secure document storage and management for all clients
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDocuments}</div>
              <p className="text-xs text-muted-foreground">All documents</p>
            </CardContent>
          </Card>

          {documentStats.slice(0, 3).map((stat) => (
            <Card key={stat.type}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.type}</CardTitle>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat._count}</div>
                <p className="text-xs text-muted-foreground">Documents</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search files or clients..." />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* File Structure */}
        <Card>
          <CardHeader>
            <CardTitle>Client Files</CardTitle>
            <CardDescription>
              Each client has a dedicated folder with yearly subfolders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock client folders */}
              {['John Doe', 'Jane Smith', 'Michael Johnson', 'Sarah Williams'].map((clientName) => (
                <div key={clientName} className="border rounded-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FolderOpen className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{clientName}</p>
                          <p className="text-sm text-muted-foreground">
                            Client ID: CL{Math.floor(Math.random() * 10000)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {Math.floor(Math.random() * 20 + 5)} files
                        </Badge>
                        <Button size="sm" variant="outline">
                          Open
                        </Button>
                      </div>
                    </div>

                    {/* Year subfolders */}
                    <div className="mt-4 ml-8 space-y-2">
                      {['2024', '2023', '2022'].map((year) => (
                        <div
                          key={year}
                          className="flex items-center justify-between p-2 hover:bg-muted/50 rounded"
                        >
                          <div className="flex items-center gap-2">
                            <FolderOpen className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm">{year} Tax Year</span>
                            <Badge variant="outline" className="text-xs">
                              {Math.floor(Math.random() * 10 + 1)} files
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            Updated {Math.floor(Math.random() * 30 + 1)} days ago
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* File Management Notice */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-yellow-600 mt-1" />
                <div>
                  <p className="font-medium">File Management Rules</p>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Clients can upload files to their designated folders</li>
                    <li>• Only tax preparers can delete files</li>
                    <li>• All files are encrypted and stored securely</li>
                    <li>• Files are organized by tax year for easy access</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
