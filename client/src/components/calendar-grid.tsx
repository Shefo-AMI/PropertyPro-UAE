import { Badge } from "@/components/ui/badge";
import type { CalendarEvent } from "@shared/schema";

interface CalendarGridProps {
  events: CalendarEvent[];
}

export function CalendarGrid({ events }: CalendarGridProps) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
  
  const days = [];
  const currentDay = new Date(startDate);
  
  // Generate 42 days (6 weeks) for the calendar grid
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }

  const isCurrentMonth = (date: Date) => date.getMonth() === month;
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.eventDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'rent_due':
        return 'bg-chart-2 text-white';
      case 'maintenance':
        return 'bg-destructive text-destructive-foreground';
      case 'inspection':
        return 'bg-chart-4 text-white';
      case 'lease_end':
        return 'bg-chart-3 text-white';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div data-testid="calendar-grid">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map(day => (
          <div key={day} className="text-center py-2 text-muted-foreground font-medium text-sm">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isCurrentMonthDay = isCurrentMonth(date);
          const isTodayDate = isToday(date);
          
          return (
            <div 
              key={index}
              className={`p-2 h-24 border-t border-l border-border ${
                !isCurrentMonthDay ? 'text-muted-foreground' : 'text-card-foreground'
              } ${isTodayDate ? 'bg-primary/10' : ''}`}
              data-testid={`calendar-day-${date.getDate()}`}
            >
              <div className={`text-sm ${isTodayDate ? 'font-bold' : ''}`}>
                {date.getDate()}
              </div>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 2).map(event => (
                  <Badge 
                    key={event.id}
                    className={`text-xs px-1 py-0.5 ${getEventColor(event.eventType || 'default')}`}
                    data-testid={`event-${event.id}`}
                  >
                    {event.title.length > 8 ? event.title.substring(0, 8) + '...' : event.title}
                  </Badge>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
