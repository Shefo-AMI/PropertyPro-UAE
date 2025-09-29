import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CalendarGrid } from "@/components/calendar-grid";
import { AIAssistant } from "@/components/ai-assistant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Calendar() {
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

  // Fetch companies first to get calendar events
  const { data: companies } = useQuery({
    queryKey: ["/api/companies"],
    enabled: isAuthenticated,
  });

  const companyId = (companies as any)?.[0]?.id;

  const { data: events = [] } = useQuery({
    queryKey: ["/api/calendar-events/company", companyId],
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

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Calendar" />
        <main className="flex-1 overflow-auto bg-background p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Calendar</h3>
              <p className="text-muted-foreground">Payment reminders and property events</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" data-testid="button-previous">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <span className="px-4 py-2 text-foreground font-medium" data-testid="text-current-month">
                {currentMonth}
              </span>
              <Button variant="outline" data-testid="button-next">
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <Card className="mb-6" data-testid="card-calendar">
            <CardContent className="p-6">
              <CalendarGrid events={events as any[]} />
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card data-testid="card-upcoming-events">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {(events as any[]).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No upcoming events</p>
                  <p className="text-sm mt-2">Events will appear here when scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(events as any[]).slice(0, 5).map((event: any) => (
                    <div key={event.id} className="flex items-center p-4 bg-muted rounded-lg" data-testid={`event-${event.id}`}>
                      <div className="w-3 h-3 bg-primary rounded-full mr-4"></div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.eventDate).toLocaleDateString()} • {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}
