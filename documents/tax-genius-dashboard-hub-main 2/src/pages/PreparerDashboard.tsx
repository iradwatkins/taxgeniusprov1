import { Users, FileText, Clock, CheckCircle, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sidebar } from "@/components/Sidebar";
import { StatCard } from "@/components/StatCard";
import { useAuth } from "@/core/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const PreparerDashboard = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const clients = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      status: "in-progress",
      documentsCount: 8,
      deadline: "2024-04-15",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      status: "completed",
      documentsCount: 12,
      deadline: "2024-04-10",
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike@example.com",
      status: "pending",
      documentsCount: 3,
      deadline: "2024-04-20",
    },
    {
      id: 4,
      name: "Lisa Brown",
      email: "lisa@example.com",
      status: "in-progress",
      documentsCount: 9,
      deadline: "2024-04-12",
    },
    {
      id: 5,
      name: "David Chen",
      email: "david@example.com",
      status: "review",
      documentsCount: 15,
      deadline: "2024-04-08",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case "in-progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "review":
        return <Badge className="bg-yellow-500 text-white">Under Review</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="preparer" onLogout={handleLogout} />
      
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Preparer Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your assigned clients and their tax returns
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Assigned Clients"
              value={clients.length}
              icon={Users}
              description="Active clients"
            />
            <StatCard
              title="Completed Returns"
              value={clients.filter(c => c.status === "completed").length}
              icon={CheckCircle}
              description="This season"
            />
            <StatCard
              title="In Progress"
              value={clients.filter(c => c.status === "in-progress").length}
              icon={Clock}
              description="Currently working"
            />
            <StatCard
              title="Under Review"
              value={clients.filter(c => c.status === "review").length}
              icon={FileText}
              description="Awaiting approval"
            />
          </div>

          {/* Client List Table */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Assigned Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {client.email}
                      </TableCell>
                      <TableCell>{getStatusBadge(client.status)}</TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {client.documentsCount} files
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(client.deadline).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Documents
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="success" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Review Pending Documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Request Missing Documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Completed Returns
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clients
                    .filter(c => c.status !== "completed")
                    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                    .slice(0, 4)
                    .map((client) => (
                      <div key={client.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm font-medium">{client.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {client.documentsCount} documents
                          </p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(client.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreparerDashboard;