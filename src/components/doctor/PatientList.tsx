import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, User, Calendar, FileText, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockPatients, type Patient } from "@/data/mockData";

export default function PatientList() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filteredPatients = useMemo(() => {
    return mockPatients.filter(patient =>
      patient.name.toLowerCase().includes(query.toLowerCase()) ||
      patient.condition.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-foreground">
          <span className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Patient List
          </span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
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
              <TableHead>Patient</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id} className="hover:bg-muted/30">
                <TableCell className="font-medium text-foreground">{patient.name}</TableCell>
                <TableCell className="text-muted-foreground">{patient.age}</TableCell>
                <TableCell className="text-muted-foreground">{patient.condition}</TableCell>
                <TableCell className="text-muted-foreground">{patient.lastVisit}</TableCell>
                <TableCell>
                  <Badge variant={
                    patient.status === 'critical' ? 'destructive' :
                    patient.status === 'inactive' ? 'secondary' : 'default'
                  }>
                    {patient.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle className="text-foreground">
                          {patient.name} - Patient Profile
                        </DialogTitle>
                      </DialogHeader>
                      
                      {selectedPatient && (
                        <div className="space-y-6">
                          {/* Patient Overview */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="font-semibold flex items-center text-foreground">
                                <User className="w-4 h-4 mr-2" />
                                Patient Overview
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Age:</span>
                                  <span className="text-foreground">{selectedPatient.age} years</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Gender:</span>
                                  <span className="text-foreground">{selectedPatient.gender}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Condition:</span>
                                  <span className="text-foreground">{selectedPatient.condition}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Last Visit:</span>
                                  <span className="text-foreground">{selectedPatient.lastVisit}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Phone:</span>
                                  <span className="text-foreground">{selectedPatient.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Email:</span>
                                  <span className="text-foreground">{selectedPatient.email}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="font-semibold flex items-center text-foreground">
                                <Activity className="w-4 h-4 mr-2" />
                                Medical History
                              </h4>
                              <div className="space-y-4">
                                {selectedPatient.medicalHistory.map((history, idx) => (
                                  <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground">{history}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Lab Reports */}
                          <div className="space-y-4">
                            <h4 className="font-semibold flex items-center text-foreground">
                              <FileText className="w-4 h-4 mr-2" />
                              Recent Lab Reports
                            </h4>
                            <div className="space-y-4">
                              {selectedPatient.labReports.map((report) => (
                                <div key={report.id} className="p-3 bg-muted/50 rounded-lg">
                                  <div className="flex justify-between items-start mb-2">
                                    <p className="font-medium text-foreground">{report.testType}</p>
                                    <p className="text-xs text-muted-foreground">{report.date}</p>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Status: {report.status} {report.results && `- ${report.results}`}
                                  </p>
                                  {report.summary && (
                                    <p className="text-xs text-muted-foreground mt-2">{report.summary}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Active Prescriptions */}
                          <div className="space-y-4">
                            <h4 className="font-semibold flex items-center text-foreground">
                              <Calendar className="w-4 h-4 mr-2" />
                              Active Prescriptions
                            </h4>
                            <div className="space-y-4">
                              {selectedPatient.prescriptions.map((prescription) => (
                                <div key={prescription.id} className="p-3 bg-muted/50 rounded-lg">
                                  <div className="flex justify-between items-start mb-2">
                                    <p className="font-medium text-foreground">Prescription #{prescription.id}</p>
                                    <p className="text-xs text-muted-foreground">{prescription.date}</p>
                                  </div>
                                  <div className="space-y-1">
                                    {prescription.medicines.map((medicine, idx) => (
                                      <p key={idx} className="text-sm text-muted-foreground">
                                        {medicine.medicineName} - {medicine.dosage} ({medicine.frequency})
                                      </p>
                                    ))}
                                  </div>
                                  {prescription.notes && (
                                    <p className="text-xs text-muted-foreground mt-2">{prescription.notes}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button 
                              onClick={() => {
                                toast({
                                  title: "AI Analysis Started",
                                  description: `Analyzing ${selectedPatient.name}'s medical data...`,
                                });
                              }}
                            >
                              Analyze with AI
                            </Button>
                          </div>
                        </div>
                      )}
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