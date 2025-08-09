import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Clock, Check, X, Link as LinkIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

interface Appointment {
  id: string;
  patient: string;
  date: Date;
  status: "pending" | "accepted" | "rejected";
  notes?: string;
}

const seed: Appointment[] = [
  { id: "a-1", patient: "Rajesh Kumar", date: new Date(), status: "pending", notes: "Follow-up on HbA1c" },
  { id: "a-2", patient: "Priya Sharma", date: new Date(Date.now() + 86400000), status: "accepted", notes: "BP check" },
];

function toICS(appt: Appointment) {
  const dt = appt.date;
  const pad = (n: number) => String(n).padStart(2, "0");
  const dtstamp = `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`;
  const body = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Medical Assistant//EN\nBEGIN:VEVENT\nUID:${appt.id}\nDTSTAMP:${dtstamp}\nDTSTART:${dtstamp}\nDTEND:${dtstamp}\nSUMMARY:Appointment with ${appt.patient}\nDESCRIPTION:${appt.notes ?? ""}\nEND:VEVENT\nEND:VCALENDAR`;
  return new Blob([body], { type: "text/calendar" });
}

export default function Schedule() {
  const [appointments, setAppointments] = useState<Appointment[]>(seed);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newAppt, setNewAppt] = useState({ patient: "", time: "10:00", notes: "" });

  const dayAppointments = useMemo(() =>
    appointments.filter((a) => selectedDate && a.date.toDateString() === selectedDate.toDateString()),
  [appointments, selectedDate]);

  const updateStatus = (id: string, status: Appointment["status"]) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    toast.success(`Appointment ${status}`);
  };

  const createAppt = () => {
    if (!selectedDate || !newAppt.patient) return toast.error("Enter patient and date");
    const [h, m] = newAppt.time.split(":").map(Number);
    const when = new Date(selectedDate);
    when.setHours(h, m, 0, 0);
    const a: Appointment = { id: "a-" + Date.now(), patient: newAppt.patient, date: when, status: "pending", notes: newAppt.notes };
    setAppointments((p) => [...p, a]);
    toast.success("Appointment created");
  };

  const googleLink = (a: Appointment) => {
    const start = a.date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const end = start; // 30m omitted for brevity
    const text = encodeURIComponent(`Appointment with ${a.patient}`);
    const details = encodeURIComponent(a.notes ?? "");
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="glass-card border-white/10 lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground"><CalendarIcon className="w-5 h-5 mr-2"/> Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate as any} className="rounded-md border" />
        </CardContent>
      </Card>

      <Card className="glass-card border-white/10 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-foreground">
            <span className="flex items-center"><Clock className="w-5 h-5 mr-2"/> Appointments</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">New</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New appointment</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Input placeholder="Patient name" value={newAppt.patient} onChange={(e) => setNewAppt({ ...newAppt, patient: e.target.value })} />
                  <Input placeholder="HH:MM" value={newAppt.time} onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })} />
                  <Textarea placeholder="Notes" value={newAppt.notes} onChange={(e) => setNewAppt({ ...newAppt, notes: e.target.value })} />
                  <Button onClick={createAppt}>Create</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            <div className="space-y-3">
              {dayAppointments.length === 0 && (
                <p className="text-sm text-muted-foreground">No appointments on this day.</p>
              )}
              {dayAppointments.map((a) => (
                <div key={a.id} className="p-4 rounded-md bg-muted/40 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{a.patient}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4"/>
                      {a.date.toLocaleString()} — <span className="capitalize">{a.status}</span>
                    </p>
                    {a.notes && <p className="text-sm text-muted-foreground mt-1">{a.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={googleLink(a)} target="_blank" rel="noreferrer" className="inline-flex">
                      <Button variant="ghost" size="sm"><LinkIcon className="w-4 h-4 mr-1"/>Google</Button>
                    </a>
                    <a download={`appointment-${a.id}.ics`} href={URL.createObjectURL(toICS(a))} className="inline-flex">
                      <Button variant="ghost" size="sm">.ics</Button>
                    </a>
                    <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, "accepted")}><Check className="w-4 h-4"/></Button>
                    <Button size="sm" variant="ghost" onClick={() => updateStatus(a.id, "rejected")}><X className="w-4 h-4"/></Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a date to view appointments.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
