
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const Categories = () => {
  const categories = [
    {
      id: 'laptops',
      name: 'أجهزة محمولة',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
      count: 15
    },
    {
      id: 'desktops',
      name: 'أجهزة مكتبية',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7',
      count: 8
    },
    {
      id: 'accessories',
      name: 'ملحقات',
      image: 'https://images.unsplash.com/photo-1544866872-fa083f78fca6',
      count: 25
    },
    {
      id: 'components',
      name: 'مكونات الكمبيوتر',
      image: 'https://images.unsplash.com/photo-1591405351990-4726e331f141',
      count: 12
    }
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 rtl">تسوق حسب الفئة</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <Link 
              key={category.id} 
              to={`/products?category=${category.id}`}
              className="group relative overflow-hidden rounded-lg aspect-square"
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transition-transform group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 rtl">
                <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                <div className="flex items-center text-white/90 text-sm">
                  <span>{category.count} منتج</span>
                  <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:translate-x-[-4px]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
