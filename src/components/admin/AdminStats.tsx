
import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Users, 
  DollarSign,
  TrendingUp,
  Package,
  Check,
  Clock,
  AlertTriangle
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Product, products } from '@/data/products';
import { getOrders } from '@/services/orders';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface StatCard {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const AdminStats = () => {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [dailySales, setDailySales] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  
  useEffect(() => {
    // Get real orders from localStorage
    const realOrders = getOrders();
    setOrders(realOrders);
    
    // Calculate order statistics
    const totalOrders = realOrders.length;
    const completedOrders = realOrders.filter(order => order.status === 'completed').length;
    const pendingOrders = realOrders.filter(order => order.status === 'pending').length;
    const cancelledOrders = realOrders.filter(order => order.status === 'cancelled').length;
    
    // Calculate total sales and profits (assuming 30% profit margin)
    const totalSales = realOrders.reduce((sum, order) => 
      order.status !== 'cancelled' ? sum + order.totalPrice : sum, 0);
    const totalProfit = totalSales * 0.3; // 30% profit margin
    
    // Count in-stock products
    const inStockProducts = products.filter(product => product.inStock).length;
    
    // Set the stats cards data
    setStats([
      {
        title: 'إجمالي الطلبات',
        value: totalOrders,
        description: `${completedOrders} مكتمل، ${pendingOrders} قيد الانتظار`,
        icon: <ShoppingBag className="h-8 w-8 text-blue-600" />,
        change: totalOrders > 0 ? '+' + totalOrders : '0',
        trend: 'up'
      },
      {
        title: 'إجمالي المبيعات',
        value: `${(totalSales).toLocaleString()} د.ج`,
        description: `${totalProfit.toLocaleString()} د.ج أرباح تقديرية`,
        icon: <DollarSign className="h-8 w-8 text-green-600" />,
        change: '+' + (totalSales > 0 ? '30%' : '0%'),
        trend: 'up'
      },
      {
        title: 'المنتجات المتوفرة',
        value: inStockProducts,
        description: `من أصل ${products.length} منتج`,
        icon: <Package className="h-8 w-8 text-amber-600" />,
      },
      {
        title: 'نسبة إكمال الطلبات',
        value: totalOrders > 0 ? `${Math.round((completedOrders / totalOrders) * 100)}%` : '0%',
        description: `${completedOrders} من ${totalOrders} طلب`,
        icon: <Check className="h-8 w-8 text-purple-600" />,
      }
    ]);

    // Prepare data for charts
    
    // Daily sales data for last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    const dailySalesData = last7Days.map(day => {
      const dayOrders = realOrders.filter(order => 
        order.date.split('T')[0] === day && order.status !== 'cancelled'
      );
      const daySales = dayOrders.reduce((sum, order) => sum + order.totalPrice, 0);
      
      return {
        day: day.split('-').slice(1).join('/'), // Format as MM/DD
        sales: daySales,
      };
    });
    
    setDailySales(dailySalesData);
    
    // Order status distribution
    const statusDistribution = [
      { name: 'مكتمل', value: completedOrders, color: '#16a34a' },
      { name: 'قيد الانتظار', value: pendingOrders, color: '#3b82f6' },
      { name: 'ملغي', value: cancelledOrders, color: '#ef4444' }
    ];
    
    setStatusData(statusDistribution);
    
    // Top products by order count
    const productOrders = new Map();
    realOrders.forEach(order => {
      const count = productOrders.get(order.productId) || 0;
      productOrders.set(order.productId, count + 1);
    });
    
    const topProductsData = Array.from(productOrders.entries())
      .map(([productId, count]) => {
        const product = products.find(p => p.id === productId);
        return {
          id: productId,
          name: product ? product.name : 'منتج غير معروف',
          count
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    setTopProducts(topProductsData);
    
  }, []);
  
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 rtl">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                {stat.trend === 'up' && (
                  <span className="text-green-600 ml-1">
                    {stat.change}
                  </span>
                )}
                {stat.trend === 'down' && (
                  <span className="text-red-600 ml-1">
                    {stat.change}
                  </span>
                )}
                {stat.description}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Dashboard Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="rtl">المبيعات اليومية (آخر 7 أيام)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`${value.toLocaleString()} د.ج`, 'المبيعات']}
                    labelFormatter={(label) => `اليوم: ${label}`}
                  />
                  <Bar dataKey="sales" fill="#4f46e5" name="المبيعات" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="rtl">توزيع حالات الطلبات</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-72 w-full">
              {statusData.some(item => item.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} طلب`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  لا توجد بيانات للعرض
                </div>
              )}
            </div>
            <div className="flex justify-center gap-4 mt-4 rtl">
              {statusData.map((status, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                  <span>{status.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Products and Latest Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="rtl">المنتجات الأكثر مبيعًا</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center rtl">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                      {index + 1}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.count} طلب</p>
                    </div>
                    <Progress value={(product.count / topProducts[0].count) * 100} className="w-24" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد بيانات متاحة
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Order Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="rtl">ملخص حالات الطلبات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center rtl">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <div className="flex-1">
                <p className="font-medium">طلبات مكتملة</p>
                <p className="text-sm text-muted-foreground">
                  {orders.filter(order => order.status === 'completed').length} طلب
                </p>
              </div>
            </div>
            <div className="flex items-center rtl">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              <div className="flex-1">
                <p className="font-medium">طلبات قيد الانتظار</p>
                <p className="text-sm text-muted-foreground">
                  {orders.filter(order => order.status === 'pending').length} طلب
                </p>
              </div>
            </div>
            <div className="flex items-center rtl">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <div className="flex-1">
                <p className="font-medium">طلبات ملغاة</p>
                <p className="text-sm text-muted-foreground">
                  {orders.filter(order => order.status === 'cancelled').length} طلب
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStats;
