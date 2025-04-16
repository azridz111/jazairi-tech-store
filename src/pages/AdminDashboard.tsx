
import { useState, useEffect } from 'react';
import { Navigate, Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings,
  LogOut,
  ChevronRight,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import AdminStats from '@/components/admin/AdminStats';
import { getOrders } from '@/services/orders';

const AdminDashboard = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  
  // Redirect if not authenticated or not admin
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  // Set active tab based on current path and count pending orders
  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes('/admin/products')) {
      setActiveTab('products');
    } else if (path.includes('/admin/orders')) {
      setActiveTab('orders');
    } else if (path.includes('/admin/users')) {
      setActiveTab('users');
    } else if (path.includes('/admin/settings')) {
      setActiveTab('settings');
    } else {
      setActiveTab('dashboard');
    }
    
    // Count pending orders
    const orders = getOrders();
    const pendingCount = orders.filter(order => order.status === 'pending').length;
    setPendingOrdersCount(pendingCount);
  }, [location]);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center rtl">
            <Link to="/" className="text-lg font-bold text-algerian-green">
              تيك ستور الجزائر
            </Link>
            <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
            <span className="text-gray-600">لوحة التحكم</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {pendingOrdersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {pendingOrdersCount}
                </Badge>
              )}
            </Button>
            <span className="text-sm font-medium rtl">مرحباً، {user.username}</span>
            <Button variant="ghost" size="sm" onClick={logout} className="rtl">
              <LogOut className="h-4 w-4 ml-1" />
              خروج
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} className="mb-6">
          <TabsList className="w-full border-b pb-0 justify-start overflow-auto rtl">
            <TabsTrigger
              value="dashboard"
              asChild
              className="data-[state=active]:border-b-2 data-[state=active]:border-algerian-green rounded-none px-4"
            >
              <Link to="/admin">
                <LayoutDashboard className="h-4 w-4 ml-2" />
                الرئيسية
              </Link>
            </TabsTrigger>
            <TabsTrigger
              value="products"
              asChild
              className="data-[state=active]:border-b-2 data-[state=active]:border-algerian-green rounded-none px-4"
            >
              <Link to="/admin/products">
                <Package className="h-4 w-4 ml-2" />
                المنتجات
              </Link>
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              asChild
              className="data-[state=active]:border-b-2 data-[state=active]:border-algerian-green rounded-none px-4"
            >
              <Link to="/admin/orders">
                <ShoppingBag className="h-4 w-4 ml-2" />
                الطلبات
                {pendingOrdersCount > 0 && (
                  <Badge variant="outline" className="ml-1">
                    {pendingOrdersCount}
                  </Badge>
                )}
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Dashboard Content or Outlet for nested routes */}
        {location.pathname === '/admin' ? (
          <>
            <div className="mb-6 rtl">
              <h1 className="text-2xl font-bold mb-2">لوحة التحكم</h1>
              <p className="text-gray-600">مرحباً بك في لوحة تحكم متجر تيك ستور الجزائر</p>
            </div>
            
            <AdminStats />
          </>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
