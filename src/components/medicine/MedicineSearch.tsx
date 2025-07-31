import React, { useState, useEffect } from 'react';
import { Search, Pill, MapPin, Star, Clock, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGeolocation } from '@/hooks/useGeolocation';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  strength: string;
}

interface PharmacyAvailability {
  pharmacyId: string;
  pharmacyName: string;
  address: string;
  distance: number;
  price: number;
  stockQuantity: number;
  verified: boolean;
  rating: number;
  contact: string;
  estimatedTime: string;
  deliveryAvailable: boolean;
}

interface MedicineSearchProps {
  onMedicineSelect?: (medicine: Medicine, pharmacy: PharmacyAvailability) => void;
  selectedMedicines?: string[];
  className?: string;
}

const MedicineSearch: React.FC<MedicineSearchProps> = ({
  onMedicineSelect,
  selectedMedicines = [],
  className = ""
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [pharmacyAvailability, setPharmacyAvailability] = useState<PharmacyAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const { latitude, longitude, error: locationError } = useGeolocation();

  // Mock medicine database
  const mockMedicines: Medicine[] = [
    { id: '1', name: 'Metformin', genericName: 'Metformin Hydrochloride', manufacturer: 'Sun Pharma', strength: '500mg' },
    { id: '2', name: 'Lisinopril', genericName: 'Lisinopril', manufacturer: 'Cipla', strength: '10mg' },
    { id: '3', name: 'Amoxicillin', genericName: 'Amoxicillin Trihydrate', manufacturer: 'Dr. Reddy\'s', strength: '500mg' },
    { id: '4', name: 'Atorvastatin', genericName: 'Atorvastatin Calcium', manufacturer: 'Ranbaxy', strength: '20mg' },
    { id: '5', name: 'Aspirin', genericName: 'Acetylsalicylic Acid', manufacturer: 'Bayer', strength: '75mg' },
    { id: '6', name: 'Ibuprofen', genericName: 'Ibuprofen', manufacturer: 'Lupin', strength: '400mg' },
    { id: '7', name: 'Paracetamol', genericName: 'Acetaminophen', manufacturer: 'GSK', strength: '500mg' },
    { id: '8', name: 'Omeprazole', genericName: 'Omeprazole', manufacturer: 'Zydus Cadila', strength: '20mg' }
  ];

  // Mock pharmacy availability data
  const mockPharmacyData: PharmacyAvailability[] = [
    {
      pharmacyId: 'ph001',
      pharmacyName: 'Apollo Pharmacy',
      address: '123 MG Road, Bangalore',
      distance: 1.2,
      price: 45,
      stockQuantity: 50,
      verified: true,
      rating: 4.5,
      contact: '+91 9876543210',
      estimatedTime: '15 mins',
      deliveryAvailable: true
    },
    {
      pharmacyId: 'ph002',
      pharmacyName: 'Medplus Health Services',
      address: '456 Brigade Road, Bangalore',
      distance: 2.1,
      price: 42,
      stockQuantity: 25,
      verified: true,
      rating: 4.2,
      contact: '+91 9876543211',
      estimatedTime: '25 mins',
      deliveryAvailable: true
    },
    {
      pharmacyId: 'ph003',
      pharmacyName: 'Local Medical Store',
      address: '789 Commercial Street, Bangalore',
      distance: 0.8,
      price: 48,
      stockQuantity: 12,
      verified: false,
      rating: 3.8,
      contact: '+91 9876543212',
      estimatedTime: '10 mins',
      deliveryAvailable: false
    }
  ];

  useEffect(() => {
    if (searchQuery.length > 2) {
      const filtered = mockMedicines.filter(medicine =>
        medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setMedicines(filtered);
    } else {
      setMedicines([]);
      setSelectedMedicine(null);
      setPharmacyAvailability([]);
    }
  }, [searchQuery]);

  const handleMedicineSelect = async (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setLoading(true);

    // Simulate API call to get pharmacy availability
    setTimeout(() => {
      setPharmacyAvailability(mockPharmacyData);
      setLoading(false);
    }, 1000);
  };

  const handlePharmacySelect = (pharmacy: PharmacyAvailability) => {
    if (selectedMedicine) {
      onMedicineSelect?.(selectedMedicine, pharmacy);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search for medicines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-muted/50 border-white/20"
        />
      </div>

      {/* Medicine Results */}
      {medicines.length > 0 && (
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Pill className="w-5 h-5 mr-2" />
              Available Medicines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {medicines.map((medicine) => (
              <div
                key={medicine.id}
                className={`p-3 rounded-lg border border-white/10 cursor-pointer transition-colors ${
                  selectedMedicine?.id === medicine.id
                    ? 'bg-primary/20 border-primary/30'
                    : 'bg-muted/20 hover:bg-muted/30'
                }`}
                onClick={() => handleMedicineSelect(medicine)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{medicine.name}</h3>
                    <p className="text-sm text-muted-foreground">{medicine.genericName}</p>
                    <p className="text-xs text-muted-foreground">{medicine.manufacturer} • {medicine.strength}</p>
                  </div>
                  {selectedMedicines.includes(medicine.id) && (
                    <Badge variant="secondary">Selected</Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Location Error */}
      {locationError && (
        <Card className="glass-card border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-warning">
              <MapPin className="w-4 h-4" />
              <p className="text-sm">{locationError}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pharmacy Availability */}
      {selectedMedicine && (
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <MapPin className="w-5 h-5 mr-2" />
              Available at Nearby Pharmacies
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Showing availability for {selectedMedicine.name} {selectedMedicine.strength}
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-muted/20 h-20 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {pharmacyAvailability.map((pharmacy) => (
                  <div
                    key={pharmacy.pharmacyId}
                    className="p-4 rounded-lg bg-muted/20 border border-white/10 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-foreground">{pharmacy.pharmacyName}</h3>
                          {pharmacy.verified && (
                            <Badge variant="secondary" className="text-xs">Verified</Badge>
                          )}
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-warning text-warning" />
                            <span className="text-xs text-muted-foreground">{pharmacy.rating}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{pharmacy.distance} km away</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{pharmacy.estimatedTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3 h-3" />
                            <span>{pharmacy.contact}</span>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground mb-2">{pharmacy.address}</p>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Price: </span>
                            <span className="font-medium text-foreground">₹{pharmacy.price}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Stock: </span>
                            <span className={`font-medium ${
                              pharmacy.stockQuantity > 20 ? 'text-success' :
                              pharmacy.stockQuantity > 5 ? 'text-warning' : 'text-destructive'
                            }`}>
                              {pharmacy.stockQuantity} units
                            </span>
                          </div>
                          {pharmacy.deliveryAvailable && (
                            <Badge variant="outline" className="text-xs">Delivery Available</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-button"
                          onClick={() => handlePharmacySelect(pharmacy)}
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicineSearch;