
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, TicketPercent, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Product } from '@/data/products';
import { toast } from 'sonner';
import { createOrder } from '@/services/orders';

interface DirectOrderProductCardProps {
  product: Product;
}

const DirectOrderProductCard = ({ product }: DirectOrderProductCardProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100) 
    : 0;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error('يرجى إدخال الاسم ورقم الهاتف');
      return;
    }
    
    // Create order
    createOrder({
      productId: product.id,
      productName: product.name,
      customerName: formData.name,
      customerPhone: formData.phone,
      customerAddress: formData.address,
      notes: formData.notes,
      totalPrice: product.price,
      date: new Date().toISOString()
    });
    
    toast.success('تم إرسال طلبك بنجاح، سنتصل بك قريبا');
    
    // Reset form
    setFormData({
      name: '',
      phone: '',
      address: '',
      notes: ''
    });
    
    // The dialog will be closed automatically by the DialogClose component
  };
  
  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-48 object-cover transition-transform group-hover:scale-105"
          />
        </Link>
        
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-algerian-red text-white text-xs font-bold py-1 px-2 rounded-full flex items-center rtl">
            <TicketPercent size={14} className="ml-1" />
            <span>{discountPercent}% خصم</span>
          </div>
        )}
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">غير متوفر</span>
          </div>
        )}
      </div>
      
      <div className="p-4 rtl">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-bold mb-2 hover:text-algerian-green transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="mb-3">
          <span className="text-lg font-bold text-algerian-green">
            {product.price.toLocaleString()} د.ج
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through mr-2">
              {product.oldPrice?.toLocaleString()} د.ج
            </span>
          )}
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          <div>{product.specs.processor}</div>
          <div>{product.specs.ram}</div>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              className="w-full rtl"
              disabled={!product.inStock}
            >
              <ShoppingBag className="ml-2 h-4 w-4" />
              اطلب الآن
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rtl">
            <DialogHeader>
              <DialogTitle>طلب {product.name}</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="أدخل اسمك الكامل" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  placeholder="أدخل رقم هاتفك" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <Input 
                  id="address" 
                  name="address" 
                  placeholder="أدخل عنوانك" 
                  value={formData.address} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات إضافية</Label>
                <Textarea 
                  id="notes" 
                  name="notes" 
                  placeholder="أي ملاحظات إضافية حول طلبك" 
                  value={formData.notes} 
                  onChange={handleChange} 
                />
              </div>
              <div className="pt-2 text-sm text-gray-500">
                السعر: {product.price.toLocaleString()} د.ج
              </div>
            </form>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit" onClick={handleSubmit}>
                  <Send className="ml-2 h-4 w-4" />
                  إرسال الطلب
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DirectOrderProductCard;
