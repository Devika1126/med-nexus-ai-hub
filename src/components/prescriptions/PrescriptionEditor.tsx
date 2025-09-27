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
  const [compatibilityResults, setCompatibilityResults] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);

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
    // Enhanced AI analysis with comprehensive synthetic data generation
    const generateCompatibilityResults = () => {
      const medicineName = medicine.name.toLowerCase();
      let score = 85;
      let status: 'safe' | 'caution' | 'unsafe' = 'safe';
      let reasons: string[] = [];
      let alternatives: string[] = [];
      let riskLevel: 'low' | 'moderate' | 'high' = 'low';
      let explanation = '';

      // Default case for any medicine not specifically handled
      if (!medicineName || medicineName.trim() === '') {
        score = 50;
        status = 'caution';
        riskLevel = 'moderate';
        reasons = ['Medicine name required for proper analysis'];
        alternatives = ['Please specify medicine name'];
        explanation = 'Cannot perform compatibility analysis without medicine name.';
        return { score, status, reasons, alternatives, riskLevel, explanation };
      }

      // Comprehensive drug interaction logic based on patient profile
      if (medicineName.includes('ibuprofen') || medicineName.includes('nsaid')) {
        if (patientReport.creatinine > 1.5) {
          score = 25;
          status = 'unsafe';
          riskLevel = 'high';
          reasons = [
            `Elevated creatinine (${patientReport.creatinine} mg/dL) indicates kidney impairment`,
            'NSAIDs can worsen kidney function and cause acute kidney injury',
            `Patient's blood pressure is elevated (${patientReport.bloodPressure})`,
            'Risk of fluid retention and cardiovascular events'
          ];
          alternatives = ['Acetaminophen 500mg TID', 'Topical diclofenac gel', 'Physical therapy', 'Heat/cold therapy'];
          explanation = 'Given the patient\'s elevated creatinine levels, NSAIDs pose significant nephrotoxic risk and should be avoided. Safer alternatives are recommended.';
        } else {
          score = 65;
          status = 'caution';
          riskLevel = 'moderate';
          reasons = ['Monitor kidney function', 'Short-term use only', 'Take with food'];
          alternatives = ['Acetaminophen 500mg', 'Topical preparations'];
          explanation = 'NSAIDs can be used with caution but require monitoring.';
        }
      } else if (medicineName.includes('metformin')) {
        if (patientReport.creatinine > 1.4) {
          score = 45;
          status = 'caution';
          riskLevel = 'moderate';
          reasons = [
            `Elevated creatinine (${patientReport.creatinine} mg/dL) may increase lactic acidosis risk`,
            'Kidney function needs close monitoring every 3-6 months',
            'Consider dose reduction to 500mg daily',
            'Contraindicated if eGFR < 30 mL/min/1.73m²'
          ];
          alternatives = ['Empagliflozin 10mg daily', 'Sitagliptin 50mg daily', 'Insulin therapy', 'Lifestyle modifications'];
          explanation = 'Metformin can be used with caution but requires dose adjustment and frequent kidney function monitoring due to elevated creatinine.';
        } else {
          score = 92;
          status = 'safe';
          riskLevel = 'low';
          reasons = ['First-line diabetes medication', 'Cardiovascular protective', 'Well tolerated'];
          alternatives = ['Continue current therapy'];
          explanation = 'Metformin is safe and appropriate for this patient.';
        }
      } else if (medicineName.includes('aspirin')) {
        score = 88;
        status = 'safe';
        riskLevel = 'low';
        reasons = [
          'Low-dose aspirin (75-100mg) is generally well tolerated',
          `Benefits outweigh risks for cardiovascular protection with BP ${patientReport.bloodPressure}`,
          'Monitor for GI symptoms',
          'Antiplatelet effect beneficial for hypertension'
        ];
        alternatives = ['Clopidogrel 75mg daily', 'Atorvastatin 20mg daily', 'Lifestyle modifications'];
        explanation = 'Aspirin is safe for this patient profile and provides cardiovascular benefits, especially given the elevated blood pressure.';
      } else if (medicineName.includes('lisinopril') || medicineName.includes('ace') || medicineName.includes('enalapril')) {
        if (patientReport.creatinine > 1.5) {
          score = 55;
          status = 'caution';
          riskLevel = 'moderate';
          reasons = [
            `ACE inhibitors can further elevate creatinine from ${patientReport.creatinine} mg/dL`,
            'Start with low dose (2.5-5mg) and monitor closely',
            'May cause hyperkalemia - monitor potassium levels',
            'Recheck creatinine in 1-2 weeks after initiation'
          ];
          alternatives = ['Amlodipine 5mg daily', 'Hydrochlorothiazide 25mg daily', 'Losartan 50mg daily', 'Lifestyle modifications'];
          explanation = 'ACE inhibitors require careful monitoring in patients with kidney impairment but may still be beneficial.';
        } else {
          score = 92;
          status = 'safe';
          riskLevel = 'low';
          reasons = [
            `Excellent choice for hypertension management (current BP: ${patientReport.bloodPressure})`,
            'Kidney protective in diabetes and hypertension',
            'Well-tolerated first-line therapy',
            'Reduces cardiovascular mortality'
          ];
          alternatives = ['ARBs if ACE cough develops', 'Amlodipine for combination therapy'];
          explanation = 'ACE inhibitors are ideal for this patient\'s blood pressure control and cardiovascular protection.';
        }
      } else if (medicineName.includes('warfarin')) {
        score = 40;
        status = 'caution';
        riskLevel = 'moderate';
        reasons = [
          'Requires frequent INR monitoring (weekly initially)',
          'Multiple drug and food interactions',
          `Patient's kidney function (creatinine ${patientReport.creatinine}) may affect metabolism`,
          'Bleeding risk assessment needed'
        ];
        alternatives = ['Apixaban 5mg twice daily', 'Rivaroxaban 20mg daily', 'Dabigatran 150mg twice daily', 'Edoxaban 60mg daily'];
        explanation = 'Direct oral anticoagulants (DOACs) may be safer alternatives with fewer monitoring requirements and drug interactions.';
      } else if (medicineName.includes('insulin')) {
        score = 95;
        status = 'safe';
        riskLevel = 'low';
        reasons = [
          `Safe with current glucose level (${patientReport.glucose} mg/dL)`,
          'No kidney-related contraindications',
          'Effective for diabetes management',
          'Dosing can be adjusted based on response'
        ];
        alternatives = ['GLP-1 agonists', 'SGLT-2 inhibitors (if eGFR >30)'];
        explanation = 'Insulin is safe and effective for this patient regardless of kidney function.';
      } else if (medicineName.includes('amlodipine') || medicineName.includes('calcium channel blocker')) {
        score = 90;
        status = 'safe';
        riskLevel = 'low';
        reasons = [
          `Excellent for hypertension control (current BP: ${patientReport.bloodPressure})`,
          'Safe with kidney impairment',
          'No dose adjustment needed',
          'Effective antihypertensive'
        ];
        alternatives = ['ACE inhibitors', 'Thiazide diuretics'];
        explanation = 'Calcium channel blockers are safe and effective for blood pressure control in patients with kidney impairment.';
      } else {
        // Generic analysis for unspecified medicines
        const hasKidneyIssues = patientReport.creatinine > 1.5;
        const hasHypertension = patientReport.bloodPressure !== "120/80";
        
        if (hasKidneyIssues) {
          score = 60;
          status = 'caution';
          riskLevel = 'moderate';
          reasons = [
            `Patient has elevated creatinine (${patientReport.creatinine} mg/dL)`,
            'Consider dose adjustment for kidney impairment',
            'Monitor kidney function regularly',
            'Avoid nephrotoxic combinations'
          ];
          alternatives = ['Kidney-safe alternatives', 'Dose-adjusted regimen', 'Non-pharmacological approaches'];
          explanation = 'Due to patient\'s kidney impairment, careful medication selection and monitoring is required.';
        } else {
          score = 85;
          status = 'safe';
          riskLevel = 'low';
          reasons = [
            'Normal kidney function supports safe use',
            'Standard dosing appropriate',
            'Regular monitoring recommended'
          ];
          alternatives = ['Continue as prescribed'];
          explanation = 'Based on patient profile, this medication appears safe with standard monitoring.';
        }
      }

      return {
        score,
        status,
        reasons,
        alternatives,
        riskLevel,
        explanation
      };
    };

    // Simulate AI processing delay for realism
    const processAnalysis = () => {
      setIsAnalyzing(medicine.id); // Set loading state
      
      const results = generateCompatibilityResults();
      
      // Update the medicine with all compatibility data
      updateMedicine(medicine.id, 'compatibilityScore', results.score);
      updateMedicine(medicine.id, 'status', results.status);
      
      // Enhanced warnings and side effects based on results
      const warnings = results.reasons.filter(reason => 
        reason.toLowerCase().includes('risk') || 
        reason.toLowerCase().includes('caution') || 
        reason.toLowerCase().includes('monitor') ||
        reason.toLowerCase().includes('contraindicated')
      );
      
      const sideEffects = results.status === 'unsafe' ? 
        ['Potential serious adverse reactions', 'Requires immediate alternatives', 'Close monitoring essential'] : 
        results.status === 'caution' ? 
        ['Mild to moderate side effects possible', 'Regular monitoring advised', 'Dose adjustments may be needed'] :
        ['Generally well tolerated', 'Minimal side effects expected', 'Standard monitoring sufficient'];
      
      updateMedicine(medicine.id, 'warnings', warnings);
      updateMedicine(medicine.id, 'sideEffects', sideEffects);
      
      // Create comprehensive compatibility result for detailed view
      const compatibilityResult = {
        medicine: medicine.name || 'Unknown Medicine',
        score: results.score,
        status: results.status,
        reasons: results.reasons,
        alternatives: results.alternatives,
        riskLevel: results.riskLevel,
        explanation: results.explanation
      };
      
      setCompatibilityResults([compatibilityResult]);
      setShowCompatibilityCheck(true);
      setIsAnalyzing(null); // Clear loading state
      
      // Log analysis for debugging
      console.log('🧠 AI Compatibility Analysis Complete:', {
        medicine: medicine.name,
        score: results.score,
        status: results.status,
        patientProfile: patientReport
      });
    };

    // Add slight delay to simulate AI processing
    setTimeout(processAnalysis, 500);
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
                            disabled={isAnalyzing === medicine.id}
                          >
                            <Brain className="w-4 h-4 mr-2" />
                            {isAnalyzing === medicine.id ? 'Analyzing...' : 'Check AI Compatibility'}
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
                            <div className="flex items-center justify-between mb-3">
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
                            
                            {/* Enhanced Progress Bar */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-muted-foreground">AI Compatibility Analysis</span>
                                <span className="text-xs font-medium text-foreground">{medicine.compatibilityScore}%</span>
                              </div>
                              <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    medicine.compatibilityScore >= 85 ? 'bg-success' :
                                    medicine.compatibilityScore >= 70 ? 'bg-warning' :
                                    'bg-destructive'
                                  }`}
                                  style={{ 
                                    width: `${medicine.compatibilityScore}%`,
                                    background: medicine.compatibilityScore >= 85 ? 
                                      'linear-gradient(90deg, hsl(var(--success)), hsl(var(--success) / 0.8))' :
                                      medicine.compatibilityScore >= 70 ?
                                      'linear-gradient(90deg, hsl(var(--warning)), hsl(var(--warning) / 0.8))' :
                                      'linear-gradient(90deg, hsl(var(--destructive)), hsl(var(--destructive) / 0.8))'
                                  }}
                                />
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

      {/* Enhanced AI Compatibility Checker */}
      {showCompatibilityCheck && compatibilityResults.length > 0 && (
        <CompatibilityChecker 
          results={compatibilityResults}
          onOverride={(medicine, reason) => {
            console.log(`Override for ${medicine}: ${reason}`);
            setShowCompatibilityCheck(false);
          }}
          onShowAlternatives={(medicine) => {
            const result = compatibilityResults.find(r => r.medicine === medicine);
            if (result?.alternatives) {
              alert(`Alternative medicines for ${medicine}:\n${result.alternatives.join('\n')}`);
            }
          }}
        />
      )}
    </div>
  );
};