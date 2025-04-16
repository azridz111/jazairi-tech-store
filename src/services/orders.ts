
import { toast } from 'sonner';

export interface Order {
  id: number;
  productId: number;
  productName: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  notes?: string;
  totalPrice: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

interface CreateOrderData {
  productId: number;
  productName: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  notes?: string;
  totalPrice: number;
  date: string;
}

// Get orders from localStorage
export const getOrders = (): Order[] => {
  const storedOrders = localStorage.getItem('orders');
  return storedOrders ? JSON.parse(storedOrders) : [];
};

// Save orders to localStorage
export const saveOrders = (orders: Order[]) => {
  localStorage.setItem('orders', JSON.stringify(orders));
};

// Create a new order
export const createOrder = (orderData: CreateOrderData): Order => {
  const orders = getOrders();
  
  // Generate a new ID
  const newId = orders.length > 0 
    ? Math.max(...orders.map(order => order.id)) + 1 
    : 1001;
  
  const newOrder: Order = {
    id: newId,
    ...orderData,
    status: 'pending'
  };
  
  // Add the new order to the list
  orders.push(newOrder);
  
  // Save to localStorage
  saveOrders(orders);
  
  return newOrder;
};

// Get order by ID
export const getOrderById = (id: number): Order | undefined => {
  const orders = getOrders();
  return orders.find(order => order.id === id);
};

// Update order status
export const updateOrderStatus = (id: number, status: 'pending' | 'completed' | 'cancelled'): boolean => {
  const orders = getOrders();
  const index = orders.findIndex(order => order.id === id);
  
  if (index !== -1) {
    orders[index].status = status;
    saveOrders(orders);
    return true;
  }
  
  return false;
};

// Delete order
export const deleteOrder = (id: number): boolean => {
  const orders = getOrders();
  const filteredOrders = orders.filter(order => order.id !== id);
  
  if (filteredOrders.length < orders.length) {
    saveOrders(filteredOrders);
    return true;
  }
  
  return false;
};
