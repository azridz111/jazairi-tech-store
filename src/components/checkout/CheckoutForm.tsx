
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wilayas } from '@/data/wilayas';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createOrder } from '@/services/orders';

interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  wilaya: string;
  address: string;
  notes: string;
}

const CheckoutForm = () => {
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
    
    setLoading(true);
    
    // Simulate API request
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create full address
      const fullAddress = `${formData.address}، ${formData.wilaya}`;
      
      // Create an order object
      const orderData = {
        productId: 0, // Will be set when ordering from product page
        productName: "طلب مباشر", // Will be updated when ordering from product page
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerPhone: formData.phoneNumber,
        customerAddress: fullAddress,
        notes: formData.notes,
        totalPrice: 0, // Will be set when ordering from product page
        date: new Date().toISOString()
      };
      
      // Create the order
      createOrder(orderData);
      
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
                <div className="relative">
                  <div className="border border-input rounded-md overflow-hidden">
                    <ScrollArea className="h-[150px]">
                      <div className="p-1">
                        {wilayas.map(wilaya => (
                          <div 
                            key={wilaya.id}
                            className={`px-3 py-2 cursor-pointer rounded-sm ${formData.wilaya === wilaya.name ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}
                            onClick={() => handleSelectChange('wilaya', wilaya.name)}
                          >
                            {wilaya.name}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {formData.wilaya ? `الولاية المختارة: ${formData.wilaya}` : 'اختر الولاية'}
                  </div>
                </div>
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
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'جاري إرسال الطلب...' : 'إرسال الطلب'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>معلومات الطلب</CardTitle>
              <CardDescription>تفاصيل الطلب</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-6">
                <p className="text-lg font-bold mb-3">Micro Tech</p>
                <p className="text-sm text-gray-600 mb-1">الجزائر، المسيلة، برهوم</p>
                <p className="text-sm text-gray-600">0791764469</p>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-center text-gray-600">
                  سيتم الاتصال بك في أقرب وقت ممكن لتأكيد طلبك وتحديد تفاصيل التوصيل والدفع.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
