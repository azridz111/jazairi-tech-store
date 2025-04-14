
import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, products } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';

const FeaturedProducts = () => {
  const [laptopProducts, setLaptopProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // Get all laptop products, limited to 4 for display
    const laptops = products.filter(product => product.category === 'laptops').slice(0, 4);
    setLaptopProducts(laptops);
  }, []);
  
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {laptopProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
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

export default FeaturedProducts;
