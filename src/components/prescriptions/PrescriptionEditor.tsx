import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  FileText,
  Brain,
  Download
} from "lucide-react";
import { CompatibilityChecker } from "./CompatibilityChecker";
import { SideEffectsPanel } from "./SideEffectsPanel";

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  compatibilityScore: number;
  status: 'safe' | 'caution' | 'unsafe';
  sideEffects: string[];
  warnings: string[];
}

interface PatientReport {
  hemoglobin: number;
  creatinine: number;
  glucose: number;
  liverEnzymes: number;
  bloodPressure: string;
}

export const PrescriptionEditor = () => {
  const [diagnosis, setDiagnosis] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [showCompatibilityCheck, setShowCompatibilityCheck] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  // Mock patient report data
  const patientReport: PatientReport = {
    hemoglobin: 12.5,
    creatinine: 1.8, // High - kidney concern
    glucose: 110,
    liverEnzymes: 45,
    bloodPressure: "140/90"
  };

  const addMedicine = () => {
    const newMedicine: Medicine = {
      id: Date.now().toString(),
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      compatibilityScore: 0,
      status: 'safe',
      sideEffects: [],
      warnings: []
    };
    setMedicines([...medicines, newMedicine]);
  };

  const updateMedicine = (id: string, field: keyof Medicine, value: any) => {
    setMedicines(medicines.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const removeMedicine = (id: string) => {
    setMedicines(medicines.filter(med => med.id !== id));
  };

  const analyzeCompatibility = (medicine: Medicine) => {
    // Mock AI analysis based on patient report
    let score = 85;
    let status: 'safe' | 'caution' | 'unsafe' = 'safe';
    let sideEffects: string[] = [];
    let warnings: string[] = [];

    // Simulate AI logic
    if (medicine.name.toLowerCase().includes('ibuprofen') && patientReport.creatinine > 1.5) {
      score = 25;
      status = 'unsafe';
      warnings.push('High creatinine levels - kidney damage risk');
      sideEffects.push('Acute kidney injury', 'Elevated creatinine', 'Fluid retention');
    } else if (medicine.name.toLowerCase().includes('metformin') && patientReport.creatinine > 1.4) {
      score = 45;
      status = 'caution';
      warnings.push('Monitor kidney function closely');
      sideEffects.push('Lactic acidosis risk', 'GI upset');
    } else if (medicine.name.toLowerCase().includes('aspirin')) {
      score = 90;
      status = 'safe';
      sideEffects.push('Mild GI irritation', 'Bleeding risk (low)');
    }

    updateMedicine(medicine.id, 'compatibilityScore', score);
    updateMedicine(medicine.id, 'status', status);
    updateMedicine(medicine.id, 'sideEffects', sideEffects);
    updateMedicine(medicine.id, 'warnings', warnings);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-success';
      case 'caution': return 'text-warning';
      case 'unsafe': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircle className="w-4 h-4" />;
      case 'caution': return <AlertTriangle className="w-4 h-4" />;
      case 'unsafe': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient Report Summary */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <FileText className="w-5 h-5 mr-2" />
            Patient Lab Report Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Hemoglobin</p>
              <p className="text-lg font-semibold text-foreground">{patientReport.hemoglobin} g/dL</p>
              <Badge variant="outline">Normal</Badge>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Creatinine</p>
              <p className="text-lg font-semibold text-destructive">{patientReport.creatinine} mg/dL</p>
              <Badge variant="destructive">High</Badge>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Glucose</p>
              <p className="text-lg font-semibold text-foreground">{patientReport.glucose} mg/dL</p>
              <Badge variant="outline">Normal</Badge>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Liver Enzymes</p>
              <p className="text-lg font-semibold text-foreground">{patientReport.liverEnzymes} U/L</p>
              <Badge variant="outline">Normal</Badge>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Blood Pressure</p>
              <p className="text-lg font-semibold text-warning">{patientReport.bloodPressure}</p>
              <Badge variant="secondary">Elevated</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prescription Form */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-foreground">Create E-Prescription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Diagnosis */}
          <div>
            <Label htmlFor="diagnosis" className="text-foreground">Diagnosis</Label>
            <Textarea
              id="diagnosis"
              placeholder="Enter primary diagnosis..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="bg-muted/50 border-white/20 text-foreground"
            />
          </div>

          {/* Medicines */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-foreground">Prescribed Medicines</Label>
              <Button onClick={addMedicine} size="sm" className="glass-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Medicine
              </Button>
            </div>

            <div className="space-y-4">
              {medicines.map((medicine) => (
                <Card key={medicine.id} className="bg-muted/20 border-white/10">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Medicine Name</Label>
                        <Input
                          placeholder="e.g., Ibuprofen"
                          value={medicine.name}
                          onChange={(e) => updateMedicine(medicine.id, 'name', e.target.value)}
                          className="bg-background/50 border-white/20"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Dosage</Label>
                        <Input
                          placeholder="e.g., 400mg"
                          value={medicine.dosage}
                          onChange={(e) => updateMedicine(medicine.id, 'dosage', e.target.value)}
                          className="bg-background/50 border-white/20"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Frequency</Label>
                        <Input
                          placeholder="e.g., Twice daily"
                          value={medicine.frequency}
                          onChange={(e) => updateMedicine(medicine.id, 'frequency', e.target.value)}
                          className="bg-background/50 border-white/20"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Duration</Label>
                        <Input
                          placeholder="e.g., 7 days"
                          value={medicine.duration}
                          onChange={(e) => updateMedicine(medicine.id, 'duration', e.target.value)}
                          className="bg-background/50 border-white/20"
                        />
                      </div>
                    </div>

                    {/* AI Compatibility Check */}
                    {medicine.name && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Button 
                            onClick={() => analyzeCompatibility(medicine)}
                            size="sm" 
                            variant="outline"
                            className="glass-button"
                          >
                            <Brain className="w-4 h-4 mr-2" />
                            Check AI Compatibility
                          </Button>
                          <Button 
                            onClick={() => removeMedicine(medicine.id)}
                            size="sm" 
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {medicine.compatibilityScore > 0 && (
                          <div className="p-3 rounded-lg bg-background/30 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className={getStatusColor(medicine.status)}>
                                  {getStatusIcon(medicine.status)}
                                </span>
                                <span className="text-sm font-medium text-foreground">
                                  Compatibility Score: {medicine.compatibilityScore}%
                                </span>
                                <Badge variant={medicine.status === 'safe' ? 'outline' : 
                                              medicine.status === 'caution' ? 'secondary' : 'destructive'}>
                                  {medicine.status}
                                </Badge>
                              </div>
                            </div>
                            
                            {medicine.warnings.length > 0 && (
                              <div className="text-sm text-destructive mb-2">
                                <strong>Warnings:</strong> {medicine.warnings.join(', ')}
                              </div>
                            )}
                            
                            {medicine.sideEffects.length > 0 && (
                              <div className="text-sm text-muted-foreground">
                                <strong>Predicted Side Effects:</strong> {medicine.sideEffects.join(', ')}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Doctor Notes */}
          <div>
            <Label htmlFor="notes" className="text-foreground">Doctor Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional instructions for patient..."
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              className="bg-muted/50 border-white/20 text-foreground"
            />
          </div>

          <Separator className="border-white/10" />

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" className="glass-button">
              Save as Draft
            </Button>
            <div className="space-x-3">
              <Button variant="outline" className="glass-button">
                <Download className="w-4 h-4 mr-2" />
                Generate PDF
              </Button>
              <Button className="bg-doctor hover:bg-doctor/90">
                Send to Patient
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};