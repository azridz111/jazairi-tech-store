
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[]; // Array to store multiple images
  specs: {
    processor: string;
    ram: string;
    storage: string;
    gpu: string;
    display: string;
  };
  inStock: boolean;
  description: string;
}

// استيراد المنتجات من localStorage إذا كانت موجودة
const storedProducts = localStorage.getItem('products');
export const products: Product[] = storedProducts ? JSON.parse(storedProducts) : [];

// تحديث localStorage عند تغيير المنتجات
export const saveProducts = () => {
  localStorage.setItem('products', JSON.stringify(products));
};

// إضافة حاسوب محمول افتراضي إذا كانت القائمة فارغة
if (products.length === 0) {
  const defaultLaptop: Product = {
    id: 1,
    name: "حاسوب محمول HP Pavilion",
    category: "laptops",
    price: 85000,
    image: "https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1500_.jpg",
    images: ["https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1500_.jpg"],
    specs: {
      processor: "Intel Core i5-10300H",
      ram: "8GB DDR4",
      storage: "512GB SSD",
      gpu: "NVIDIA GTX 1650",
      display: "15.6 بوصة FHD"
    },
    inStock: true,
    description: "حاسوب محمول قوي لجميع الاستخدامات اليومية والألعاب الخفيفة."
  };
  
  products.push(defaultLaptop);
  saveProducts();
}
