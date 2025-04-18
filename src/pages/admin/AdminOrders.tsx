
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Order, getOrders, updateOrderStatus, deleteOrder } from '@/services/orders';

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);
  
  const loadOrders = async () => {
    setLoading(true);
    try {
      // Properly await the Promise result
      const ordersList = await getOrders();
      setOrders(ordersList);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('حدث خطأ أثناء تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleDeleteOrder = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      try {
        const deleted = await deleteOrder(id);
        
        if (deleted) {
          setOrders(prev => prev.filter(order => order.id !== id));
          toast.success('تم حذف الطلب بنجاح');
        } else {
          toast.error('فشل في حذف الطلب');
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error('حدث خطأ أثناء حذف الطلب');
      }
    }
  };
  
  const handleChangeOrderStatus = async (id: string, newStatus: 'pending' | 'completed' | 'cancelled') => {
    try {
      const updated = await updateOrderStatus(id, newStatus);
      
      if (updated) {
        setOrders(prev => 
          prev.map(order => 
            order.id === id 
              ? { ...order, status: newStatus } 
              : order
          )
        );
        
        const statusText = 
          newStatus === 'completed' ? 'مكتمل' : 
          newStatus === 'pending' ? 'قيد المعالجة' : 'ملغي';
        
        toast.success(`تم تغيير حالة الطلب إلى ${statusText}`);
      } else {
        toast.error('فشل في تحديث حالة الطلب');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('حدث خطأ أثناء تحديث حالة الطلب');
    }
  };
  
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
  };
  
  const filteredOrders = orders.filter(order => {
    // Filter by search term
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);
    
    // Filter by status
    const matchesStatus = statusFilter && statusFilter !== 'all' ? order.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'pending':
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
                  <SelectItem value="pending">قيد المعالجة</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={loadOrders} className="rtl">
            تحديث الطلبات
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
                  <TableHead className="rtl">اسم العميل</TableHead>
                  <TableHead className="rtl">رقم الهاتف</TableHead>
                  <TableHead className="rtl">المنتج</TableHead>
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
                    <TableCell className="rtl">{order.customerName}</TableCell>
                    <TableCell className="rtl">{order.customerPhone}</TableCell>
                    <TableCell className="rtl">{order.productName}</TableCell>
                    <TableCell className="rtl">{order.totalPrice.toLocaleString()} د.ج</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)} rtl`}>
                        {getStatusText(order.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 rtl space-x-reverse">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rtl"
                              onClick={() => viewOrderDetails(order)}
                            >
                              <Eye className="h-4 w-4 ml-1" />
                              عرض
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rtl">
                            <DialogHeader>
                              <DialogTitle>تفاصيل الطلب #{order.id}</DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h3 className="text-lg font-bold mb-2">معلومات العميل</h3>
                                    <p><strong>الاسم:</strong> {selectedOrder.customerName}</p>
                                    <p><strong>رقم الهاتف:</strong> {selectedOrder.customerPhone}</p>
                                    {selectedOrder.customerAddress && (
                                      <p><strong>العنوان:</strong> {selectedOrder.customerAddress}</p>
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-bold mb-2">معلومات الطلب</h3>
                                    <p><strong>رقم الطلب:</strong> #{selectedOrder.id}</p>
                                    <p><strong>التاريخ:</strong> {new Date(selectedOrder.date).toLocaleDateString('ar')}</p>
                                    <p>
                                      <strong>الحالة:</strong> 
                                      <span className={`mr-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedOrder.status)}`}>
                                        {getStatusText(selectedOrder.status)}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="mt-4">
                                  <h3 className="text-lg font-bold mb-2">المنتج المطلوب</h3>
                                  <div className="border rounded-lg p-3">
                                    <p><strong>المنتج:</strong> {selectedOrder.productName}</p>
                                    <p><strong>السعر:</strong> {selectedOrder.totalPrice.toLocaleString()} د.ج</p>
                                  </div>
                                </div>
                                
                                {selectedOrder.notes && (
                                  <div className="mt-4">
                                    <h3 className="text-lg font-bold mb-2">ملاحظات</h3>
                                    <p>{selectedOrder.notes}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {order.status === 'pending' && (
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
                        
                        {order.status === 'pending' && (
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
                    <TableCell colSpan={8} className="text-center py-8 rtl">
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
