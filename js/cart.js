// Cart Management System for Azu Spirits

class ShoppingCart {
  constructor() {
    this.items = [];
    this.loadCart();
  }

  // Load cart from localStorage
  loadCart() {
    const saved = localStorage.getItem('azuSpiritsCart');
    this.items = saved ? JSON.parse(saved) : [];
  }

  // Save cart to localStorage
  saveCart() {
    localStorage.setItem('azuSpiritsCart', JSON.stringify(this.items));
    this.updateCartDisplay();
  }

  // Add item to cart
  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += product.quantity || 1;
    } else {
      this.items.push({
        id: product.id,
        priceId: product.priceId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: product.quantity || 1
      });
    }
    
    this.saveCart();
    this.showAddedNotification(product.name);
  }

  // Remove item from cart
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
  }

  // Update item quantity
  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
  }

  // Get cart total
  getTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Get item count
  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  // Clear cart
  clearCart() {
    this.items = [];
    this.saveCart();
  }

  // Update cart display in header
  updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      const count = this.getItemCount();
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  // Show notification when item added
  showAddedNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span>✓ ${productName} added to cart</span>
        <a href="/AzuSpirits/cart.html" class="view-cart-link">View Cart</a>
      </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Get items for Stripe checkout
  getCheckoutItems() {
    return this.items.map(item => ({
      price: item.priceId,
      quantity: item.quantity
    }));
  }
}

// Initialize cart globally
const cart = new ShoppingCart();

// Product catalog - MUST MATCH PRODUCT PAGE IDs!
const products = {
  // GIN TASTING SETS (£55 each)
  'cotswolds-gins-tasting-gift': {
    name: 'Craft Gins of the Cotswolds Tasting Gift Set',
    price: 52.00,
    priceId: 'price_1SLSSSDLWuae7NssXA2c2K50',
    image: 'https://codeandcapture.github.io/AzuSpirits/images/products/cotswolds-gin-gift-alt1.jpg'
  },
  'london-gins-tasting-gift': {
    name: 'London Gin Tasting Set',
    price: 52.00,
    priceId: 'price_1SLSUCDLWuae7NssKYS4Jx7b',
    image: 'https://codeandcapture.github.io/AzuSpirits/images/products/london-gins.jpg'
  },
  'devon-gins-tasting-gift': {
    name: 'Devon Gins Tasting Set',
    price: 52.00,
    priceId: 'price_1SLSd6DLWuae7NssLsJuYrMT',
    image: '/AzuSpirits/images/products/devon-gin-tasting.jpg'
  },
  'yorkshire-gin-gift-set': {
    name: 'Yorkshire Gin Gift Set',
    price: 52.00,
    priceId: 'price_1SLSX1DLWuae7NssYC9gC2aT',
    image: '/AzuSpirits/images/products/yorkshire-gin.jpg'
  },
  
  // WHISKY TASTING SETS
  'regions-of-scotland-whisky-tasting-set': {
    name: 'Regions of Scotland Whisky Tasting Gift Set',
    price: 58.00,
    priceId: 'price_1SLSdlDLWuae7Nss8iCw26SW',
    image: '/AzuSpirits/images/products/regions-of-scotland-gift.jpg'
  },
  'six-styles-scotch-whisky-tasting-set': {  // ← FIXED: Now matches product page!
    name: 'Six Styles of Scotch Tasting Gift Set',
    price: 63.00,
    priceId: 'price_1SLSeHDLWuae7Nss2SEy0Fmy',
    image: '/AzuSpirits/images/products/six-styles-scotch-main.jpg'
  },
  'founders-selection-whisky-gift-set': {
    name: 'Founders Selection Whisky Gift Set',
    price: 55.00,
    priceId: 'price_1SLSZ8DLWuae7NssGHl64wqJ',
    image: '/AzuSpirits/images/products/founders-selection.jpg'
  },
  'luxury-single-malt-whisky': {
    name: 'Luxury Single Malt Whisky Tasting Gift Set',
    price: 110.00,
    priceId: 'price_1SLSbYDLWuae7NssO2HhSFVk',
    image: '/AzuSpirits/images/products/luxury-single-malt.jpg'
  },
  
  // CHRISTMAS CRACKERS
  'scotch-whisky-christmas-crackers': {
    name: 'Scotch Whisky Christmas Crackers',
    price: 58.00,
    priceId: 'price_1SLSiIDLWuae7NssttgxBG5i',
    image: '/AzuSpirits/images/products/christmas-crackers-whisky-main.jpg'
  }
};

// Add to cart function
function addToCart(productId, productName, productPrice, productImage, priceId) {
  console.log('🛒 addToCart called with:', productId);  // Debug log
  
  // Look up priceId if not provided
  if (!priceId && products[productId]) {
    priceId = products[productId].priceId;
    console.log('✓ Found priceId:', priceId);  // Debug log
  }
  
  if (!priceId) {
    console.error('❌ No priceId found for:', productId);
    console.log('Available products:', Object.keys(products));
    alert('Error: Product not found in cart system. Please contact support.');
    return;
  }
  
  cart.addItem({
    id: productId,
    priceId: priceId,
    name: productName,
    price: productPrice,
    image: productImage,
    quantity: 1
  });
}

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('🛒 Cart system loaded');
  console.log('📦 Available products:', Object.keys(products).length);
  cart.updateCartDisplay();
});

// Add notification styles
if (!document.querySelector('#cart-notification-styles')) {
  const style = document.createElement('style');
  style.id = 'cart-notification-styles';
  style.textContent = `
    .cart-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #165B33;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      opacity: 0;
      transform: translateY(-20px);
      transition: all 0.3s ease;
    }
    
    .cart-notification.show {
      opacity: 1;
      transform: translateY(0);
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .view-cart-link {
      color: #D4AF37;
      text-decoration: none;
      font-weight: bold;
      border-left: 1px solid rgba(255,255,255,0.3);
      padding-left: 1rem;
    }
    
    .view-cart-link:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 768px) {
      .cart-notification {
        top: 10px;
        right: 10px;
        left: 10px;
        padding: 0.75rem 1rem;
      }
      
      .notification-content {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
      }
      
      .view-cart-link {
        border-left: none;
        padding-left: 0;
      }
    }
  `;
  document.head.appendChild(style);
}


