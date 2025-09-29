import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import type { MaintenanceRequest } from "@shared/schema";

interface MaintenanceCardProps {
  request: MaintenanceRequest;
}

export function MaintenanceCard({ request }: MaintenanceCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-destructive/10 text-destructive';
      case 'high':
        return 'bg-chart-3/10 text-chart-3';
      case 'medium':
        return 'bg-chart-4/10 text-chart-4';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-chart-3/10 text-chart-3';
      case 'in_progress':
        return 'bg-chart-4/10 text-chart-4';
      case 'completed':
        return 'bg-chart-2/10 text-chart-2';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="border border-border p-6" data-testid={`card-maintenance-${request.id}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-card-foreground mb-1" data-testid={`text-maintenance-title-${request.id}`}>
            {request.title}
          </h4>
          <p className="text-muted-foreground text-sm">
            {request.category} • Submitted {new Date(request.createdAt!).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className={getPriorityColor(request.priority!)}>
            {request.priority}
          </Badge>
          <Badge className={getStatusColor(request.status!)}>
            {request.status?.replace('_', ' ')}
          </Badge>
        </div>
      </div>
      <p className="text-card-foreground mb-4" data-testid={`text-maintenance-description-${request.id}`}>
        {request.description}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
        <div>
          <span className="text-muted-foreground">Category:</span>
          <span className="text-card-foreground font-medium block">{request.category}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Assigned to:</span>
          <span className="text-card-foreground font-medium block">{request.assignedTo || "Unassigned"}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Est. Cost:</span>
          <span className="text-card-foreground font-medium block">
            ${request.estimatedCost || "0"}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Priority:</span>
          <span className="text-card-foreground font-medium block capitalize">{request.priority}</span>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="default"
          size="sm"
          data-testid={`button-update-status-${request.id}`}
        >
          Update Status
        </Button>
        <Button
          variant="outline"
          size="sm"
          data-testid={`button-view-details-${request.id}`}
        >
          View Details
        </Button>
        <Button
          variant="outline"
          size="sm"
          data-testid={`button-comment-${request.id}`}
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
