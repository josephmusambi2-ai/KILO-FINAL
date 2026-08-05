/* ============================================================
   CATALOG — renders products grouped into "aisles" (categories),
   handles the search box, category + brand chips, and the
   fitment (make/model/year) search in the hero.

   Product data comes from Supabase via initStore() in store.js.
   If Supabase is unreachable it falls back to the shipped
   catalog in products.js.
   ============================================================ */

let activeCategory = "All";
let activeBrand    = "All";
let searchQuery    = "";
let fitmentQuery   = "";

function getStockTag(stock) {
  if (stock <= 0)  return { cls: "out", label: "Out of stock" };
  if (stock <= 5)  return { cls: "low", label: `Only ${stock} left` };
  return { cls: "in",  label: "In stock" };
}

function productMatches(p) {
  const q  = searchQuery .trim().toLowerCase();
  const fq = fitmentQuery.trim().toLowerCase();

  const matchesCategory = activeCategory === "All" || p.category === activeCategory;
  const matchesBrand    = activeBrand    === "All" || p.brand    === activeBrand;
  const matchesSearch   = !q  ||
    p.name                       .toLowerCase().includes(q) ||
    p.id                         .toLowerCase().includes(q) ||
    (p.brand       || "")        .toLowerCase().includes(q) ||
    (p.description || "")        .toLowerCase().includes(q) ||
    (p.fitment     || "")        .toLowerCase().includes(q);
  const matchesFitment  = !fq ||
    (p.fitment || "")            .toLowerCase().includes(fq) ||
    (p.brand   || "")            .toLowerCase().includes(fq);

  return matchesCategory && matchesBrand && matchesSearch && matchesFitment;
}

function renderChips() {
  const categories = ["All", ...CATEGORIES];
  const row = document.getElementById("chip-row");
  row.innerHTML = categories.map(cat => `
    <button class="chip ${cat === activeCategory ? "active" : ""}" data-cat="${cat}">${cat}</button>
  `).join("");
  row.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.cat;
      renderChips();
      renderCatalog();
      document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
    });
  });
}

function renderBrandChips() {
  const brands = ["All", ...BRANDS];
  const row = document.getElementById("brand-chip-row");
  if (!row) return;
  row.innerHTML = brands.map(brand => `
    <button class="chip ${brand === activeBrand ? "active" : ""}" data-brand="${brand}">${brand}</button>
  `).join("");
  row.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      activeBrand = btn.dataset.brand;
      renderBrandChips();
      renderCatalog();
      document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
    });
  });
}

function productCard(p) {
  const stock = getStockTag(p.stock);
  const media = p.image
    ? `<img src="${p.image}" alt="${p.name}" loading="lazy">`
    : `<span class="part-icon">${p.category}</span>`;
  return `
    <div class="product-card">
      <div class="card-media">
        <span class="bin-tag">${p.id}</span>
        <span class="stock-tag ${stock.cls}">${stock.label}</span>
        ${media}
      </div>
      <div class="card-body">
        <div class="card-category">${p.brand ? `${p.brand} · ` : ""}${p.category}</div>
        <div class="card-title">${p.name}</div>
        <div class="card-fitment">Fits: ${p.fitment}</div>
        <div class="card-footer">
          <div class="card-price"><span class="cur">${SHOP_CONFIG.currencySymbol}</span>${p.price.toLocaleString()}</div>
          <button class="add-btn" data-id="${p.id}" ${p.stock <= 0 ? "disabled" : ""}>
            ${p.stock <= 0 ? "Unavailable" : "Add"}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderCatalog() {
  const container = document.getElementById("catalog");
  const filtered  = PRODUCTS.filter(productMatches);

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state">No parts match your search. Try a different keyword, brand, or clear the fitment search.</div>`;
    return;
  }

  const order = activeCategory === "All" ? CATEGORIES : [activeCategory];
  let html = "", aisleNum = 0;

  order.forEach(cat => {
    const items = filtered.filter(p => p.category === cat);
    if (items.length === 0) return;
    aisleNum++;
    html += `
      <div class="aisle">
        <div class="aisle-header">
          <span class="aisle-number">AISLE ${String(aisleNum).padStart(2, "0")}</span>
          <span class="aisle-title">${cat}</span>
          <span class="aisle-count">${items.length} part${items.length !== 1 ? "s" : ""}</span>
        </div>
        <div class="product-grid">
          ${items.map(productCard).join("")}
        </div>
      </div>
    `;
  });

  container.innerHTML = html || `<div class="empty-state">No parts match your search.</div>`;

  container.querySelectorAll(".add-btn").forEach(btn => {
    if (btn.disabled) return;
    btn.addEventListener("click", () => {
      addToCart(btn.dataset.id, 1);
      btn.textContent = "Added ✓";
      btn.classList.add("added");
      setTimeout(() => { btn.textContent = "Add"; btn.classList.remove("added"); }, 1200);
    });
  });
}

function initBranding() {
  document.title = `${SHOP_CONFIG.shopName} — ${SHOP_CONFIG.tagline}`;
  document.querySelectorAll(".js-shop-name").forEach(el => el.textContent = SHOP_CONFIG.shopName);
  document.querySelectorAll(".js-tagline")  .forEach(el => el.textContent = SHOP_CONFIG.tagline);
  document.querySelectorAll(".js-phone")    .forEach(el => el.textContent = SHOP_CONFIG.contactPhone);
  document.querySelectorAll(".js-address")  .forEach(el => el.textContent = SHOP_CONFIG.contactAddress);
  document.querySelectorAll(".js-email")    .forEach(el => el.textContent = SHOP_CONFIG.orderEmail);
}

/* Show a loading state while Supabase loads */
function showCatalogLoading() {
  document.getElementById("catalog").innerHTML =
    `<div class="empty-state" style="opacity:0.5;">Loading catalog…</div>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  initBranding();
  showCatalogLoading();

  // Load products from Supabase (falls back to shipped defaults on error)
  await initStore();

  renderChips();
  renderBrandChips();
  renderCatalog();
  renderCartCount();

  document.getElementById("search-input").addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderCatalog();
  });

  document.getElementById("fitment-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const make  = document.getElementById("fitment-make") .value.trim();
    const model = document.getElementById("fitment-model").value.trim();
    const year  = document.getElementById("fitment-year") .value.trim();
    fitmentQuery   = [make, model, year].filter(Boolean).join(" ");
    activeCategory = "All";
    activeBrand    = "All";
    renderChips();
    renderBrandChips();
    renderCatalog();
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("cart-btn")      .addEventListener("click", openCart);
  document.getElementById("cart-close")    .addEventListener("click", closeCart);
  document.getElementById("cart-overlay")  .addEventListener("click", closeCart);
  document.getElementById("checkout-whatsapp").addEventListener("click", checkoutWhatsApp);
  document.getElementById("checkout-email")   .addEventListener("click", checkoutEmail);
});
