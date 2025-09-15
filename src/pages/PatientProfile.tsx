import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompatibilityChecker } from "@/components/prescriptions/CompatibilityChecker";
import { mockPatients, mockLabReports, mockMedicines } from "@/data/mockData";
import { 
  User, 
  FileText, 
  Pill, 
  Search,
  Plus,
  Trash2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Activity,
  Brain
} from "lucide-react";

interface PrescribedMedicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export default function PatientProfile() {
  const { id } = useParams();
  const patient = mockPatients.find(p => p.id === id);
  const patientReports = mockLabReports.filter(report => report.patientId === id);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescribedMedicines, setPrescribedMedicines] = useState<PrescribedMedicine[]>([]);
  const [showCompatibility, setShowCompatibility] = useState(false);

  // Filter medicines based on search
  const filteredMedicines = useMemo(() => {
    return mockMedicines.filter(medicine =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Generate compatibility results
  const compatibilityResults = useMemo(() => {
    if (!prescribedMedicines.length || !patientReports.length) return [];

    return prescribedMedicines.map(medicine => {
      const score = Math.floor(Math.random() * 40) + 60; // 60-100%
      const status: 'safe' | 'caution' | 'unsafe' = score >= 85 ? 'safe' : score >= 70 ? 'caution' : 'unsafe';
      const riskLevel: 'low' | 'moderate' | 'high' = score >= 85 ? 'low' : score >= 70 ? 'moderate' : 'high';

      return {
        medicine: medicine.name,
        score,
        status,
        reasons: [
          `Patient's kidney function affects drug clearance`,
          `Liver enzymes within normal range support safe metabolism`,
          score < 70 ? 'Drug interaction detected with patient history' : 'No significant interactions detected',
          `Patient age (${patient?.age}) considered in dosage calculation`
        ],
        alternatives: status === 'unsafe' ? [
          `Alternative: ${mockMedicines[Math.floor(Math.random() * mockMedicines.length)].name}`,
          `Lower dosage: Reduce by 25% due to patient profile`
        ] : undefined,
        riskLevel,
        explanation: status === 'safe' 
          ? 'This medication shows excellent compatibility with the patient\'s current health profile and lab values.'
          : status === 'caution'
          ? 'This medication requires careful monitoring due to moderate interaction risks with patient\'s profile.'
          : 'This medication shows significant interaction risks. Consider alternatives or dose adjustments.'
      };
    });
  }, [prescribedMedicines, patientReports, patient]);

  const addMedicine = (medicine: any) => {
    const newMedicine: PrescribedMedicine = {
      id: Date.now().toString(),
      name: medicine.name,
      dosage: "",
      frequency: "",
      duration: "",
      instructions: ""
    };
    setPrescribedMedicines([...prescribedMedicines, newMedicine]);
    setSearchTerm("");
  };

  const updateMedicine = (id: string, field: string, value: string) => {
    setPrescribedMedicines(medicines =>
      medicines.map(med =>
        med.id === id ? { ...med, [field]: value } : med
      )
    );
  };

  const removeMedicine = (id: string) => {
    setPrescribedMedicines(medicines => medicines.filter(med => med.id !== id));
  };

  const getLabValueStatus = (value: number, normalRange: string) => {
    const [min, max] = normalRange.split('-').map(v => parseFloat(v));
    if (value < min) return 'low';
    if (value > max) return 'high';
    return 'normal';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'low': return 'destructive';
      case 'high': return 'destructive'; 
      case 'normal': return 'outline';
      default: return 'secondary';
    }
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Patient Not Found</h2>
            <p className="text-muted-foreground">The requested patient profile could not be located.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Patient Profile</h1>
            <p className="text-muted-foreground">Comprehensive medical management</p>
          </div>
          <Button 
            onClick={() => setShowCompatibility(!showCompatibility)}
            className="glass-button"
            disabled={!prescribedMedicines.length}
          >
            <Brain className="w-4 h-4 mr-2" />
            {showCompatibility ? 'Hide' : 'Check'} AI Compatibility
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile & Reports</TabsTrigger>
            <TabsTrigger value="prescribe">Prescription Composer</TabsTrigger>
            <TabsTrigger value="compatibility">AI Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Information */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium text-foreground">{patient.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium text-foreground">{patient.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium text-foreground">{patient.gender}</p>
                  </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blood Type</p>
                  <p className="font-medium text-foreground">O+</p>
                </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">{patient.phone}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm">{patient.email}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">Address on file</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Medical History</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.medicalHistory.map((condition, index) => (
                      <Badge key={index} variant="secondary">{condition}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Allergies</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="destructive">Penicillin</Badge>
                    <Badge variant="destructive">Shellfish</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lab Reports */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <FileText className="w-5 h-5 mr-2 text-primary" />
                  Latest Lab Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patientReports.length > 0 ? (
                  <div className="space-y-4">
                    {patientReports.slice(0, 2).map(report => (
                      <div key={report.id} className="p-4 rounded-lg bg-muted/20 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground">{report.testType}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(report.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={report.status === 'completed' ? 'outline' : 
                                        report.status === 'pending' ? 'secondary' : 'destructive'}>
                            {report.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Results: {report.results || 'Processing...'}
                          </p>
                          {report.summary && (
                            <p className="text-xs text-muted-foreground">
                              Summary: {report.summary}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No lab reports available for this patient.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescribe" className="space-y-6">
            {/* Prescription Composer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Pill className="w-5 h-5 mr-2 text-primary" />
                    Medicine Search & Selection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search medicines..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {searchTerm && (
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {filteredMedicines.map(medicine => (
                        <div key={medicine.id} className="p-3 rounded-lg bg-muted/20 border border-white/10 flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-foreground">{medicine.name}</h4>
                            <p className="text-sm text-muted-foreground">{medicine.category}</p>
                            <p className="text-xs text-muted-foreground">{medicine.genericName}</p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addMedicine(medicine)}
                            className="glass-button"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-muted-foreground">Diagnosis</label>
                    <Textarea
                      placeholder="Enter diagnosis and clinical notes..."
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Activity className="w-5 h-5 mr-2 text-primary" />
                    Prescribed Medicines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {prescribedMedicines.length > 0 ? (
                    <div className="space-y-4">
                      {prescribedMedicines.map(medicine => (
                        <div key={medicine.id} className="p-4 rounded-lg bg-muted/20 border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-foreground">{medicine.name}</h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeMedicine(medicine.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              placeholder="Dosage (e.g., 500mg)"
                              value={medicine.dosage}
                              onChange={(e) => updateMedicine(medicine.id, 'dosage', e.target.value)}
                            />
                            <Input
                              placeholder="Frequency (e.g., Twice daily)"
                              value={medicine.frequency}
                              onChange={(e) => updateMedicine(medicine.id, 'frequency', e.target.value)}
                            />
                            <Input
                              placeholder="Duration (e.g., 7 days)"
                              value={medicine.duration}
                              onChange={(e) => updateMedicine(medicine.id, 'duration', e.target.value)}
                            />
                            <Input
                              placeholder="Special instructions"
                              value={medicine.instructions}
                              onChange={(e) => updateMedicine(medicine.id, 'instructions', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Search and add medicines to create prescription.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compatibility">
            {showCompatibility && prescribedMedicines.length > 0 ? (
              <CompatibilityChecker 
                results={compatibilityResults}
                onOverride={(medicine, reason) => {
                  console.log(`Override requested for ${medicine}: ${reason}`);
                }}
                onShowAlternatives={(medicine) => {
                  console.log(`Show alternatives for ${medicine}`);
                }}
              />
            ) : (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    AI Compatibility Analysis
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Add medicines to prescription to analyze compatibility with patient's profile and lab results.
                  </p>
                  {!prescribedMedicines.length && (
                    <Button
                      onClick={() => {
                        const prescribeTab = document.querySelector('[value="prescribe"]') as HTMLElement;
                        prescribeTab?.click();
                      }}
                      className="glass-button"
                    >
                      Go to Prescription Composer
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}