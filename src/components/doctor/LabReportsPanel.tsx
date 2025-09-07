import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { FlaskConical, Upload, Search, FileText, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockLabReports, type LabReport } from "@/data/mockData";

export default function LabReportsPanel() {
  const { toast } = useToast();
  const [reports, setReports] = useState<LabReport[]>(mockLabReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);

  // Simulate real-time report arrivals
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldAddReport = Math.random() > 0.98; // 2% chance every 5 seconds
      if (shouldAddReport) {
        const newReport: LabReport = {
          id: `lab-${Date.now()}`,
          patientId: 'pat-new',
          patientName: `Patient ${Math.floor(Math.random() * 100)}`,
          doctorId: 'doc-001',
          doctorName: 'Dr. Rajesh Sharma',
          testType: ["Blood Test", "Urine Analysis", "X-Ray", "ECG"][Math.floor(Math.random() * 4)],
          date: new Date().toISOString().split('T')[0],
          status: Math.random() > 0.7 ? 'critical' : 'pending',
          urgent: Math.random() > 0.8,
          summary: "New report awaiting review"
        };
        
        setReports(prev => [newReport, ...prev]);
        
        if (newReport.urgent) {
          toast({
            title: "Urgent Report Received",
            description: `${newReport.testType} for ${newReport.patientName}`,
            variant: "destructive"
          });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [toast]);

  const filteredReports = useMemo(() => {
    return reports.filter(report => 
      report.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reports, searchQuery]);

  const saveAnnotation = (reportId: string, annotation: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, annotation } : report
    ));
    setActiveAnnotation(null);
    toast({
      title: "Annotation Saved",
      description: "Your notes have been added to the report",
    });
  };

  const markReviewed = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, status: 'reviewed' } : report
    ));
    toast({
      title: "Report Reviewed",
      description: "Report status updated to reviewed",
    });
  };

  const uploadDummy = () => {
    const dummyReport: LabReport = {
      id: `lab-${Date.now()}`,
      patientId: 'pat-dummy',
      patientName: "Test Patient",
      doctorId: 'doc-001',
      doctorName: 'Dr. Rajesh Sharma',
      testType: "Complete Blood Count",
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      urgent: false,
      summary: "Dummy report for testing"
    };

    setReports(prev => [dummyReport, ...prev]);
    toast({
      title: "Test Report Added",
      description: "Dummy report has been uploaded successfully",
    });
  };

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-foreground">
          <span className="flex items-center">
            <FlaskConical className="w-5 h-5 mr-2" />
            Laboratory Reports
          </span>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-10 w-64 bg-muted/50 border-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={uploadDummy} variant="outline" className="glass-button">
              <Upload className="w-4 h-4 mr-2" />
              Add Test Report
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Test Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id} className="hover:bg-muted/30">
                <TableCell className="font-medium text-foreground">{report.patientName}</TableCell>
                <TableCell className="text-foreground">{report.testType}</TableCell>
                <TableCell className="text-muted-foreground">{report.date}</TableCell>
                <TableCell>
                  <Badge variant={
                    report.status === 'critical' ? 'destructive' :
                    report.status === 'completed' ? 'default' :
                    report.status === 'reviewed' ? 'secondary' : 'outline'
                  }>
                    <div className="flex items-center space-x-1">
                      {report.status === 'critical' && <AlertCircle className="w-3 h-3" />}
                      {report.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                      {report.status === 'pending' && <Clock className="w-3 h-3" />}
                      <span>{report.status}</span>
                    </div>
                  </Badge>
                </TableCell>
                <TableCell>
                  {report.urgent && (
                    <Badge variant="destructive" className="text-xs">
                      URGENT
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {activeAnnotation === report.id ? (
                      <div className="flex items-center space-x-2">
                        <Textarea
                          placeholder="Add annotation..."
                          className="w-40 h-8 text-xs resize-none"
                          defaultValue={report.annotation || ""}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              saveAnnotation(report.id, (e.target as HTMLTextAreaElement).value);
                            }
                          }}
                        />
                        <Button 
                          size="sm" 
                          onClick={() => {
                            const textarea = document.querySelector(`textarea[defaultValue="${report.annotation || ""}"]`) as HTMLTextAreaElement;
                            saveAnnotation(report.id, textarea?.value || "");
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setActiveAnnotation(report.id)}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                        {report.status === 'completed' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => markReviewed(report.id)}
                          >
                            Mark Reviewed
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FlaskConical className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No reports found matching your search</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}