import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Calendar as CalendarWidget } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

// Appointment types with their colors
const appointmentTypes = {
  cleaning: { label: "Cleaning", color: "bg-teal-500/20 text-teal-600 border-teal-500/30" },
  checkup: { label: "Check-up", color: "bg-blue-500/20 text-blue-600 border-blue-500/30" },
  rootcanal: { label: "Root Canal", color: "bg-orange-500/20 text-orange-600 border-orange-500/30" },
  consultation: { label: "Consultation", color: "bg-purple-500/20 text-purple-600 border-purple-500/30" },
  emergency: { label: "Emergency", color: "bg-red-500/20 text-red-600 border-red-500/30" },
  filling: { label: "Filling", color: "bg-amber-500/20 text-amber-600 border-amber-500/30" },
};

type AppointmentType = keyof typeof appointmentTypes;

interface Appointment {
  id: number;
  patient: string;
  type: AppointmentType;
  date: string;
  time: string;
  duration: number; // in minutes
  phone: string;
}

// Get current week dates
const getWeekDates = (baseDate: Date) => {
  const dates = [];
  const startOfWeek = new Date(baseDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
  startOfWeek.setDate(diff);

  for (let i = 0; i < 5; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date);
  }
  return dates;
};

// Format date as YYYY-MM-DD
const formatDateKey = (date: Date) => {
  return date.toISOString().split("T")[0];
};

// Sample appointments for this week
const generateSampleAppointments = (): Appointment[] => {
  const today = new Date();
  const weekDates = getWeekDates(today);

  return [
    {
      id: 1,
      patient: "Sarah Johnson",
      type: "cleaning",
      date: formatDateKey(weekDates[0]),
      time: "09:00",
      duration: 30,
      phone: "+1 (555) 234-5678",
    },
    {
      id: 2,
      patient: "Mike Chen",
      type: "checkup",
      date: formatDateKey(weekDates[0]),
      time: "10:30",
      duration: 45,
      phone: "+1 (555) 345-6789",
    },
    {
      id: 3,
      patient: "Emma Wilson",
      type: "consultation",
      date: formatDateKey(weekDates[1]),
      time: "14:00",
      duration: 30,
      phone: "+1 (555) 456-7890",
    },
    {
      id: 4,
      patient: "James Rodriguez",
      type: "rootcanal",
      date: formatDateKey(weekDates[2]),
      time: "09:30",
      duration: 90,
      phone: "+1 (555) 567-8901",
    },
    {
      id: 5,
      patient: "Lisa Park",
      type: "filling",
      date: formatDateKey(weekDates[2]),
      time: "15:00",
      duration: 45,
      phone: "+1 (555) 678-9012",
    },
    {
      id: 6,
      patient: "David Thompson",
      type: "cleaning",
      date: formatDateKey(weekDates[3]),
      time: "11:00",
      duration: 30,
      phone: "+1 (555) 789-0123",
    },
    {
      id: 7,
      patient: "Amanda Foster",
      type: "checkup",
      date: formatDateKey(weekDates[4]),
      time: "10:00",
      duration: 45,
      phone: "+1 (555) 890-1234",
    },
    {
      id: 8,
      patient: "Robert Kim",
      type: "emergency",
      date: formatDateKey(weekDates[4]),
      time: "16:00",
      duration: 60,
      phone: "+1 (555) 901-2345",
    },
  ];
};

// Time slots from 9 AM to 5 PM
const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30",
];

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

const formatDateHeader = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const appointments = generateSampleAppointments();
  const weekDates = getWeekDates(currentDate);

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getAppointmentsForSlot = (date: Date, time: string) => {
    const dateKey = formatDateKey(date);
    return appointments.filter(
      (apt) => apt.date === dateKey && apt.time === time
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Calendar"
        description="View and manage appointment schedules"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Mini Calendar Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border/50 p-4">
            <CalendarWidget
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setCurrentDate(date);
                }
              }}
              className="w-full"
            />

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Appointment Types
              </p>
              <div className="space-y-2">
                {Object.entries(appointmentTypes).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-sm border", value.color)} />
                    <span className="text-xs text-muted-foreground">{value.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Week View */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
            {/* Week Navigation */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek("prev")}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <h3 className="text-sm font-semibold">
                {weekDates[0].toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek("next")}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Week Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Day Headers */}
                <div className="grid grid-cols-6 border-b border-border">
                  <div className="p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Time
                  </div>
                  {weekDates.map((date, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "p-3 text-center border-l border-border",
                        isToday(date) && "bg-primary/5"
                      )}
                    >
                      <p className={cn(
                        "text-xs font-medium uppercase tracking-wider",
                        isToday(date) ? "text-primary" : "text-muted-foreground"
                      )}>
                        {formatDateHeader(date)}
                      </p>
                      {isToday(date) && (
                        <Badge variant="default" className="mt-1 text-[10px]">
                          Today
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="divide-y divide-border/50">
                  {timeSlots.map((time) => (
                    <div key={time} className="grid grid-cols-6">
                      <div className="p-3 text-xs font-mono text-muted-foreground border-r border-border/50">
                        {formatTime(time)}
                      </div>
                      {weekDates.map((date, idx) => {
                        const slotAppointments = getAppointmentsForSlot(date, time);
                        return (
                          <div
                            key={idx}
                            className={cn(
                              "p-1 min-h-[60px] border-l border-border/50",
                              isToday(date) && "bg-primary/5"
                            )}
                          >
                            {slotAppointments.map((apt) => (
                              <div
                                key={apt.id}
                                className={cn(
                                  "p-2 rounded border text-xs mb-1 cursor-pointer hover:opacity-80 transition-opacity",
                                  appointmentTypes[apt.type].color
                                )}
                              >
                                <div className="flex items-center gap-1 font-medium">
                                  <User className="h-3 w-3" />
                                  {apt.patient}
                                </div>
                                <div className="flex items-center gap-1 mt-1 opacity-80">
                                  <Clock className="h-3 w-3" />
                                  {apt.duration} min
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
