import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Users, CreditCard, Printer, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface RestaurantTable {
  id: number;
  table_number: number;
  seats: number;
  status: string;
}

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  special_instructions?: string;
}

interface Order {
  id: number;
  items: OrderItem[];
  subtotal: number;
}

interface BillData {
  orders: Order[];
  total: number;
  table_number: number;
}

const Billing = () => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [billData, setBillData] = useState<BillData | null>(null);
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();
    // Set up polling for real-time updates
    const interval = setInterval(fetchTables, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/billing/tables');
      const data = await response.json();
      setTables(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tables",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const fetchBill = async (tableId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/billing/${tableId}`);
      const data = await response.json();
      setBillData(data);
      setIsBillDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bill details",
        variant: "destructive",
      });
    }
  };

  const processPayment = async () => {
    if (!selectedTable || !paymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/billing/${selectedTable.id}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payment_method: paymentMethod }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment processed successfully",
        });
        setIsBillDialogOpen(false);
        setSelectedTable(null);
        setBillData(null);
        setPaymentMethod('');
        fetchTables(); // Refresh tables
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4" />;
      case 'occupied':
        return <Users className="h-4 w-4" />;
      case 'reserved':
        return <Users className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const handleTableClick = (table: RestaurantTable) => {
    setSelectedTable(table);
    if (table.status === 'occupied') {
      fetchBill(table.id);
    } else {
      toast({
        title: "Info",
        description: `Table ${table.table_number} is ${table.status}`,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading tables...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Restaurant Billing</h1>
          <p className="text-muted-foreground">
            Manage table billing and process payments
          </p>
        </div>
      </div>

      {/* Table Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['available', 'occupied', 'reserved'].map((status) => {
          const statusTables = tables.filter(table => table.status === status);
          return (
            <Card key={status}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
                  {getStatusIcon(status)}
                  {status} Tables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statusTables.length}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tables Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Floor Plan</CardTitle>
          <CardDescription>
            Click on occupied tables to view bills and process payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tables.map((table) => (
              <Card
                key={table.id}
                className={`cursor-pointer transition-all hover:shadow-md ${getStatusColor(table.status)} border-2`}
                onClick={() => handleTableClick(table)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getStatusIcon(table.status)}
                  </div>
                  <div className="font-bold">Table {table.table_number}</div>
                  <div className="text-sm opacity-75">{table.seats} seats</div>
                  <Badge 
                    variant="outline" 
                    className={`mt-2 ${getStatusColor(table.status)} border-0`}
                  >
                    {table.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bill Dialog */}
      <Dialog open={isBillDialogOpen} onOpenChange={setIsBillDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Bill for Table {billData?.table_number}
            </DialogTitle>
            <DialogDescription>
              Review order details and process payment
            </DialogDescription>
          </DialogHeader>

          {billData && (
            <div className="space-y-4">
              {/* Order Items */}
              <div className="space-y-4">
                {billData.orders.map((order, orderIndex) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Order #{order.id}</h4>
                    <div className="space-y-2">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium">
                              {item.quantity}x {item.name}
                            </div>
                            {item.special_instructions && (
                              <div className="text-sm text-muted-foreground">
                                Note: {item.special_instructions}
                              </div>
                            )}
                          </div>
                          <div className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Order Subtotal:</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>${billData.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="upi">UPI/QR Code</SelectItem>
                    <SelectItem value="room">Room Charge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 flex items-center gap-2"
                  onClick={() => window.print()}
                >
                  <Printer className="h-4 w-4" />
                  Print Bill
                </Button>
                <Button
                  className="flex-1 flex items-center gap-2"
                  onClick={processPayment}
                  disabled={!paymentMethod}
                >
                  <CreditCard className="h-4 w-4" />
                  Process Payment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Billing;