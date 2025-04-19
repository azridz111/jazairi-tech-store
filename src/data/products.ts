
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

// تصدير المنتجات كمصفوفة للاستخدام في التطبيق
export const products: Product[] = productsCache;

// تحديث قاعدة البيانات عند تغيير المنتجات
export const saveProducts = async () => {
  try {
    // حذف جميع المنتجات الحالية
    await db.products.clear();
    // إضافة المنتجات المحدثة
    await db.products.bulkAdd(productsCache);
  } catch (error) {
    console.error('Error saving products:', error);
  }
};

// تحديد آخر معرف مستخدم في قاعدة البيانات
export const getMaxProductId = async (): Promise<number> => {
  try {
    const maxProduct = await db.products.orderBy('id').reverse().first();
    return maxProduct ? maxProduct.id : 0;
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
    const newId = maxId + 1;
    const productWithNewId = { ...product, id: newId };
    
    // إضافة المنتج إلى قاعدة البيانات
    await db.products.add(productWithNewId);
    
    // تحديث ذاكرة التخزين المؤقت
    productsCache = [...productsCache, productWithNewId];
    
    return true;
  } catch (error) {
    console.error('Error adding product:', error);
    return false;
  }
};

// تحديث منتج موجود
export const updateProduct = async (id: number, updatedProduct: Product): Promise<boolean> => {
  try {
    // استخدام الصيغة الصحيحة لتحديث البيانات في Dexie
    await db.products.update(id, {
      name: updatedProduct.name,
      category: updatedProduct.category,
      price: updatedProduct.price,
      oldPrice: updatedProduct.oldPrice,
      image: updatedProduct.image,
      images: updatedProduct.images,
      specs: updatedProduct.specs,
      inStock: updatedProduct.inStock,
      description: updatedProduct.description
    });
    
    // تحديث ذاكرة التخزين المؤقت
    productsCache = productsCache.map(p => p.id === id ? updatedProduct : p);
    
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
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};
