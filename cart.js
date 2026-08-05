/* ============================================================
   CART — stores items in the browser's localStorage so the
   cart survives a page refresh. Checkout builds a WhatsApp
   message (and an email fallback) instead of taking payment
   online.
   ============================================================ */

const CART_KEY = "torqueco_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartCount();
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + qty;
  saveCart(cart);
  showToast("Added to cart");
}

function setQty(productId, qty) {
  const cart = getCart();
  if (qty <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = qty;
  }
  saveCart(cart);
  renderCartDrawer();
}

function removeFromCart(productId) {
  const cart = getCart();
  delete cart[productId];
  saveCart(cart);
  renderCartDrawer();
}

function cartItemCount() {
  const cart = getCart();
  return Object.values(cart).reduce((sum, q) => sum + q, 0);
}

function cartTotal() {
  const cart = getCart();
  let total = 0;
  for (const id in cart) {
    const product = PRODUCTS.find(p => p.id === id);
    if (product) total += product.price * cart[id];
  }
  return total;
}

function renderCartCount() {
  const el = document.getElementById("cart-count");
  const count = cartItemCount();
  if (!el) return;
  el.textContent = count;
  el.style.display = count > 0 ? "flex" : "none";
}

function formatPrice(n) {
  return `${SHOP_CONFIG.currencySymbol} ${n.toLocaleString()}`;
}

function renderCartDrawer() {
  const cart = getCart();
  const itemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total-value");
  const ids = Object.keys(cart);

  if (ids.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty">Your cart is empty.<br>Browse the aisles and add some parts.</div>`;
    totalEl.textContent = formatPrice(0);
    return;
  }

  itemsEl.innerHTML = ids.map(id => {
    const p = PRODUCTS.find(pr => pr.id === id);
    if (!p) return "";
    const qty = cart[id];
    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-sku">${p.id}</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="setQty('${p.id}', ${qty - 1})">−</button>
            <span class="qty-value">${qty}</span>
            <button class="qty-btn" onclick="setQty('${p.id}', ${qty + 1})">+</button>
            <button class="cart-item-remove" onclick="removeFromCart('${p.id}')">Remove</button>
          </div>
        </div>
        <div class="cart-item-price">${formatPrice(p.price * qty)}</div>
      </div>
    `;
  }).join("");

  totalEl.textContent = formatPrice(cartTotal());
}

function openCart() {
  document.getElementById("cart-overlay").classList.add("open");
  document.getElementById("cart-drawer").classList.add("open");
  renderCartDrawer();
}

function closeCart() {
  document.getElementById("cart-overlay").classList.remove("open");
  document.getElementById("cart-drawer").classList.remove("open");
}

function buildOrderText() {
  const cart = getCart();
  const ids = Object.keys(cart);
  if (ids.length === 0) return "";

  let lines = [`New order from ${SHOP_CONFIG.shopName} website:`, ""];
  ids.forEach(id => {
    const p = PRODUCTS.find(pr => pr.id === id);
    if (!p) return;
    const qty = cart[id];
    lines.push(`• ${p.name} (${p.id}) x${qty} — ${formatPrice(p.price * qty)}`);
  });
  lines.push("");
  lines.push(`Total: ${formatPrice(cartTotal())}`);
  lines.push("");
  lines.push("Name: ");
  lines.push("Phone: ");
  lines.push("Delivery or pickup: ");

  return lines.join("\n");
}

function checkoutWhatsApp() {
  const text = buildOrderText();
  if (!text) {
    showToast("Your cart is empty");
    return;
  }
  const url = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

function checkoutEmail() {
  const text = buildOrderText();
  if (!text) {
    showToast("Your cart is empty");
    return;
  }
  const subject = encodeURIComponent(`Order from ${SHOP_CONFIG.shopName} website`);
  const body = encodeURIComponent(text);
  window.location.href = `mailto:${SHOP_CONFIG.orderEmail}?subject=${subject}&body=${body}`;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.addEventListener("DOMContentLoaded", renderCartCount);
