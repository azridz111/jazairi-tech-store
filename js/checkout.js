
document.addEventListener('DOMContentLoaded', () => {
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutItemsContainer = document.getElementById('checkout-items');
  const orderTotalElement = document.getElementById('order-total-value');
  const wilayaSelect = document.getElementById('wilaya');

  // تحميل ولايات الجزائر
  function loadWilayas() {
    if (!wilayaSelect) return;
    
    const wilayas = [
      "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة", "بشار", "البليدة", "البويرة",
      "تمنراست", "تبسة", "تلمسان", "تيارت", "تيزي وزو", "الجزائر", "الجلفة", "جيجل", "سطيف", "سعيدة",
      "سكيكدة", "سيدي بلعباس", "عنابة", "قالمة", "قسنطينة", "المدية", "مستغانم", "المسيلة", "معسكر", "ورقلة",
      "وهران", "البيض", "إليزي", "برج بوعريريج", "بومرداس", "الطارف", "تندوف", "تيسمسيلت", "الوادي", "خنشلة",
      "سوق أهراس", "تيبازة", "ميلة", "عين الدفلى", "النعامة", "عين تموشنت", "غرداية", "غليزان"
    ];
    
    wilayas.forEach((wilaya, index) => {
      const option = document.createElement('option');
      option.value = wilaya;
      option.textContent = `${index + 1} - ${wilaya}`;
      wilayaSelect.appendChild(option);
    });
  }

  // تحميل عناصر سلة التسوق
  function loadCheckoutItems() {
    const cart = JSON.parse(localStorage.getItem('tech_store_cart') || '[]');
    
    if (cart.length === 0) {
      checkoutItemsContainer.innerHTML = '<p>سلة التسوق فارغة</p>';
      orderTotalElement.textContent = '0 د.ج';
      return;
    }

    // مسح العناصر السابقة
    checkoutItemsContainer.innerHTML = '';

    // حساب المجموع
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

  // معالجة إرسال النموذج
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const cart = JSON.parse(localStorage.getItem('tech_store_cart') || '[]');
      
      if (cart.length === 0) {
        showToast('error', 'سلة التسوق فارغة');
        return;
      }

      // جمع بيانات النموذج
      const fullName = document.getElementById('full-name').value;
      const phone = document.getElementById('phone').value;
      const address = document.getElementById('address').value;
      const wilaya = document.getElementById('wilaya').value;

      // التحقق الأساسي
      if (!fullName || !phone || !address || !wilaya) {
        showToast('error', 'يرجى ملء جميع الحقول');
        return;
      }

      // تحضير كائن الطلب
      const order = {
        id: Date.now(),
        items: cart,
        customer: { fullName, phone, address, wilaya },
        total: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        date: new Date().toISOString(),
        status: 'pending'
      };

      // حفظ الطلب في localStorage
      const orders = JSON.parse(localStorage.getItem('tech_store_orders') || '[]');
      orders.push(order);
      localStorage.setItem('tech_store_orders', JSON.stringify(orders));

      // مسح السلة
      localStorage.removeItem('tech_store_cart');

      // عرض رسالة نجاح
      showToast('success', 'تم تأكيد طلبك بنجاح');

      // إعادة التوجيه إلى صفحة نجاح الطلب
      setTimeout(() => {
        window.location.href = 'order-success.html';
      }, 1500);
    });
  }

  // وظيفة لعرض إشعارات toast
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
    
    // تهيئة الأيقونة
    lucide.createIcons();
    
    // إزالة toast تلقائياً بعد 3 ثوان
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // التحميل الأولي لعناصر الدفع
  loadCheckoutItems();
  // تحميل الولايات
  loadWilayas();
});
