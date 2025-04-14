
import { useState, useEffect } from 'react';
import { Navigate, Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings,
  LogOut,
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import AdminStats from '@/components/admin/AdminStats';

const AdminDashboard = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Redirect if not authenticated or not admin
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  // Set active tab based on current path
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
          <div className="flex items-center">
            <span className="text-sm font-medium ml-4 rtl">مرحباً، {user.username}</span>
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
              </Link>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              asChild
              className="data-[state=active]:border-b-2 data-[state=active]:border-algerian-green rounded-none px-4"
            >
              <Link to="/admin/users">
                <Users className="h-4 w-4 ml-2" />
                المستخدمين
              </Link>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              asChild
              className="data-[state=active]:border-b-2 data-[state=active]:border-algerian-green rounded-none px-4"
            >
              <Link to="/admin/settings">
                <Settings className="h-4 w-4 ml-2" />
                الإعدادات
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold mb-4 rtl">الطلبات الأخيرة</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b rtl">
                    <div>
                      <p className="font-medium">#12345</p>
                      <p className="text-sm text-gray-600">2023-04-15</p>
                    </div>
                    <div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">مكتمل</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">175,000 د.ج</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b rtl">
                    <div>
                      <p className="font-medium">#12346</p>
                      <p className="text-sm text-gray-600">2023-04-12</p>
                    </div>
                    <div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">قيد المعالجة</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">92,000 د.ج</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b rtl">
                    <div>
                      <p className="font-medium">#12347</p>
                      <p className="text-sm text-gray-600">2023-04-10</p>
                    </div>
                    <div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">مكتمل</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">252,000 د.ج</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Button asChild variant="outline" className="w-full rtl">
                    <Link to="/admin/orders">
                      عرض جميع الطلبات
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold mb-4 rtl">المنتجات الأكثر مبيعًا</h2>
                <div className="space-y-4">
                  <div className="flex items-center rtl">
                    <img 
                      src="https://images.unsplash.com/photo-1531297484001-80022131f5a1" 
                      alt="ROG STRIX G15" 
                      className="w-12 h-12 object-cover rounded mr-4" 
                    />
                    <div className="flex-1">
                      <p className="font-medium">ROG STRIX G15</p>
                      <p className="text-sm text-gray-600">45 وحدة</p>
                    </div>
                    <div>
                      <p className="font-medium">189,000 د.ج</p>
                    </div>
                  </div>
                  <div className="flex items-center rtl">
                    <img 
                      src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf" 
                      alt="iMac 24" 
                      className="w-12 h-12 object-cover rounded mr-4" 
                    />
                    <div className="flex-1">
                      <p className="font-medium">iMac 24</p>
                      <p className="text-sm text-gray-600">32 وحدة</p>
                    </div>
                    <div>
                      <p className="font-medium">252,000 د.ج</p>
                    </div>
                  </div>
                  <div className="flex items-center rtl">
                    <img 
                      src="https://images.unsplash.com/photo-1460925895917-afdab827c52f" 
                      alt="MacBook Air M2" 
                      className="w-12 h-12 object-cover rounded mr-4" 
                    />
                    <div className="flex-1">
                      <p className="font-medium">MacBook Air M2</p>
                      <p className="text-sm text-gray-600">28 وحدة</p>
                    </div>
                    <div>
                      <p className="font-medium">175,000 د.ج</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Button asChild variant="outline" className="w-full rtl">
                    <Link to="/admin/products">
                      إدارة المنتجات
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
