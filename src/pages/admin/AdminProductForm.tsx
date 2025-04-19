import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { 
  loadProducts, 
  addProduct, 
  updateProduct, 
  products as initialProducts
} from '@/data/products';
import type { Product } from '@/data/products';
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
    const fetchData = async () => {
      setLoading(true);
      try {
        // تحميل المنتجات لضمان البيانات الأحدث
        await loadProducts();
        
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
      } catch (error) {
        console.error('Error loading product data:', error);
        toast.error('حدث خطأ أثناء تحميل بيانات المنتج');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditing, navigate]);
  
  const handleSubmit = async (productData: Partial<Product>) => {
    setSubmitting(true);
    
    try {
      if (isEditing && product) {
        // تحديث منتج موجود
        const updatedProduct = { ...product, ...productData } as Product;
        const success = await updateProduct(product.id, updatedProduct);
        
        if (success) {
          toast.success('تم تحديث المنتج بنجاح');
          navigate('/admin/products');
        } else {
          toast.error('فشل تحديث المنتج');
        }
      } else {
        // إضافة منتج جديد
        const newProduct = { 
          id: 1, // سيتم تحديثه تلقائياً في addProduct
          ...productData,
          // Ensure we have both image and images array
          image: productData.image || (productData.images && productData.images.length > 0 ? productData.images[0] : ''),
          images: productData.images || [productData.image || '']
        } as Product;
        
        const success = await addProduct(newProduct);
        
        if (success) {
          toast.success('تم إضافة المنتج بنجاح');
          navigate('/admin/products');
        } else {
          toast.error('فشل إضافة المنتج');
        }
      }
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
