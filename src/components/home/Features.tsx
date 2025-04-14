
import { Truck, ShieldCheck, RefreshCw, PhoneCall } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Truck className="h-10 w-10" />,
      title: 'توصيل سريع',
      description: 'نوصل لجميع ولايات الجزائر'
    },
    {
      icon: <ShieldCheck className="h-10 w-10" />,
      title: 'ضمان جودة',
      description: 'جميع منتجاتنا أصلية ومضمونة'
    },
    {
      icon: <RefreshCw className="h-10 w-10" />,
      title: 'استبدال سهل',
      description: 'استبدال المنتج خلال 14 يوم'
    },
    {
      icon: <PhoneCall className="h-10 w-10" />,
      title: 'دعم فني',
      description: 'فريق دعم متخصص لمساعدتك'
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg transition-transform hover:-translate-y-1">
              <div className="text-algerian-green mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 rtl">{feature.title}</h3>
              <p className="text-gray-600 rtl">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
