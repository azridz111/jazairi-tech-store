
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-algerian-green to-emerald-700 text-white">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="max-w-2xl rtl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            أفضل أجهزة الكمبيوتر والإلكترونيات في الجزائر
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            اكتشف تشكيلتنا الواسعة من أحدث أجهزة الكمبيوتر المحمولة والمكتبية وملحقاتها بأسعار تنافسية وجودة عالية.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 rtl">
            <Button asChild size="lg" className="bg-white text-algerian-green hover:bg-gray-100">
              <Link to="/products">
                تسوق الآن
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-algerian-green">
              <Link to="/products?category=laptops">أجهزة محمولة</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
