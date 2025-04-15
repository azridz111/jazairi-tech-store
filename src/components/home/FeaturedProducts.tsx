
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, products } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // Get featured products or fallback to first 4 products
    const featured = products.filter(product => product.featured) || products.slice(0, 4);
    setFeaturedProducts(featured);
  }, []);
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8 rtl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">منتجات مميزة</h2>
          <Button variant="outline" className="hidden md:flex rtl" asChild>
            <a href="/products">
              عرض الكل
              <ChevronLeft className="mr-2 h-4 w-4" />
            </a>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} featured />
          ))}
        </div>
        
        <div className="flex justify-center mt-8 md:hidden">
          <Button variant="outline" className="rtl" asChild>
            <a href="/products">
              عرض جميع المنتجات
              <ChevronLeft className="mr-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
