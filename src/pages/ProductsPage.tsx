
import ProductGrid from '@/components/products/ProductGrid';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const ProductsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-algerian-green to-emerald-700 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2 rtl">منتجاتنا</h1>
            <p className="rtl">تصفح مجموعتنا الواسعة من أجهزة الكمبيوتر والإلكترونيات</p>
          </div>
        </div>
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
