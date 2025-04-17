
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loadProducts, deleteProduct, products, updateProduct } from '@/data/products';
import AdminProductList from '@/components/admin/AdminProductList';
import { toast } from 'sonner';
import type { Product } from '@/data/products';

const AdminProducts = () => {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // تحميل المنتجات
    const fetchProducts = async () => {
      setLoading(true);
      try {
        await loadProducts();
        setProductsList([...products]);
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error('حدث خطأ أثناء تحميل المنتجات');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredProducts = productsList.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDelete = async (id: number) => {
    // التأكيد قبل الحذف
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج؟')) {
      try {
        // حذف المنتج من قاعدة البيانات
        const success = await deleteProduct(id);
        
        if (success) {
          // تحديث حالة التطبيق المحلية
          setProductsList(prev => prev.filter(product => product.id !== id));
          toast.success('تم حذف المنتج بنجاح');
        } else {
          toast.error('فشل حذف المنتج');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('حدث خطأ أثناء حذف المنتج');
      }
    }
  };
  
  const handleToggleStock = async (id: number, inStock: boolean) => {
    try {
      // إيجاد المنتج في القائمة
      const product = productsList.find(p => p.id === id);
      
      if (!product) {
        toast.error('المنتج غير موجود');
        return;
      }
      
      // تحديث حالة المخزون
      const updatedProduct = { ...product, inStock };
      
      // تحديث في قاعدة البيانات
      const success = await updateProduct(id, updatedProduct);
      
      if (success) {
        // تحديث حالة التطبيق المحلية
        setProductsList(productsList.map(product => 
          product.id === id ? { ...product, inStock } : product
        ));
        
        toast.success(`تم ${inStock ? 'توفير' : 'نفاذ'} المنتج بنجاح`);
      } else {
        toast.error('فشل تحديث حالة المنتج');
      }
    } catch (error) {
      console.error('Error updating product stock:', error);
      toast.error('حدث خطأ أثناء تحديث حالة المنتج');
    }
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 rtl">
        <div>
          <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
          <p className="text-gray-600">إضافة، تعديل وحذف منتجات المتجر</p>
        </div>
        <Button asChild>
          <Link to="/admin/products/add">
            <Plus className="h-4 w-4 ml-2" />
            إضافة منتج جديد
          </Link>
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4 border-b">
          <Input
            placeholder="ابحث عن منتج..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-md rtl"
          />
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <p className="rtl">جاري تحميل المنتجات...</p>
          </div>
        ) : (
          <AdminProductList 
            products={filteredProducts} 
            onDelete={handleDelete}
            onToggleStock={handleToggleStock}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
