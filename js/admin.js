
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
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => editProduct(parseInt(btn.getAttribute('data-id'))));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteProduct(parseInt(btn.getAttribute('data-id'))));
    });
  }

  // Load orders
  function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('tech_store_orders') || '[]');
    
    if (!ordersList) return;
    ordersList.innerHTML = '';
    
    if (orders.length === 0) {
      ordersList.innerHTML = '<div class="no-orders">لا توجد طلبات لعرضها</div>';
      return;
    }
    
    orders.forEach(order => {
      const orderElement = document.createElement('div');
      orderElement.className = 'admin-order-item';
      
      // Create order items HTML
      let orderItemsHTML = '';
      order.items.forEach(item => {
        orderItemsHTML += `
          <div class="order-product">
            <img src="${item.product.image}" alt="${item.product.name}">
            <div>
              <p>${item.product.name}</p>
              <p>الكمية: ${item.quantity} × ${item.product.price.toLocaleString()} د.ج</p>
            </div>
          </div>
        `;
      });
      
      // Format date
      const orderDate = new Date(order.date);
      const formattedDate = `${orderDate.getDate()}/${orderDate.getMonth() + 1}/${orderDate.getFullYear()}`;
      
      orderElement.innerHTML = `
        <div class="order-header">
          <h3>طلب رقم: ${order.id}</h3>
          <span class="order-date">${formattedDate}</span>
          <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
        </div>
        <div class="order-customer">
          <p><strong>العميل:</strong> ${order.customer.fullName}</p>
          <p><strong>الهاتف:</strong> ${order.customer.phone}</p>
          <p><strong>العنوان:</strong> ${order.customer.address}, ${order.customer.wilaya}</p>
        </div>
        <div class="order-items">
          <h4>المنتجات:</h4>
          ${orderItemsHTML}
        </div>
        <div class="order-footer">
          <p class="order-total">المجموع: ${order.total.toLocaleString()} د.ج</p>
          <div class="order-actions">
            <select class="status-select" data-id="${order.id}">
              <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>قيد الانتظار</option>
              <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>قيد المعالجة</option>
              <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>تم الشحن</option>
              <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>تم التسليم</option>
              <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>ملغي</option>
            </select>
            <button class="update-status-btn" data-id="${order.id}">تحديث الحالة</button>
          </div>
        </div>
      `;
      
      ordersList.appendChild(orderElement);
    });
    
    // Add event listeners for order status update
    document.querySelectorAll('.update-status-btn').forEach(btn => {
      btn.addEventListener('click', () => updateOrderStatus(btn.getAttribute('data-id')));
    });
  }
  
  // Get status text in Arabic
  function getStatusText(status) {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'processing': return 'قيد المعالجة';
      case 'shipped': return 'تم الشحن';
      case 'delivered': return 'تم التسليم';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  }
  
  // Update order status
  function updateOrderStatus(orderId) {
    const orders = JSON.parse(localStorage.getItem('tech_store_orders') || '[]');
    const statusSelect = document.querySelector(`.status-select[data-id="${orderId}"]`);
    
    if (!statusSelect) return;
    
    const newStatus = statusSelect.value;
    const orderIndex = orders.findIndex(order => order.id == orderId);
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = newStatus;
      localStorage.setItem('tech_store_orders', JSON.stringify(orders));
      
      showToast('success', 'تم تحديث حالة الطلب');
      loadOrders();
    }
  }

  // Show add product modal
  if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
      if (addProductModal) {
        addProductModal.style.display = 'block';
      }
    });
  }

  // Cancel add product
  if (cancelProductBtn) {
    cancelProductBtn.addEventListener('click', () => {
      if (addProductModal) {
        addProductModal.style.display = 'none';
        if (addProductForm) {
          addProductForm.reset();
        }
      }
    });
  }

  // Add/Edit product
  if (addProductForm) {
    addProductForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const productName = document.getElementById('product-name').value;
      const productPrice = parseFloat(document.getElementById('product-price').value);
      const productImage = document.getElementById('product-image').value;
      const productProcessor = document.getElementById('product-processor')?.value || '';
      const productRam = document.getElementById('product-ram')?.value || '';
      const productStorage = document.getElementById('product-storage')?.value || '';
      const productGpu = document.getElementById('product-gpu')?.value || '';
      const productDisplay = document.getElementById('product-display')?.value || '';
      const productDescription = document.getElementById('product-description')?.value || '';
      const productInStock = document.getElementById('product-instock')?.checked || true;

      const products = JSON.parse(localStorage.getItem('products') || '[]');

      const newProduct = {
        id: Date.now(),
        name: productName,
        price: productPrice,
        image: productImage,
        specs: {
          processor: productProcessor,
          ram: productRam,
          storage: productStorage,
          gpu: productGpu,
          display: productDisplay
        },
        inStock: productInStock,
        description: productDescription,
        category: 'laptops' // Default category
      };

      products.push(newProduct);
      localStorage.setItem('products', JSON.stringify(products));

      // Show success message
      showToast('success', 'تمت إضافة المنتج بنجاح');

      // Refresh product list
      loadProducts();

      // Hide modal
      if (addProductModal) {
        addProductModal.style.display = 'none';
      }
      
      // Reset form
      e.target.reset();
    });
  }

  // Edit product
  function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);

    if (product && addProductForm) {
      // Fill form fields with product data
      const nameInput = document.getElementById('product-name');
      const priceInput = document.getElementById('product-price');
      const imageInput = document.getElementById('product-image');
      const processorInput = document.getElementById('product-processor');
      const ramInput = document.getElementById('product-ram');
      const storageInput = document.getElementById('product-storage');
      const gpuInput = document.getElementById('product-gpu');
      const displayInput = document.getElementById('product-display');
      const descriptionInput = document.getElementById('product-description');
      const inStockInput = document.getElementById('product-instock');
      
      if (nameInput) nameInput.value = product.name;
      if (priceInput) priceInput.value = product.price;
      if (imageInput) imageInput.value = product.image;
      if (processorInput) processorInput.value = product.specs.processor || '';
      if (ramInput) ramInput.value = product.specs.ram || '';
      if (storageInput) storageInput.value = product.specs.storage || '';
      if (gpuInput) gpuInput.value = product.specs.gpu || '';
      if (displayInput) displayInput.value = product.specs.display || '';
      if (descriptionInput) descriptionInput.value = product.description || '';
      if (inStockInput) inStockInput.checked = product.inStock;

      // Show modal
      if (addProductModal) {
        addProductModal.style.display = 'block';
      }

      // Update form submission to handle edit
      addProductForm.onsubmit = function(e) {
        e.preventDefault();
        
        // Update product data
        product.name = nameInput ? nameInput.value : product.name;
        product.price = priceInput ? parseFloat(priceInput.value) : product.price;
        product.image = imageInput ? imageInput.value : product.image;
        if (product.specs) {
          product.specs.processor = processorInput ? processorInput.value : product.specs.processor;
          product.specs.ram = ramInput ? ramInput.value : product.specs.ram;
          product.specs.storage = storageInput ? storageInput.value : product.specs.storage;
          product.specs.gpu = gpuInput ? gpuInput.value : product.specs.gpu;
          product.specs.display = displayInput ? displayInput.value : product.specs.display;
        }
        product.description = descriptionInput ? descriptionInput.value : product.description;
        product.inStock = inStockInput ? inStockInput.checked : product.inStock;
        
        // Save updated products
        localStorage.setItem('products', JSON.stringify(products));
        
        // Show success message
        showToast('success', 'تم تحديث المنتج بنجاح');
        
        // Refresh product list
        loadProducts();
        
        // Hide modal and reset form
        if (addProductModal) {
          addProductModal.style.display = 'none';
        }
        addProductForm.reset();
        
        // Reset form submission handler
        addProductForm.onsubmit = null;
        
        // Restore default submit handler
        addProductForm.addEventListener('submit', arguments.callee);
      };
    }
  }

  // Delete product
  function deleteProduct(productId) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const updatedProducts = products.filter(p => p.id !== productId);
      
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      
      // Show success message
      showToast('success', 'تم حذف المنتج بنجاح');
      
      // Refresh product list
      loadProducts();
    }
  }

  // Function to show toast notifications
  function showToast(type, message) {
    const toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '';
    switch (type) {
      case 'success':
        icon = '<i data-lucide="check-circle"></i>';
        break;
      case 'error':
        icon = '<i data-lucide="x-circle"></i>';
        break;
      case 'info':
        icon = '<i data-lucide="info"></i>';
        break;
    }
    
    toast.innerHTML = `${icon} ${message}`;
    toastContainer.appendChild(toast);
    
    // Initialize icon
    lucide.createIcons();
    
    // Auto remove toast after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Initial loads
  loadProducts();
  loadOrders();
});
