import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Heart, 
  Activity, 
  Calendar,
  AlertTriangle, 
  FileText, 
  Pill,
  Settings,
  Home,
  Clock,
  TrendingUp,
  TrendingDown,
  Download,
  CheckCircle,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PatientPrescriptionView } from "@/components/prescriptions/PatientPrescriptionView";
import { mockPatients, mockLabReports, mockAppointments, mockPrescriptions, mockMedicines } from "@/data/mockData";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock current patient (in real app, would come from auth context)
  const currentPatientId = 'pat-001';
  const currentPatient = mockPatients.find(p => p.id === currentPatientId)!;
  const patientLabReports = mockLabReports.filter(lr => lr.patientId === currentPatientId);
  const patientAppointments = mockAppointments.filter(a => a.patientId === currentPatientId);
  const patientPrescriptions = mockPrescriptions.filter(p => p.patientId === currentPatientId);

  const healthMetrics = [
    { title: "Blood Pressure", value: "120/80", status: "normal", trend: "stable", icon: Heart },
    { title: "Blood Sugar", value: "95 mg/dL", status: "normal", trend: "down", icon: Activity },
    { title: "Heart Rate", value: "72 bpm", status: "normal", trend: "stable", icon: Heart },
    { title: "Weight", value: "68 kg", status: "normal", trend: "up", icon: TrendingUp }
  ];

  // Get current medications from prescriptions
  const currentMedications = patientPrescriptions
    .filter(p => p.status === 'active')
    .flatMap(p => p.medicines.map(m => ({
      name: m.medicineName,
      dosage: m.dosage,
      frequency: m.frequency,
      nextDose: "8:00 AM", // Mock next dose time
      status: "active"
    })));

  const healthAlerts = [
    ...(patientLabReports.filter(lr => lr.urgent).map(lr => ({
      type: "Lab Results",
      message: `Urgent: ${lr.testType} results require attention`,
      severity: "high" as const
    }))),
    ...(patientAppointments.filter(a => new Date(a.date) <= new Date(Date.now() + 24*60*60*1000)).map(a => ({
      type: "Appointment",
      message: `Upcoming appointment with ${a.doctorName}`,
      severity: "medium" as const
    }))),
    {
      type: "Medication Reminder",
      message: "Time to take your evening medication",
      severity: "low" as const
    }
  ];

  const sidebarItems = [
    { id: "overview", label: "Health Overview", icon: Home },
    { id: "prescriptions", label: "E-Prescriptions", icon: FileText },
    { id: "medications", label: "Medications", icon: Pill },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "reports", label: "Lab Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-white/10 backdrop-blur-xl">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-patient/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-patient" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Patient Portal</h1>
                <p className="text-xs text-muted-foreground">Your Health Hub</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start ${activeTab === item.id ? 'bg-patient/20 text-patient' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Button 
              variant="outline" 
              className="w-full glass-button"
              onClick={() => navigate("/")}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="border-b border-white/10 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Health Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {currentPatient.name}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" className="glass-button">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Health Alerts */}
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <AlertTriangle className="w-5 h-5 mr-2 text-warning" />
                      Health Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {healthAlerts.map((alert, index) => (
                      <div key={index} className="p-3 rounded-lg bg-muted/30 border border-white/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <Badge variant={alert.severity === 'medium' ? 'secondary' : 'outline'} className="mb-1">
                              {alert.type}
                            </Badge>
                            <p className="text-foreground text-sm">{alert.message}</p>
                          </div>
                          <Clock className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Health Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {healthMetrics.map((metric, index) => (
                    <Card key={index} className="glass-card border-white/10">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 bg-patient/20 rounded-lg flex items-center justify-center">
                            <metric.icon className="w-5 h-5 text-patient" />
                          </div>
                          <div className="flex items-center space-x-1">
                            {metric.trend === 'up' ? (
                              <TrendingUp className="w-4 h-4 text-success" />
                            ) : metric.trend === 'down' ? (
                              <TrendingDown className="w-4 h-4 text-patient" />
                            ) : (
                              <div className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{metric.title}</p>
                          <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                          <Badge variant="outline" className="mt-2">
                            {metric.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Current Medications */}
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-foreground">
                      <span className="flex items-center">
                        <Pill className="w-5 h-5 mr-2" />
                        Current Medications
                      </span>
                      <Button variant="outline" size="sm" className="glass-button">
                        Manage
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentMedications.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No active medications</p>
                      ) : (
                        currentMedications.map((med, index) => (
                          <div key={index} className="p-4 rounded-lg bg-muted/20 border border-white/10">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <div className="w-3 h-3 bg-patient rounded-full"></div>
                                  <div>
                                    <p className="font-semibold text-foreground">{med.name}</p>
                                    <p className="text-sm text-muted-foreground">{med.dosage} • {med.frequency}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-foreground">Next: {med.nextDose}</p>
                                <Badge variant="outline" className="mt-1">
                                  {med.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Appointments */}
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-foreground">
                      <span className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Upcoming Appointments
                      </span>
                      <Button variant="outline" size="sm" className="glass-button">
                        Book New
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {patientAppointments.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No upcoming appointments</p>
                      ) : (
                        patientAppointments.map((apt, index) => (
                          <div key={index} className="p-4 rounded-lg bg-muted/20 border border-white/10">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-foreground">{apt.doctorName}</p>
                                <p className="text-sm text-patient">Appointment • {apt.type}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-foreground">{new Date(apt.date).toLocaleDateString()}</p>
                                <p className="text-sm text-muted-foreground">{apt.time}</p>
                                <Badge variant="outline" className="mt-1">
                                  {apt.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "prescriptions" && (
              <div className="space-y-6">
                <PatientPrescriptionView />
              </div>
            )}

            {activeTab === "medications" && (
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-foreground">
                    <span className="flex items-center">
                      <Pill className="w-5 h-5 mr-2" />
                      My Medications
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentMedications.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No active medications</p>
                    ) : (
                      currentMedications.map((med, index) => (
                        <div key={index} className="p-4 rounded-lg bg-muted/20 border border-white/10">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-patient rounded-full"></div>
                                <div>
                                  <p className="font-semibold text-foreground text-lg">{med.name}</p>
                                  <p className="text-sm text-muted-foreground">{med.dosage} • {med.frequency}</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-foreground">Next: {med.nextDose}</p>
                              <Badge variant="outline" className="mt-1">
                                {med.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="glass-button">
                              Set Reminder
                            </Button>
                            <Button size="sm" variant="outline" className="glass-button">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "appointments" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">My Appointments</h2>
                  <Button className="bg-patient hover:bg-patient/90">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book New Appointment
                  </Button>
                </div>
                {patientAppointments.map((appointment) => (
                  <Card key={appointment.id} className="glass-card border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-patient/20 rounded-full flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-patient" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{appointment.doctorName}</p>
                            <p className="text-sm text-muted-foreground">{appointment.type} appointment</p>
                            <p className="text-sm text-muted-foreground">{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className={
                            appointment.status === 'confirmed' ? 'bg-success/20 text-success' :
                            appointment.status === 'scheduled' ? 'bg-warning/20 text-warning' :
                            appointment.status === 'completed' ? 'bg-muted/20 text-muted-foreground' :
                            'bg-destructive/20 text-destructive'
                          }>
                            {appointment.status}
                          </Badge>
                          <div className="flex space-x-2 mt-2">
                            <Button variant="ghost" size="sm">
                              Reschedule
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                      {appointment.notes && (
                        <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                          <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "reports" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Lab Reports</h2>
                  <Button variant="outline" className="glass-button">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                </div>
                {patientLabReports.map((report) => (
                  <Card key={report.id} className="glass-card border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-lab/20 rounded-full flex items-center justify-center">
                            <FileText className="w-6 h-6 text-lab" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{report.testType}</p>
                            <p className="text-sm text-muted-foreground">By {report.doctorName}</p>
                            <p className="text-sm text-muted-foreground">{new Date(report.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className={
                            report.status === 'completed' ? 'bg-success/20 text-success' :
                            report.status === 'pending' ? 'bg-warning/20 text-warning' :
                            report.status === 'critical' ? 'bg-destructive/20 text-destructive' :
                            'bg-info/20 text-info'
                          }>
                            {report.status}
                          </Badge>
                          {report.urgent && (
                            <Badge variant="destructive" className="ml-2">
                              URGENT
                            </Badge>
                          )}
                          <div className="flex space-x-2 mt-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                      {report.summary && (
                        <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                          <p className="text-sm font-medium text-foreground mb-1">Summary:</p>
                          <p className="text-sm text-muted-foreground">{report.summary}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "medications" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">My Medications</h2>
                  <Button className="bg-patient hover:bg-patient/90">
                    <Pill className="w-4 h-4 mr-2" />
                    Add Medication
                  </Button>
                </div>
                {currentMedications.map((medication, index) => (
                  <Card key={index} className="glass-card border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-patient/20 rounded-full flex items-center justify-center">
                            <Pill className="w-6 h-6 text-patient" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{medication.name}</p>
                            <p className="text-sm text-muted-foreground">{medication.dosage} • {medication.frequency}</p>
                            <p className="text-sm text-muted-foreground">Next dose: {medication.nextDose}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="bg-success/20 text-success">
                            {medication.status}
                          </Badge>
                          <div className="flex space-x-2 mt-2">
                            <Button variant="ghost" size="sm">
                              Set Reminder
                            </Button>
                            <Button variant="ghost" size="sm">
                              Mark Taken
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Settings</h2>
                
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-foreground">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">Full Name</label>
                        <p className="text-muted-foreground">{currentPatient.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Age</label>
                        <p className="text-muted-foreground">{currentPatient.age} years</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Gender</label>
                        <p className="text-muted-foreground">{currentPatient.gender}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Phone</label>
                        <p className="text-muted-foreground">{currentPatient.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <p className="text-muted-foreground">{currentPatient.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Condition</label>
                        <p className="text-muted-foreground">{currentPatient.condition}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="glass-button">
                      Edit Profile
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-foreground">Medical History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {currentPatient.medicalHistory.map((item, index) => (
                        <div key={index} className="p-3 bg-muted/20 rounded-lg border border-white/10">
                          <p className="text-sm text-foreground">{item}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-foreground">Privacy & Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive appointment reminders via email</p>
                      </div>
                      <Button variant="outline" size="sm">Toggle</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">SMS Reminders</p>
                        <p className="text-sm text-muted-foreground">Get medication reminders via SMS</p>
                      </div>
                      <Button variant="outline" size="sm">Toggle</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Data Sharing</p>
                        <p className="text-sm text-muted-foreground">Share data with healthcare providers</p>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab !== "overview" && activeTab !== "prescriptions" && activeTab !== "appointments" && 
             activeTab !== "reports" && activeTab !== "medications" && activeTab !== "settings" && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {sidebarItems.find(item => item.id === activeTab)?.label}
                </h3>
                <p className="text-muted-foreground">This section is under development</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;