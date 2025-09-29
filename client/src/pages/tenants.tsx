import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { TenantCard } from "@/components/tenant-card";
import { AIAssistant } from "@/components/ai-assistant";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Tenants() {
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

  // Fetch companies first to get the companyId
  const { data: companies } = useQuery({
    queryKey: ["/api/companies"],
    enabled: isAuthenticated,
  });

  const companyId = companies?.[0]?.id;

  // Fetch tenants
  const { data: tenants = [], isLoading: tenantsLoading } = useQuery({
    queryKey: ["/api/tenants/company", companyId],
    enabled: !!companyId,
  });

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
        <Header title="Tenants" />
        <main className="flex-1 overflow-auto bg-background p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Tenants</h3>
              <p className="text-muted-foreground">Manage tenant information and applications</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" data-testid="button-import-tenants">
                <Upload className="mr-2 h-4 w-4" />
                Import Tenants
              </Button>
              <Button data-testid="button-add-tenant">
                <Plus className="mr-2 h-4 w-4" />
                Add Tenant
              </Button>
            </div>
          </div>

          {tenantsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : tenants.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No tenants yet</h3>
              <p className="text-muted-foreground mb-4">Add your first tenant to get started</p>
              <Button data-testid="button-add-first-tenant">
                <Plus className="mr-2 h-4 w-4" />
                Add Tenant
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tenants.map((tenant) => (
                <TenantCard key={tenant.id} tenant={tenant} />
              ))}
              
              {/* Add Tenant Card */}
              <div className="bg-card rounded-lg border border-dashed border-border p-6 flex flex-col items-center justify-center min-h-48 hover:bg-muted/20 transition-colors cursor-pointer" data-testid="card-add-tenant">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-medium text-foreground mb-1">Add New Tenant</h4>
                <p className="text-muted-foreground text-sm text-center">Create a new tenant profile or application</p>
              </div>
            </div>
          )}
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}
