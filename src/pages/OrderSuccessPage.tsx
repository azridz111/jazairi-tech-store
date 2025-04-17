
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Package, Edit, Trash2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { wilayas } from '@/data/wilayas';
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';
import { updateOrder, deleteOrder } from '@/services/orders';

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
  status: 'pending' | 'completed' | 'cancelled';
}

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [editForm, setEditForm] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    wilaya: '',
    address: '',
    notes: ''
  });
  const [searchText, setSearchText] = useState('');
  
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
    
    // Extract wilaya and address from customerAddress
    const addressParts = lastOrder.customerAddress.split('، ');
    const wilaya = addressParts.length > 1 ? addressParts[addressParts.length - 1] : '';
    const address = addressParts.length > 1 ? addressParts.slice(0, -1).join('، ') : lastOrder.customerAddress;
    
    // Initialize edit form with current data
    if (lastOrder) {
      setEditForm({
        customerName: lastOrder.customerName,
        customerPhone: lastOrder.customerPhone,
        customerAddress: lastOrder.customerAddress,
        wilaya: wilaya,
        address: address,
        notes: lastOrder.notes || ''
      });
    }
    
    // Store current date as last order date
    localStorage.setItem('lastOrderDate', new Date().toISOString());
  }, [navigate]);
  
  const filteredWilayas = searchText 
    ? wilayas.filter((wilaya) => 
        wilaya.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : wilayas;
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleWilayaSelect = (wilayaName: string) => {
    setEditForm(prev => ({ ...prev, wilaya: wilayaName }));
    setSearchText("");
  };
  
  const handleSaveEdit = () => {
    if (!orderData) return;
    
    if (!editForm.customerName || !editForm.customerPhone || !editForm.wilaya) {
      toast.error('يرجى إدخال الاسم ورقم الهاتف والولاية');
      return;
    }
    
    // Create the full address
    const fullAddress = editForm.address 
      ? `${editForm.address}، ${editForm.wilaya}`
      : editForm.wilaya;
    
    // Update order in localStorage
    const updateSuccess = updateOrder(orderData.id, {
      customerName: editForm.customerName,
      customerPhone: editForm.customerPhone,
      customerAddress: fullAddress,
      notes: editForm.notes
    });
    
    if (updateSuccess) {
      // Update current order data in the state
      setOrderData({
        ...orderData,
        customerName: editForm.customerName,
        customerPhone: editForm.customerPhone,
        customerAddress: fullAddress,
        notes: editForm.notes
      });
      
      toast.success('تم تحديث معلومات الطلب بنجاح');
    } else {
      toast.error('حدث خطأ أثناء تحديث الطلب');
    }
  };
  
  const handleDeleteOrder = () => {
    if (!orderData) return;
    
    // Remove order from localStorage
    const deleteSuccess = deleteOrder(orderData.id);
    
    if (deleteSuccess) {
      toast.success('تم حذف الطلب بنجاح');
      navigate('/');
    } else {
      toast.error('حدث خطأ أثناء حذف الطلب');
    }
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
              <p className="text-gray-700 mb-2">المنتج: <span className="font-bold">{orderData.productName}</span></p>
              <p className="text-gray-700 mb-2">السعر: <span className="font-bold">{orderData.totalPrice.toLocaleString()} د.ج</span></p>
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
                        <label htmlFor="wilaya" className="text-sm font-medium">الولاية</label>
                        <Command className="rounded-lg border shadow-md">
                          <CommandInput 
                            placeholder="ابحث عن الولاية..." 
                            value={searchText}
                            onValueChange={setSearchText}
                            className="text-right"
                          />
                          <CommandEmpty className="text-right p-2">لا توجد نتائج</CommandEmpty>
                          <CommandGroup className="max-h-48 overflow-auto">
                            {filteredWilayas.map((wilaya) => (
                              <CommandItem
                                key={wilaya.id}
                                value={wilaya.name}
                                onSelect={() => handleWilayaSelect(wilaya.name)}
                                className="text-right cursor-pointer"
                              >
                                {wilaya.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                        {editForm.wilaya && (
                          <p className="text-sm text-muted-foreground mt-1">
                            الولاية المختارة: {editForm.wilaya}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="address" className="text-sm font-medium">العنوان التفصيلي</label>
                        <Input
                          id="address"
                          name="address"
                          value={editForm.address}
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
                      <Button onClick={handleSaveEdit}>
                        <Send className="ml-2 h-4 w-4" />
                        حفظ التغييرات
                      </Button>
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
