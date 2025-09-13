import { Upload, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/core/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "filed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "filed":
        return <Badge className="bg-success text-success-foreground">Filed</Badge>;
      case "in-progress":
        return <Badge variant="secondary">In Progress</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="client" onLogout={handleLogout} />
      
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t('welcome')} {user?.profile?.first_name && `, ${user.profile.first_name}`}
            </h1>
            <p className="text-muted-foreground">
              Manage your tax returns and upload documents
            </p>
          </div>

          {/* Tax Return Status */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  2024 Tax Return Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Current Status:</span>
                  {getStatusBadge("not-started")}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {getStatusIcon("not-started")}
                  <span>Ready to begin your tax preparation</span>
                </div>
                <Button variant="success" className="w-full mt-4">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View Previous Returns
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Additional Documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Schedule Consultation
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Document Upload Section */}
          <Card className="mt-6 border-border">
            <CardHeader>
              <CardTitle>Document Checklist</CardTitle>
              <p className="text-sm text-muted-foreground">
                Upload these documents to get started with your tax preparation
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  "W-2 Forms",
                  "1099 Forms",
                  "Investment Statements",
                  "Mortgage Interest Statement",
                  "Property Tax Records",
                  "Charitable Donations",
                ].map((document) => (
                  <div
                    key={document}
                    className="flex items-center justify-between p-3 border border-border rounded-md"
                  >
                    <span className="text-sm font-medium">{document}</span>
                    <Button variant="outline" size="sm">
                      Upload
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;