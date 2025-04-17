
import db from './database';

/**
 * Orders service for storing and managing orders
 */

// Define the Order interface for type safety
export interface Order {
  id: string;
  productId: number;
  productName: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes: string;
  totalPrice: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

/**
 * Creates a new order and stores it in the database
 * @param order Order data to be stored
 * @returns The ID of the created order
 */
export const createOrder = async (order: Omit<Order, 'id' | 'status'>): Promise<string> => {
  // Generate a unique ID for the order
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Add the ID to the order object with default pending status
  const orderWithId = {
    ...order,
    id: orderId,
    status: 'pending' as const
  };
  
  try {
    // Store the order in the database
    await db.orders.add(orderWithId);
    
    // Also save to localStorage as a backup
    const existingOrders = localStorage.getItem('orders');
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    orders.push(orderWithId);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Also save to userOrders for editing functionality
    const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    userOrders.push(orderWithId);
    localStorage.setItem('userOrders', JSON.stringify(userOrders));
    
    return orderId;
  } catch (error) {
    console.error('Error creating order:', error);
    return orderId; // Still return the ID even if storing failed
  }
};

/**
 * Gets all orders from the database
 * @returns Array of orders
 */
export const getOrders = async (): Promise<Order[]> => {
  try {
    const orders = await db.orders.toArray();
    return orders;
  } catch (error) {
    console.error('Error getting orders:', error);
    // Fall back to localStorage if database fails
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  }
};

/**
 * Updates an existing order
 * @param orderId ID of the order to update
 * @param updatedOrder Updated order data
 * @returns boolean indicating success
 */
export const updateOrder = async (orderId: string, updatedOrder: Partial<Order>): Promise<boolean> => {
  try {
    // Get the existing order
    const existingOrder = await db.orders.get(orderId);
    
    if (!existingOrder) return false;
    
    // Update the order in the database
    await db.orders.update(orderId, updatedOrder);
    
    // Update in localStorage as well for backup
    const orders = localStorage.getItem('orders');
    if (orders) {
      const parsedOrders = JSON.parse(orders);
      const orderIndex = parsedOrders.findIndex((order: Order) => order.id === orderId);
      
      if (orderIndex !== -1) {
        parsedOrders[orderIndex] = { ...parsedOrders[orderIndex], ...updatedOrder };
        localStorage.setItem('orders', JSON.stringify(parsedOrders));
      }
    }
    
    // Update in userOrders as well for consistency
    const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const userOrderIndex = userOrders.findIndex((order: Order) => order.id === orderId);
    
    if (userOrderIndex !== -1) {
      userOrders[userOrderIndex] = { ...userOrders[userOrderIndex], ...updatedOrder };
      localStorage.setItem('userOrders', JSON.stringify(userOrders));
    }
    
    return true;
  } catch (error) {
    console.error('Error updating order:', error);
    return false;
  }
};

/**
 * Updates the status of an order
 * @param orderId ID of the order to update
 * @param newStatus New status to set
 * @returns boolean indicating success
 */
export const updateOrderStatus = async (orderId: string, newStatus: 'pending' | 'completed' | 'cancelled'): Promise<boolean> => {
  return await updateOrder(orderId, { status: newStatus });
};

/**
 * Deletes an order by its ID
 * @param orderId ID of the order to delete
 * @returns boolean indicating success
 */
export const deleteOrder = async (orderId: string): Promise<boolean> => {
  try {
    // Delete from the database
    await db.orders.delete(orderId);
    
    // Delete from localStorage as well for backup
    const orders = localStorage.getItem('orders');
    if (orders) {
      const parsedOrders = JSON.parse(orders);
      const filteredOrders = parsedOrders.filter((order: Order) => order.id !== orderId);
      localStorage.setItem('orders', JSON.stringify(filteredOrders));
    }
    
    // Delete from userOrders as well
    const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const filteredUserOrders = userOrders.filter((order: Order) => order.id !== orderId);
    localStorage.setItem('userOrders', JSON.stringify(filteredUserOrders));
    
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    return false;
  }
};
