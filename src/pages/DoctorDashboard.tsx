import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Stethoscope, 
  Users, 
  AlertTriangle, 
  FileText, 
  Search,
  Bell,
  Settings,
  Home,
  Brain,
  Calendar,
  ChevronRight,
  Pill
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PrescriptionEditor } from "@/components/prescriptions/PrescriptionEditor";
import PatientsPanel from "@/components/doctor/PatientList";
import ReportsPanel from "@/components/doctor/LabReportsPanel";
import AISuggestions from "@/components/doctor/AISuggestions";
import Schedule from "@/components/doctor/Schedule";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { title: "Today's Patients", value: "12", icon: Users, color: "patient" },
    { title: "Pending Reports", value: "8", icon: FileText, color: "lab" },
    { title: "AI Alerts", value: "3", icon: AlertTriangle, color: "warning" },
    { title: "Prescriptions", value: "45", icon: Stethoscope, color: "doctor" }
  ];

  const recentPatients = [
    { id: 1, name: "Rajesh Kumar", age: 45, condition: "Diabetes", lastVisit: "2024-01-15", status: "critical" },
    { id: 2, name: "Priya Sharma", age: 32, condition: "Hypertension", lastVisit: "2024-01-14", status: "stable" },
    { id: 3, name: "Amit Singh", age: 58, condition: "Heart Disease", lastVisit: "2024-01-13", status: "monitoring" },
    { id: 4, name: "Sunita Devi", age: 41, condition: "Asthma", lastVisit: "2024-01-12", status: "stable" }
  ];

  const aiAlerts = [
    { type: "Drug Interaction", patient: "Rajesh Kumar", severity: "high", message: "Potential interaction between Metformin and prescribed antibiotic" },
    { type: "Dosage Warning", patient: "Amit Singh", severity: "medium", message: "Blood pressure medication dosage may need adjustment based on recent labs" },
    { type: "Allergy Alert", patient: "Priya Sharma", severity: "high", message: "Patient has documented allergy to prescribed medication class" }
  ];

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "patients", label: "Patient List", icon: Users },
    { id: "reports", label: "Lab Reports", icon: FileText },
    { id: "prescriptions", label: "E-Prescriptions", icon: Pill },
    { id: "ai-suggestions", label: "AI Suggestions", icon: Brain },
    { id: "calendar", label: "Schedule", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-white/10 backdrop-blur-xl">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Dr. Portal</h1>
                <p className="text-xs text-muted-foreground">NMC Verified</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start ${activeTab === item.id ? 'bg-doctor/20 text-doctor' : 'text-muted-foreground hover:text-foreground'}`}
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
                <h1 className="text-2xl font-bold text-foreground">Doctor Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Dr. Smith</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search patients..." 
                    className="pl-10 w-64 bg-muted/50 border-white/20"
                  />
                </div>
                <Button variant="outline" size="icon" className="glass-button">
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <Card key={index} className="glass-card border-white/10">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-muted-foreground text-sm">{stat.title}</p>
                            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                          </div>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            stat.color === 'doctor' ? 'bg-doctor/20 text-doctor' :
                            stat.color === 'patient' ? 'bg-patient/20 text-patient' :
                            stat.color === 'lab' ? 'bg-lab/20 text-lab' :
                            'bg-warning/20 text-warning'
                          }`}>
                            <stat.icon className="w-6 h-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* AI Alerts */}
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <AlertTriangle className="w-5 h-5 mr-2 text-warning" />
                      AI-Powered Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {aiAlerts.map((alert, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/30 border border-white/10">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                                {alert.severity} priority
                              </Badge>
                              <span className="text-sm font-medium text-foreground">{alert.type}</span>
                            </div>
                            <p className="text-muted-foreground text-sm mb-1">Patient: {alert.patient}</p>
                            <p className="text-foreground">{alert.message}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Patients */}
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-foreground">
                      <span className="flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Recent Patients
                      </span>
                      <Button variant="outline" size="sm" className="glass-button">
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentPatients.map((patient) => (
                        <div key={patient.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/20 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-patient/20 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-patient" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{patient.name}</p>
                              <p className="text-sm text-muted-foreground">Age: {patient.age} • {patient.condition}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={
                              patient.status === 'critical' ? 'destructive' :
                              patient.status === 'monitoring' ? 'secondary' :
                              'outline'
                            }>
                              {patient.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">{patient.lastVisit}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "prescriptions" && (
              <PrescriptionEditor />
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

export default DoctorDashboard;