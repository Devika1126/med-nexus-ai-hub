import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Clock, 
  Pill, 
  Download,
  Eye,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { mockPrescriptions, mockPatients, mockMedicines, type Prescription } from "@/data/mockData";

export const PatientPrescriptionView = () => {
  // Mock current patient (in real app, would come from auth context)
  const currentPatientId = 'pat-001';
  const currentPatient = mockPatients.find(p => p.id === currentPatientId);
  const patientPrescriptions = mockPrescriptions.filter(p => p.patientId === currentPatientId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/20 text-success';
      case 'completed':
        return 'bg-muted/50 text-muted-foreground';
      case 'cancelled':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-secondary/20 text-secondary-foreground';
    }
  };

  const getMedicineAvailability = (medicineId: string) => {
    const medicine = mockMedicines.find(m => m.id === medicineId);
    if (!medicine) return { available: false, stock: 0 };
    
    return {
      available: medicine.stockQuantity > 0,
      stock: medicine.stockQuantity,
      lowStock: medicine.stockQuantity <= medicine.minStockLevel
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">My Prescriptions</h2>
        <Button variant="outline" className="glass-button">
          <Download className="w-4 h-4 mr-2" />
          Download History
        </Button>
      </div>

      {patientPrescriptions.length === 0 ? (
        <Card className="glass-card border-white/10">
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Prescriptions Found</h3>
            <p className="text-muted-foreground">Your prescriptions will appear here once your doctor creates them.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {patientPrescriptions.map((prescription) => (
            <Card key={prescription.id} className="glass-card border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Prescription #{prescription.id}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Prescribed by {prescription.doctorName} on {new Date(prescription.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(prescription.status)}
                    >
                      {prescription.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground flex items-center">
                    <Pill className="w-4 h-4 mr-2" />
                    Prescribed Medications
                  </h4>
                  {prescription.medicines.map((medicine, index) => {
                    const availability = getMedicineAvailability(medicine.medicineId);
                    return (
                      <div key={index} className="p-3 rounded-lg bg-muted/20 border border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-patient rounded-full"></div>
                              <div>
                                <p className="font-medium text-foreground">{medicine.medicineName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {medicine.dosage} • {medicine.frequency} • {medicine.duration}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Quantity: {medicine.quantity}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-1">
                              {availability.available ? (
                                <Badge variant="outline" className="bg-success/20 text-success text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Available
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-destructive/20 text-destructive text-xs">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Out of Stock
                                </Badge>
                              )}
                              {availability.lowStock && availability.available && (
                                <Badge variant="outline" className="bg-warning/20 text-warning text-xs">
                                  Low Stock
                                </Badge>
                              )}
                            </div>
                            {availability.available && (
                              <p className="text-xs text-muted-foreground">
                                Stock: {availability.stock}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {prescription.notes && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Doctor's Notes</h4>
                      <p className="text-sm text-muted-foreground p-3 bg-muted/20 rounded-lg border border-white/10">
                        {prescription.notes}
                      </p>
                    </div>
                  </>
                )}

                <Separator />
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Prescribed on {new Date(prescription.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="glass-button">
                      Download PDF
                    </Button>
                    <Button size="sm" className="bg-patient hover:bg-patient/90">
                      Order from Pharmacy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};