
import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Users, 
  PackageCheck, 
  TrendingUp,
  Package
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Product, products } from '@/data/products';

interface StatCard {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

// Mock data - in a real app, this would come from your backend
const mockOrdersData = [
  { id: 1, date: '2023-04-01', status: 'completed', total: 175000 },
  { id: 2, date: '2023-04-05', status: 'processing', total: 92000 },
  { id: 3, date: '2023-04-08', status: 'completed', total: 252000 },
  { id: 4, date: '2023-04-12', status: 'completed', total: 175000 },
  { id: 5, date: '2023-04-15', status: 'cancelled', total: 150000 }
];

const AdminStats = () => {
  const [stats, setStats] = useState<StatCard[]>([]);
  
  useEffect(() => {
    // Calculate stats from mock data
    const totalOrders = mockOrdersData.length;
    const totalSales = mockOrdersData.reduce((sum, order) => 
      order.status !== 'cancelled' ? sum + order.total : sum, 0);
    const completedOrders = mockOrdersData.filter(order => order.status === 'completed').length;
    const inStockProducts = products.filter(product => product.inStock).length;
    
    setStats([
      {
        title: 'إجمالي الطلبات',
        value: totalOrders,
        description: 'منذ الشهر الماضي',
        icon: <ShoppingBag className="h-8 w-8 text-blue-600" />,
        change: '+12%',
        trend: 'up'
      },
      {
        title: 'إجمالي المبيعات',
        value: `${(totalSales / 1000).toFixed(0)}K د.ج`,
        description: 'منذ الشهر الماضي',
        icon: <TrendingUp className="h-8 w-8 text-green-600" />,
        change: '+8%',
        trend: 'up'
      },
      {
        title: 'المنتجات المتوفرة',
        value: inStockProducts,
        description: `من أصل ${products.length} منتج`,
        icon: <PackageCheck className="h-8 w-8 text-amber-600" />,
      },
      {
        title: 'المنتجات الأكثر مبيعًا',
        value: products.find(p => p.id === 1)?.name || '-',
        description: '45 وحدة تم بيعها',
        icon: <Package className="h-8 w-8 text-purple-600" />,
      }
    ]);
  }, []);
  
  return (
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
                <span className="text-green-600 mr-1">
                  {stat.change}
                </span>
              )}
              {stat.trend === 'down' && (
                <span className="text-red-600 mr-1">
                  {stat.change}
                </span>
              )}
              {stat.description}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
