
import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock orders data - in a real app this would come from an API
const mockOrders = [
  {
    id: 12345,
    date: '2023-04-15',
    customer: 'محمد أحمد',
    total: 175000,
    status: 'completed',
    items: 2
  },
  {
    id: 12346,
    date: '2023-04-12',
    customer: 'علي محمد',
    total: 92000,
    status: 'processing',
    items: 1
  },
  {
    id: 12347,
    date: '2023-04-10',
    customer: 'فاطمة علي',
    total: 252000,
    status: 'completed',
    items: 1
  },
  {
    id: 12348,
    date: '2023-04-08',
    customer: 'أحمد خالد',
    total: 175000,
    status: 'processing',
    items: 2
  },
  {
    id: 12349,
    date: '2023-04-05',
    customer: 'سارة محمد',
    total: 150000,
    status: 'cancelled',
    items: 1
  }
];

type OrderStatus = 'processing' | 'completed' | 'cancelled';

interface Order {
  id: number;
  date: string;
  customer: string;
  total: number;
  status: OrderStatus;
  items: number;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading orders from API
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredOrders = orders.filter(order => {
    // Filter by search term
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'processing':
        return 'قيد المعالجة';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };
  
  return (
    <div>
      <div className="mb-6 rtl">
        <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
        <p className="text-gray-600">مراجعة وإدارة طلبات العملاء</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 md:items-center rtl">
          <Input
            placeholder="ابحث برقم الطلب أو اسم العميل..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-md"
          />
          
          <div className="md:ml-4 w-full md:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="جميع الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع الحالات</SelectItem>
                <SelectItem value="processing">قيد المعالجة</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <p className="rtl">جاري تحميل الطلبات...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="rtl">رقم الطلب</TableHead>
                  <TableHead className="rtl">تاريخ الطلب</TableHead>
                  <TableHead className="rtl">العميل</TableHead>
                  <TableHead className="rtl">عدد المنتجات</TableHead>
                  <TableHead className="rtl">المبلغ الإجمالي</TableHead>
                  <TableHead className="rtl">الحالة</TableHead>
                  <TableHead className="rtl">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium rtl">#{order.id}</TableCell>
                    <TableCell className="rtl">{new Date(order.date).toLocaleDateString('ar')}</TableCell>
                    <TableCell className="rtl">{order.customer}</TableCell>
                    <TableCell className="rtl">{order.items}</TableCell>
                    <TableCell className="rtl">{order.total.toLocaleString()} د.ج</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)} rtl`}>
                        {getStatusText(order.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="rtl">
                        <Eye className="h-4 w-4 ml-1" />
                        عرض التفاصيل
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 rtl">
                      لا توجد طلبات مطابقة للبحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
