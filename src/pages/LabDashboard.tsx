import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FlaskConical, 
  Upload, 
  FileText, 
  Settings,
  Home,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Download,
  ExternalLink,
  Eye,
  Edit
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockLabReports, mockPatients, mockDoctors } from "@/data/mockData";

const LabDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [dragActive, setDragActive] = useState(false);

  const stats = [
    { 
      title: "Reports Uploaded", 
      value: mockLabReports.length.toString(), 
      icon: Upload, 
      trend: `${mockLabReports.filter(r => new Date(r.date) >= new Date(Date.now() - 24*60*60*1000)).length} today`
    },
    { 
      title: "Pending Reviews", 
      value: mockLabReports.filter(r => r.status === 'pending').length.toString(), 
      icon: Clock, 
      trend: `${mockLabReports.filter(r => r.urgent).length} urgent` 
    },
    { 
      title: "Processed Today", 
      value: mockLabReports.filter(r => r.status === 'completed' || r.status === 'reviewed').length.toString(), 
      icon: CheckCircle, 
      trend: "+3 from yesterday" 
    },
    { 
      title: "Critical Results", 
      value: mockLabReports.filter(r => r.status === 'critical').length.toString(), 
      icon: AlertCircle, 
      trend: "Requires attention" 
    }
  ];

  // Use real lab reports from mock data
  const recentReports = mockLabReports.slice(-10); // Show last 10 reports

  const sidebarItems = [
    { id: "overview", label: "Dashboard", icon: Home },
    { id: "upload", label: "Upload Reports", icon: Upload },
    { id: "reports", label: "All Reports", icon: FileText },
    { id: "integration", label: "API Integration", icon: FlaskConical },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file upload logic here
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-white/10 backdrop-blur-xl">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-lab/20 rounded-lg flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-lab" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Lab Portal</h1>
                <p className="text-xs text-muted-foreground">NABL Certified</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start ${activeTab === item.id ? 'bg-lab/20 text-lab' : 'text-muted-foreground hover:text-foreground'}`}
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
                <h1 className="text-2xl font-bold text-foreground">Laboratory Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, MediLab Diagnostics</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search reports..." 
                    className="pl-10 w-64 bg-muted/50 border-white/20"
                  />
                </div>
                <Button className="bg-lab hover:bg-lab/90">
                  <Upload className="w-4 h-4 mr-2" />
                  Quick Upload
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
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-lab/20 rounded-xl flex items-center justify-center">
                            <stat.icon className="w-6 h-6 text-lab" />
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">{stat.title}</p>
                          <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                          <p className="text-xs text-lab mt-1">{stat.trend}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recent Reports Table */}
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-foreground">
                      <span className="flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Recent Report Uploads
                      </span>
                      <Button variant="outline" size="sm" className="glass-button">
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentReports.map((report) => (
                        <div key={report.id} className="p-4 rounded-lg hover:bg-muted/20 transition-colors border border-white/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-lab/20 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-lab" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{report.id}</p>
                                <p className="text-sm text-muted-foreground">
                                  {report.patientName} • {report.testType}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Assigned to: {report.doctorName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(report.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="flex items-center space-x-2">
                                  <Badge 
                                    variant={
                                      report.status === 'completed' || report.status === 'reviewed' ? 'default' :
                                      report.status === 'pending' ? 'secondary' :
                                      report.status === 'critical' ? 'destructive' : 'outline'
                                    }
                                    className={
                                      report.status === 'completed' || report.status === 'reviewed' ? 'bg-success/20 text-success' :
                                      report.status === 'pending' ? 'bg-warning/20 text-warning' :
                                      report.status === 'critical' ? 'bg-destructive/20 text-destructive' : ''
                                    }
                                  >
                                    {report.status}
                                  </Badge>
                                  {report.urgent && (
                                    <Badge variant="destructive" className="text-xs">
                                      URGENT
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          {report.summary && (
                            <div className="mt-3 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
                              <strong>Summary:</strong> {report.summary}
                            </div>
                          )}
                          {report.annotation && (
                            <div className="mt-2 p-2 bg-info/10 rounded text-xs text-info">
                              <strong>Note:</strong> {report.annotation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "upload" && (
              <div className="space-y-6">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-foreground">Upload Laboratory Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                        dragActive 
                          ? 'border-lab bg-lab/10' 
                          : 'border-white/20 hover:border-lab/50'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Upload className="w-16 h-16 text-lab mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Drop files here or click to upload
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Supports PDF, JPEG, PNG files up to 10MB
                      </p>
                      <Button className="bg-lab hover:bg-lab/90">
                        Choose Files
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-foreground">Report Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">Patient ID</label>
                        <Input placeholder="Enter patient ID" className="bg-muted/50 border-white/20 mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Test Type</label>
                        <Input placeholder="e.g., Complete Blood Count" className="bg-muted/50 border-white/20 mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Doctor Name</label>
                        <Input placeholder="Prescribing doctor" className="bg-muted/50 border-white/20 mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Priority</label>
                        <select className="w-full p-2 rounded-md bg-muted/50 border border-white/20 text-foreground mt-1">
                          <option value="normal">Normal</option>
                          <option value="urgent">Urgent</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>
                    <Button className="w-full bg-lab hover:bg-lab/90">
                      Upload Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab !== "overview" && activeTab !== "upload" && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FlaskConical className="w-8 h-8 text-muted-foreground" />
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

export default LabDashboard;