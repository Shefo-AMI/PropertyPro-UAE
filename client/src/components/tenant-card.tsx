import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import type { Tenant } from "@shared/schema";

interface TenantCardProps {
  tenant: Tenant;
}

export function TenantCard({ tenant }: TenantCardProps) {
  const initials = `${tenant.firstName[0]}${tenant.lastName[0]}`;
  const fullName = `${tenant.firstName} ${tenant.lastName}`;

  return (
    <Card className="p-6" data-testid={`card-tenant-${tenant.id}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-medium" data-testid={`text-tenant-initials-${tenant.id}`}>
              {initials}
            </span>
          </div>
          <div className="ml-3">
            <h4 className="text-lg font-semibold text-card-foreground" data-testid={`text-tenant-name-${tenant.id}`}>
              {fullName}
            </h4>
            <p className="text-muted-foreground text-sm" data-testid={`text-tenant-email-${tenant.id}`}>
              {tenant.email}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">
          Active
        </Badge>
      </div>
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Phone:</span>
          <span className="text-card-foreground" data-testid={`text-tenant-phone-${tenant.id}`}>
            {tenant.phone || "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Emergency Contact:</span>
          <span className="text-card-foreground" data-testid={`text-tenant-emergency-${tenant.id}`}>
            {tenant.emergencyContact || "N/A"}
          </span>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          className="flex-1"
          data-testid={`button-view-tenant-${tenant.id}`}
        >
          View Profile
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          data-testid={`button-message-tenant-${tenant.id}`}
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
