import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, User, FileText, HeartPulse, Activity } from "lucide-react";
import { toast } from "sonner";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  condition: string;
  lastVisit: string; // ISO date
  status: "stable" | "monitoring" | "critical";
  history: { date: string; note: string }[];
  labReports: { id: string; type: string; date: string; status: "pending" | "ready"; summary: string }[];
}

const mockPatients: Patient[] = [
  {
    id: "p-001",
    name: "Rajesh Kumar",
    age: 45,
    gender: "Male",
    condition: "Diabetes",
    lastVisit: "2024-01-15",
    status: "critical",
    history: [
      { date: "2023-12-10", note: "HbA1c elevated at 8.6%." },
      { date: "2023-10-06", note: "Metformin started 500mg BID." },
    ],
    labReports: [
      { id: "r-1001", type: "HbA1c", date: "2024-01-12", status: "ready", summary: "Elevated HbA1c indicates poor glycemic control." },
      { id: "r-1002", type: "Lipid Profile", date: "2023-12-22", status: "ready", summary: "LDL borderline high." },
    ],
  },
  {
    id: "p-002",
    name: "Priya Sharma",
    age: 32,
    gender: "Female",
    condition: "Hypertension",
    lastVisit: "2024-01-14",
    status: "stable",
    history: [
      { date: "2023-11-02", note: "BP controlled on current regimen." },
    ],
    labReports: [
      { id: "r-1003", type: "CBC", date: "2023-11-01", status: "ready", summary: "Within normal limits." },
    ],
  },
  {
    id: "p-003",
    name: "Amit Singh",
    age: 58,
    gender: "Male",
    condition: "Heart Disease",
    lastVisit: "2024-01-13",
    status: "monitoring",
    history: [
      { date: "2023-09-18", note: "Statin therapy initiated." },
    ],
    labReports: [
      { id: "r-1004", type: "ECG", date: "2023-09-18", status: "ready", summary: "Non-specific ST-T changes." },
    ],
  },
];

export default function PatientList() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Patient | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return mockPatients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q) ||
        String(p.age).includes(q)
    );
  }, [query]);

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-foreground">
          <span className="flex items-center"><User className="w-5 h-5 mr-2" /> Patient List</span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, condition, age"
              className="pl-10 w-72 bg-muted/50 border-white/20"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.age}</TableCell>
                <TableCell>{p.condition}</TableCell>
                <TableCell>{p.lastVisit}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      p.status === "critical" ? "destructive" : p.status === "monitoring" ? "secondary" : "outline"
                    }
                  >
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelected(p)}>
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle className="text-foreground">{p.name} — Quick Profile</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="max-h-[65vh] pr-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center"><Activity className="w-4 h-4 mr-2"/>Overview</h4>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <p>Age: <span className="text-foreground font-medium">{p.age}</span></p>
                              <p>Gender: <span className="text-foreground font-medium">{p.gender}</span></p>
                              <p>Primary Condition: <span className="text-foreground font-medium">{p.condition}</span></p>
                              <p>Last Visit: <span className="text-foreground font-medium">{p.lastVisit}</span></p>
                            </div>
                            <Separator className="my-4" />
                            <h4 className="font-semibold mb-2 flex items-center"><HeartPulse className="w-4 h-4 mr-2"/>Medical History</h4>
                            <ul className="space-y-2 text-sm">
                              {p.history.map((h) => (
                                <li key={h.date} className="p-3 rounded-md bg-muted/40 border border-white/10">
                                  <p className="text-foreground font-medium">{h.date}</p>
                                  <p className="text-muted-foreground">{h.note}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center"><FileText className="w-4 h-4 mr-2"/>Lab Reports</h4>
                            <ul className="space-y-2 text-sm">
                              {p.labReports.map((r) => (
                                <li key={r.id} className="p-3 rounded-md bg-muted/40 border border-white/10">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-foreground font-medium">{r.type} — {r.date}</p>
                                      <p className="text-muted-foreground">{r.summary}</p>
                                    </div>
                                    <Badge variant={r.status === "ready" ? "secondary" : "outline"}>{r.status}</Badge>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            <Button
                              className="mt-4"
                              onClick={() => {
                                toast.success("Patient opened in AI Suggestions", { description: "Jumping to AI panel..." });
                                setSelected(p);
                              }}
                            >
                              Analyze with AI
                            </Button>
                          </div>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
