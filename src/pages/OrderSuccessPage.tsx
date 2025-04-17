
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Package, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';

interface OrderData {
  id: string;
  productId: number;
  productName: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes: string;
  totalPrice: number;
  date: string;
}

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [editForm, setEditForm] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    notes: ''
  });
  
  // Generate a random order ID
  const orderId = Math.floor(100000 + Math.random() * 900000);
  
  useEffect(() => {
    // Get stored orders
    const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    
    if (savedOrders.length === 0) {
      navigate('/');
      return;
    }
    
    // Get the most recent order
    const lastOrder = savedOrders[savedOrders.length - 1];
    setOrderData(lastOrder);
    
    // Initialize edit form with current data
    if (lastOrder) {
      setEditForm({
        customerName: lastOrder.customerName,
        customerPhone: lastOrder.customerPhone,
        customerAddress: lastOrder.customerAddress,
        notes: lastOrder.notes || ''
      });
    }
    
    // Store current date as last order date
    localStorage.setItem('lastOrderDate', new Date().toISOString());
  }, [navigate]);
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveEdit = () => {
    if (!orderData) return;
    
    // Update order in localStorage
    const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const updatedOrders = savedOrders.map((order: OrderData) => {
      if (order.id === orderData.id) {
        return {
          ...order,
          customerName: editForm.customerName,
          customerPhone: editForm.customerPhone,
          customerAddress: editForm.customerAddress,
          notes: editForm.notes
        };
      }
      return order;
    });
    
    localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
    
    // Update current order data
    setOrderData({
      ...orderData,
      customerName: editForm.customerName,
      customerPhone: editForm.customerPhone,
      customerAddress: editForm.customerAddress,
      notes: editForm.notes
    });
    
    toast.success('تم تحديث معلومات الطلب بنجاح');
  };
  
  const handleDeleteOrder = () => {
    if (!orderData) return;
    
    // Remove order from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const updatedOrders = savedOrders.filter((order: OrderData) => order.id !== orderData.id);
    localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
    
    toast.success('تم حذف الطلب بنجاح');
    navigate('/');
  };
  
  if (!orderData) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-algerian-green" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4 text-algerian-green rtl">تم الطلب بنجاح!</h1>
            <p className="text-lg mb-6 rtl">شكراً لك على طلبك. تم استلام طلبك وسيتم معالجته في أقرب وقت.</p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8 rtl">
              <p className="text-gray-700 mb-2">رقم الطلب: <span className="font-bold">{orderId}</span></p>
              <p className="text-gray-700 mb-4">تاريخ الطلب: <span className="font-bold">{new Date(orderData.date).toLocaleDateString('ar')}</span></p>
              
              <div className="text-right border-t pt-4 mt-4">
                <p className="mb-1"><strong>الاسم:</strong> {orderData.customerName}</p>
                <p className="mb-1"><strong>رقم الهاتف:</strong> {orderData.customerPhone}</p>
                <p className="mb-1"><strong>العنوان:</strong> {orderData.customerAddress}</p>
                {orderData.notes && <p className="mb-1"><strong>ملاحظات:</strong> {orderData.notes}</p>}
              </div>
              
              <div className="flex justify-center gap-4 mt-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Edit className="ml-2 h-4 w-4" />
                      تعديل المعلومات
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rtl">
                    <DialogHeader>
                      <DialogTitle>تعديل معلومات الطلب</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="customerName" className="text-sm font-medium">الاسم</label>
                        <Input
                          id="customerName"
                          name="customerName"
                          value={editForm.customerName}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="customerPhone" className="text-sm font-medium">رقم الهاتف</label>
                        <Input
                          id="customerPhone"
                          name="customerPhone"
                          value={editForm.customerPhone}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="customerAddress" className="text-sm font-medium">العنوان</label>
                        <Input
                          id="customerAddress"
                          name="customerAddress"
                          value={editForm.customerAddress}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="notes" className="text-sm font-medium">ملاحظات</label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={editForm.notes}
                          onChange={handleEditChange}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleSaveEdit}>حفظ التغييرات</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="ml-2 h-4 w-4" />
                      حذف الطلب
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rtl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>هل أنت متأكد من حذف الطلب؟</AlertDialogTitle>
                      <AlertDialogDescription>
                        لا يمكن التراجع عن هذا الإجراء. سيتم حذف الطلب نهائيًا.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteOrder}>حذف</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            <p className="mb-8 rtl">
              سيتم التواصل معك قريباً لتأكيد الطلب وترتيب التوصيل. يمكنك دائماً الاتصال بنا إذا كان لديك أي استفسارات.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 rtl">
              <Button asChild size="lg" className="flex-1">
                <Link to="/">
                  <Home className="ml-2 h-5 w-5" />
                  العودة للرئيسية
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1">
                <Link to="/products">
                  <Package className="ml-2 h-5 w-5" />
                  تصفح المنتجات
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
