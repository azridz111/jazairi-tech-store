
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, refreshProductsCache } from '@/data/products';
import DirectOrderProductCard from './DirectOrderProductCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const ProductGrid = () => {
  const [searchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Load products from database
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const products = await refreshProductsCache();
        setAllProducts(products);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  // Get the search term from URL if available
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);
  
  // Filter products based on search term and availability
  useEffect(() => {
    let result = [...allProducts];
    
    // Only show laptops
    result = result.filter(product => product.category === 'laptops');
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by availability
    if (inStockOnly) {
      result = result.filter(product => product.inStock);
    }
    
    // Sort products
    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    setFilteredProducts(result);
  }, [allProducts, searchTerm, inStockOnly, sortOrder]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg rtl">جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow rtl">
          <h2 className="text-xl font-bold mb-4">تصفية الحواسيب المحمولة</h2>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="search" className="mb-2 block">بحث</Label>
              <Input
                id="search"
                placeholder="ابحث عن حاسوب محمول..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="rtl"
              />
            </div>
            
            <div>
              <Label htmlFor="sort" className="mb-2 block">الترتيب</Label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="rtl">
                  <SelectValue placeholder="الترتيب الافتراضي" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">الترتيب الافتراضي</SelectItem>
                  <SelectItem value="price-asc">السعر: من الأقل إلى الأعلى</SelectItem>
                  <SelectItem value="price-desc">السعر: من الأعلى إلى الأقل</SelectItem>
                  <SelectItem value="name-asc">الاسم: أ-ي</SelectItem>
                  <SelectItem value="name-desc">الاسم: ي-أ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 rtl">
              <Checkbox 
                id="inStock" 
                checked={inStockOnly} 
                onCheckedChange={(checked) => setInStockOnly(checked as boolean)} 
              />
              <Label htmlFor="inStock">المنتجات المتوفرة فقط</Label>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold rtl">الحواسيب المحمولة</h2>
            <p className="text-sm text-gray-600 rtl">{filteredProducts.length} منتج</p>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <DirectOrderProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <p className="text-lg rtl">لم يتم العثور على حواسيب محمولة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
