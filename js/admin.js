
document.addEventListener('DOMContentLoaded', () => {
  const addProductBtn = document.getElementById('add-product-btn');
  const addProductModal = document.getElementById('add-product-modal');
  const addProductForm = document.getElementById('add-product-form');
  const cancelProductBtn = document.getElementById('cancel-product-btn');
  const productList = document.getElementById('product-list');
  const ordersList = document.getElementById('orders-list');

  // Check if user is admin
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.isAdmin) {
    window.location.href = 'login.html';
    return;
  }

  // Load products
  function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    productList.innerHTML = '';
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = 'admin-product-item';
      productElement.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-details">
          <h3>${product.name}</h3>
          <p>السعر: ${product.price.toLocaleString()} د.ج</p>
        </div>
        <div class="product-actions">
          <button class="edit-btn" data-id="${product.id}">تعديل</button>
          <button class="delete-btn" data-id="${product.id}">حذف</button>
        </div>
      `;
      productList.appendChild(productElement);
    });

    // Add event listeners for edit and delete
    productList.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', editProduct);
    });
    productList.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', deleteProduct);
    });
  }

  // Load orders
  function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('tech_store_orders') || '[]');
    
    ordersList.innerHTML = '';
    orders.forEach(order => {
      const orderElement = document.createElement('div');
      orderElement.className = 'admin-order-item';
      orderElement.innerHTML = `
        <div class="order-header">
          <span>رقم الطلب: ${order.id}</span>
          <span>التاريخ: ${new Date(order.date).toLocaleDateString()}</span>
        </div>
        <div class="order-details">
          <p>العميل: ${order.customer.fullName}</p>
          <p>المجموع: ${order.total.toLocaleString()} د.ج</p>
          <p>الحالة: ${order.status}</p>
        </div>
      `;
      ordersList.appendChild(orderElement);
    });
  }

  // Show add product modal
  addProductBtn.addEventListener('click', () => {
    addProductModal.style.display = 'block';
  });

  // Cancel add product
  cancelProductBtn.addEventListener('click', () => {
    addProductModal.style.display = 'none';
    addProductForm.reset();
  });

  // Add/Edit product
  addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const productName = document.getElementById('product-name').value;
    const productPrice = parseFloat(document.getElementById('product-price').value);
    const productImage = document.getElementById('product-image').value;
    const productSpecs = document.getElementById('product-specs').value;

    const products = JSON.parse(localStorage.getItem('products') || '[]');

    const newProduct = {
      id: Date.now(),
      name: productName,
      price: productPrice,
      image: productImage,
      specs: productSpecs
    };

    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));

    // Refresh product list
    loadProducts();

    // Hide modal
    addProductModal.style.display = 'none';
    addProductForm.reset();
  });

  // Edit product
  function editProduct(e) {
    const productId = e.target.getAttribute('data-id');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === parseInt(productId));

    if (product) {
      document.getElementById('product-name').value = product.name;
      document.getElementById('product-price').value = product.price;
      document.getElementById('product-image').value = product.image;
      document.getElementById('product-specs').value = product.specs;

      addProductModal.style.display = 'block';

      // Remove the product from the list
      const updatedProducts = products.filter(p => p.id !== parseInt(productId));
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      loadProducts();
    }
  }

  // Delete product
  function deleteProduct(e) {
    const productId = e.target.getAttribute('data-id');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    const updatedProducts = products.filter(p => p.id !== parseInt(productId));
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    loadProducts();
  }

  // Initial loads
  loadProducts();
  loadOrders();
});
