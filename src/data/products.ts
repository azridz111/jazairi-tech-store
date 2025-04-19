
import db from '@/services/database';

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

// Load all products from the database
export const loadProducts = async (): Promise<Product[]> => {
  try {
    return await db.products.toArray();
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

// Get products export - this will be populated after loadProducts is called
export let products: Product[] = [];

// Update local products array
export const refreshProductsCache = async () => {
  products = await loadProducts();
  return products;
};

// Get the maximum product ID
export const getMaxProductId = async (): Promise<number> => {
  try {
    const allProducts = await db.products.toArray();
    if (allProducts.length === 0) return 0;
    const maxId = Math.max(...allProducts.map(p => p.id));
    return maxId;
  } catch (error) {
    console.error('Error getting max product ID:', error);
    return 0;
  }
};

// Add a new product
export const addProduct = async (product: Product): Promise<boolean> => {
  try {
    // Make sure ID is unique
    const maxId = await getMaxProductId();
    const productWithNewId = { ...product, id: maxId + 1 };
    
    // Add to database
    await db.products.add(productWithNewId);
    
    // Refresh local cache
    await refreshProductsCache();
    
    return true;
  } catch (error) {
    console.error('Error adding product:', error);
    return false;
  }
};

// Update an existing product
export const updateProduct = async (id: number, updatedProduct: Product): Promise<boolean> => {
  try {
    // Fixed: Use the correct update method with a proper changes object
    // First parameter is the key (id), second parameter is the changes to apply
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
    
    await refreshProductsCache();
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
};

// Delete a product
export const deleteProduct = async (id: number): Promise<boolean> => {
  try {
    await db.products.delete(id);
    await refreshProductsCache();
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};
