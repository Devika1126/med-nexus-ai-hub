import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

// For Supabase projects, add your Mapbox token in Edge Function Secrets
// For now, use a temporary input field for the token
const MAPBOX_TOKEN_PLACEHOLDER = 'pk.your_mapbox_token_here';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number;
  verified: boolean;
  contact: string;
}

interface PharmacyMapProps {
  pharmacies: Pharmacy[];
  userLocation?: { latitude: number; longitude: number };
  onPharmacySelect?: (pharmacy: Pharmacy) => void;
  selectedPharmacyId?: string;
  className?: string;
}

const PharmacyMap: React.FC<PharmacyMapProps> = ({
  pharmacies,
  userLocation,
  onPharmacySelect,
  selectedPharmacyId,
  className = ""
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [mapInitialized, setMapInitialized] = useState(false);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: userLocation ? [userLocation.longitude, userLocation.latitude] : [77.5946, 12.9716], // Default to Bangalore
        zoom: 12,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        setMapInitialized(true);
        
        // Add user location marker
        if (userLocation) {
          new mapboxgl.Marker({ color: '#3b82f6' })
            .setLngLat([userLocation.longitude, userLocation.latitude])
            .setPopup(new mapboxgl.Popup().setHTML('<p>Your Location</p>'))
            .addTo(map.current!);
        }

        // Add pharmacy markers
        pharmacies.forEach((pharmacy) => {
          const markerColor = pharmacy.id === selectedPharmacyId ? '#10b981' : '#ef4444';
          
          const marker = new mapboxgl.Marker({ color: markerColor })
            .setLngLat([pharmacy.longitude, pharmacy.latitude])
            .setPopup(
              new mapboxgl.Popup().setHTML(`
                <div class="p-2">
                  <h3 class="font-semibold text-foreground">${pharmacy.name}</h3>
                  <p class="text-sm text-muted-foreground">${pharmacy.address}</p>
                  <p class="text-sm">Distance: ${pharmacy.distance.toFixed(1)} km</p>
                  <p class="text-sm">Contact: ${pharmacy.contact}</p>
                </div>
              `)
            )
            .addTo(map.current!);

          marker.getElement().addEventListener('click', () => {
            onPharmacySelect?.(pharmacy);
          });
        });

        // Fit map to show all markers
        if (pharmacies.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          
          if (userLocation) {
            bounds.extend([userLocation.longitude, userLocation.latitude]);
          }
          
          pharmacies.forEach(pharmacy => {
            bounds.extend([pharmacy.longitude, pharmacy.latitude]);
          });

          map.current!.fitBounds(bounds, { padding: 50 });
        }
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  useEffect(() => {
    if (mapboxToken) {
      initializeMap();
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Update selected pharmacy marker color
  useEffect(() => {
    if (mapInitialized && map.current) {
      // Remove existing markers and re-add with updated colors
      // This is a simplified approach - in production, you'd manage marker references
      const markers = document.querySelectorAll('.mapboxgl-marker');
      markers.forEach(marker => marker.remove());

      // Re-add markers with updated colors
      if (userLocation) {
        new mapboxgl.Marker({ color: '#3b82f6' })
          .setLngLat([userLocation.longitude, userLocation.latitude])
          .setPopup(new mapboxgl.Popup().setHTML('<p>Your Location</p>'))
          .addTo(map.current!);
      }

      pharmacies.forEach((pharmacy) => {
        const markerColor = pharmacy.id === selectedPharmacyId ? '#10b981' : '#ef4444';
        
        const marker = new mapboxgl.Marker({ color: markerColor })
          .setLngLat([pharmacy.longitude, pharmacy.latitude])
          .setPopup(
            new mapboxgl.Popup().setHTML(`
              <div class="p-2">
                <h3 class="font-semibold">${pharmacy.name}</h3>
                <p class="text-sm text-gray-600">${pharmacy.address}</p>
                <p class="text-sm">Distance: ${pharmacy.distance.toFixed(1)} km</p>
                <p class="text-sm">Contact: ${pharmacy.contact}</p>
              </div>
            `)
          )
          .addTo(map.current!);

        marker.getElement().addEventListener('click', () => {
          onPharmacySelect?.(pharmacy);
        });
      });
    }
  }, [selectedPharmacyId, mapInitialized]);

  if (!mapboxToken) {
    return (
      <div className={`glass-card border-white/10 p-6 ${className}`}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-warning">
            <MapPin className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Map Configuration Required</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            To display the pharmacy locations map, please enter your Mapbox public token below.
            Get your token from{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="flex space-x-2">
            <Input
              placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJ5b3VyLXRva2VuIn0..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="bg-muted/50 border-white/20"
            />
            <Button 
              variant="outline" 
              className="glass-button"
              onClick={() => mapboxToken && initializeMap()}
              disabled={!mapboxToken}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Load Map
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-96 rounded-lg shadow-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
    </div>
  );
};

export default PharmacyMap;