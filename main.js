/* ============================================================
   SITE — shared nav/branding logic for every page, plus the
   catalog renderer (search box, category + brand chips, and
   the fitment/make-model-year search) which only runs on pages
   that actually have a #catalog element (the Shop page).

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
  if (!row) return;
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
    : `<span class="card-media-icon">${categoryIcon(p.category)}</span>`;
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
          <div class="card-price-note">Enquire for price</div>
          <button class="add-btn" data-id="${p.id}" ${p.stock <= 0 ? "disabled" : ""}>
            ${p.stock <= 0 ? "Unavailable" : "Enquire"}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderCatalog() {
  const container = document.getElementById("catalog");
  if (!container) return;
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
      setTimeout(() => { btn.textContent = "Enquire"; btn.classList.remove("added"); }, 1200);
    });
  });
}

function renderHomeCategories() {
  const row = document.getElementById("home-category-grid");
  if (!row) return;
  row.innerHTML = CATEGORIES.map(cat => `
    <a class="category-tile" href="shop.html?category=${encodeURIComponent(cat)}">
      <span class="category-tile-icon">${categoryIcon(cat)}</span>
      <span class="category-tile-name">${cat}</span>
    </a>
  `).join("");
}

function renderBrandSlider() {
  const track = document.getElementById("brand-track");
  if (!track) return;
  const brands = BRANDS.filter(b => b.toLowerCase() !== "universal");
  if (brands.length === 0) return;
  const card = (b) => `
    <div class="brand-card">
      <span class="brand-card-icon">${CAR_ICON}</span>
      <span class="brand-card-name">${b}</span>
    </div>
  `;
  // Duplicate the list so the CSS animation (translateX -50%) loops seamlessly
  track.innerHTML = brands.map(card).join("") + brands.map(card).join("");
}

function renderAboutBrands() {
  const row = document.getElementById("about-brand-list");
  if (!row) return;
  row.innerHTML = BRANDS.map(b => `<span class="brand-pill">${b}</span>`).join("");
}

function initBranding() {
  document.querySelectorAll(".js-shop-name").forEach(el => el.textContent = SHOP_CONFIG.shopName);
  document.querySelectorAll(".js-tagline")  .forEach(el => el.textContent = SHOP_CONFIG.tagline);
  document.querySelectorAll(".js-phone")    .forEach(el => el.textContent = SHOP_CONFIG.contactPhone);
  document.querySelectorAll(".js-address")  .forEach(el => el.textContent = SHOP_CONFIG.contactAddress);
  document.querySelectorAll(".js-email")    .forEach(el => el.textContent = SHOP_CONFIG.orderEmail);
}

/* ------------------------------------------------------------
   HERO SLIDERS (Home + Shop)
   Each slide first tries a local file in the /images folder.
   If that file doesn't exist yet, it falls back automatically
   to a Lorem Picsum placeholder (a placeholder-photo service
   meant for exactly this — testing a layout before real assets
   exist).

   TO USE YOUR OWN PHOTOS: just add files with these exact
   names to an "images" folder at the root of your repo:
     images/hero-1.jpg ... images/hero-4.jpg        (Home page)
     images/shop-hero-1.jpg ... images/shop-hero-4.jpg (Shop page)
   Recommended size: roughly 1600×800px (landscape), .jpg or .png.
   No code changes needed — the real file is used automatically
   as soon as it's uploaded with the matching name.
   ------------------------------------------------------------ */
const HOME_HERO_IMAGES = [
  { real: "images/hero-1.jpg", fallback: "https://picsum.photos/seed/kilo-hero-1/1600/800" },
  { real: "images/hero-2.jpg", fallback: "https://picsum.photos/seed/kilo-hero-2/1600/800" },
  { real: "images/hero-3.jpg", fallback: "https://picsum.photos/seed/kilo-hero-3/1600/800" },
  { real: "images/hero-4.jpg", fallback: "https://picsum.photos/seed/kilo-hero-4/1600/800" }
];

const SHOP_HERO_IMAGES = [
  { real: "images/shop-hero-1.jpg", fallback: "https://picsum.photos/seed/kilo-shop-hero-1/1600/800" },
  { real: "images/shop-hero-2.jpg", fallback: "https://picsum.photos/seed/kilo-shop-hero-2/1600/800" },
  { real: "images/shop-hero-3.jpg", fallback: "https://picsum.photos/seed/kilo-shop-hero-3/1600/800" },
  { real: "images/shop-hero-4.jpg", fallback: "https://picsum.photos/seed/kilo-shop-hero-4/1600/800" }
];

function initImageSlider(trackId, images) {
  const track = document.getElementById(trackId);
  if (!track) return;
  track.innerHTML = images.map((slide, i) => `
    <img class="hero-slider-img${i === 0 ? " active" : ""}"
         src="${slide.real}"
         onerror="this.onerror=null;this.src='${slide.fallback}';"
         alt="" loading="${i === 0 ? "eager" : "lazy"}">
  `).join("");

  const imgs = track.querySelectorAll(".hero-slider-img");
  let current = 0;
  if (imgs.length < 2) return;
  setInterval(() => {
    imgs[current].classList.remove("active");
    current = (current + 1) % imgs.length;
    imgs[current].classList.add("active");
  }, 2000);
}

function initNav() {
  const toggle = document.getElementById("nav-toggle");
  const mobile = document.getElementById("mobile-nav");
  if (toggle && mobile) {
    toggle.addEventListener("click", () => {
      const isOpen = mobile.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    // Close the mobile menu once a link is tapped, so it doesn't stay
    // open after navigating.
    mobile.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobile.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
}

/* Show a loading state while Supabase loads */
function showCatalogLoading() {
  const el = document.getElementById("catalog");
  if (el) el.innerHTML = `<div class="empty-state" style="opacity:0.5;">Loading catalog…</div>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  initBranding();
  initNav();
  initImageSlider("hero-slider-track", HOME_HERO_IMAGES);
  initImageSlider("shop-hero-slider-track", SHOP_HERO_IMAGES);
  showCatalogLoading();

  // Load products from Supabase (falls back to shipped defaults on error)
  await initStore();

  renderChips();
  renderBrandChips();
  renderHomeCategories();
  renderBrandSlider();
  renderAboutBrands();
  renderCatalog();
  renderCartCount();

  // Pre-select a category if the shop page was opened from a category link
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get("category");
  if (catParam && CATEGORIES.includes(catParam)) {
    activeCategory = catParam;
    renderChips();
    renderCatalog();
  }

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderCatalog();
    });
  }

  const fitmentForm = document.getElementById("fitment-form");
  if (fitmentForm) {
    fitmentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const make  = document.getElementById("fitment-make") .value.trim();
      const model = document.getElementById("fitment-model").value.trim();
      const year  = document.getElementById("fitment-year") .value.trim();
      const query = [make, model, year].filter(Boolean).join(" ");

      // If we're not already on the shop page, go there with the query
      if (!document.getElementById("catalog")) {
        window.location.href = `shop.html?fitment=${encodeURIComponent(query)}`;
        return;
      }
      fitmentQuery   = query;
      activeCategory = "All";
      activeBrand    = "All";
      renderChips();
      renderBrandChips();
      renderCatalog();
      document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
    });
  }

  // Fitment query arriving via URL (from the home page hero search)
  const fitmentParam = params.get("fitment");
  if (fitmentParam && document.getElementById("catalog")) {
    fitmentQuery = fitmentParam;
    renderCatalog();
  }

  const cartBtn = document.getElementById("cart-btn");
  if (cartBtn) cartBtn.addEventListener("click", openCart);
  const cartClose = document.getElementById("cart-close");
  if (cartClose) cartClose.addEventListener("click", closeCart);
  const cartOverlay = document.getElementById("cart-overlay");
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);
  const waBtn = document.getElementById("checkout-whatsapp");
  if (waBtn) waBtn.addEventListener("click", checkoutWhatsApp);
  const emailBtn = document.getElementById("checkout-email");
  if (emailBtn) emailBtn.addEventListener("click", checkoutEmail);
  const footerCartLink = document.getElementById("footer-cart-link");
  if (footerCartLink) {
    footerCartLink.addEventListener("click", (e) => {
      e.preventDefault();
      openCart();
    });
  }
});
