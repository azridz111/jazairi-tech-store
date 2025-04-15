
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
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const cart = JSON.parse(localStorage.getItem('tech_store_cart') || '[]');
    
    if (cart.length === 0) {
      alert('سلة التسوق فارغة');
      return;
    }

    // Collect form data
    const fullName = document.getElementById('full-name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const wilaya = document.getElementById('wilaya').value;

    // Basic validation
    if (!fullName || !phone || !address || !wilaya) {
      alert('يرجى ملء جميع الحقول');
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

    // Redirect to order success page
    window.location.href = 'order-success.html';
  });

  // Initial load of checkout items
  loadCheckoutItems();
});
