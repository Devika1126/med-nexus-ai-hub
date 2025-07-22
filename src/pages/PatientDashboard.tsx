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
  TrendingDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PatientPrescriptionView } from "@/components/prescriptions/PatientPrescriptionView";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const healthMetrics = [
    { title: "Blood Pressure", value: "120/80", status: "normal", trend: "stable", icon: Heart },
    { title: "Blood Sugar", value: "95 mg/dL", status: "normal", trend: "down", icon: Activity },
    { title: "Heart Rate", value: "72 bpm", status: "normal", trend: "stable", icon: Heart },
    { title: "Weight", value: "68 kg", status: "normal", trend: "up", icon: TrendingUp }
  ];

  const medications = [
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily", nextDose: "2:00 PM", status: "active" },
    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", nextDose: "8:00 AM", status: "active" },
    { name: "Aspirin", dosage: "81mg", frequency: "Once daily", nextDose: "8:00 AM", status: "active" }
  ];

  const upcomingAppointments = [
    { doctor: "Dr. Rajesh Kumar", specialty: "Cardiology", date: "Jan 20, 2024", time: "10:00 AM" },
    { doctor: "Dr. Priya Sharma", specialty: "Endocrinology", date: "Jan 25, 2024", time: "2:30 PM" }
  ];

  const healthAlerts = [
    { type: "Medication Reminder", message: "Time to take your evening medication", severity: "low" },
    { type: "Lab Results", message: "New blood test results available", severity: "medium" },
    { type: "Appointment", message: "Upcoming cardiology appointment tomorrow", severity: "medium" }
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
                <p className="text-muted-foreground">Welcome back, John Doe</p>
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
                      {medications.map((med, index) => (
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
                      ))}
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
                      {upcomingAppointments.map((apt, index) => (
                        <div key={index} className="p-4 rounded-lg bg-muted/20 border border-white/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-foreground">{apt.doctor}</p>
                              <p className="text-sm text-patient">{apt.specialty}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-foreground">{apt.date}</p>
                              <p className="text-sm text-muted-foreground">{apt.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "prescriptions" && (
              <PatientPrescriptionView />
            )}

            {activeTab !== "overview" && activeTab !== "prescriptions" && (
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