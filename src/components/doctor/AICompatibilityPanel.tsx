import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompatibilityChecker } from "@/components/prescriptions/CompatibilityChecker";
import { mockPatients, mockLabReports, mockMedicines } from "@/data/mockData";
import { Brain, Search, Plus, Trash2, User, Beaker } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PrescribedMedicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export default function AICompatibilityPanel() {
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [prescribedMedicines, setPrescribedMedicines] = useState<PrescribedMedicine[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const patient = mockPatients.find(p => p.id === selectedPatient);
  const patientReports = mockLabReports.filter(report => report.patientId === selectedPatient);

  // Filter medicines based on search
  const filteredMedicines = useMemo(() => {
    return mockMedicines.filter(medicine =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Generate AI compatibility results
  const compatibilityResults = useMemo(() => {
    if (!prescribedMedicines.length || !patient) return [];

    return prescribedMedicines.map(medicine => {
      // Simulate AI analysis based on patient data
      const baseScore = 85;
      const ageAdjustment = patient.age > 65 ? -10 : patient.age < 18 ? -5 : 0;
          const medicineDetails = mockMedicines.find(m => m.name === medicine.name);
          const conditionAdjustment = patient.condition.includes('Diabetes') ? -8 : 
                                     patient.condition.includes('Hypertension') ? -5 :
                                     patient.condition.includes('Heart') ? -12 : 0;
          const historyAdjustment = patient.medicalHistory.some(h => 
            h.toLowerCase().includes('allerg') || h.toLowerCase().includes('adverse')
          ) ? -15 : 0;
          
          const finalScore = Math.max(45, Math.min(99, 
            baseScore + ageAdjustment + conditionAdjustment + historyAdjustment + 
            (Math.random() * 10 - 5) // Add some randomness
          ));

          const status: 'safe' | 'caution' | 'unsafe' = 
            finalScore >= 85 ? 'safe' : finalScore >= 70 ? 'caution' : 'unsafe';
          const riskLevel: 'low' | 'moderate' | 'high' = 
            finalScore >= 85 ? 'low' : finalScore >= 70 ? 'moderate' : 'high';

          return {
            medicine: medicine.name,
            score: Math.round(finalScore),
            status,
            reasons: [
              `Patient age (${patient.age}) affects drug metabolism`,
              patient.condition.includes('Diabetes') ? 'Diabetes may affect drug absorption' : 'No metabolic concerns detected',
              patientReports.length > 0 ? 'Recent lab values support safe administration' : 'Limited recent lab data available',
              finalScore < 70 ? 'Multiple risk factors identified in patient profile' : 'Patient profile supports medication use',
              medicineDetails?.category === 'Antibiotic' && patient.medicalHistory.some(h => h.includes('penicillin')) ? 
                'Caution: Patient has penicillin allergy history' : 'No known drug allergies for this class'
            ],
            alternatives: status === 'unsafe' ? [
              `Alternative: ${mockMedicines.find(m => m.category === medicineDetails?.category && m.id !== medicineDetails?.id)?.name || 'Generic alternative'}`,
              `Lower dosage: Reduce initial dose by 25-50%`,
              `Alternative therapy: Consider non-pharmacological options`
            ] : undefined,
            riskLevel,
            explanation: status === 'safe' 
              ? `${medicine.name} shows excellent compatibility with ${patient.name}'s current health profile. Safe to prescribe with standard monitoring.`
              : status === 'caution'
              ? `${medicine.name} can be prescribed to ${patient.name} but requires enhanced monitoring due to identified risk factors.`
              : `${medicine.name} presents significant risks for ${patient.name}. Consider alternatives or specialized consultation before prescribing.`
          };
    });
  }, [prescribedMedicines, patient, patientReports]);

  const addMedicine = (medicine: any) => {
    const newMedicine: PrescribedMedicine = {
      id: Date.now().toString(),
      name: medicine.name,
      dosage: "",
      frequency: "",
      duration: ""
    };
    setPrescribedMedicines([...prescribedMedicines, newMedicine]);
    setSearchTerm("");
    
    toast({
      title: "Medicine Added",
      description: `${medicine.name} added to prescription for compatibility analysis.`,
    });
  };

  const removeMedicine = (id: string) => {
    setPrescribedMedicines(medicines => medicines.filter(med => med.id !== id));
  };

  const runCompatibilityCheck = () => {
    if (!selectedPatient || !prescribedMedicines.length) {
      toast({
        title: "Incomplete Information",
        description: "Please select a patient and add medicines before running compatibility analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
      toast({
        title: "AI Analysis Complete",
        description: `Compatibility analysis completed for ${prescribedMedicines.length} medicine(s).`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Brain className="w-5 h-5 mr-2 text-primary" />
            AI Medicine Compatibility Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Patient Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Select Patient</label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a patient..." />
                </SelectTrigger>
                <SelectContent>
                  {mockPatients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{patient.name} - {patient.age}y - {patient.condition}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={runCompatibilityCheck}
                disabled={!selectedPatient || !prescribedMedicines.length || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Run AI Analysis
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Patient Summary */}
          {patient && (
            <div className="p-4 rounded-lg bg-muted/20 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{patient.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {patient.age} years • {patient.gender} • {patient.condition}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Beaker className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {patientReports.length} lab report(s)
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Medical History: {patient.medicalHistory.slice(0, 2).join(', ')}
                {patient.medicalHistory.length > 2 && '...'}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medicine Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Search className="w-5 h-5 mr-2 text-primary" />
              Medicine Search
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
                {filteredMedicines.slice(0, 5).map(medicine => (
                  <div key={medicine.id} className="p-3 rounded-lg bg-muted/20 border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{medicine.name}</h4>
                      <p className="text-sm text-muted-foreground">{medicine.category} • {medicine.strength}</p>
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
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              Selected Medicines ({prescribedMedicines.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prescribedMedicines.length > 0 ? (
              <div className="space-y-3">
                {prescribedMedicines.map(medicine => (
                  <div key={medicine.id} className="p-3 rounded-lg bg-muted/20 border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{medicine.name}</h4>
                      <p className="text-sm text-muted-foreground">Ready for analysis</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeMedicine(medicine.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Search and add medicines to analyze compatibility
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Results */}
      {showResults && compatibilityResults.length > 0 && (
        <CompatibilityChecker 
          results={compatibilityResults}
          onOverride={(medicine, reason) => {
            toast({
              title: "Override Recorded",
              description: `Doctor override for ${medicine} has been documented.`,
            });
          }}
          onShowAlternatives={(medicine) => {
            toast({
              title: "Alternatives Available",
              description: `Alternative options for ${medicine} are being prepared.`,
            });
          }}
        />
      )}

      {/* Getting Started Help */}
      {!selectedPatient && !prescribedMedicines.length && (
        <Card className="glass-card border-white/10">
          <CardContent className="p-8 text-center">
            <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              AI-Powered Medicine Compatibility Analysis
            </h3>
            <p className="text-muted-foreground mb-4">
              Select a patient and add medicines to get real-time compatibility analysis based on:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="p-3 bg-muted/20 rounded-lg">
                <User className="w-6 h-6 mx-auto mb-2 text-primary" />
                Patient Profile
                <div className="text-xs">Age, conditions, history</div>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <Beaker className="w-6 h-6 mx-auto mb-2 text-primary" />
                Lab Results
                <div className="text-xs">Recent test values</div>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <Brain className="w-6 h-6 mx-auto mb-2 text-primary" />
                AI Analysis
                <div className="text-xs">Drug interactions & safety</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}