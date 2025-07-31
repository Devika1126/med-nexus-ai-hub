import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  strength: string;
  category: string;
  stockQuantity: number;
  minStockLevel: number;
  price: number;
  mrp: number;
  expiryDate: string;
  batchNumber: string;
  lastUpdated: Date;
  description?: string;
}

interface InventoryManagerProps {
  pharmacyId: string;
  className?: string;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({
  pharmacyId,
  className = ""
}) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock data
  const mockMedicines: Medicine[] = [
    {
      id: '1',
      name: 'Metformin',
      genericName: 'Metformin Hydrochloride',
      manufacturer: 'Sun Pharma',
      strength: '500mg',
      category: 'Diabetes',
      stockQuantity: 150,
      minStockLevel: 20,
      price: 45,
      mrp: 55,
      expiryDate: '2025-12-31',
      batchNumber: 'MET001',
      lastUpdated: new Date('2024-01-15'),
      description: 'Used to treat type 2 diabetes'
    },
    {
      id: '2',
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      manufacturer: 'Cipla',
      strength: '10mg',
      category: 'Hypertension',
      stockQuantity: 8,
      minStockLevel: 15,
      price: 120,
      mrp: 150,
      expiryDate: '2025-08-15',
      batchNumber: 'LIS002',
      lastUpdated: new Date('2024-01-14'),
      description: 'ACE inhibitor for high blood pressure'
    },
    {
      id: '3',
      name: 'Amoxicillin',
      genericName: 'Amoxicillin Trihydrate',
      manufacturer: 'Dr. Reddy\'s',
      strength: '500mg',
      category: 'Antibiotic',
      stockQuantity: 75,
      minStockLevel: 25,
      price: 85,
      mrp: 100,
      expiryDate: '2025-06-30',
      batchNumber: 'AMX003',
      lastUpdated: new Date('2024-01-13'),
      description: 'Broad-spectrum antibiotic'
    },
    {
      id: '4',
      name: 'Paracetamol',
      genericName: 'Acetaminophen',
      manufacturer: 'GSK',
      strength: '500mg',
      category: 'Pain Relief',
      stockQuantity: 200,
      minStockLevel: 50,
      price: 25,
      mrp: 35,
      expiryDate: '2026-03-15',
      batchNumber: 'PAR004',
      lastUpdated: new Date('2024-01-12'),
      description: 'Pain reliever and fever reducer'
    }
  ];

  const categories = ['Diabetes', 'Hypertension', 'Antibiotic', 'Pain Relief', 'Cardiac', 'Respiratory'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMedicines(mockMedicines);
      setLoading(false);
    }, 1000);
  }, [pharmacyId]);

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || medicine.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockMedicines = medicines.filter(med => med.stockQuantity <= med.minStockLevel);

  const getStockStatus = (medicine: Medicine) => {
    if (medicine.stockQuantity === 0) return { status: 'out', color: 'destructive' };
    if (medicine.stockQuantity <= medicine.minStockLevel) return { status: 'low', color: 'warning' };
    return { status: 'good', color: 'success' };
  };

  const handleAddMedicine = (medicineData: Partial<Medicine>) => {
    const newMedicine: Medicine = {
      id: Date.now().toString(),
      name: medicineData.name || '',
      genericName: medicineData.genericName || '',
      manufacturer: medicineData.manufacturer || '',
      strength: medicineData.strength || '',
      category: medicineData.category || '',
      stockQuantity: medicineData.stockQuantity || 0,
      minStockLevel: medicineData.minStockLevel || 10,
      price: medicineData.price || 0,
      mrp: medicineData.mrp || 0,
      expiryDate: medicineData.expiryDate || '',
      batchNumber: medicineData.batchNumber || '',
      lastUpdated: new Date(),
      description: medicineData.description || ''
    };

    setMedicines(prev => [...prev, newMedicine]);
    setIsAddDialogOpen(false);
    toast({
      title: "Medicine Added",
      description: `${newMedicine.name} has been added to inventory.`,
    });
  };

  const handleUpdateMedicine = (medicineData: Partial<Medicine>) => {
    if (!editingMedicine) return;

    setMedicines(prev => prev.map(med => 
      med.id === editingMedicine.id 
        ? { ...med, ...medicineData, lastUpdated: new Date() }
        : med
    ));
    setEditingMedicine(null);
    toast({
      title: "Medicine Updated",
      description: `${editingMedicine.name} has been updated.`,
    });
  };

  const handleDeleteMedicine = (medicineId: string) => {
    const medicine = medicines.find(m => m.id === medicineId);
    setMedicines(prev => prev.filter(med => med.id !== medicineId));
    toast({
      title: "Medicine Removed",
      description: `${medicine?.name} has been removed from inventory.`,
      variant: "destructive"
    });
  };

  const MedicineForm: React.FC<{
    medicine?: Medicine | null;
    onSubmit: (data: Partial<Medicine>) => void;
    onCancel: () => void;
  }> = ({ medicine, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Medicine>>(
      medicine || {
        name: '',
        genericName: '',
        manufacturer: '',
        strength: '',
        category: '',
        stockQuantity: 0,
        minStockLevel: 10,
        price: 0,
        mrp: 0,
        expiryDate: '',
        batchNumber: '',
        description: ''
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Medicine Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="genericName">Generic Name</Label>
            <Input
              id="genericName"
              value={formData.genericName}
              onChange={(e) => setFormData(prev => ({ ...prev, genericName: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input
              id="manufacturer"
              value={formData.manufacturer}
              onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="strength">Strength</Label>
            <Input
              id="strength"
              value={formData.strength}
              onChange={(e) => setFormData(prev => ({ ...prev, strength: e.target.value }))}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="stockQuantity">Stock Quantity</Label>
            <Input
              id="stockQuantity"
              type="number"
              value={formData.stockQuantity}
              onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: parseInt(e.target.value) || 0 }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="minStockLevel">Min Stock Level</Label>
            <Input
              id="minStockLevel"
              type="number"
              value={formData.minStockLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, minStockLevel: parseInt(e.target.value) || 0 }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="batchNumber">Batch Number</Label>
            <Input
              id="batchNumber"
              value={formData.batchNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {medicine ? 'Update' : 'Add'} Medicine
          </Button>
        </div>
      </form>
    );
  };

  if (loading) {
    return (
      <Card className={`glass-card border-white/10 ${className}`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted/20 h-16 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Medicines</p>
                <p className="text-2xl font-bold text-foreground">{medicines.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-8 h-8 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-warning">{lowStockMedicines.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-foreground">
                  ₹{medicines.reduce((sum, med) => sum + (med.price * med.stockQuantity), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="glass-card border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search medicines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Medicine
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Medicine</DialogTitle>
                </DialogHeader>
                <MedicineForm
                  onSubmit={handleAddMedicine}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Medicine List */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-foreground">Inventory ({filteredMedicines.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredMedicines.map((medicine) => {
              const stockStatus = getStockStatus(medicine);
              
              return (
                <div
                  key={medicine.id}
                  className="p-4 rounded-lg bg-muted/20 border border-white/10 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-foreground">{medicine.name}</h3>
                        <Badge variant="outline" className="text-xs">{medicine.strength}</Badge>
                        <Badge variant="secondary" className="text-xs">{medicine.category}</Badge>
                        <Badge variant={stockStatus.color as any} className="text-xs">
                          {stockStatus.status === 'out' ? 'Out of Stock' :
                           stockStatus.status === 'low' ? 'Low Stock' : 'In Stock'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {medicine.genericName} • {medicine.manufacturer}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Stock: </span>
                          <span className={`font-medium ${
                            stockStatus.status === 'out' ? 'text-destructive' :
                            stockStatus.status === 'low' ? 'text-warning' : 'text-success'
                          }`}>
                            {medicine.stockQuantity} units
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Price: </span>
                          <span className="font-medium text-foreground">₹{medicine.price}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Batch: </span>
                          <span className="text-foreground">{medicine.batchNumber}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expires: </span>
                          <span className="text-foreground">{medicine.expiryDate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="glass-button"
                            onClick={() => setEditingMedicine(medicine)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Medicine</DialogTitle>
                          </DialogHeader>
                          <MedicineForm
                            medicine={editingMedicine}
                            onSubmit={handleUpdateMedicine}
                            onCancel={() => setEditingMedicine(null)}
                          />
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="glass-button text-destructive hover:text-destructive"
                        onClick={() => handleDeleteMedicine(medicine.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManager;