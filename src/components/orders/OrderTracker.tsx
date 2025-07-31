import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface OrderStatus {
  id: string;
  label: string;
  timestamp?: Date;
  description: string;
  completed: boolean;
}

interface Order {
  id: string;
  prescriptionId: string;
  pharmacyName: string;
  pharmacyContact: string;
  pharmacyAddress: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'rejected';
  orderTime: Date;
  estimatedDelivery?: Date;
  medicines: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  deliveryRequired: boolean;
  deliveryAddress?: string;
  trackingNumber?: string;
}

interface OrderTrackerProps {
  orderId: string;
  className?: string;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({
  orderId,
  className = ""
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock order data
  const mockOrder: Order = {
    id: orderId,
    prescriptionId: 'presc-001',
    pharmacyName: 'Apollo Pharmacy',
    pharmacyContact: '+91 9876543210',
    pharmacyAddress: '123 MG Road, Bangalore, Karnataka 560001',
    status: 'preparing',
    orderTime: new Date('2024-01-15T10:30:00'),
    estimatedDelivery: new Date('2024-01-15T14:30:00'),
    medicines: [
      { id: '1', name: 'Metformin 500mg', quantity: 30, price: 45 },
      { id: '2', name: 'Lisinopril 10mg', quantity: 30, price: 120 }
    ],
    totalAmount: 165,
    deliveryRequired: true,
    deliveryAddress: '456 Brigade Road, Bangalore, Karnataka 560025',
    trackingNumber: 'APL2024011501'
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrder(mockOrder);
      setLoading(false);
    }, 1000);
  }, [orderId]);

  const getOrderStatuses = (order: Order): OrderStatus[] => {
    const baseStatuses: OrderStatus[] = [
      {
        id: 'pending',
        label: 'Order Placed',
        timestamp: order.orderTime,
        description: 'Your order has been placed and sent to the pharmacy',
        completed: true
      },
      {
        id: 'confirmed',
        label: 'Order Confirmed',
        timestamp: order.status !== 'pending' ? new Date(order.orderTime.getTime() + 5 * 60000) : undefined,
        description: 'Pharmacy has confirmed your order',
        completed: order.status !== 'pending'
      },
      {
        id: 'preparing',
        label: 'Preparing Order',
        timestamp: ['preparing', 'ready', 'out_for_delivery', 'delivered'].includes(order.status) 
          ? new Date(order.orderTime.getTime() + 15 * 60000) : undefined,
        description: 'Your medicines are being prepared',
        completed: ['preparing', 'ready', 'out_for_delivery', 'delivered'].includes(order.status)
      }
    ];

    if (order.deliveryRequired) {
      baseStatuses.push(
        {
          id: 'ready',
          label: 'Ready for Delivery',
          timestamp: ['ready', 'out_for_delivery', 'delivered'].includes(order.status)
            ? new Date(order.orderTime.getTime() + 45 * 60000) : undefined,
          description: 'Order is ready and will be dispatched soon',
          completed: ['ready', 'out_for_delivery', 'delivered'].includes(order.status)
        },
        {
          id: 'out_for_delivery',
          label: 'Out for Delivery',
          timestamp: ['out_for_delivery', 'delivered'].includes(order.status)
            ? new Date(order.orderTime.getTime() + 60 * 60000) : undefined,
          description: 'Your order is on the way',
          completed: ['out_for_delivery', 'delivered'].includes(order.status)
        },
        {
          id: 'delivered',
          label: 'Delivered',
          timestamp: order.status === 'delivered' 
            ? new Date(order.orderTime.getTime() + 90 * 60000) : undefined,
          description: 'Order delivered successfully',
          completed: order.status === 'delivered'
        }
      );
    } else {
      baseStatuses.push({
        id: 'ready',
        label: 'Ready for Pickup',
        timestamp: ['ready'].includes(order.status)
          ? new Date(order.orderTime.getTime() + 45 * 60000) : undefined,
        description: 'Your order is ready for pickup at the pharmacy',
        completed: ['ready'].includes(order.status)
      });
    }

    return baseStatuses;
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (status === 'rejected') return <XCircle className="w-5 h-5 text-destructive" />;
    if (!completed) return <Clock className="w-5 h-5 text-muted-foreground" />;
    
    switch (status) {
      case 'pending':
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'preparing':
        return <Package className="w-5 h-5 text-primary" />;
      case 'ready':
      case 'out_for_delivery':
        return <Truck className="w-5 h-5 text-primary" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-success" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getProgressPercentage = (statuses: OrderStatus[]) => {
    const completedCount = statuses.filter(s => s.completed).length;
    return (completedCount / statuses.length) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
      case 'preparing':
      case 'ready':
      case 'out_for_delivery':
        return 'default';
      case 'delivered':
        return 'success';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card className={`glass-card border-white/10 ${className}`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="animate-pulse bg-muted/20 h-8 rounded-lg w-1/3" />
            <div className="animate-pulse bg-muted/20 h-4 rounded-lg w-full" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-muted/20 h-16 rounded-lg" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card className={`glass-card border-white/10 ${className}`}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Order not found
          </div>
        </CardContent>
      </Card>
    );
  }

  const statuses = getOrderStatuses(order);
  const progressPercentage = getProgressPercentage(statuses);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Order Header */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Order #{order.id}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Tracking Number: {order.trackingNumber}
              </p>
            </div>
            <Badge variant={getStatusColor(order.status) as any} className="capitalize">
              {order.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground">{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Pharmacy Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{order.pharmacyName}</p>
                  <p className="text-muted-foreground">{order.pharmacyAddress}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-foreground">{order.pharmacyContact}</p>
                  {order.estimatedDelivery && (
                    <p className="text-muted-foreground">
                      Est. Delivery: {order.estimatedDelivery.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Status Timeline */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-foreground">Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statuses.map((status, index) => (
              <div key={status.id} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  {getStatusIcon(status.id, status.completed)}
                  {index < statuses.length - 1 && (
                    <div className={`w-px h-12 mt-2 ${
                      status.completed ? 'bg-success' : 'bg-muted-foreground/30'
                    }`} />
                  )}
                </div>
                
                <div className="flex-1 pb-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-medium ${
                      status.completed ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {status.label}
                    </h3>
                    {status.timestamp && (
                      <span className="text-xs text-muted-foreground">
                        {status.timestamp.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    status.completed ? 'text-muted-foreground' : 'text-muted-foreground/70'
                  }`}>
                    {status.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-foreground">Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Medicines */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Medicines</h4>
              <div className="space-y-2">
                {order.medicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-white/10"
                  >
                    <div>
                      <p className="font-medium text-foreground">{medicine.name}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {medicine.quantity}</p>
                    </div>
                    <p className="font-medium text-foreground">₹{medicine.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            {order.deliveryRequired && order.deliveryAddress && (
              <div>
                <h4 className="font-medium text-foreground mb-2">Delivery Address</h4>
                <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/20 border border-white/10">
                  {order.deliveryAddress}
                </p>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <span className="font-medium text-foreground">Total Amount</span>
              <span className="text-xl font-bold text-foreground">₹{order.totalAmount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button variant="outline" className="glass-button">
          <Phone className="w-4 h-4 mr-2" />
          Contact Pharmacy
        </Button>
        {order.status === 'delivered' && (
          <Button variant="outline" className="glass-button">
            Download Receipt
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderTracker;