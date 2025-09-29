import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AIAssistant } from "@/components/ai-assistant";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Upload, Edit, Trash2 } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Units() {
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

  // Fetch companies and properties to get units
  const { data: companies } = useQuery({
    queryKey: ["/api/companies"],
    enabled: isAuthenticated,
  });

  const companyId = (companies as any)?.[0]?.id;

  const { data: properties = [] } = useQuery({
    queryKey: ["/api/properties/company", companyId],
    enabled: !!companyId,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'bg-chart-2/10 text-chart-2';
      case 'vacant':
        return 'bg-muted text-muted-foreground';
      case 'maintenance':
        return 'bg-chart-3/10 text-chart-3';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

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
        <Header title="Units" />
        <main className="flex-1 overflow-auto bg-background p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Units</h3>
              <p className="text-muted-foreground">Manage individual rental units</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" data-testid="button-upload-csv">
                <Upload className="mr-2 h-4 w-4" />
                Upload CSV
              </Button>
              <Button data-testid="button-add-unit">
                <Plus className="mr-2 h-4 w-4" />
                Add Unit
              </Button>
            </div>
          </div>

          {(properties as any[]).length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-4">Create properties first to add units</p>
              <Button onClick={() => window.location.href = "/properties"} data-testid="button-create-property">
                Create Property
              </Button>
            </div>
          ) : (
            <Card className="overflow-hidden" data-testid="card-units-table">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted">
                      <TableHead className="text-muted-foreground font-medium">Unit</TableHead>
                      <TableHead className="text-muted-foreground font-medium">Property</TableHead>
                      <TableHead className="text-muted-foreground font-medium">Type</TableHead>
                      <TableHead className="text-muted-foreground font-medium">Tenant</TableHead>
                      <TableHead className="text-muted-foreground font-medium">Rent</TableHead>
                      <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                      <TableHead className="text-muted-foreground font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No units available. Add units to your properties to see them here.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}
