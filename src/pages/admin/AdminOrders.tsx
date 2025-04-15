
import { useState, useEffect } from 'react';
import { Eye, Trash2, CheckCircle, XCircle } from 'lucide-react';
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
import { toast } from 'sonner';

type OrderStatus = 'processing' | 'completed' | 'cancelled';

interface Order {
  id: number;
  date: string;
  customer: string;
  total: number;
  status: OrderStatus;
  items: number;
}

// قائمة طلبات فارغة للبدء بها
const mockOrders: Order[] = [];

// متغير لتتبع آخر معرف طلب
let lastOrderId = 1000;

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // تحميل الطلبات
    setOrders(mockOrders);
    setLoading(false);
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleDeleteOrder = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      setOrders(prev => prev.filter(order => order.id !== id));
      toast.success('تم حذف الطلب بنجاح');
    }
  };
  
  const handleChangeOrderStatus = (id: number, newStatus: OrderStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id 
          ? { ...order, status: newStatus } 
          : order
      )
    );
    
    const statusText = 
      newStatus === 'completed' ? 'مكتمل' : 
      newStatus === 'processing' ? 'قيد المعالجة' : 'ملغي';
    
    toast.success(`تم تغيير حالة الطلب إلى ${statusText}`);
  };
  
  // وظيفة لإضافة طلب اختباري جديد
  const addTestOrder = () => {
    const newOrder: Order = {
      id: ++lastOrderId,
      date: new Date().toISOString().split('T')[0],
      customer: 'عميل جديد',
      total: Math.floor(Math.random() * 300000) + 50000,
      status: 'processing',
      items: Math.floor(Math.random() * 5) + 1
    };
    
    setOrders(prev => [...prev, newOrder]);
    toast.success('تم إضافة طلب اختباري جديد');
  };
  
  const filteredOrders = orders.filter(order => {
    // تصفية حسب البحث
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    // تصفية حسب الحالة
    const matchesStatus = statusFilter && statusFilter !== 'all' ? order.status === statusFilter : true;
    
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
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 md:items-center justify-between rtl">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
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
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="processing">قيد المعالجة</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={addTestOrder} className="rtl">
            إضافة طلب اختباري
          </Button>
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
                      <div className="flex space-x-2 rtl space-x-reverse">
                        <Button variant="outline" size="sm" className="rtl">
                          <Eye className="h-4 w-4 ml-1" />
                          عرض
                        </Button>
                        
                        {order.status === 'processing' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleChangeOrderStatus(order.id, 'completed')}
                          >
                            <CheckCircle className="h-4 w-4 ml-1" />
                            إكمال
                          </Button>
                        )}
                        
                        {order.status === 'processing' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleChangeOrderStatus(order.id, 'cancelled')}
                          >
                            <XCircle className="h-4 w-4 ml-1" />
                            إلغاء
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <Trash2 className="h-4 w-4 ml-1" />
                          حذف
                        </Button>
                      </div>
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
