
document.addEventListener('DOMContentLoaded', () => {
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutItemsContainer = document.getElementById('checkout-items');
  const orderTotalElement = document.getElementById('order-total-value');

  // Load cart items
  function loadCheckoutItems() {
    const cart = JSON.parse(localStorage.getItem('tech_store_cart') || '[]');
    
    if (cart.length === 0) {
      checkoutItemsContainer.innerHTML = '<p>سلة التسوق فارغة</p>';
      orderTotalElement.textContent = '0 د.ج';
      return;
    }

    // Clear previous items
    checkoutItemsContainer.innerHTML = '';

    // Calculate total
    let total = 0;

    cart.forEach(item => {
      const itemTotal = item.product.price * item.quantity;
      total += itemTotal;

      const itemElement = document.createElement('div');
      itemElement.className = 'checkout-item';
      itemElement.innerHTML = `
        <img src="${item.product.image}" alt="${item.product.name}">
        <div class="item-details">
          <span>${item.product.name}</span>
          <span>${item.quantity} × ${item.product.price.toLocaleString()} د.ج</span>
        </div>
        <div class="item-price">${itemTotal.toLocaleString()} د.ج</div>
      `;

      checkoutItemsContainer.appendChild(itemElement);
    });

    orderTotalElement.textContent = `${total.toLocaleString()} د.ج`;
  }

  // Handle form submission
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const cart = JSON.parse(localStorage.getItem('tech_store_cart') || '[]');
      
      if (cart.length === 0) {
        showToast('error', 'سلة التسوق فارغة');
        return;
      }

      // Collect form data
      const fullName = document.getElementById('full-name').value;
      const phone = document.getElementById('phone').value;
      const address = document.getElementById('address').value;
      const wilaya = document.getElementById('wilaya').value;

      // Basic validation
      if (!fullName || !phone || !address || !wilaya) {
        showToast('error', 'يرجى ملء جميع الحقول');
        return;
      }

      // Prepare order object
      const order = {
        id: Date.now(),
        items: cart,
        customer: { fullName, phone, address, wilaya },
        total: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        date: new Date().toISOString(),
        status: 'pending'
      };

      // Save order to localStorage
      const orders = JSON.parse(localStorage.getItem('tech_store_orders') || '[]');
      orders.push(order);
      localStorage.setItem('tech_store_orders', JSON.stringify(orders));

      // Clear cart
      localStorage.removeItem('tech_store_cart');

      // Show success message
      showToast('success', 'تم تأكيد طلبك بنجاح');

      // Redirect to order success page
      setTimeout(() => {
        window.location.href = 'order-success.html';
      }, 1000);
    });
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

  // Initial load of checkout items
  loadCheckoutItems();
});
