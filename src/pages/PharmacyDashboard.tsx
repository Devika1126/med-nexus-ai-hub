import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Pill, 
  Package, 
  Clock, 
  CheckCircle,
  Bell,
  Settings,
  Home,
  BarChart3,
  MessageSquare,
  Search,
  ChevronRight,
  Store,
  Users,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import InventoryManager from "@/components/pharmacy/InventoryManager";
import OrderHandler from "@/components/pharmacy/OrderHandler";
import { mockPharmacyOrders, mockMedicines } from "@/data/mockData";

const PharmacyDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { 
      title: "Total Orders", 
      value: mockPharmacyOrders.length.toString(), 
      icon: Package, 
      color: "primary" 
    },
    { 
      title: "Pending Orders", 
      value: mockPharmacyOrders.filter(o => o.status === 'pending').length.toString(), 
      icon: Clock, 
      color: "warning" 
    },
    { 
      title: "Medicines in Stock", 
      value: mockMedicines.filter(m => m.stockQuantity > 0).length.toString(), 
      icon: Pill, 
      color: "success" 
    },
    { 
      title: "Today's Revenue", 
      value: `₹${mockPharmacyOrders.filter(o => o.orderDate === new Date().toISOString().split('T')[0]).reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}`, 
      icon: TrendingUp, 
      color: "lab" 
    }
  ];

  const recentOrders = mockPharmacyOrders.slice(-4); // Last 4 orders

  const lowStockAlerts = mockMedicines
    .filter(med => med.stockQuantity <= med.minStockLevel)
    .slice(0, 3) // Show top 3 alerts
    .map(med => ({
      medicine: `${med.name} ${med.strength}`,
      currentStock: med.stockQuantity,
      minLevel: med.minStockLevel,
      urgency: med.stockQuantity === 0 ? 'critical' as const : 
               med.stockQuantity <= med.minStockLevel * 0.5 ? 'high' as const : 
               'medium' as const
    }));

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "orders", label: "Order Management", icon: Package },
    { id: "inventory", label: "Inventory", icon: Pill },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "customers", label: "Customers", icon: Users },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-white/10 backdrop-blur-xl">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Pharmacy Portal</h1>
                <p className="text-xs text-muted-foreground">Verified Partner</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === item.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Button 
              variant="outline" 
              className="w-full glass-button"
              onClick={() => navigate("/")}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="border-b border-white/10 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Pharmacy Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Apollo Pharmacy</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search orders, medicines..." 
                    className="pl-10 w-64 bg-muted/50 border-white/20"
                  />
                </div>
                <Button variant="outline" size="icon" className="glass-button">
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <Card key={index} className="glass-card border-white/10">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-muted-foreground text-sm">{stat.title}</p>
                            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                          </div>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            stat.color === 'primary' ? 'bg-primary/20 text-primary' :
                            stat.color === 'warning' ? 'bg-warning/20 text-warning' :
                            stat.color === 'success' ? 'bg-success/20 text-success' :
                            'bg-lab/20 text-lab'
                          }`}>
                            <stat.icon className="w-6 h-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Low Stock Alerts */}
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <Package className="w-5 h-5 mr-2 text-warning" />
                      Stock Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {lowStockAlerts.map((alert, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/30 border border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant={
                                alert.urgency === 'critical' ? 'destructive' :
                                alert.urgency === 'high' ? 'destructive' : 'secondary'
                              }>
                                {alert.urgency} priority
                              </Badge>
                              <span className="text-sm font-medium text-foreground">{alert.medicine}</span>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              Current Stock: {alert.currentStock} • Min Level: {alert.minLevel}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-foreground">
                      <span className="flex items-center">
                        <Package className="w-5 h-5 mr-2" />
                        Recent Orders
                      </span>
                      <Button variant="outline" size="sm" className="glass-button">
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/20 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{order.id}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.patientName} • {order.medicines.length} medicines • ₹{order.totalAmount}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={
                              order.status === 'pending' ? 'secondary' :
                              order.status === 'confirmed' ? 'default' :
                              order.status === 'ready' ? 'default' :
                              order.status === 'delivered' ? 'outline' : 'secondary'
                            }>
                              {order.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "orders" && (
              <OrderHandler pharmacyId="pharmacy-001" />
            )}

            {activeTab === "inventory" && (
              <InventoryManager pharmacyId="pharmacy-001" />
            )}

            {activeTab !== "overview" && activeTab !== "orders" && activeTab !== "inventory" && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {sidebarItems.find(item => item.id === activeTab)?.label}
                </h3>
                <p className="text-muted-foreground">This section is under development</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;