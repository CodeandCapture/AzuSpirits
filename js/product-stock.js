document.addEventListener('DOMContentLoaded', () => {
  const productId = document.body.dataset.productId;
  const product = products[productId];

  if (!product) return;

  if (product.stock === 'sold-out') {
    const quantitySelector = document.querySelector('.quantity-selector');
    const button = document.querySelector('.add-to-cart-btn');

    if (quantitySelector) {
      quantitySelector.style.display = 'none';
    }

    if (button) {
      button.textContent = 'Sold Out';
      button.disabled = true;
      button.removeAttribute('onclick');
      button.classList.add('sold-out');
    }
  }
});
