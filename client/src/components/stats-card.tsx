import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
  "data-testid"?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = "text-primary",
  bgColor = "bg-primary/10",
  "data-testid": testId
}: StatsCardProps) {
  return (
    <Card className="border border-border" data-testid={testId}>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-card-foreground">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
