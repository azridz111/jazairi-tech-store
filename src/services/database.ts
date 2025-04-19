
import Dexie from 'dexie';
import type { Product } from '@/data/products';
import type { Order } from '@/services/orders';

// Define the database schema
class AlgerianLaptopsDB extends Dexie {
  products: Dexie.Table<Product, number>;
  orders: Dexie.Table<Order, string>;

  constructor() {
    super('AlgerianLaptopsDB');
    
    // Define tables and their primary keys
    this.version(1).stores({
      products: 'id',
      orders: 'id'
    });
    
    // Define table types
    this.products = this.table('products');
    this.orders = this.table('orders');
  }
}

// Create database instance
const db = new AlgerianLaptopsDB();

// Initialize the database with data if needed
export const initializeDatabase = async () => {
  try {
    // Check if products exist in the database
    const productsCount = await db.products.count();
    
    if (productsCount === 0) {
      console.log('No products found in database, initializing...');
      // If no products are in the database, create a default product
      const defaultProduct: Product = {
        id: 1,
        name: "حاسوب محمول HP Pavilion",
        category: "laptops", // Explicitly set to "laptops" to match the Product type
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
      
      await db.products.add(defaultProduct);
      console.log('Default product added to database');
    }
    
    // Check if orders exist in the database
    const ordersCount = await db.orders.count();
    
    if (ordersCount === 0) {
      console.log('No orders found in database');
      // We don't need to initialize orders with default data
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Export the database
export default db;
