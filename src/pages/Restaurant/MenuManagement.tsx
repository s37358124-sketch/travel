import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, ChefHat, DollarSign } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image_url?: string;
  tags?: string[];
}

interface Menu {
  id: number;
  name: string;
  description: string;
  items: MenuItem[];
}

const MenuManagement = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states
  const [menuForm, setMenuForm] = useState({ name: '', description: '' });
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true,
    image_url: '',
    tags: '',
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/menus');
      const data = await response.json();
      setMenus(data);
      if (data.length > 0 && !selectedMenu) {
        setSelectedMenu(data[0]);
      }
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch menus",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const createMenu = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuForm),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Menu created successfully",
        });
        setIsMenuDialogOpen(false);
        setMenuForm({ name: '', description: '' });
        fetchMenus();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create menu",
        variant: "destructive",
      });
    }
  };

  const createOrUpdateItem = async () => {
    try {
      const itemData = {
        ...itemForm,
        price: parseFloat(itemForm.price),
        tags: itemForm.tags ? itemForm.tags.split(',').map(tag => tag.trim()) : [],
      };

      let response;
      if (editingItem) {
        response = await fetch(`http://localhost:5000/api/menus/items/${editingItem.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData),
        });
      } else {
        response = await fetch(`http://localhost:5000/api/menus/${selectedMenu?.id}/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData),
        });
      }

      if (response.ok) {
        toast({
          title: "Success",
          description: `Menu item ${editingItem ? 'updated' : 'created'} successfully`,
        });
        setIsItemDialogOpen(false);
        setEditingItem(null);
        setItemForm({
          name: '',
          description: '',
          price: '',
          category: '',
          available: true,
          image_url: '',
          tags: '',
        });
        fetchMenus();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingItem ? 'update' : 'create'} menu item`,
        variant: "destructive",
      });
    }
  };

  const toggleItemAvailability = async (itemId: number, available: boolean) => {
    try {
      const response = await fetch(`http://localhost:5000/api/menus/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Item ${available ? 'enabled' : 'disabled'} successfully`,
        });
        fetchMenus();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item availability",
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/menus/items/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Menu item deleted successfully",
        });
        fetchMenus();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      available: item.available,
      image_url: item.image_url || '',
      tags: item.tags?.join(', ') || '',
    });
    setIsItemDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading menus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">
            Create and manage your restaurant menus and items
          </p>
        </div>
        <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Menu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Menu</DialogTitle>
              <DialogDescription>
                Add a new menu category to organize your food items
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="menu-name">Menu Name</Label>
                <Input
                  id="menu-name"
                  placeholder="e.g., Breakfast Menu"
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="menu-description">Description</Label>
                <Textarea
                  id="menu-description"
                  placeholder="Brief description of this menu"
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                />
              </div>
              <Button onClick={createMenu} className="w-full">
                Create Menu
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Menu Sidebar */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Menus</h3>
          {menus.map((menu) => (
            <Card
              key={menu.id}
              className={`cursor-pointer transition-colors ${
                selectedMenu?.id === menu.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedMenu(menu)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{menu.name}</CardTitle>
                <CardDescription className="text-xs">
                  {menu.items.length} items
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Menu Items */}
        <div className="lg:col-span-3">
          {selectedMenu ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedMenu.name}</CardTitle>
                    <CardDescription>{selectedMenu.description}</CardDescription>
                  </div>
                  <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                        </DialogTitle>
                        <DialogDescription>
                          {editingItem ? 'Update the menu item details' : 'Add a new item to your menu'}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="item-name">Item Name</Label>
                          <Input
                            id="item-name"
                            placeholder="e.g., Grilled Chicken"
                            value={itemForm.name}
                            onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="item-price">Price ($)</Label>
                          <Input
                            id="item-price"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={itemForm.price}
                            onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="item-description">Description</Label>
                          <Textarea
                            id="item-description"
                            placeholder="Describe the dish"
                            value={itemForm.description}
                            onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="item-category">Category</Label>
                          <Input
                            id="item-category"
                            placeholder="e.g., Main Course"
                            value={itemForm.category}
                            onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="item-tags">Tags (comma separated)</Label>
                          <Input
                            id="item-tags"
                            placeholder="e.g., Spicy, Vegan, Gluten-free"
                            value={itemForm.tags}
                            onChange={(e) => setItemForm({ ...itemForm, tags: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="item-image">Image URL (optional)</Label>
                          <Input
                            id="item-image"
                            placeholder="https://example.com/image.jpg"
                            value={itemForm.image_url}
                            onChange={(e) => setItemForm({ ...itemForm, image_url: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2 flex items-center space-x-2">
                          <Switch
                            id="item-available"
                            checked={itemForm.available}
                            onCheckedChange={(checked) => setItemForm({ ...itemForm, available: checked })}
                          />
                          <Label htmlFor="item-available">Available for ordering</Label>
                        </div>
                      </div>
                      <Button onClick={createOrUpdateItem} className="w-full">
                        {editingItem ? 'Update Item' : 'Add Item'}
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedMenu.items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <ChefHat className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">No items in this menu</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedMenu.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.description}
                              </div>
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {item.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {item.price.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={item.available}
                                onCheckedChange={(checked) => toggleItemAvailability(item.id, checked)}
                              />
                              <span className="text-sm">
                                {item.available ? 'Available' : 'Unavailable'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditDialog(item)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteItem(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <div className="text-center">
                  <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a menu to view items</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;