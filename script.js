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
    launchConfetti(orderBtn);
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

/* Confetti: pink hearts and flowers, drawn on a full-page canvas */
const CONFETTI_COLORS = ['#F5B7BD', '#D88291', '#9e244e', '#7A002B', '#f6e6ec'];

function drawHeart(ctx, size) {
  const s = size / 2;
  ctx.beginPath();
  ctx.moveTo(0, s * 0.4);
  ctx.bezierCurveTo(-s * 1.4, -s * 0.5, -s * 0.5, -s * 1.3, 0, -s * 0.4);
  ctx.bezierCurveTo(s * 0.5, -s * 1.3, s * 1.4, -s * 0.5, 0, s * 0.4);
  ctx.fill();
}

function drawFlower(ctx, size, centerColor) {
  const petal = size / 3;
  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.rotate((i * 2 * Math.PI) / 5);
    ctx.beginPath();
    ctx.ellipse(0, -petal, petal * 0.75, petal, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = centerColor;
  ctx.beginPath();
  ctx.arc(0, 0, petal * 0.6, 0, Math.PI * 2);
  ctx.fill();
}

function launchConfetti(origin) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const rect = origin.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  const pieces = Array.from({ length: 90 }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2;
    const speed = 6 + Math.random() * 9;
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 12 + Math.random() * 14,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.3,
      shape: Math.random() < 0.5 ? 'heart' : 'flower',
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    };
  });

  const duration = 2200;
  const start = performance.now();

  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = Math.max(0, Math.min(1, (duration - elapsed) / 600));

    pieces.forEach((p) => {
      p.vy += 0.3;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      if (p.shape === 'heart') {
        drawHeart(ctx, p.size);
      } else {
        drawFlower(ctx, p.size, p.color === '#f6e6ec' ? '#D88291' : '#f6e6ec');
      }
      ctx.restore();
    });

    if (elapsed < duration) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(frame);
}

/* Contact page: confetti, then send the message */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    launchConfetti(form.querySelector('button[type="submit"]'));
    setTimeout(() => form.submit(), 1200);
  });
});
