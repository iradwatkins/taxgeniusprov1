import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Upload, 
  Users, 
  Trophy, 
  DollarSign, 
  QrCode, 
  Link as LinkIcon, 
  FileText,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type UserRole = "client" | "referrer" | "preparer";

interface SidebarProps {
  role: UserRole;
  onLogout?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const getNavItems = (role: UserRole): NavItem[] => {
  const dashboardPath = `/dashboard/${role}`;
  const baseItems: NavItem[] = [
    { label: "Dashboard", href: dashboardPath, icon: Home },
  ];

  switch (role) {
    case "client":
      return [
        ...baseItems,
        { label: "Upload Documents", href: "/dashboard/client/upload", icon: Upload },
        { label: "My Returns", href: "/dashboard/client/returns", icon: FileText },
        { label: "Settings", href: "/dashboard/client/settings", icon: Settings },
      ];
    case "referrer":
      return [
        ...baseItems,
        { label: "Referrals", href: "/dashboard/referrer/referrals", icon: Users },
        { label: "Contest", href: "/dashboard/referrer/contest", icon: Trophy },
        { label: "Earnings", href: "/dashboard/referrer/earnings", icon: DollarSign },
        { label: "Marketing Tools", href: "/dashboard/referrer/marketing", icon: QrCode },
        { label: "Settings", href: "/dashboard/referrer/settings", icon: Settings },
      ];
    case "preparer":
      return [
        ...baseItems,
        { label: "Client List", href: "/dashboard/preparer/clients", icon: Users },
        { label: "Documents", href: "/dashboard/preparer/documents", icon: FileText },
        { label: "Settings", href: "/dashboard/preparer/settings", icon: Settings },
      ];
    default:
      return baseItems;
  }
};

export const Sidebar = ({ role, onLogout }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navItems = getNavItems(role);

  return (
    <div
      className={cn(
        "bg-card border-r border-border transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-primary">Tax Genius</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
        {!isCollapsed && (
          <p className="text-sm text-muted-foreground mt-1 capitalize">
            {role} Dashboard
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={onLogout}
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  );
};