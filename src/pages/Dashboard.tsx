import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarDays, Users, Bed, Plus, Clock, MapPin, Phone } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface KPIData {
  arrivals: number;
  departures: number;
  occupancyPercentage: number;
  totalRooms: number;
  bookedRooms: number;
}

interface Reservation {
  id: number;
  guest_name: string;
  contact_number: string;
  source: string;
  check_in: string;
  check_out: string;
  room_number: string;
  room_type: string;
  status: string;
  total_price: number;
}

const Dashboard = () => {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activeTab, setActiveTab] = useState('arrivals');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIData();
    fetchReservations(activeTab);
  }, []);

  useEffect(() => {
    fetchReservations(activeTab);
  }, [activeTab]);

  const fetchKPIData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/kpi');
      const data = await response.json();
      setKpiData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    }
  };

  const fetchReservations = async (type: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/dashboard/reservations?type=${type}`);
      const data = await response.json();
      setReservations(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch reservations",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      confirmed: 'bg-blue-100 text-blue-800',
      'checked-in': 'bg-green-100 text-green-800',
      'checked-out': 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  if (loading && !kpiData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Reservation
        </Button>
      </div>

      {/* KPI Cards */}
      {kpiData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Arrivals</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.arrivals}</div>
              <p className="text-xs text-muted-foreground">
                Guests checking in today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Departures</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.departures}</div>
              <p className="text-xs text-muted-foreground">
                Guests checking out today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.occupancyPercentage}%</div>
              <p className="text-xs text-muted-foreground">
                {kpiData.bookedRooms} of {kpiData.totalRooms} rooms occupied
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reservations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reservations Overview</CardTitle>
          <CardDescription>
            Manage your property reservations by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="arrivals">Arrivals</TabsTrigger>
              <TabsTrigger value="departures">Departures</TabsTrigger>
              <TabsTrigger value="stayovers">Stayovers</TabsTrigger>
              <TabsTrigger value="inhouse">In-House</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Clock className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No reservations found for {activeTab}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    reservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">
                          {reservation.guest_name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {reservation.contact_number}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {reservation.room_number} ({reservation.room_type})
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{reservation.source}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(reservation.check_in)}</TableCell>
                        <TableCell>{formatDate(reservation.check_out)}</TableCell>
                        <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            {activeTab === 'arrivals' && (
                              <Button size="sm">
                                Check In
                              </Button>
                            )}
                            {activeTab === 'departures' && (
                              <Button size="sm">
                                Check Out
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;