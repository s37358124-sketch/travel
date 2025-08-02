import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Building, 
  UtensilsCrossed, 
  Package, 
  MessageSquare, 
  BarChart3, 
  Users, 
  LogOut,
  ChefHat,
  Receipt,
  Menu
} from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navigationItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      title: 'Hospitality',
      icon: Building,
      path: '/hospitality',
      subItems: [
        { title: 'Properties', path: '/properties' },
        { title: 'Reservations', path: '/reservations' },
        { title: 'Calendar', path: '/calendar' },
      ]
    },
    {
      title: 'Restaurant',
      icon: UtensilsCrossed,
      path: '/restaurant',
      subItems: [
        { title: 'Orders', path: '/restaurant/orders' },
        { title: 'Menu Management', path: '/restaurant/menu' },
        { title: 'Billing', path: '/restaurant/billing' },
      ]
    },
    {
      title: 'Inventory',
      icon: Package,
      path: '/inventory',
    },
    {
      title: 'Feedback',
      icon: MessageSquare,
      path: '/feedback',
    },
    {
      title: 'Stats & Tally',
      icon: BarChart3,
      path: '/stats',
    },
    {
      title: 'Staff Management',
      icon: Users,
      path: '/staff',
    },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary">PropManage</h1>
          <p className="text-sm text-muted-foreground">Property & Restaurant</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <div key={item.path}>
              <Button
                variant={isActivePath(item.path) ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
              
              {/* Sub-items for Restaurant */}
              {item.subItems && isActivePath(item.path) && (
                <div className="ml-6 mt-2 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Button
                      key={subItem.path}
                      variant={location.pathname === subItem.path ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => navigate(subItem.path)}
                    >
                      {subItem.title === 'Orders' && <ChefHat className="mr-2 h-3 w-3" />}
                      {subItem.title === 'Menu Management' && <Menu className="mr-2 h-3 w-3" />}
                      {subItem.title === 'Billing' && <Receipt className="mr-2 h-3 w-3" />}
                      {subItem.title}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@propmanage.com</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;