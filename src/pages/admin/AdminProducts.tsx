
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product, products as initialProducts } from '@/data/products';
import AdminProductList from '@/components/admin/AdminProductList';
import { toast } from 'sonner';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading products from API
    setTimeout(() => {
      setProducts(initialProducts);
      setLoading(false);
    }, 500);
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDelete = (id: number) => {
    // Confirm before deleting
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج؟')) {
      setProducts(products.filter(product => product.id !== id));
      toast.success('تم حذف المنتج بنجاح');
    }
  };
  
  const handleToggleStock = (id: number, inStock: boolean) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, inStock } : product
    ));
    
    toast.success(`تم ${inStock ? 'توفير' : 'نفاذ'} المنتج بنجاح`);
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
