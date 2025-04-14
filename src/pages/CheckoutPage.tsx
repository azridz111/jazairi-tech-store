
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const CheckoutPage = () => {
  const { items } = useCart();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6 rtl">
            <Link to="/cart" className="text-algerian-green hover:underline flex items-center">
              <ArrowRight className="ml-1 h-4 w-4" />
              العودة إلى السلة
            </Link>
          </div>
          
          <h1 className="text-2xl font-bold mb-8 rtl">إتمام الطلب</h1>
          
          {items.length > 0 ? (
            <CheckoutForm />
          ) : (
            <div className="text-center bg-white py-16 px-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 rtl">لا يمكن إتمام الطلب</h2>
              <p className="text-gray-500 mb-6 rtl">سلة التسوق فارغة. يرجى إضافة منتجات إلى السلة قبل متابعة عملية الشراء.</p>
              <Link 
                to="/products" 
                className="inline-flex items-center px-4 py-2 rounded-md bg-algerian-green text-white hover:bg-algerian-green/90 transition rtl"
              >
                <ArrowRight className="ml-2 h-4 w-4" />
                تصفح المنتجات
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
