import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, MapPin, Users, ChefHat, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  special_instructions?: string;
}

interface Order {
  id: number;
  order_source: string;
  table_number?: number;
  room_number?: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    // Set up polling for real-time updates
    const interval = setInterval(fetchOrders, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Order status updated to ${newStatus}`,
        });
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      preparing: { color: 'bg-blue-100 text-blue-800', icon: ChefHat },
      ready: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      served: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
      paid: { color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getOrderSource = (order: Order) => {
    if (order.table_number) {
      return (
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          Table {order.table_number}
        </div>
      );
    }
    if (order.room_number) {
      return (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          Room {order.room_number}
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1">
        <Users className="h-4 w-4" />
        Walk-in
      </div>
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else {
      return `${Math.floor(diffInMinutes / 60)}h ${diffInMinutes % 60}m ago`;
    }
  };

  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Restaurant Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all restaurant orders in real-time
          </p>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['pending', 'preparing', 'ready', 'served'].map((status) => {
          const statusOrders = getOrdersByStatus(status);
          return (
            <Card key={status}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                  {status} Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statusOrders.length}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            Track and manage orders from tables, rooms, and walk-ins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <ChefHat className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No orders found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{getOrderSource(order)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item.quantity}x {item.name}
                            {item.special_instructions && (
                              <div className="text-xs text-muted-foreground">
                                Note: {item.special_instructions}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>${order.total_amount?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatTime(order.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                          >
                            Start Preparing
                          </Button>
                        )}
                        {order.status === 'preparing' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                          >
                            Mark Ready
                          </Button>
                        )}
                        {order.status === 'ready' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'served')}
                          >
                            Mark Served
                          </Button>
                        )}
                        {order.status === 'served' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateOrderStatus(order.id, 'paid')}
                          >
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;