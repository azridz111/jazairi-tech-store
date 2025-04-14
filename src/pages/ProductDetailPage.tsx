
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product, products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, ArrowRight, TicketPercent, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  
  useEffect(() => {
    // Find product by ID
    const productId = parseInt(id || '0');
    const foundProduct = products.find(p => p.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Find similar products (same category, excluding this product)
      const similar = products
        .filter(p => p.category === foundProduct.category && p.id !== productId)
        .slice(0, 4);
      
      setSimilarProducts(similar);
    }
  }, [id]);
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 rtl">المنتج غير موجود</h1>
            <Button asChild className="rtl">
              <Link to="/products">
                <ArrowRight className="ml-2 h-4 w-4" />
                العودة إلى المنتجات
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100) 
    : 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6 rtl">
            <Link to="/products" className="text-algerian-green hover:underline flex items-center">
              <ArrowRight className="ml-1 h-4 w-4" />
              العودة إلى المنتجات
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <div className="relative overflow-hidden rounded-lg bg-gray-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-auto object-cover"
              />
              
              {hasDiscount && (
                <div className="absolute top-4 right-4 bg-algerian-red text-white px-3 py-1 rounded-full flex items-center rtl">
                  <TicketPercent size={16} className="ml-1" />
                  <span>{discountPercent}% خصم</span>
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div className="rtl">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="mb-4">
                <span className="text-2xl font-bold text-algerian-green">
                  {product.price.toLocaleString()} د.ج
                </span>
                {hasDiscount && (
                  <span className="text-lg text-gray-500 line-through mr-3">
                    {product.oldPrice?.toLocaleString()} د.ج
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 mb-6">{product.description}</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-bold mb-3">المواصفات:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-algerian-green mt-0.5 ml-2 flex-shrink-0" />
                    <span><strong>المعالج:</strong> {product.specs.processor}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-algerian-green mt-0.5 ml-2 flex-shrink-0" />
                    <span><strong>الذاكرة:</strong> {product.specs.ram}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-algerian-green mt-0.5 ml-2 flex-shrink-0" />
                    <span><strong>التخزين:</strong> {product.specs.storage}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-algerian-green mt-0.5 ml-2 flex-shrink-0" />
                    <span><strong>الرسوميات:</strong> {product.specs.gpu}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-algerian-green mt-0.5 ml-2 flex-shrink-0" />
                    <span><strong>الشاشة:</strong> {product.specs.display}</span>
                  </li>
                </ul>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <div className={`h-3 w-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'} ml-2`}></div>
                  <span>{product.inStock ? 'متوفر في المخزون' : 'غير متوفر حاليًا'}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => product.inStock && addToCart(product)}
                  className="flex-1"
                  size="lg"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="ml-2 h-5 w-5" />
                  إضافة للسلة
                </Button>
                <Button asChild variant="outline" size="lg" className="flex-1">
                  <Link to="/cart">الذهاب للسلة</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Product Tabs */}
          <Tabs defaultValue="description" className="mb-12">
            <TabsList className="rtl">
              <TabsTrigger value="description">الوصف</TabsTrigger>
              <TabsTrigger value="specifications">المواصفات التفصيلية</TabsTrigger>
              <TabsTrigger value="delivery">الشحن والتوصيل</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-4 rtl">
              <p>{product.description}</p>
              <p className="mt-4">
                جهاز متميز بأداء فائق ومواصفات عالية الجودة. مثالي للاستخدام اليومي والألعاب والعمل.
                يتميز بتصميم أنيق ومتين مع نظام تبريد متطور للحفاظ على أداء الجهاز حتى مع الاستخدام المكثف.
              </p>
            </TabsContent>
            <TabsContent value="specifications" className="p-4 rtl">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-bold">المعالج</td>
                    <td className="py-2">{product.specs.processor}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-bold">الذاكرة العشوائية</td>
                    <td className="py-2">{product.specs.ram}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-bold">التخزين</td>
                    <td className="py-2">{product.specs.storage}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-bold">بطاقة الرسوميات</td>
                    <td className="py-2">{product.specs.gpu}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-bold">الشاشة</td>
                    <td className="py-2">{product.specs.display}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-bold">نظام التشغيل</td>
                    <td className="py-2">Windows 11</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-bold">الضمان</td>
                    <td className="py-2">سنة واحدة</td>
                  </tr>
                </tbody>
              </table>
            </TabsContent>
            <TabsContent value="delivery" className="p-4 rtl">
              <h3 className="text-lg font-bold mb-2">معلومات الشحن والتوصيل</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>توصيل مجاني داخل ولاية الجزائر العاصمة.</li>
                <li>التوصيل إلى باقي الولايات خلال 3-7 أيام عمل.</li>
                <li>رسوم الشحن تبدأ من 1000 د.ج حسب الولاية والوزن.</li>
                <li>التوصيل عبر خدمة توصيل موثوقة مع إمكانية تتبع الشحنة.</li>
                <li>الدفع عند الاستلام متاح في معظم الولايات.</li>
              </ul>
            </TabsContent>
          </Tabs>
          
          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 rtl">منتجات مشابهة</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
