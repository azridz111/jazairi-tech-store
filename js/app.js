// Global state
let cart = [];
let products = [];
let user = null;
let isAdmin = false;

// Constants
const STORAGE_KEYS = {
  CART: 'tech_store_cart',
  PRODUCTS: 'products',
  USER: 'user'
};

// DOM Elements
const cartBadge = document.querySelector('.cart-count');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenuButton = document.getElementById('close-menu-button');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const searchForm = document.getElementById('search-form');
const authButtons = document.getElementById('auth-buttons');
const adminLink = document.getElementById('admin-link');
const mobileAdminLink = document.getElementById('mobile-admin-link');
const mobileLoginLink = document.getElementById('mobile-login-link');
const mobileLogoutButton = document.getElementById('mobile-logout-button');
const currentYearSpan = document.getElementById('current-year');

// Initialize the application
document.addEventListener('DOMContentLoaded', initApp);

// Initialize Lucide icons
function initIcons() {
  lucide.createIcons();
}

// Initialize the application
function initApp() {
  initIcons();
  loadCart();
  loadUser();
  setupEventListeners();
  loadProducts();
  setupAddToCartButtons();
  
  const currentPath = window.location.pathname;
  if (currentPath.includes('index.html') || currentPath === '/') {
    displayFeaturedProducts();
  } else if (currentPath.includes('products.html')) {
    setupProductsPage();
  } else if (currentPath.includes('cart.html')) {
    renderCart();
  } else if (currentPath.includes('login.html')) {
    setupLoginPage();
  } else if (currentPath.includes('admin.html')) {
    // Only allow admin access
    if (!isAdmin) {
      window.location.href = 'index.html';
      showToast('error', 'عذراً، يجب أن تكون مديراً للوصول إلى هذه الصفحة');
    } else {
      setupAdminPage();
    }
  }
}

// Setup add to cart buttons
function setupAddToCartButtons() {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      let productData;
      try {
        // محاولة استخراج بيانات المنتج من الزر
        productData = JSON.parse(this.getAttribute('data-product'));
      } catch (error) {
        // إذا فشل، نستخدم منتج افتراضي
        productData = {
          id: 1,
          name: this.closest('.product-card').querySelector('h3').textContent,
          price: parseFloat(this.closest('.product-card').querySelector('.price').textContent.replace(/[^0-9]/g, '')),
          image: this.closest('.product-card').querySelector('img').src
        };
      }
      
      addToCart({
        id: productData.id || Date.now(),
        name: productData.name,
        price: productData.price,
        image: productData.image,
        specs: productData.specs || { processor: "غير محدد", ram: "غير محدد" }
      });
    });
  });
}

// Setup event listeners
function setupEventListeners() {
  // Mobile menu toggle
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.add('active');
    });
  }
  
  // Close mobile menu
  if (closeMenuButton) {
    closeMenuButton.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  }

    // Search form
  if (searchForm) {
    searchForm.addEventListener('submit', handleSearch);
  }
  
  // Mobile logout button
  if (mobileLogoutButton) {
    mobileLogoutButton.addEventListener('click', logout);
  }

  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
}

// Handle search
function handleSearch(e) {
  e.preventDefault();
  const searchInput = document.getElementById('search-input');
  if (searchInput && searchInput.value.trim()) {
    window.location.href = `products.html?search=${encodeURIComponent(searchInput.value.trim())}`;
  }
}

// Load user from local storage
function loadUser() {
  const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
      isAdmin = user.isAdmin;
      updateAuthUI();
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
}

// Update auth UI based on login status
function updateAuthUI() {
  if (authButtons) {
    authButtons.innerHTML = '';
    
    if (user) {
      // User is logged in
      const logoutButton = document.createElement('button');
      logoutButton.className = 'icon-button';
      logoutButton.title = 'تسجيل الخروج';
      logoutButton.innerHTML = '<i data-lucide="log-out"></i>';
      logoutButton.addEventListener('click', logout);
      
      authButtons.appendChild(logoutButton);
    } else {
      // User is not logged in
      const loginLink = document.createElement('a');
      loginLink.href = 'login.html';
      loginLink.className = 'icon-button';
      loginLink.title = 'تسجيل الدخول';
      loginLink.innerHTML = '<i data-lucide="log-in"></i>';
      
      authButtons.appendChild(loginLink);
    }
    
    // Initialize icons for new elements
    initIcons();
  }
  
  // Update admin links
  if (adminLink) {
    adminLink.style.display = isAdmin ? 'block' : 'none';
  }
  
  if (mobileAdminLink) {
    mobileAdminLink.style.display = isAdmin ? 'block' : 'none';
  }
  
  if (mobileLoginLink && mobileLogoutButton) {
    if (user) {
      mobileLoginLink.style.display = 'none';
      mobileLogoutButton.style.display = 'block';
    } else {
      mobileLoginLink.style.display = 'block';
      mobileLogoutButton.style.display = 'none';
    }
  }
}

// Logout
function logout() {
  user = null;
  isAdmin = false;
  localStorage.removeItem(STORAGE_KEYS.USER);
  updateAuthUI();
  showToast('info', 'تم تسجيل الخروج');
  
  // Redirect to home if on admin page
  if (window.location.pathname.includes('admin.html')) {
    window.location.href = 'index.html';
  }
}

// Login setup
function setupLoginPage() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      login(username, password);
    });
  }
}

// Login user
function login(username, password) {
  // Mock users data
  const mockUsers = [
    { id: 1, username: 'admin', password: 'admin123', isAdmin: true },
    { id: 2, username: 'user', password: 'user123', isAdmin: false },
  ];
  
  const foundUser = mockUsers.find(
    u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );
  
  if (foundUser) {
    const { password, ...userWithoutPassword } = foundUser;
    user = userWithoutPassword;
    isAdmin = user.isAdmin;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithoutPassword));
    showToast('success', 'تم تسجيل الدخول بنجاح');
    
    // Redirect to home page
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
    
    return true;
  }
  
  showToast('error', 'اسم المستخدم أو كلمة المرور غير صحيحة');
  return false;
}

// Load cart from local storage
function loadCart() {
  const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
      updateCartBadge();
    } catch (error) {
      console.error('Error parsing cart data:', error);
    }
  }
}

// Save cart to local storage
function saveCart() {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  updateCartBadge();
}

// Update cart badge
function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-count');
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  badges.forEach(badge => {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  });
}

// Add to cart
function addToCart(product) {
  const existingItem = cart.find(item => item.product.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
    showToast('success', 'تمت إضافة منتج إلى السلة');
  } else {
    cart.push({ product, quantity: 1 });
    showToast('success', 'تمت إضافة منتج جديد إلى السلة');
  }
  
  saveCart();
}

// Update cart item quantity
function updateQuantity(productId, quantity) {
  if (quantity < 1) return;
  
  const item = cart.find(item => item.product.id === productId);
  if (item) {
    item.quantity = quantity;
    saveCart();
    renderCart();
  }
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.product.id !== productId);
  saveCart();
  renderCart();
  showToast('info', 'تمت إزالة المنتج من السلة');
}

// Clear cart
function clearCart() {
  cart = [];
  saveCart();
  renderCart();
  showToast('info', 'تم تفريغ السلة');
}

// Show toast notification
function showToast(type, message) {
  const toastContainer = document.getElementById('toast-container');
  
  if (!toastContainer) {
    // إنشاء حاوية toast إذا لم تكن موجودة
    const newToastContainer = document.createElement('div');
    newToastContainer.id = 'toast-container';
    document.body.appendChild(newToastContainer);
    toastContainer = newToastContainer;
  }
  
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
  initIcons();
  
  // Auto remove toast after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Load products from local storage or initialize with default product
function loadProducts() {
  const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  
  if (storedProducts) {
    products = JSON.parse(storedProducts);
  }
  
  // If no products, add default laptop
  if (products.length === 0) {
    products = [{
      id: 1,
      name: "حاسوب محمول HP Pavilion",
      category: "laptops",
      price: 85000,
      image: "https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1500_.jpg",
      specs: {
        processor: "Intel Core i5-10300H",
        ram: "8GB DDR4",
        storage: "512GB SSD",
        gpu: "NVIDIA GTX 1650",
        display: "15.6 بوصة FHD"
      },
      inStock: true,
      description: "حاسوب محمول قوي لجميع الاستخدامات اليومية والألعاب الخفيفة."
    }];
    
    saveProducts();
  }
}

// Save products to local storage
function saveProducts() {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

// Display featured products on home page
function displayFeaturedProducts() {
  const featuredProductsContainer = document.getElementById('featured-products');
  if (!featuredProductsContainer) return;
  
  // Filter for laptops (limited to 4)
  const laptops = products.filter(product => product.category === 'laptops').slice(0, 4);
  
  if (laptops.length === 0) {
    featuredProductsContainer.innerHTML = '<p class="loading-text">لا توجد منتجات لعرضها</p>';
    return;
  }
  
  featuredProductsContainer.innerHTML = '';
  
  laptops.forEach(product => {
    const productCard = createProductCard(product);
    featuredProductsContainer.appendChild(productCard);
  });
  
  // Initialize icons for new elements
  initIcons();
}

// Create a product card element
function createProductCard(product) {
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;
  
  const card = document.createElement('div');
  card.className = 'product-card';
  
  let productHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}">
      ${hasDiscount ? `
        <div class="discount-badge">
          <i data-lucide="ticket-percent"></i>
          <span>${discountPercent}% خصم</span>
        </div>
      ` : ''}
      ${!product.inStock ? `
        <div class="out-of-stock">
          <span>غير متوفر</span>
        </div>
      ` : ''}
    </div>
    <div class="product-details">
      <h3 class="product-name">${product.name}</h3>
      <div class="product-price">
        <span class="current-price">${product.price.toLocaleString()} د.ج</span>
        ${hasDiscount ? `<span class="old-price">${product.oldPrice.toLocaleString()} د.ج</span>` : ''}
      </div>
      <div class="product-specs">
        <div>${product.specs.processor}</div>
        <div>${product.specs.ram}</div>
      </div>
      <button class="add-to-cart" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" ${!product.inStock ? 'disabled' : ''}>
        <i data-lucide="shopping-cart"></i>
        إضافة للسلة
      </button>
    </div>
  `;
  
  card.innerHTML = productHTML;
  return card;
}

// Setup products page
function setupProductsPage() {
  const productsContainer = document.getElementById('products-container');
  const sortSelect = document.getElementById('sort-select');
  const inStockCheckbox = document.getElementById('in-stock-checkbox');
  const productCountElement = document.getElementById('product-count');
  
  if (!productsContainer) return;
  
  // Filter for laptops
  let filteredProducts = products.filter(product => product.category === 'laptops');
  
  // Get search parameter from URL
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  
  // Filter by search term if present
  if (searchQuery) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = searchQuery;
    }
    
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Handle sort change
  if (sortSelect) {
    sortSelect.addEventListener('change', updateProductsDisplay);
  }
  
  // Handle in-stock checkbox
  if (inStockCheckbox) {
    inStockCheckbox.addEventListener('change', updateProductsDisplay);
  }
  
  // Update products display
  function updateProductsDisplay() {
    let sortedProducts = [...filteredProducts];
    
    // Apply in-stock filter if checked
    if (inStockCheckbox && inStockCheckbox.checked) {
      sortedProducts = sortedProducts.filter(product => product.inStock);
    }
    
    // Apply sorting
    if (sortSelect) {
      const sortValue = sortSelect.value;
      
      if (sortValue === 'price-asc') {
        sortedProducts.sort((a, b) => a.price - b.price);
      } else if (sortValue === 'price-desc') {
        sortedProducts.sort((a, b) => b.price - a.price);
      } else if (sortValue === 'name-asc') {
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortValue === 'name-desc') {
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      }
    }
    
    // Update count
    if (productCountElement) {
      productCountElement.textContent = sortedProducts.length;
    }
    
    // Render products
    productsContainer.innerHTML = '';
    
    if (sortedProducts.length === 0) {
      productsContainer.innerHTML = '<div class="no-products">لم يتم العثور على حواسيب محمولة</div>';
      return;
    }
    
    sortedProducts.forEach(product => {
      const productCard = createProductCard(product);
      productsContainer.appendChild(productCard);
    });
    
    // Initialize icons for new elements
    initIcons();
  }
  
  // Initial display
  updateProductsDisplay();
}

// Render cart items
function renderCart() {
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSummaryContainer = document.getElementById('cart-summary');
  const cartContainer = document.getElementById('cart-container');
  const emptyCartContainer = document.getElementById('empty-cart');
  
  if (!cartContainer) return;
  
  if (cart.length === 0) {
    if (emptyCartContainer) {
      emptyCartContainer.style.display = 'block';
    }
    if (cartContainer) {
      cartContainer.style.display = 'none';
    }
    return;
  }
  
  if (emptyCartContainer) {
    emptyCartContainer.style.display = 'none';
  }
  if (cartContainer) {
    cartContainer.style.display = 'grid';
  }
  
  // Render cart items
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      
      cartItem.innerHTML = `
        <div class="cart-item-image">
          <img src="${item.product.image}" alt="${item.product.name}">
        </div>
        <div class="cart-item-details">
          <h3 class="cart-item-name">${item.product.name}</h3>
          <p class="cart-item-specs">
            ${item.product.specs.processor}, ${item.product.specs.ram}
          </p>
          <p class="cart-item-price">${item.product.price.toLocaleString()} د.ج</p>
        </div>
        <div class="cart-item-actions">
          <div class="quantity-control">
            <button class="quantity-btn" onclick="updateQuantity(${item.product.id}, ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>
              <i data-lucide="minus"></i>
            </button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity(${item.product.id}, ${item.quantity + 1})">
              <i data-lucide="plus"></i>
            </button>
          </div>
          <button class="remove-item" onclick="removeFromCart(${item.product.id})">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      `;
      
      cartItemsContainer.appendChild(cartItem);
    });
    
    // Add cart actions
    const cartActions = document.createElement('div');
    cartActions.className = 'cart-actions';
    
    cartActions.innerHTML = `
      <button class="clear-cart" onclick="clearCart()">
        <i data-lucide="trash-2"></i>
        تفريغ السلة
      </button>
      <a href="products.html" class="button outline">
        <i data-lucide="arrow-right"></i>
        مواصلة التسوق
      </a>
    `;
    
    cartItemsContainer.appendChild(cartActions);
  }
  
  // Render cart summary
  if (cartSummaryContainer) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    
    cartSummaryContainer.innerHTML = `
      <h2>ملخص الطلب</h2>
      <div class="summary-line">
        <span>عدد المنتجات:</span>
        <span>${cart.length}</span>
      </div>
      <div class="summary-line">
        <span>المجموع الفرعي:</span>
        <span>${totalPrice.toLocaleString()} د.ج</span>
      </div>
      <div class="summary-line">
        <span>الشحن:</span>
        <span>يحدد عند الطلب</span>
      </div>
      <div class="summary-line summary-total">
        <span>المجموع:</span>
        <span class="summary-total-value">${totalPrice.toLocaleString()} د.ج</span>
      </div>
      <a href="checkout.html" class="checkout-button">متابعة الطلب</a>
    `;
  }
  
  // Initialize icons for new elements
  initIcons();
}

// Setup admin page
function setupAdminPage() {
  const adminProductsContainer = document.getElementById('admin-products-container');
  const addProductForm = document.getElementById('add-product-form');
  
  if (addProductForm) {
    addProductForm.addEventListener('submit', handleAddProduct);
  }
  
  if (adminProductsContainer) {
    renderAdminProducts();
  }
}

// Render admin products
function renderAdminProducts() {
  const adminProductsContainer = document.getElementById('admin-products-container');
  if (!adminProductsContainer) return;
  
  adminProductsContainer.innerHTML = '';
  
  if (products.length === 0) {
    adminProductsContainer.innerHTML = '<tr><td colspan="6" class="text-center">لا توجد منتجات لعرضها</td></tr>';
    return;
  }
  
  products.forEach(product => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>
        <img src="${product.image}" alt="${product.name}" class="admin-product-image">
      </td>
      <td>${product.name}</td>
      <td>${product.price.toLocaleString()} د.ج</td>
      <td>
        ${product.inStock 
          ? '<span class="status-badge in-stock"><i data-lucide="package-check"></i> متوفر</span>' 
          : '<span class="status-badge out-of-stock"><i data-lucide="package-x"></i> غير متوفر</span>'}
      </td>
      <td>
        <div class="action-buttons">
          <button class="edit-button" onclick="editProduct(${product.id})">
            <i data-lucide="edit"></i> تعديل
          </button>
          <button class="stock-button" onclick="toggleProductStock(${product.id}, ${!product.inStock})">
            ${product.inStock 
              ? '<i data-lucide="package-x"></i> نفذ' 
              : '<i data-lucide="package-check"></i> توفر'}
          </button>
          <button class="delete-button" onclick="deleteProduct(${product.id})">
            <i data-lucide="trash-2"></i> حذف
          </button>
        </div>
      </td>
    `;
    
    adminProductsContainer.appendChild(row);
  });
  
  // Initialize icons for new elements
  initIcons();
}

// Handle add product form submission
function handleAddProduct(e) {
  e.preventDefault();
  
  const productData = {
    id: Date.now(), // Use timestamp for unique ID
    name: document.getElementById('product-name').value,
    category: 'laptops', // Always set to laptops
    price: parseFloat(document.getElementById('product-price').value),
    image: document.getElementById('product-image').value,
    specs: {
      processor: document.getElementById('product-processor').value,
      ram: document.getElementById('product-ram').value,
      storage: document.getElementById('product-storage').value,
      gpu: document.getElementById('product-gpu').value,
      display: document.getElementById('product-display').value
    },
    inStock: document.getElementById('product-instock').checked,
    description: document.getElementById('product-description').value
  };
  
  // Add old price if provided
  const oldPrice = document.getElementById('product-oldprice').value;
  if (oldPrice) {
    productData.oldPrice = parseFloat(oldPrice);
  }
  
  // Add product to array
  products.push(productData);
  
  // Save products
  saveProducts();
  
  // Reset form
  e.target.reset();
  
  // Show success message
  showToast('success', 'تمت إضافة المنتج بنجاح');
  
  // Refresh product list
  renderAdminProducts();
}

// Edit product
function editProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  // Fill form with product data
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-oldprice').value = product.oldPrice || '';
  document.getElementById('product-image').value = product.image;
  document.getElementById('product-processor').value = product.specs.processor;
  document.getElementById('product-ram').value = product.specs.ram;
  document.getElementById('product-storage').value = product.specs.storage;
  document.getElementById('product-gpu').value = product.specs.gpu;
  document.getElementById('product-display').value = product.specs.display;
  document.getElementById('product-instock').checked = product.inStock;
  document.getElementById('product-description').value = product.description;
  
  // Change form submit handler to update product
  const form = document.getElementById('add-product-form');
  
  // Remove previous event listeners (simplified approach)
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);
  
  // Add new event listener
  newForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Update product data
    product.name = document.getElementById('product-name').value;
    product.price = parseFloat(document.getElementById('product-price').value);
    
    const oldPrice = document.getElementById('product-oldprice').value;
    product.oldPrice = oldPrice ? parseFloat(oldPrice) : undefined;
    
    product.image = document.getElementById('product-image').value;
    product.specs.processor = document.getElementById('product-processor').value;
    product.specs.ram = document.getElementById('product-ram').value;
    product.specs.storage = document.getElementById('product-storage').value;
    product.specs.gpu = document.getElementById('product-gpu').value;
    product.specs.display = document.getElementById('product-display').value;
    product.inStock = document.getElementById('product-instock').checked;
    product.description = document.getElementById('product-description').value;
    
    // Save products
    saveProducts();
    
    // Reset form
    e.target.reset();
    
    // Show success message
    showToast('success', 'تم تحديث المنتج بنجاح');
    
    // Refresh product list
    renderAdminProducts();
    
    // Reset form submit handler to add product
    e.target.removeEventListener('submit', arguments.callee);
    e.target.addEventListener('submit', handleAddProduct);
  });
  
  // Update button text
  const submitButton = document.querySelector('#add-product-form button[type="submit"]');
  if (submitButton) {
    submitButton.textContent = 'تحديث المنتج';
  }
  
  // Scroll to form
  document.querySelector('.admin-form').scrollIntoView({ behavior: 'smooth' });
}

// Delete product
function deleteProduct(productId) {
  if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
    products = products.filter(p => p.id !== productId);
    saveProducts();
    renderAdminProducts();
    showToast('info', 'تم حذف المنتج بنجاح');
  }
}

// Toggle product stock status
function toggleProductStock(productId, inStock) {
  const product = products.find(p => p.id === productId);
  if (product) {
    product.inStock = inStock;
    saveProducts();
    renderAdminProducts();
    showToast('success', `تم تغيير حالة المنتج إلى ${inStock ? 'متوفر' : 'غير متوفر'}`);
  }
}

// إضافة وظيفة عالمية لإضافة المنتجات للسلة
window.addToCartFromPage = function(productJson) {
  try {
    const product = JSON.parse(decodeURIComponent(productJson));
    addToCart(product);
  } catch (error) {
    console.error('خطأ في إضافة المنتج للسلة:', error);
    showToast('error', 'حدث خطأ أثناء إضافة المنتج للسلة');
  }
};
