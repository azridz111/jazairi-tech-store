
import { useState } from 'react';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import ImageUpload from './ImageUpload';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AdminProductFormProps {
  product?: Product;
  onSubmit: (product: Partial<Product>) => void;
  isLoading: boolean;
}

const AdminProductForm = ({ product, onSubmit, isLoading }: AdminProductFormProps) => {
  const isEditing = !!product;
  
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      category: 'laptops', // Always set to laptops
      price: 0,
      oldPrice: undefined,
      image: '',
      images: [],
      specs: {
        processor: '',
        ram: '',
        storage: '',
        gpu: '',
        display: ''
      },
      inStock: true,
      description: ''
    }
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      specs: {
        ...prev.specs,
        [name]: value
      }
    }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ 
      ...prev, 
      images: images,
      // Set the first image as the main product image
      image: images.length > 0 ? images[0] : ''
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure category is always laptops
    onSubmit({...formData, category: 'laptops'});
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="rtl">
          {isEditing ? 'تعديل المنتج' : 'إضافة حاسوب محمول جديد'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 rtl">
          <div className="space-y-2">
            <Label htmlFor="name">اسم الحاسوب المحمول</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Hidden field for category - always laptops */}
          <input type="hidden" name="category" value="laptops" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">السعر (د.ج)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="oldPrice">السعر القديم (اختياري)</Label>
              <Input
                id="oldPrice"
                name="oldPrice"
                type="number"
                value={formData.oldPrice || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>صور المنتج</Label>
            <ImageUpload 
              images={formData.images || []}
              onChange={handleImagesChange}
            />
            {formData.images?.length === 0 && (
              <p className="text-xs text-red-500">يجب إضافة صورة واحدة على الأقل</p>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">المواصفات</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="processor">المعالج</Label>
                <Input
                  id="processor"
                  name="processor"
                  value={formData.specs?.processor || ''}
                  onChange={handleSpecChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ram">الذاكرة العشوائية</Label>
                <Input
                  id="ram"
                  name="ram"
                  value={formData.specs?.ram || ''}
                  onChange={handleSpecChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storage">التخزين</Label>
                <Input
                  id="storage"
                  name="storage"
                  value={formData.specs?.storage || ''}
                  onChange={handleSpecChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpu">بطاقة الرسوميات</Label>
                <Input
                  id="gpu"
                  name="gpu"
                  value={formData.specs?.gpu || ''}
                  onChange={handleSpecChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display">الشاشة</Label>
                <Input
                  id="display"
                  name="display"
                  value={formData.specs?.display || ''}
                  onChange={handleSpecChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2 rtl">
            <Checkbox 
              id="inStock" 
              checked={formData.inStock}
              onCheckedChange={(checked) => handleCheckboxChange('inStock', checked as boolean)}
            />
            <Label htmlFor="inStock">متوفر في المخزون</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full rtl" 
            disabled={isLoading || (formData.images?.length === 0)}
          >
            {isLoading 
              ? 'جاري الحفظ...' 
              : isEditing 
                ? 'حفظ التغييرات' 
                : 'إضافة الحاسوب المحمول'
            }
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AdminProductForm;
