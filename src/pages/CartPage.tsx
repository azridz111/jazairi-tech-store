
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import CartItem from '@/components/cart/CartItem';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const CartPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6 rtl">
            <Link to="/products" className="text-algerian-green hover:underline flex items-center">
              <ArrowRight className="ml-1 h-4 w-4" />
              مواصلة التسوق
            </Link>
          </div>
          
          <h1 className="text-2xl font-bold mb-6 rtl">سلة التسوق</h1>
          
          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  {items.map(item => (
                    <CartItem 
                      key={item.product.id} 
                      product={item.product}
                      quantity={item.quantity}
                    />
                  ))}
                  
                  <div className="flex justify-between mt-6 rtl">
                    <Button variant="outline" className="text-red-500" onClick={clearCart}>
                      <Trash2 className="ml-2 h-4 w-4" />
                      تفريغ السلة
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/products">
                        <ArrowRight className="ml-2 h-4 w-4" />
                        مواصلة التسوق
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-lg font-bold mb-4 rtl">ملخص الطلب</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between rtl">
                      <span>عدد المنتجات:</span>
                      <span>{items.length}</span>
                    </div>
                    <div className="flex justify-between rtl">
                      <span>المجموع الفرعي:</span>
                      <span>{totalPrice.toLocaleString()} د.ج</span>
                    </div>
                    <div className="flex justify-between rtl">
                      <span>الشحن:</span>
                      <span>يحدد عند الطلب</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between font-bold rtl">
                        <span>المجموع:</span>
                        <span className="text-algerian-green">{totalPrice.toLocaleString()} د.ج</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button asChild className="w-full">
                    <Link to="/checkout">
                      متابعة الطلب
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center bg-white py-16 px-4 rounded-lg shadow-md">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-bold mb-4 rtl">سلة التسوق فارغة</h2>
              <p className="text-gray-500 mb-6 rtl">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد.</p>
              <Button asChild>
                <Link to="/products">
                  <ArrowRight className="ml-2 h-4 w-4" />
                  تصفح المنتجات
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
