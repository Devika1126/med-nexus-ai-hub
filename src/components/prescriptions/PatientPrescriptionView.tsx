import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Share2, 
  MessageCircle, 
  Bell,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Calendar,
  Pill,
  QrCode,
  Heart,
  Languages
} from "lucide-react";

interface PrescribedMedicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  compatibilityScore: number;
  status: 'safe' | 'caution' | 'unsafe';
  sideEffects: string[];
  warnings: string[];
  explanation: string;
  hindiExplanation: string;
}

interface Prescription {
  id: string;
  doctorName: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  medicines: PrescribedMedicine[];
  notes: string;
  qrCode: string;
}

export const PatientPrescriptionView = () => {
  const [selectedPrescription, setSelectedPrescription] = useState<string>("1");
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Mock prescription data
  const prescriptions: Prescription[] = [
    {
      id: "1",
      doctorName: "Dr. Rajesh Kumar",
      doctorId: "NMC123456",
      date: "2024-01-15",
      diagnosis: "Hypertension with mild kidney dysfunction",
      notes: "Take medicines with food. Monitor blood pressure daily. Return for follow-up in 2 weeks.",
      qrCode: "QR123456789",
      medicines: [
        {
          id: "m1",
          name: "Amlodipine",
          dosage: "5mg",
          frequency: "Once daily",
          duration: "30 days",
          compatibilityScore: 92,
          status: 'safe',
          sideEffects: ["Mild ankle swelling", "Dizziness"],
          warnings: [],
          explanation: "This blood pressure medicine is safe for you based on your kidney function.",
          hindiExplanation: "आपकी किडनी के कार्य के आधार पर यह रक्तचाप की दवा आपके लिए सुरक्षित है।"
        },
        {
          id: "m2",
          name: "Aspirin",
          dosage: "75mg",
          frequency: "Once daily",
          duration: "Ongoing",
          compatibilityScore: 78,
          status: 'caution',
          sideEffects: ["Stomach irritation", "Bleeding risk"],
          warnings: ["Monitor for signs of bleeding"],
          explanation: "Blood thinner to prevent heart problems. Take with food to reduce stomach upset.",
          hindiExplanation: "हृदय की समस्याओं को रोकने के लिए रक्त पतला करने वाली दवा। पेट की समस्या कम करने के लिए खाने के साथ लें।"
        }
      ]
    }
  ];

  const currentPrescription = prescriptions.find(p => p.id === selectedPrescription);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-success';
      case 'caution': return 'text-warning';
      case 'unsafe': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string, size = "w-4 h-4") => {
    switch (status) {
      case 'safe': return <CheckCircle className={size} />;
      case 'caution': return <AlertTriangle className={size} />;
      case 'unsafe': return <XCircle className={size} />;
      default: return null;
    }
  };

  const getRiskEmoji = (status: string) => {
    switch (status) {
      case 'safe': return '😊';
      case 'caution': return '😐';
      case 'unsafe': return '😟';
      default: return '😊';
    }
  };

  if (!currentPrescription) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-foreground">
              <FileText className="w-5 h-5 mr-2" />
              E-Prescription
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="glass-button"
              >
                <Languages className="w-4 h-4 mr-2" />
                {language === 'en' ? 'हिंदी' : 'English'}
              </Button>
              <Button variant="outline" size="sm" className="glass-button">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm" className="glass-button">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Doctor</p>
              <p className="font-semibold text-foreground">{currentPrescription.doctorName}</p>
              <p className="text-xs text-muted-foreground">NMC ID: {currentPrescription.doctorId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date Prescribed</p>
              <p className="font-semibold text-foreground">{currentPrescription.date}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Prescription ID</p>
              <div className="flex items-center space-x-2">
                <p className="font-semibold text-foreground">{currentPrescription.id}</p>
                <QrCode className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-foreground">Diagnosis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">{currentPrescription.diagnosis}</p>
        </CardContent>
      </Card>

      {/* Medicine List */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Pill className="w-5 h-5 mr-2" />
            Prescribed Medicines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentPrescription.medicines.map((medicine) => (
            <Card key={medicine.id} className="bg-muted/20 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-foreground">{medicine.name}</h4>
                      <span className="text-2xl">{getRiskEmoji(medicine.status)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Dosage</p>
                        <p className="text-sm font-medium text-foreground">{medicine.dosage}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Frequency</p>
                        <p className="text-sm font-medium text-foreground">{medicine.frequency}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-sm font-medium text-foreground">{medicine.duration}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={getStatusColor(medicine.status)}>
                        {getStatusIcon(medicine.status)}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {medicine.compatibilityScore}%
                      </span>
                    </div>
                    <Badge variant={medicine.status === 'safe' ? 'outline' : 
                                  medicine.status === 'caution' ? 'secondary' : 'destructive'}>
                      {medicine.status}
                    </Badge>
                  </div>
                </div>

                {/* Compatibility Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Safety for your condition</span>
                    <span className="text-sm font-medium text-foreground">{medicine.compatibilityScore}%</span>
                  </div>
                  <Progress value={medicine.compatibilityScore} className="h-2" />
                </div>

                {/* Explanation */}
                <div className="p-3 rounded-lg bg-background/30 border border-white/10 mb-4">
                  <div className="flex items-start space-x-2">
                    <Heart className="w-4 h-4 text-patient mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        {language === 'en' ? 'What this means for you:' : 'आपके लिए इसका मतलब:'}
                      </p>
                      <p className="text-sm text-foreground">
                        {language === 'en' ? medicine.explanation : medicine.hindiExplanation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Warnings */}
                {medicine.warnings.length > 0 && (
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/20 mb-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          {language === 'en' ? 'Important Warnings:' : 'महत्वपूर्ण चेतावनी:'}
                        </p>
                        <ul className="text-sm text-foreground space-y-1">
                          {medicine.warnings.map((warning, idx) => (
                            <li key={idx}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Side Effects */}
                {medicine.sideEffects.length > 0 && (
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-2">
                      {language === 'en' ? 'Possible side effects:' : 'संभावित दुष्प्रभाव:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {medicine.sideEffects.map((effect, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 mt-4">
                  <Button size="sm" variant="outline" className="glass-button">
                    <Bell className="w-4 h-4 mr-2" />
                    Set Reminder
                  </Button>
                  <Button size="sm" variant="outline" className="glass-button">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ask Doctor
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Doctor Notes */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-foreground">Doctor's Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">{currentPrescription.notes}</p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Button className="bg-patient hover:bg-patient/90">
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat with Doctor
        </Button>
        <Button variant="outline" className="glass-button">
          <Calendar className="w-4 h-4 mr-2" />
          Book Follow-up
        </Button>
      </div>
    </div>
  );
};