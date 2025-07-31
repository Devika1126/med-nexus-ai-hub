import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, Phone, Truck, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGeolocation } from '@/hooks/useGeolocation';
import PharmacyMap from '@/components/pharmacy/PharmacyMap';

interface Medicine {
  id: string;
  name: string;
  strength: string;
  quantity: number;
}

interface PharmacyAvailability {
  pharmacyId: string;
  pharmacyName: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number;
  price: number;
  stockQuantity: number;
  verified: boolean;
  rating: number;
  contact: string;
  estimatedTime: string;
  deliveryAvailable: boolean;
  deliveryFee?: number;
}

interface PharmacyAvailabilityProps {
  medicines: Medicine[];
  onOrderPlace?: (pharmacy: PharmacyAvailability, medicines: Medicine[]) => void;
  className?: string;
}

const PharmacyAvailability: React.FC<PharmacyAvailabilityProps> = ({
  medicines,
  onOrderPlace,
  className = ""
}) => {
  const [pharmacies, setPharmacies] = useState<PharmacyAvailability[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const { latitude, longitude, error: locationError } = useGeolocation();

  // Mock pharmacy data with coordinates
  const mockPharmacies: PharmacyAvailability[] = [
    {
      pharmacyId: 'ph001',
      pharmacyName: 'Apollo Pharmacy',
      address: '123 MG Road, Bangalore',
      latitude: 12.9716,
      longitude: 77.5946,
      distance: 1.2,
      price: 450,
      stockQuantity: 50,
      verified: true,
      rating: 4.5,
      contact: '+91 9876543210',
      estimatedTime: '15-20 mins',
      deliveryAvailable: true,
      deliveryFee: 30
    },
    {
      pharmacyId: 'ph002',
      pharmacyName: 'Medplus Health Services',
      address: '456 Brigade Road, Bangalore',
      latitude: 12.9698,
      longitude: 77.6047,
      distance: 2.1,
      price: 425,
      stockQuantity: 25,
      verified: true,
      rating: 4.2,
      contact: '+91 9876543211',
      estimatedTime: '25-30 mins',
      deliveryAvailable: true,
      deliveryFee: 40
    },
    {
      pharmacyId: 'ph003',
      pharmacyName: 'HealthKart Pharmacy',
      address: '789 Commercial Street, Bangalore',
      latitude: 12.9833,
      longitude: 77.6044,
      distance: 0.8,
      price: 480,
      stockQuantity: 12,
      verified: true,
      rating: 4.3,
      contact: '+91 9876543212',
      estimatedTime: '10-15 mins',
      deliveryAvailable: false
    },
    {
      pharmacyId: 'ph004',
      pharmacyName: 'Local Medical Store',
      address: '321 Koramangala, Bangalore',
      latitude: 12.9352,
      longitude: 77.6245,
      distance: 3.5,
      price: 395,
      stockQuantity: 8,
      verified: false,
      rating: 3.8,
      contact: '+91 9876543213',
      estimatedTime: '35-40 mins',
      deliveryAvailable: true,
      deliveryFee: 50
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch pharmacy availability
    setLoading(true);
    setTimeout(() => {
      setPharmacies(mockPharmacies);
      setLoading(false);
    }, 1500);
  }, [medicines]);

  const calculateTotalPrice = (pharmacy: PharmacyAvailability) => {
    const medicineTotal = medicines.reduce((total, medicine) => {
      return total + (pharmacy.price * medicine.quantity);
    }, 0);
    const deliveryFee = pharmacy.deliveryAvailable ? (pharmacy.deliveryFee || 0) : 0;
    return medicineTotal + deliveryFee;
  };

  const handleOrderPlace = (pharmacy: PharmacyAvailability) => {
    onOrderPlace?.(pharmacy, medicines);
  };

  const getStockColor = (quantity: number) => {
    if (quantity > 20) return 'text-success';
    if (quantity > 5) return 'text-warning';
    return 'text-destructive';
  };

  const getAvailabilityStatus = (pharmacy: PharmacyAvailability) => {
    const totalRequired = medicines.reduce((sum, med) => sum + med.quantity, 0);
    if (pharmacy.stockQuantity >= totalRequired) return 'available';
    if (pharmacy.stockQuantity > 0) return 'partial';
    return 'unavailable';
  };

  if (loading) {
    return (
      <Card className={`glass-card border-white/10 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <MapPin className="w-5 h-5 mr-2" />
            Finding Nearby Pharmacies...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted/20 h-24 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-foreground">
            <span className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Available at Nearby Pharmacies
            </span>
            <Button
              variant="outline"
              size="sm"
              className="glass-button"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            {medicines.map((medicine) => (
              <Badge key={medicine.id} variant="secondary" className="text-xs">
                {medicine.name} {medicine.strength} × {medicine.quantity}
              </Badge>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Location Error */}
      {locationError && (
        <Card className="glass-card border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-warning">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{locationError}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map */}
      {showMap && (
        <PharmacyMap
          pharmacies={pharmacies.map(p => ({
            id: p.pharmacyId,
            name: p.pharmacyName,
            address: p.address,
            latitude: p.latitude,
            longitude: p.longitude,
            distance: p.distance,
            verified: p.verified,
            contact: p.contact
          }))}
          userLocation={latitude && longitude ? { latitude, longitude } : undefined}
          onPharmacySelect={(pharmacy) => setSelectedPharmacy(pharmacy.id)}
          selectedPharmacyId={selectedPharmacy}
          className="glass-card border-white/10"
        />
      )}

      {/* Pharmacy List */}
      <div className="space-y-4">
        {pharmacies.map((pharmacy) => {
          const availability = getAvailabilityStatus(pharmacy);
          const totalPrice = calculateTotalPrice(pharmacy);
          const isSelected = selectedPharmacy === pharmacy.pharmacyId;

          return (
            <Card
              key={pharmacy.pharmacyId}
              className={`glass-card border-white/10 cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-primary/50 border-primary/30' : ''
              } ${availability === 'unavailable' ? 'opacity-60' : ''}`}
              onClick={() => setSelectedPharmacy(pharmacy.pharmacyId)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-foreground">{pharmacy.pharmacyName}</h3>
                      {pharmacy.verified && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-warning text-warning" />
                        <span className="text-xs text-muted-foreground">{pharmacy.rating}</span>
                      </div>
                      <Badge
                        variant={
                          availability === 'available' ? 'default' :
                          availability === 'partial' ? 'secondary' : 'destructive'
                        }
                        className="text-xs"
                      >
                        {availability === 'available' ? 'In Stock' :
                         availability === 'partial' ? 'Limited Stock' : 'Out of Stock'}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{pharmacy.address}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{pharmacy.distance} km</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{pharmacy.estimatedTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{pharmacy.contact}</span>
                      </div>
                      {pharmacy.deliveryAvailable && (
                        <div className="flex items-center space-x-1">
                          <Truck className="w-3 h-3 text-success" />
                          <span className="text-success text-xs">Delivery: ₹{pharmacy.deliveryFee}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <span className="text-muted-foreground text-sm">Stock: </span>
                          <span className={`font-medium ${getStockColor(pharmacy.stockQuantity)}`}>
                            {pharmacy.stockQuantity} units
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-sm">Total: </span>
                          <span className="font-semibold text-foreground text-lg">₹{totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-6">
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className={isSelected ? "" : "glass-button"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOrderPlace(pharmacy);
                      }}
                      disabled={availability === 'unavailable'}
                    >
                      {availability === 'unavailable' ? 'Out of Stock' : 'Order Now'}
                    </Button>
                    {availability === 'partial' && (
                      <p className="text-xs text-warning text-center">Limited availability</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PharmacyAvailability;