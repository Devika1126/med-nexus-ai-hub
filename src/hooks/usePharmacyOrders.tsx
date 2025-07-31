import { useState, useEffect } from 'react';

export interface PharmacyOrder {
  id: string;
  prescriptionId: string;
  patientId: string;
  patientName: string;
  pharmacyId: string;
  status: 'pending' | 'confirmed' | 'fulfilled' | 'rejected';
  deliveryRequired: boolean;
  orderTime: Date;
  medicines: {
    id: string;
    name: string;
    dosage: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  patientContact: string;
  deliveryAddress?: string;
}

export const usePharmacyOrders = (pharmacyId?: string) => {
  const [orders, setOrders] = useState<PharmacyOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockOrders: PharmacyOrder[] = [
      {
        id: '1',
        prescriptionId: 'presc-001',
        patientId: 'patient-001',
        patientName: 'Rajesh Kumar',
        pharmacyId: 'pharmacy-001',
        status: 'pending',
        deliveryRequired: true,
        orderTime: new Date('2024-01-15T10:30:00'),
        medicines: [
          { id: '1', name: 'Metformin 500mg', dosage: '1 tablet twice daily', quantity: 30, price: 45 },
          { id: '2', name: 'Lisinopril 10mg', dosage: '1 tablet daily', quantity: 30, price: 120 }
        ],
        totalAmount: 165,
        patientContact: '+91 9876543210',
        deliveryAddress: '123 MG Road, Bangalore, Karnataka 560001'
      },
      {
        id: '2',
        prescriptionId: 'presc-002',
        patientId: 'patient-002',
        patientName: 'Priya Sharma',
        pharmacyId: 'pharmacy-001',
        status: 'confirmed',
        deliveryRequired: false,
        orderTime: new Date('2024-01-15T14:15:00'),
        medicines: [
          { id: '3', name: 'Amoxicillin 500mg', dosage: '1 capsule thrice daily', quantity: 21, price: 85 }
        ],
        totalAmount: 85,
        patientContact: '+91 9876543211'
      },
      {
        id: '3',
        prescriptionId: 'presc-003',
        patientId: 'patient-003',
        patientName: 'Amit Singh',
        pharmacyId: 'pharmacy-001',
        status: 'fulfilled',
        deliveryRequired: true,
        orderTime: new Date('2024-01-14T16:45:00'),
        medicines: [
          { id: '4', name: 'Atorvastatin 20mg', dosage: '1 tablet at bedtime', quantity: 30, price: 95 },
          { id: '5', name: 'Aspirin 75mg', dosage: '1 tablet daily', quantity: 30, price: 25 }
        ],
        totalAmount: 120,
        patientContact: '+91 9876543212',
        deliveryAddress: '456 Brigade Road, Bangalore, Karnataka 560025'
      }
    ];

    setOrders(mockOrders);
    setLoading(false);
  }, [pharmacyId]);

  const updateOrderStatus = (orderId: string, status: PharmacyOrder['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const getOrdersByStatus = (status: PharmacyOrder['status']) => {
    return orders.filter(order => order.status === status);
  };

  const getOrderStats = () => {
    const pending = orders.filter(o => o.status === 'pending').length;
    const confirmed = orders.filter(o => o.status === 'confirmed').length;
    const fulfilled = orders.filter(o => o.status === 'fulfilled').length;
    const totalRevenue = orders
      .filter(o => o.status === 'fulfilled')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return { pending, confirmed, fulfilled, totalRevenue };
  };

  return {
    orders,
    loading,
    updateOrderStatus,
    getOrdersByStatus,
    getOrderStats
  };
};