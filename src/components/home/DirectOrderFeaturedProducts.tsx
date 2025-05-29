
import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, refreshProductsCache } from '@/data/products';
import DirectOrderProductCard from '@/components/products/DirectOrderProductCard';

const DirectOrderFeaturedProducts = () => {
  const [laptopProducts, setLaptopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const products = await refreshProductsCache();
        // Get all laptop products, limited to 4 for display
        const laptops = products.filter(product => product.category === 'laptops').slice(0, 4);
        setLaptopProducts(laptops);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="rtl">جاري تحميل المنتجات...</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8 rtl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">الحواسيب المحمولة</h2>
          <Button variant="outline" className="hidden md:flex rtl" asChild>
            <a href="/products">
              عرض الكل
              <ChevronLeft className="mr-2 h-4 w-4" />
            </a>
          </Button>
        </div>
        
        {laptopProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {laptopProducts.map(product => (
              <DirectOrderProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600 rtl">لا توجد حواسيب محمولة متوفرة حالياً</p>
          </div>
        )}
        
        <div className="flex justify-center mt-8 md:hidden">
          <Button variant="outline" className="rtl" asChild>
            <a href="/products">
              عرض جميع الحواسيب المحمولة
              <ChevronLeft className="mr-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DirectOrderFeaturedProducts;
