import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Building, BarChart3, Home, Users, Wrench, Calendar, FileText, TrendingUp, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Properties", href: "/properties", icon: Building },
  { name: "Units", href: "/units", icon: Home },
  { name: "Tenants", href: "/tenants", icon: Users },
  { name: "Maintenance", href: "/maintenance", icon: Wrench },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Accounting", href: "/accounting", icon: FileText },
  { name: "Reports", href: "/reports", icon: TrendingUp },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();

  const initials = (user as any)?.firstName && (user as any)?.lastName 
    ? `${(user as any).firstName[0]}${(user as any).lastName[0]}` 
    : (user as any)?.email?.[0]?.toUpperCase() || "U";

  return (
    <div className={cn(
      "bg-sidebar border-r border-sidebar-border transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )} data-testid="sidebar">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center">
            <div className="bg-sidebar-primary rounded-lg p-2 mr-3">
              <Building className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-sidebar-foreground font-serif">PropertyPro</h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="ml-auto p-1 text-muted-foreground hover:text-sidebar-foreground"
              data-testid="button-toggle-sidebar"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  data-testid={`nav-${item.name.toLowerCase()}`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {!isCollapsed && <span>{item.name}</span>}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="px-4 py-6 border-t border-sidebar-border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium" data-testid="text-user-initials">
                {initials}
              </span>
            </div>
            {!isCollapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-sidebar-foreground" data-testid="text-user-name">
                  {(user as any)?.firstName && (user as any)?.lastName 
                    ? `${(user as any).firstName} ${(user as any).lastName}` 
                    : (user as any)?.email || "User"}
                </p>
                <p className="text-xs text-muted-foreground" data-testid="text-user-email">
                  {(user as any)?.email || ""}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
