
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product, products as initialProducts, saveProducts } from '@/data/products';
import AdminProductFormComponent from '@/components/admin/AdminProductForm';
import { toast } from 'sonner';

// متغير عالمي لتتبع آخر معرف تم استخدامه
let lastId = initialProducts.length > 0 
  ? Math.max(...initialProducts.map(p => p.id)) 
  : 0;

const AdminProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const isEditing = !!id;
  
  useEffect(() => {
    if (isEditing) {
      const productId = parseInt(id!);
      const foundProduct = initialProducts.find(p => p.id === productId);
      
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        toast.error('المنتج غير موجود');
        navigate('/admin/products');
      }
    }
    
    setLoading(false);
  }, [id, isEditing, navigate]);
  
  const handleSubmit = async (productData: Partial<Product>) => {
    setSubmitting(true);
    
    try {
      // محاكاة للاتصال بالخادم
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEditing && product) {
        // تحديث منتج موجود
        const updatedProduct = { ...product, ...productData };
        const index = initialProducts.findIndex(p => p.id === product.id);
        
        if (index !== -1) {
          initialProducts[index] = updatedProduct as Product;
          saveProducts(); // حفظ في localStorage
          toast.success('تم تحديث المنتج بنجاح');
        }
      } else {
        // إنشاء منتج جديد
        const newId = ++lastId;
        const newProduct = { 
          id: newId,
          ...productData
        } as Product;
        
        initialProducts.push(newProduct);
        saveProducts(); // حفظ في localStorage
        toast.success('تم إضافة المنتج بنجاح');
      }
      
      navigate('/admin/products');
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ المنتج');
      console.error('Error saving product:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="rtl">جاري التحميل...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center mb-6 rtl">
        <Link to="/admin/products" className="text-algerian-green hover:underline flex items-center">
          <ArrowRight className="ml-1 h-4 w-4" />
          العودة إلى المنتجات
        </Link>
      </div>
      
      <div className="mb-6 rtl">
        <h1 className="text-2xl font-bold">
          {isEditing ? 'تعديل المنتج' : 'إضافة منتج جديد'}
        </h1>
        <p className="text-gray-600">
          {isEditing 
            ? 'قم بتعديل بيانات المنتج وحفظ التغييرات'
            : 'قم بإدخال بيانات المنتج الجديد'
          }
        </p>
      </div>
      
      <AdminProductFormComponent 
        product={product}
        onSubmit={handleSubmit}
        isLoading={submitting}
      />
    </div>
  );
};

export default AdminProductForm;
