import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Clock, User, CheckCircle, XCircle, Download, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockAppointments, type Appointment } from "@/data/mockData";

const toICS = (appt: Appointment): string => {
  const dateTime = `${appt.date}T${appt.time}:00`;
  const start = new Date(dateTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const end = new Date(new Date(dateTime).getTime() + 60*60*1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Medical Assistant//EN
BEGIN:VEVENT
UID:${appt.id}
DTSTART:${start}
DTEND:${end}
SUMMARY:Appointment with ${appt.patientName}
DESCRIPTION:${appt.notes || 'Medical consultation'}
END:VEVENT
END:VCALENDAR`;
};

export default function Schedule() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newAppointmentData, setNewAppointmentData] = useState({
    patient: "",
    time: "",
    notes: ""
  });

  const dayAppointments = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  }, [appointments, selectedDate]);

  const updateStatus = (id: string, status: Appointment["status"]) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status } : apt
    ));
    
    toast({
      title: "Appointment Updated",
      description: `Status changed to ${status}`,
    });
  };

  const createAppt = () => {
    if (!newAppointmentData.patient || !newAppointmentData.time) return;
    
    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      patientId: `pat-${Date.now()}`,
      patientName: newAppointmentData.patient,
      doctorId: 'doc-001',
      doctorName: 'Dr. Rajesh Sharma',
      date: selectedDate.toISOString().split('T')[0],
      time: newAppointmentData.time,
      status: "scheduled",
      type: "consultation",
      notes: newAppointmentData.notes
    };
    
    setAppointments(prev => [...prev, newAppt]);
    setNewAppointmentData({ patient: "", time: "", notes: "" });
    
    toast({
      title: "Appointment Scheduled",
      description: `Appointment with ${newAppt.patientName} scheduled successfully`,
    });
  };

  const googleLink = (a: Appointment) => {
    const dateTime = `${a.date}T${a.time}:00`;
    const start = new Date(dateTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(new Date(dateTime).getTime() + 60*60*1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Appointment%20with%20${a.patientName}&dates=${start}/${end}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <CalendarDays className="w-5 h-5 mr-2" />
            Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar 
            mode="single" 
            selected={selectedDate} 
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border border-white/10"
          />
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full mt-4" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Patient Name</label>
                  <Input
                    placeholder="Enter patient name"
                    value={newAppointmentData.patient}
                    onChange={(e) => setNewAppointmentData({ ...newAppointmentData, patient: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Time</label>
                  <Input
                    type="time"
                    value={newAppointmentData.time}
                    onChange={(e) => setNewAppointmentData({ ...newAppointmentData, time: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    placeholder="Appointment notes (optional)"
                    value={newAppointmentData.notes}
                    onChange={(e) => setNewAppointmentData({ ...newAppointmentData, notes: e.target.value })}
                  />
                </div>
                <Button onClick={createAppt} className="w-full">
                  Schedule Appointment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Appointments */}
      <Card className="glass-card border-white/10 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-foreground">
            <span className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Appointments - {selectedDate.toDateString()}
            </span>
            <Badge variant="outline">
              {dayAppointments.length} scheduled
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dayAppointments.length === 0 ? (
              <div className="text-center py-12">
                <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No appointments scheduled for this date</p>
              </div>
            ) : (
              dayAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{apt.patientName}</p>
                      <p className="text-sm text-muted-foreground">{apt.time}</p>
                      <p className="text-xs text-muted-foreground">{apt.type}</p>
                      {apt.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{apt.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      apt.status === 'confirmed' ? 'default' :
                      apt.status === 'cancelled' ? 'destructive' : 'secondary'
                    }>
                      {apt.status}
                    </Badge>
                    <div className="flex space-x-1">
                      {apt.status === 'scheduled' && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateStatus(apt.id, 'confirmed')}
                          >
                            <CheckCircle className="w-4 h-4 text-success" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateStatus(apt.id, 'cancelled')}
                          >
                            <XCircle className="w-4 h-4 text-destructive" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(googleLink(apt))}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const blob = new Blob([toICS(apt)], { type: 'text/calendar' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `appointment-${apt.id}.ics`;
                          a.click();
                        }}
                      >
                        <CalendarDays className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}