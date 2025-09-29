import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye } from "lucide-react";
import type { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden" data-testid={`card-property-${property.id}`}>
      {property.imageUrl ? (
        <img 
          src={property.imageUrl} 
          alt={property.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground">No Image</span>
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-lg font-semibold text-card-foreground" data-testid={`text-property-name-${property.id}`}>
            {property.name}
          </h4>
          <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">
            Active
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm mb-3" data-testid={`text-property-address-${property.id}`}>
          {property.address}
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <span className="text-muted-foreground">Type:</span>
            <span className="text-card-foreground font-medium ml-1" data-testid={`text-property-type-${property.id}`}>
              {property.type || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Units:</span>
            <span className="text-card-foreground font-medium ml-1" data-testid={`text-property-units-${property.id}`}>
              {property.totalUnits || 0}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex-1"
            data-testid={`button-view-property-${property.id}`}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            data-testid={`button-edit-property-${property.id}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
