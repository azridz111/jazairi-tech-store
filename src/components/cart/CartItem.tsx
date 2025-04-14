
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  product: Product;
  quantity: number;
}

const CartItem = ({ product, quantity }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center border-b pb-4 mb-4 rtl">
      <div className="flex-shrink-0 w-full sm:w-20 h-20 mb-4 sm:mb-0 sm:mr-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover rounded" 
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="font-medium mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {product.specs.processor}, {product.specs.ram}
        </p>
        <p className="font-bold text-algerian-green">
          {product.price.toLocaleString()} د.ج
        </p>
      </div>
      
      <div className="flex items-center mt-4 sm:mt-0">
        <div className="flex items-center border rounded overflow-hidden mr-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-none"
            onClick={() => updateQuantity(product.id, quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <span className="w-10 text-center">{quantity}</span>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-none"
            onClick={() => updateQuantity(product.id, quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => removeFromCart(product.id)}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
