
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  
  // Generate a random order ID
  const orderId = Math.floor(100000 + Math.random() * 900000);
  
  // Redirect to home if accessed directly
  useEffect(() => {
    const hasOrderData = localStorage.getItem('lastOrderDate');
    
    if (!hasOrderData) {
      navigate('/');
      return;
    }
    
    // Store current date as last order date
    localStorage.setItem('lastOrderDate', new Date().toISOString());
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-algerian-green" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4 text-algerian-green rtl">تم الطلب بنجاح!</h1>
            <p className="text-lg mb-6 rtl">شكراً لك على طلبك. تم استلام طلبك وسيتم معالجته في أقرب وقت.</p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8 rtl">
              <p className="text-gray-700 mb-2">رقم الطلب: <span className="font-bold">{orderId}</span></p>
              <p className="text-gray-700">تاريخ الطلب: <span className="font-bold">{new Date().toLocaleDateString('ar')}</span></p>
            </div>
            
            <p className="mb-8 rtl">
              سيتم التواصل معك قريباً لتأكيد الطلب وترتيب التوصيل. يمكنك دائماً الاتصال بنا إذا كان لديك أي استفسارات.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 rtl">
              <Button asChild size="lg" className="flex-1">
                <Link to="/">
                  <Home className="ml-2 h-5 w-5" />
                  العودة للرئيسية
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1">
                <Link to="/products">
                  <Package className="ml-2 h-5 w-5" />
                  تصفح المنتجات
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
