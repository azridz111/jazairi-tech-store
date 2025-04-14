
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product, products as initialProducts } from '@/data/products';
import AdminProductFormComponent from '@/components/admin/AdminProductForm';
import { toast } from 'sonner';

const AdminProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const isEditing = !!id;
  
  useEffect(() => {
    if (isEditing) {
      // Simulate API call to fetch product
      setTimeout(() => {
        const productId = parseInt(id);
        const foundProduct = initialProducts.find(p => p.id === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          toast.error('المنتج غير موجود');
          navigate('/admin/products');
        }
        
        setLoading(false);
      }, 500);
    } else {
      setLoading(false);
    }
  }, [id, isEditing, navigate]);
  
  const handleSubmit = async (productData: Partial<Product>) => {
    setSubmitting(true);
    
    // Simulate API call to save product
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEditing) {
        toast.success('تم تحديث المنتج بنجاح');
      } else {
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
