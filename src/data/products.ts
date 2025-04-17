
import db from '../services/database';

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

// مخزن مؤقت للمنتجات
let productsCache: Product[] = [];

// استيراد المنتجات من قاعدة البيانات
export const loadProducts = async (): Promise<Product[]> => {
  try {
    const dbProducts = await db.products.toArray();
    
    // إضافة حاسوب محمول افتراضي إذا كانت القائمة فارغة
    if (dbProducts.length === 0) {
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
      
      await db.products.add(defaultLaptop);
      productsCache = [defaultLaptop];
    } else {
      productsCache = dbProducts;
    }
    
    return productsCache;
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

// تصدير المنتجات كمصفوفة للاستخدام في التطبيق (ستبقى فارغة حتى يتم تحميلها)
export const products: Product[] = productsCache;

// تحديث قاعدة البيانات عند تغيير المنتجات
export const saveProducts = async () => {
  try {
    // حذف جميع المنتجات الحالية
    await db.products.clear();
    // إضافة المنتجات المحدثة
    await db.products.bulkAdd(productsCache);
    
    // نحتفظ أيضًا بنسخة محلية لدعم الاتصال غير المتصل
    localStorage.setItem('products', JSON.stringify(productsCache));
  } catch (error) {
    console.error('Error saving products:', error);
  }
};

// إضافة منتج جديد
export const addProduct = async (product: Product): Promise<boolean> => {
  try {
    await db.products.add(product);
    productsCache.push(product);
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
    await db.products.update(id, updatedProduct);
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
    await db.products.delete(id);
    productsCache = productsCache.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(productsCache));
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};
