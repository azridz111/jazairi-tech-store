
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { wilayas } from '@/data/wilayas';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  wilaya: string;
  address: string;
  notes: string;
}

const CheckoutForm = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    wilaya: '',
    address: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.wilaya || !formData.address) {
      toast.error('الرجاء إكمال جميع الحقول المطلوبة');
      return;
    }
    
    if (items.length === 0) {
      toast.error('سلة التسوق فارغة');
      return;
    }
    
    setLoading(true);
    
    // Simulate API request
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send the order data to your backend
      console.log('Order submitted:', {
        customerInfo: formData,
        items: items.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        totalAmount: totalPrice
      });
      
      // Clear cart and redirect to success page
      clearCart();
      toast.success('تم إرسال طلبك بنجاح');
      navigate('/order-success');
    } catch (error) {
      toast.error('حدث خطأ أثناء إرسال طلبك');
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>معلومات الشخصية</CardTitle>
              <CardDescription>أدخل بياناتك الشخصية لإتمام الطلب</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">الاسم <span className="text-red-500">*</span></Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">اللقب <span className="text-red-500">*</span></Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">رقم الهاتف <span className="text-red-500">*</span></Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="0XXXXXXXXX"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wilaya">الولاية <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.wilaya}
                  onValueChange={(value) => handleSelectChange('wilaya', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الولاية" />
                  </SelectTrigger>
                  <SelectContent>
                    {wilayas.map(wilaya => (
                      <SelectItem key={wilaya.id} value={wilaya.name}>
                        {wilaya.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">العنوان <span className="text-red-500">*</span></Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="أي معلومات إضافية تريد إضافتها لطلبك"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>ملخص الطلب</CardTitle>
              <CardDescription>مراجعة المنتجات والسعر الإجمالي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.length > 0 ? (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between pb-2 border-b">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">{item.quantity} × {item.product.price.toLocaleString()} د.ج</p>
                      </div>
                      <p className="font-medium">{(item.product.price * item.quantity).toLocaleString()} د.ج</p>
                    </div>
                  ))}
                  
                  <div className="flex justify-between pt-2">
                    <p className="font-bold">المجموع</p>
                    <p className="font-bold text-algerian-green">{totalPrice.toLocaleString()} د.ج</p>
                  </div>
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">سلة التسوق فارغة</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || items.length === 0}
              >
                {loading ? 'جاري إرسال الطلب...' : 'إرسال الطلب'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
