
/**
 * Orders service for storing and managing orders
 */

// Define the Order interface for type safety
export interface Order {
  id?: string;
  productId: number;
  productName: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes: string;
  totalPrice: number;
  date: string;
}

/**
 * Creates a new order and stores it in localStorage
 * @param order Order data to be stored
 * @returns The ID of the created order
 */
export const createOrder = (order: Order): string => {
  // Generate a unique ID for the order
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Add the ID to the order object
  const orderWithId = {
    ...order,
    id: orderId
  };
  
  // Get existing orders from localStorage
  const existingOrders = localStorage.getItem('orders');
  const orders = existingOrders ? JSON.parse(existingOrders) : [];
  
  // Add the new order to the orders array
  orders.push(orderWithId);
  
  // Save the updated orders back to localStorage
  localStorage.setItem('orders', JSON.stringify(orders));
  
  return orderId;
};

/**
 * Gets all orders from localStorage
 * @returns Array of orders
 */
export const getOrders = (): Order[] => {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
};

/**
 * Updates an existing order
 * @param orderId ID of the order to update
 * @param updatedOrder Updated order data
 * @returns boolean indicating success
 */
export const updateOrder = (orderId: string, updatedOrder: Partial<Order>): boolean => {
  const orders = getOrders();
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) return false;
  
  orders[orderIndex] = { ...orders[orderIndex], ...updatedOrder };
  localStorage.setItem('orders', JSON.stringify(orders));
  
  return true;
};

/**
 * Deletes an order by its ID
 * @param orderId ID of the order to delete
 * @returns boolean indicating success
 */
export const deleteOrder = (orderId: string): boolean => {
  const orders = getOrders();
  const filteredOrders = orders.filter(order => order.id !== orderId);
  
  if (filteredOrders.length === orders.length) return false;
  
  localStorage.setItem('orders', JSON.stringify(filteredOrders));
  return true;
};
