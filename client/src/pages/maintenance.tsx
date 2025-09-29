import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MaintenanceCard } from "@/components/maintenance-card";
import { AIAssistant } from "@/components/ai-assistant";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Maintenance() {
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
        <Header title="Maintenance Requests" />
        <main className="flex-1 overflow-auto bg-background p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Maintenance Requests</h3>
              <p className="text-muted-foreground">Track and manage property maintenance</p>
            </div>
            <Button data-testid="button-log-request">
              <Plus className="mr-2 h-4 w-4" />
              Log Request
            </Button>
          </div>

          {/* Status Filter */}
          <div className="flex space-x-2 mb-6">
            <Button variant="default" size="sm" data-testid="filter-all">All</Button>
            <Button variant="outline" size="sm" data-testid="filter-open">Open</Button>
            <Button variant="outline" size="sm" data-testid="filter-in-progress">In Progress</Button>
            <Button variant="outline" size="sm" data-testid="filter-completed">Completed</Button>
          </div>

          {/* Maintenance Requests */}
          <div className="space-y-4">
            <div className="text-center py-12">
              <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No maintenance requests</h3>
              <p className="text-muted-foreground mb-4">Log your first maintenance request to get started</p>
              <Button data-testid="button-log-first-request">
                <Plus className="mr-2 h-4 w-4" />
                Log Request
              </Button>
            </div>
          </div>
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}
