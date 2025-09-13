import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/core/providers/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user?.role) {
      // Redirect to role-specific dashboard
      switch (user.role) {
        case "client":
          navigate("/dashboard/client", { replace: true });
          break;
        case "referrer":
          navigate("/dashboard/referrer", { replace: true });
          break;
        case "preparer":
          navigate("/dashboard/preparer", { replace: true });
          break;
        default:
          // If user has no role assigned, stay on generic dashboard
          break;
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // If user has no role, show role selection or setup
  if (user && !user.role) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold">Welcome to Tax Genius!</h1>
          <p className="text-muted-foreground">
            Your account is being set up. If you just registered, please check your email to confirm your account.
          </p>
          <p className="text-sm text-muted-foreground">
            Once confirmed, you'll be redirected to your role-specific dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Default fallback (shouldn't reach here due to ProtectedRoute)
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold">Tax Genius Dashboard</h1>
        <p className="text-muted-foreground">Setting up your dashboard...</p>
      </div>
    </div>
  );
};

export default Dashboard;