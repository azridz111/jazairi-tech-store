
import { Link } from 'react-router-dom';
import { TicketPercent } from 'lucide-react';
import { Product } from '@/data/products';

interface DirectOrderProductCardProps {
  product: Product;
}

const DirectOrderProductCard = ({ product }: DirectOrderProductCardProps) => {
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100) 
    : 0;
  
  // Use the main image or the first image from the images array
  const displayImage = product.image || (product.images && product.images.length > 0 ? product.images[0] : '');
  
  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img 
            src={displayImage} 
            alt={product.name} 
            className="w-full h-48 object-cover transition-transform group-hover:scale-105"
          />
        </Link>
        
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-algerian-red text-white text-xs font-bold py-1 px-2 rounded-full flex items-center rtl">
            <TicketPercent size={14} className="ml-1" />
            <span>{discountPercent}% خصم</span>
          </div>
        )}
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">غير متوفر</span>
          </div>
        )}
      </div>
      
      <div className="p-4 rtl">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-bold mb-2 hover:text-algerian-green transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="mb-3">
          <span className="text-lg font-bold text-algerian-green">
            {product.price.toLocaleString()} د.ج
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through mr-2">
              {product.oldPrice?.toLocaleString()} د.ج
            </span>
          )}
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          <div>{product.specs.processor}</div>
          <div>{product.specs.ram}</div>
        </div>
        
        <Link 
          to={`/product/${product.id}`}
          className="block w-full text-center py-2 px-4 bg-algerian-green text-white rounded-md hover:bg-algerian-green/90 transition-colors rtl"
        >
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
};

export default DirectOrderProductCard;
