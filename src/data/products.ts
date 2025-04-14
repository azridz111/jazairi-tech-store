
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  specs: {
    processor: string;
    ram: string;
    storage: string;
    gpu: string;
    display: string;
  };
  inStock: boolean;
  description: string;
  featured?: boolean;
}

// استيراد المنتجات من localStorage إذا كانت موجودة
const storedProducts = localStorage.getItem('products');
export const products: Product[] = storedProducts ? JSON.parse(storedProducts) : [];

// تحديث localStorage عند تغيير المنتجات
export const saveProducts = () => {
  localStorage.setItem('products', JSON.stringify(products));
};

