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
  LayoutDashboard,
  Brain,
  Calendar,
  ChevronRight,
  Pill,
  Lightbulb
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PrescriptionEditor } from "@/components/prescriptions/PrescriptionEditor";
import AISuggestions from "@/components/doctor/AISuggestions";
import AICompatibilityPanel from "@/components/doctor/AICompatibilityPanel";
import PatientList from "@/components/doctor/PatientList";
import LabReportsPanel from "@/components/doctor/LabReportsPanel";
import Schedule from "@/components/doctor/Schedule";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "patients", label: "Patients", icon: Users },
    { id: "prescriptions", label: "Prescriptions", icon: Pill },
    { id: "ai-compatibility", label: "AI Compatibility", icon: Brain },
    { id: "reports", label: "Lab Reports", icon: FileText },
    { id: "ai-suggestions", label: "AI Suggestions", icon: Lightbulb },
    { id: "schedule", label: "Schedule", icon: Calendar }
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Statistics Cards */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="glass-card border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                          <p className="text-2xl font-bold text-foreground">247</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">+12% from last month</p>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Prescriptions</p>
                          <p className="text-2xl font-bold text-foreground">89</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Pill className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">+8% from last week</p>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Lab Reports</p>
                          <p className="text-2xl font-bold text-foreground">156</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">23 pending review</p>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">AI Analyses</p>
                          <p className="text-2xl font-bold text-foreground">42</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Brain className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">95% accuracy rate</p>
                    </CardContent>
                  </Card>
                </div>

                {/* AI-Powered Alerts */}
                <div className="space-y-4">
                  <Card className="glass-card border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-warning" />
                        AI Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                        <p className="text-sm font-medium text-foreground">Drug Interaction Alert</p>
                        <p className="text-xs text-muted-foreground">Patient #156 - Potential interaction detected</p>
                      </div>
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-sm font-medium text-foreground">Critical Lab Value</p>
                        <p className="text-xs text-muted-foreground">Patient #203 - Urgent review required</p>
                      </div>
                      <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                        <p className="text-sm font-medium text-foreground">Treatment Success</p>
                        <p className="text-xs text-muted-foreground">Patient #145 - Excellent response</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "patients" && <PatientList />}
            
            {activeTab === "prescriptions" && <PrescriptionEditor />}
            
            {activeTab === "ai-compatibility" && <AICompatibilityPanel />}
            
            {activeTab === "reports" && <LabReportsPanel />}
            
            {activeTab === "ai-suggestions" && <AISuggestions />}
            
            {activeTab === "schedule" && <Schedule />}

            {/* Placeholder for other tabs */}
            {!["overview", "patients", "prescriptions", "ai-compatibility", "reports", "ai-suggestions", "schedule"].includes(activeTab) && (
              <Card className="glass-card border-white/10">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {sidebarItems.find(item => item.id === activeTab)?.label}
                  </h3>
                  <p className="text-muted-foreground">This section is under development.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;