
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

// Initialize the database with data from localStorage if needed
export const initializeDatabase = async () => {
  try {
    // Check if products exist in the database
    const productsCount = await db.products.count();
    
    if (productsCount === 0) {
      // If no products are in the database, get from localStorage and add them
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        const products: Product[] = JSON.parse(storedProducts);
        await db.products.bulkAdd(products);
        console.log('Initialized products from localStorage');
      }
    }
    
    // Check if orders exist in the database
    const ordersCount = await db.orders.count();
    
    if (ordersCount === 0) {
      // If no orders are in the database, get from localStorage and add them
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        const orders: Order[] = JSON.parse(storedOrders);
        await db.orders.bulkAdd(orders);
        console.log('Initialized orders from localStorage');
      }
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Export the database
export default db;
