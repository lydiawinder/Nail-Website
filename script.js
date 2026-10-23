document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');

  if (!track || !nextBtn || !prevBtn) return;

  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  let currentIndex = 1;
  let isTransitioning = false;

  track.style.transition = 'none';
  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  function updateCarousel() {
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  track.addEventListener('transitionend', () => {
    isTransitioning = false;

  
    if (currentIndex === 0) {
      track.style.transition = 'none';
      currentIndex = slides.length - 2; 
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    
    if (currentIndex === slides.length - 1) {
      track.style.transition = 'none';
      currentIndex = 1; 
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  });

  prevBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    updateCarousel();
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);

  for (const field of ['name', 'email', 'message']) {
    const output = document.getElementById(`submitted-${field}`);
    if (output) {
      output.textContent = urlParams.get(field) || '';
    }
  }
});

/* Shop page: cart and order form */
document.addEventListener('DOMContentLoaded', () => {
  const colorSelect = document.getElementById('color');
  const qtyInput = document.getElementById('quantity');
  if (!colorSelect || !qtyInput) return;

  const itemTotal = document.getElementById('itemTotal');
  const addBtn = document.getElementById('addToCart');
  const orderBtn = document.getElementById('placeOrder');
  const cartBody = document.getElementById('cartBody');
  const cartTable = document.getElementById('cartTable');
  const emptyMsg = document.getElementById('emptyCart');
  const cartTotal = document.getElementById('cartTotal');
  const orderMessage = document.getElementById('orderMessage');

  let cart = [];

  const money = (n) => `$${n.toFixed(2)}`;

  function currentQty() {
    const q = parseInt(qtyInput.value, 10);
    if (Number.isNaN(q)) return 0;
    return Math.min(Math.max(q, 0), 20);
  }

  function currentPrice() {
    return parseFloat(colorSelect.selectedOptions[0].dataset.price);
  }

  function updateItemTotal() {
    itemTotal.textContent = money(currentPrice() * currentQty());
  }

  function renderCart() {
    cartBody.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      const subtotal = item.price * item.qty;
      total += subtotal;

      const row = document.createElement('tr');
      [item.color, money(item.price), String(item.qty), money(subtotal)].forEach((text) => {
        const td = document.createElement('td');
        td.textContent = text;
        row.appendChild(td);
      });

      const actionCell = document.createElement('td');
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = 'Remove';
      removeBtn.setAttribute('aria-label', `Remove ${item.color}`);
      removeBtn.addEventListener('click', () => {
        cart.splice(index, 1);
        renderCart();
      });
      actionCell.appendChild(removeBtn);
      row.appendChild(actionCell);
      cartBody.appendChild(row);
    });

    cartTable.hidden = cart.length === 0;
    emptyMsg.hidden = cart.length > 0;
    cartTotal.textContent = money(total);
    orderBtn.disabled = cart.length === 0;
  }

  colorSelect.addEventListener('change', updateItemTotal);
  qtyInput.addEventListener('input', updateItemTotal);

  addBtn.addEventListener('click', () => {
    const qty = currentQty();
    if (qty < 1) {
      qtyInput.focus();
      return;
    }
    const color = colorSelect.value;
    const price = currentPrice();
    const existing = cart.find((item) => item.color === color);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, 20);
    } else {
      cart.push({ color, price, qty });
    }
    orderMessage.hidden = true;
    qtyInput.value = 1;
    updateItemTotal();
    renderCart();
  });

  orderBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    orderMessage.textContent =
      `Thank you! Your order of ${count} bottle${count === 1 ? '' : 's'} (${money(total)}) has been placed.`;
    orderMessage.hidden = false;
    cart = [];
    renderCart();
  });

  updateItemTotal();
  renderCart();
});
