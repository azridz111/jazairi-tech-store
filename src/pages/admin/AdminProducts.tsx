
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { deleteProduct, updateProduct, refreshProductsCache } from '@/data/products';
import AdminProductList from '@/components/admin/AdminProductList';
import { toast } from 'sonner';
import type { Product } from '@/data/products';

const AdminProducts = () => {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load products
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const products = await refreshProductsCache();
        setProductsList(products);
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
    // Confirm before deleting
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج؟')) {
      try {
        // Delete the product from the database
        const success = await deleteProduct(id);
        
        if (success) {
          // Update local state
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
      // Find the product in the list
      const product = productsList.find(p => p.id === id);
      
      if (!product) {
        toast.error('المنتج غير موجود');
        return;
      }
      
      // Update stock status
      const updatedProduct = { ...product, inStock };
      
      // Update in database
      const success = await updateProduct(id, updatedProduct);
      
      if (success) {
        // Update local state
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
