import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Package, Phone, MapPin, User, Pill } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePharmacyOrders, PharmacyOrder } from '@/hooks/usePharmacyOrders';
import { useToast } from '@/hooks/use-toast';

interface OrderHandlerProps {
  pharmacyId: string;
  className?: string;
}

const OrderHandler: React.FC<OrderHandlerProps> = ({
  pharmacyId,
  className = ""
}) => {
  const { orders, loading, updateOrderStatus, getOrdersByStatus, getOrderStats } = usePharmacyOrders(pharmacyId);
  const [activeTab, setActiveTab] = useState('pending');
  const { toast } = useToast();

  const stats = getOrderStats();

  const handleStatusUpdate = (orderId: string, status: PharmacyOrder['status']) => {
    updateOrderStatus(orderId, status);
    
    const statusMessages = {
      confirmed: 'Order confirmed and being prepared',
      fulfilled: 'Order fulfilled successfully',
      rejected: 'Order has been rejected'
    };

    toast({
      title: "Order Status Updated",
      description: statusMessages[status],
    });
  };

  const getStatusIcon = (status: PharmacyOrder['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'confirmed':
        return <Package className="w-4 h-4 text-primary" />;
      case 'fulfilled':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: PharmacyOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'default';
      case 'fulfilled':
        return 'success';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const OrderCard: React.FC<{ order: PharmacyOrder }> = ({ order }) => (
    <Card className="glass-card border-white/10">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-foreground">Order #{order.id}</h3>
              <Badge variant={getStatusColor(order.status) as any} className="flex items-center space-x-1">
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status}</span>
              </Badge>
              {order.deliveryRequired && (
                <Badge variant="outline" className="text-xs">Delivery Required</Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{order.patientName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{order.patientContact}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {order.orderTime.toLocaleDateString()} {order.orderTime.toLocaleTimeString()}
                </span>
              </div>
              {order.deliveryAddress && (
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground text-xs">{order.deliveryAddress}</span>
                </div>
              )}
            </div>

            {/* Medicines List */}
            <div className="space-y-2 mb-4">
              <h4 className="font-medium text-foreground flex items-center">
                <Pill className="w-4 h-4 mr-2" />
                Prescribed Medicines ({order.medicines.length})
              </h4>
              <div className="space-y-2">
                {order.medicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="p-3 rounded-lg bg-muted/20 border border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{medicine.name}</p>
                        <p className="text-sm text-muted-foreground">{medicine.dosage}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">Qty: {medicine.quantity}</p>
                        <p className="text-sm text-muted-foreground">₹{medicine.price} each</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="text-lg font-semibold text-foreground">
                Total: ₹{order.totalAmount}
              </div>
              
              {order.status === 'pending' && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="glass-button text-destructive hover:text-destructive"
                    onClick={() => handleStatusUpdate(order.id, 'rejected')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm
                  </Button>
                </div>
              )}
              
              {order.status === 'confirmed' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(order.id, 'fulfilled')}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Mark as Fulfilled
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Card className={`glass-card border-white/10 ${className}`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted/20 h-32 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-6 h-6 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold text-primary">{stats.confirmed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Fulfilled</p>
                <p className="text-2xl font-bold text-success">{stats.fulfilled}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                <span className="text-xs font-bold text-success">₹</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold text-success">₹{stats.totalRevenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Tabs */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-foreground">Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="pending" className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Pending ({stats.pending})</span>
              </TabsTrigger>
              <TabsTrigger value="confirmed" className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>Confirmed ({stats.confirmed})</span>
              </TabsTrigger>
              <TabsTrigger value="fulfilled" className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Fulfilled ({stats.fulfilled})</span>
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center space-x-2">
                <span>All ({orders.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4 mt-6">
              {getOrdersByStatus('pending').map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {getOrdersByStatus('pending').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No pending orders
                </div>
              )}
            </TabsContent>

            <TabsContent value="confirmed" className="space-y-4 mt-6">
              {getOrdersByStatus('confirmed').map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {getOrdersByStatus('confirmed').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No confirmed orders
                </div>
              )}
            </TabsContent>

            <TabsContent value="fulfilled" className="space-y-4 mt-6">
              {getOrdersByStatus('fulfilled').map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {getOrdersByStatus('fulfilled').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No fulfilled orders
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4 mt-6">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHandler;