
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 rtl">
          <div>
            <h3 className="text-xl font-bold mb-4">تيك ستور الجزائر</h3>
            <p className="mb-4">
              متجرك المفضل للكمبيوتر والإلكترونيات في الجزائر، نوفر أحدث المنتجات بأفضل الأسعار.
            </p>
            <div className="flex space-x-4 rtl">
              <a href="#" className="hover:text-algerian-red transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-algerian-red transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-algerian-red transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-algerian-red transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-algerian-red transition-colors">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-algerian-red transition-colors">
                  سلة التسوق
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-algerian-red transition-colors">
                  تسجيل الدخول
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">فئات المنتجات</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=laptops" className="hover:text-algerian-red transition-colors">
                  أجهزة الكمبيوتر المحمولة
                </Link>
              </li>
              <li>
                <Link to="/products?category=desktops" className="hover:text-algerian-red transition-colors">
                  أجهزة الكمبيوتر المكتبية
                </Link>
              </li>
              <li>
                <Link to="/products?category=accessories" className="hover:text-algerian-red transition-colors">
                  ملحقات الكمبيوتر
                </Link>
              </li>
              <li>
                <Link to="/products?category=components" className="hover:text-algerian-red transition-colors">
                  مكونات الكمبيوتر
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">اتصل بنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <MapPin size={20} className="ml-2" />
                <span>شارع ديدوش مراد، الجزائر العاصمة</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="ml-2" />
                <span>+213 XX XX XX XX</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="ml-2" />
                <span>info@techstore-dz.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} تيك ستور الجزائر. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
