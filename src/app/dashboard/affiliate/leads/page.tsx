import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Search,
  Filter,
  Eye,
  UserPlus,
  CheckCircle2,
  Clock,
  XCircle,
  Mail,
  Phone,
  Calendar,
  DollarSign,
} from 'lucide-react';

export const metadata = {
  title: 'Leads | Tax Genius Pro',
  description: 'Manage your affiliate leads',
};

async function isAffiliate() {
  const user = await currentUser();
  if (!user) return false;
  const role = user.publicMetadata?.role;
  return role === 'affiliate' || role === 'admin';
}

export default async function AffiliateLeadsPage() {
  const userIsAffiliate = await isAffiliate();

  if (!userIsAffiliate) {
    redirect('/forbidden');
  }

  // Mock leads data
  const leads = [
    {
      id: '1',
      name: 'Jennifer Williams',
      email: 'jennifer.williams@email.com',
      phone: '+1 (555) 123-4567',
      status: 'Converted',
      source: 'Blog Post',
      signupDate: '2024-03-10',
      conversionDate: '2024-03-15',
      value: 350,
    },
    {
      id: '2',
      name: 'Daniel Brown',
      email: 'daniel.brown@email.com',
      phone: '+1 (555) 234-5678',
      status: 'Contacted',
      source: 'YouTube Video',
      signupDate: '2024-03-12',
      conversionDate: null,
      value: 0,
    },
    {
      id: '3',
      name: 'Ashley Garcia',
      email: 'ashley.garcia@email.com',
      phone: '+1 (555) 345-6789',
      status: 'Converted',
      source: 'Newsletter',
      signupDate: '2024-03-14',
      conversionDate: '2024-03-18',
      value: 450,
    },
    {
      id: '4',
      name: 'Christopher Lee',
      email: 'christopher.lee@email.com',
      phone: '+1 (555) 456-7890',
      status: 'New',
      source: 'Social Media',
      signupDate: '2024-03-15',
      conversionDate: null,
      value: 0,
    },
    {
      id: '5',
      name: 'Michelle Taylor',
      email: 'michelle.taylor@email.com',
      phone: '+1 (555) 567-8901',
      status: 'Lost',
      source: 'Blog Post',
      signupDate: '2024-03-08',
      conversionDate: null,
      value: 0,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Converted':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'Contacted':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'New':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Lost':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Converted':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'Contacted':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'New':
        return <UserPlus className="w-4 h-4 text-yellow-600" />;
      case 'Lost':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const convertedLeads = leads.filter((l) => l.status === 'Converted');
  const totalValue = convertedLeads.reduce((sum, l) => sum + l.value, 0);
  const conversionRate = Math.round((convertedLeads.length / leads.length) * 100);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage your affiliate leads</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Lead Manually
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
            <p className="text-xs text-muted-foreground">All time leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Converted</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{convertedLeads.length}</div>
            <p className="text-xs text-muted-foreground">Successful conversions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Lead to customer rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue}</div>
            <p className="text-xs text-muted-foreground">From converted leads</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lead List</CardTitle>
              <CardDescription>All your affiliate leads</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search leads..." className="pl-9 w-64" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Signup Date</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {lead.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        {lead.conversionDate && (
                          <p className="text-xs text-muted-foreground">
                            Converted: {new Date(lead.conversionDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(lead.status)}
                      <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{lead.source}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-3 h-3" />
                      {new Date(lead.signupDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {lead.value > 0 ? (
                      <p className="font-semibold text-green-600">${lead.value}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">-</p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Lead Sources & Conversion Funnel */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>Where your leads come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Blog Post', 'YouTube Video', 'Newsletter', 'Social Media'].map((source) => {
                const count = leads.filter((l) => l.source === source).length;
                const percentage = (count / leads.length) * 100;
                return (
                  <div key={source} className="flex items-center justify-between">
                    <span className="text-sm">{source}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Lead journey stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">New Leads</span>
                  <span className="font-medium">
                    {leads.filter((l) => l.status === 'New').length} (
                    {Math.round(
                      (leads.filter((l) => l.status === 'New').length / leads.length) * 100
                    )}
                    %)
                  </span>
                </div>
                <div className="h-6 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-yellow-600 flex items-center px-2 text-white text-xs font-medium"
                    style={{
                      width: `${(leads.filter((l) => l.status === 'New').length / leads.length) * 100}%`,
                    }}
                  >
                    {leads.filter((l) => l.status === 'New').length}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Contacted</span>
                  <span className="font-medium">
                    {leads.filter((l) => l.status === 'Contacted').length} (
                    {Math.round(
                      (leads.filter((l) => l.status === 'Contacted').length / leads.length) * 100
                    )}
                    %)
                  </span>
                </div>
                <div className="h-6 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-blue-600 flex items-center px-2 text-white text-xs font-medium"
                    style={{
                      width: `${(leads.filter((l) => l.status === 'Contacted').length / leads.length) * 100}%`,
                    }}
                  >
                    {leads.filter((l) => l.status === 'Contacted').length}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Converted</span>
                  <span className="font-medium">
                    {convertedLeads.length} ({conversionRate}%)
                  </span>
                </div>
                <div className="h-6 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-green-600 flex items-center px-2 text-white text-xs font-medium"
                    style={{ width: `${conversionRate}%` }}
                  >
                    {convertedLeads.length}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
