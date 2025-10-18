// Cart Management System for Azu Spirits
// Store cart in memory (no localStorage due to artifact limitations)

class ShoppingCart {
  constructor() {
    this.items = [];
    this.loadCart();
  }

// Load cart from memory or initialize empty
loadCart() {
  const saved = localStorage.getItem('azuSpiritsCart');
  this.items = saved ? JSON.parse(saved) : [];
}

// Save cart to memory
saveCart() {
  localStorage.setItem('azuSpiritsCart', JSON.stringify(this.items));
  this.updateCartDisplay();
}



  // Add item to cart
  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
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
      cartCount.style.display = count > 0 ? 'block' : 'none';
    }
  }

  // Show notification when item added
  showAddedNotification(productName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span>✓ ${productName} added to cart</span>
        <a href="/cart" class="view-cart-link">View Cart</a>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Get items for Stripe/PayPal
  getCheckoutItems() {
    return this.items.map(item => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
          images: [item.image]
        },
        unit_amount: Math.round(item.price * 100) // Convert to pence
      },
      quantity: item.quantity
    }));
  }
}

// Initialize cart globally
const cart = new ShoppingCart();

// Add to cart button handler
function addToCart(productId, productName, productPrice, productImage) {
  cart.addItem({
    id: productId,
    name: productName,
    price: productPrice,
    image: productImage
  });
}

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', () => {
  cart.updateCartDisplay();
});


