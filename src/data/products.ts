
// Define Product type and export it
export interface Product {
  id: number;
  name: string;
  category: 'laptops' | 'desktops' | 'accessories' | 'components';
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
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

// مخزن مؤقت للمنتجات
let productsCache: Product[] = [];

// استيراد المنتجات من التخزين المحلي
export const loadProducts = async (): Promise<Product[]> => {
  try {
    const savedProducts = localStorage.getItem('products');
    
    if (savedProducts) {
      productsCache = JSON.parse(savedProducts);
    } else {
      // إضافة حاسوب محمول افتراضي إذا كانت القائمة فارغة
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
      
      productsCache = [defaultLaptop];
      localStorage.setItem('products', JSON.stringify(productsCache));
    }
    
    return productsCache;
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

// تصدير المنتجات كمصفوفة للاستخدام في التطبيق
export const products: Product[] = productsCache;

// تحديث التخزين المحلي عند تغيير المنتجات
export const saveProducts = async () => {
  try {
    localStorage.setItem('products', JSON.stringify(productsCache));
  } catch (error) {
    console.error('Error saving products:', error);
  }
};

// تحديد آخر معرف مستخدم
export const getMaxProductId = async (): Promise<number> => {
  try {
    if (productsCache.length === 0) return 0;
    const maxId = Math.max(...productsCache.map(p => p.id));
    return maxId;
  } catch (error) {
    console.error('Error getting max product ID:', error);
    return 0;
  }
};

// إضافة منتج جديد
export const addProduct = async (product: Product): Promise<boolean> => {
  try {
    // التأكد من أن المعرف فريد
    const maxId = await getMaxProductId();
    const productWithNewId = { ...product, id: maxId + 1 };
    
    // إضافة المنتج إلى الذاكرة المؤقتة
    productsCache.push(productWithNewId);
    
    // حفظ في التخزين المحلي
    localStorage.setItem('products', JSON.stringify(productsCache));
    
    return true;
  } catch (error) {
    console.error('Error adding product:', error);
    return false;
  }
};

// تحديث منتج موجود
export const updateProduct = async (id: number, updatedProduct: Product): Promise<boolean> => {
  try {
    const index = productsCache.findIndex(p => p.id === id);
    if (index !== -1) {
      productsCache[index] = updatedProduct;
      localStorage.setItem('products', JSON.stringify(productsCache));
    }
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
};

// حذف منتج
export const deleteProduct = async (id: number): Promise<boolean> => {
  try {
    productsCache = productsCache.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(productsCache));
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};
