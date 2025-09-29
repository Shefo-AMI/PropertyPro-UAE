import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { StatsCard } from "@/components/stats-card";
import { AIAssistant } from "@/components/ai-assistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Home, Users, DollarSign, Plus, UserPlus, Wrench, FileText } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" />
        <main className="flex-1 overflow-auto bg-background p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Properties"
              value="0"
              icon={Building}
              iconColor="text-primary"
              bgColor="bg-primary/10"
              data-testid="card-total-properties"
            />
            <StatsCard
              title="Active Units"
              value="0"
              icon={Home}
              iconColor="text-chart-2"
              bgColor="bg-chart-2/10"
              data-testid="card-active-units"
            />
            <StatsCard
              title="Total Tenants"
              value="0"
              icon={Users}
              iconColor="text-chart-3"
              bgColor="bg-chart-3/10"
              data-testid="card-total-tenants"
            />
            <StatsCard
              title="Monthly Revenue"
              value="$0"
              icon={DollarSign}
              iconColor="text-chart-4"
              bgColor="bg-chart-4/10"
              data-testid="card-monthly-revenue"
            />
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <Card data-testid="card-revenue-chart">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Revenue chart will appear here when you have data</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card data-testid="card-recent-activity">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center text-muted-foreground py-8">
                    <p>No recent activity</p>
                    <p className="text-sm mt-2">Activity will appear here as you use the system</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card data-testid="card-quick-actions">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-6 h-auto"
                  data-testid="button-add-property"
                >
                  <Plus className="h-8 w-8 mb-2 text-primary" />
                  <span>Add Property</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-6 h-auto"
                  data-testid="button-add-tenant"
                >
                  <UserPlus className="h-8 w-8 mb-2 text-chart-2" />
                  <span>Add Tenant</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-6 h-auto"
                  data-testid="button-log-maintenance"
                >
                  <Wrench className="h-8 w-8 mb-2 text-chart-3" />
                  <span>Log Maintenance</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-6 h-auto"
                  data-testid="button-generate-report"
                >
                  <FileText className="h-8 w-8 mb-2 text-chart-4" />
                  <span>Generate Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}
