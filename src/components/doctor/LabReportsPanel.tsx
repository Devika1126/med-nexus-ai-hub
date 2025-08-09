import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export interface LabReport {
  id: string;
  patientName: string;
  type: string;
  date: string; // ISO
  status: "pending" | "ready";
  urgent?: boolean;
  summary: string;
  annotation?: string;
}

const initialReports: LabReport[] = [
  { id: "r-1001", patientName: "Rajesh Kumar", type: "HbA1c", date: "2024-01-12", status: "ready", summary: "Elevated HbA1c indicates poor glycemic control.", annotation: "Increase dose and dietary counseling." },
  { id: "r-1005", patientName: "Amit Singh", type: "Lipid Profile", date: "2024-01-13", status: "pending", urgent: true, summary: "Awaiting LDL fractional breakdown." },
  { id: "r-1007", patientName: "Priya Sharma", type: "CBC", date: "2024-01-11", status: "ready", summary: "Within normal range." },
];

export default function LabReportsPanel() {
  const [reports, setReports] = useState<LabReport[]>(() => {
    const saved = localStorage.getItem("lab_reports");
    return saved ? JSON.parse(saved) : initialReports;
  });
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    localStorage.setItem("lab_reports", JSON.stringify(reports));
  }, [reports]);

  // Simulate realtime: new ready report arrives after 10s
  useEffect(() => {
    const t = setTimeout(() => {
      const newReport: LabReport = {
        id: "r-rt-" + Date.now(),
        patientName: "Auto Stream",
        type: "CRP",
        date: new Date().toISOString().slice(0, 10),
        status: "ready",
        summary: "Realtime update: CRP mildly elevated.",
      };
      setReports((prev) => [newReport, ...prev]);
      toast.info("New lab report received", { description: `${newReport.patientName} • ${newReport.type}` });
    }, 10000);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return reports.filter(
      (r) =>
        r.patientName.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [reports, query]);

  const saveAnnotation = (id: string) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, annotation: note } : r)));
    setActiveId(null);
    setNote("");
    toast.success("Annotation saved");
  };

  const markReviewed = (id: string) => {
    toast.success("Marked as reviewed");
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "ready" } : r)));
  };

  const uploadDummy = () => {
    const dummy: LabReport = {
      id: "r-up-" + Date.now(),
      patientName: "Manual Upload",
      type: "Vitamin D",
      date: new Date().toISOString().slice(0, 10),
      status: "ready",
      summary: "Uploaded report: Vitamin D insufficient.",
      annotation: "Start supplementation 2000 IU daily.",
    };
    setReports((prev) => [dummy, ...prev]);
    toast.success("Report uploaded");
  };

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-foreground">
          <span className="flex items-center"><FileText className="w-5 h-5 mr-2" /> Lab Reports</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient, type, status"
                className="pl-10 w-72 bg-muted/50 border-white/20"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button onClick={uploadDummy} variant="outline" className="glass-button">
              <UploadCloud className="w-4 h-4 mr-2" /> Upload
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[520px] pr-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Annotation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/30">
                  <TableCell>{r.patientName}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === "ready" ? "secondary" : "outline"}>
                      {r.urgent && <span className="mr-2">⚠️</span>}
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate" title={r.annotation}>{r.annotation ?? "—"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {r.status !== "ready" ? (
                      <Button size="sm" variant="ghost" onClick={() => markReviewed(r.id)}>
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Mark Ready
                      </Button>
                    ) : null}
                    {activeId === r.id ? (
                      <div className="flex items-center gap-2">
                        <Textarea
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Add annotation"
                          className="w-56"
                        />
                        <Button size="sm" onClick={() => saveAnnotation(r.id)}>Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setActiveId(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => { setActiveId(r.id); setNote(r.annotation ?? ""); }}>
                        Annotate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
