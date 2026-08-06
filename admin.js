/* ============================================================
   ADMIN — logic for admin.html (Manage Store).

   All changes now go directly to Supabase and are immediately
   live for every visitor — no download or GitHub push needed.
   ============================================================ */

const ADMIN_SESSION_KEY = "torqueco_admin_session";

let editingId           = null;   // product id being edited, or null when adding
let pendingImageFile    = null;   // File picked by user — uploaded on save
let pendingImagePreview = null;   // blob URL for preview only
let pendingImageRemoved = false;  // true when user clicked "Remove photo"
let adminFilterQuery    = "";

/* ─────────────────────────────────────────────────────────────
   Login
   ───────────────────────────────────────────────────────────── */

function isLoggedIn() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "yes";
}

async function showDashboard() {
  setBannerLoading();
  const result = await initStore();

  document.getElementById("login-screen").hidden = true;
  document.getElementById("admin-wrap").hidden   = false;
  document.querySelectorAll(".js-currency").forEach(el => el.textContent = SHOP_CONFIG.currencySymbol);

  if (!result.ok) {
    setBannerError(result.error);
  } else if (result.isEmpty) {
    setBannerEmpty();
  } else {
    setBannerLive();
  }

  populateSelects();
  renderPartsTable();
  renderBrandList();
  renderCategoryList();
  updatePartCount();
}

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const entered = document.getElementById("login-password").value;
  if (entered === SHOP_CONFIG.adminPassword) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "yes");
    document.getElementById("login-error").textContent = "";
    showDashboard();
  } else {
    document.getElementById("login-error").textContent = "That password isn't right. Try again.";
  }
});

document.getElementById("logout-btn").addEventListener("click", () => {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  location.reload();
});

if (isLoggedIn()) showDashboard();

/* ─────────────────────────────────────────────────────────────
   Publish banner (replaces the old "Download updated files" UI)
   ───────────────────────────────────────────────────────────── */

function setBannerLoading() {
  const b = document.getElementById("publish-banner");
  if (!b) return;
  b.innerHTML = `<div class="publish-banner-text">Connecting to Supabase…</div>`;
}

function setBannerLive() {
  const b = document.getElementById("publish-banner");
  if (!b) return;
  b.innerHTML = `
    <div class="publish-banner-text">
      <strong>Changes save to Supabase instantly</strong> — live for every visitor the moment you click Save.
      No download or GitHub push needed.
    </div>
    <button class="btn btn-outline" id="refresh-btn">Refresh data</button>
  `;
  document.getElementById("refresh-btn").addEventListener("click", async () => {
    document.getElementById("refresh-btn").disabled = true;
    await initStore();
    populateSelects();
    renderPartsTable();
    renderBrandList();
    renderCategoryList();
    updatePartCount();
    document.getElementById("refresh-btn").disabled = false;
    showToast("Refreshed from Supabase");
  });
}

function setBannerEmpty() {
  const b = document.getElementById("publish-banner");
  if (!b) return;
  b.innerHTML = `
    <div class="publish-banner-text">
      <strong>Your Supabase database is empty.</strong>
      Click to seed it with the starter catalog — then add, edit, or delete parts as usual.
    </div>
    <button class="btn btn-accent" id="seed-btn">Seed starter catalog</button>
  `;
  document.getElementById("seed-btn").addEventListener("click", async () => {
    const btn = document.getElementById("seed-btn");
    btn.disabled = true;
    btn.textContent = "Seeding…";
    const result = await seedFromDefaults();
    if (result.ok) {
      populateSelects();
      renderPartsTable();
      renderBrandList();
      renderCategoryList();
      updatePartCount();
      setBannerLive();
      showToast("Starter catalog loaded into Supabase");
    } else {
      btn.disabled = false;
      btn.textContent = "Seed starter catalog";
      showToast("Error: " + result.error);
    }
  });
}

function setBannerError(msg) {
  const b = document.getElementById("publish-banner");
  if (!b) return;
  b.innerHTML = `
    <div class="publish-banner-text">
      <strong>Could not reach Supabase</strong> — showing the local starter catalog instead.
      Check your internet connection or Supabase project status. (${msg || "Unknown error"})
    </div>
    <button class="btn btn-outline" id="retry-btn">Retry</button>
  `;
  document.getElementById("retry-btn").addEventListener("click", async () => {
    setBannerLoading();
    const result = await initStore();
    populateSelects(); renderPartsTable(); renderBrandList(); renderCategoryList(); updatePartCount();
    if (result.ok && result.isEmpty) setBannerEmpty();
    else if (result.ok) setBannerLive();
    else setBannerError(result.error);
  });
}

function updatePartCount() {
  const el = document.getElementById("tab-count-parts");
  if (el) el.textContent = `(${PRODUCTS.length})`;
}

/* ─────────────────────────────────────────────────────────────
   Tabs
   ───────────────────────────────────────────────────────────── */

document.getElementById("admin-tabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".admin-tab");
  if (!btn) return;
  document.querySelectorAll(".admin-tab").forEach(b => b.classList.toggle("active", b === btn));
  const tab = btn.dataset.tab;
  document.getElementById("panel-parts")     .hidden = tab !== "parts";
  document.getElementById("panel-brands")    .hidden = tab !== "brands";
  document.getElementById("panel-categories").hidden = tab !== "categories";
});

/* ─────────────────────────────────────────────────────────────
   Dropdown population
   ───────────────────────────────────────────────────────────── */

function populateSelects() {
  document.getElementById("field-brand")   .innerHTML = BRANDS    .map(b => `<option value="${b}">${b}</option>`).join("");
  document.getElementById("field-category").innerHTML = CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join("");
}

/* ─────────────────────────────────────────────────────────────
   Photo upload
   ───────────────────────────────────────────────────────────── */

document.getElementById("part-image-input").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  pendingImageFile    = file;
  pendingImageRemoved = false;
  if (pendingImagePreview) URL.revokeObjectURL(pendingImagePreview);
  pendingImagePreview = URL.createObjectURL(file);
  showPhotoPreview(pendingImagePreview);
});

document.getElementById("photo-remove-btn").addEventListener("click", () => {
  pendingImageFile    = null;
  pendingImageRemoved = true;
  if (pendingImagePreview) URL.revokeObjectURL(pendingImagePreview);
  pendingImagePreview = null;
  document.getElementById("part-image-input").value = "";
  showPhotoPreview(null);
});

function showPhotoPreview(url) {
  const el = document.getElementById("photo-preview");
  el.innerHTML = url ? `<img src="${url}" alt="Preview">` : "No photo";
}

/* ─────────────────────────────────────────────────────────────
   Part form (add / edit)
   ───────────────────────────────────────────────────────────── */

const partForm     = document.getElementById("part-form");
const partIdField  = document.getElementById("field-id");
const partNameField = document.getElementById("field-name");

partNameField.addEventListener("input", () => {
  if (!editingId && !partIdField.dataset.touched) partIdField.value = "";
});
partIdField.addEventListener("input", () => { partIdField.dataset.touched = "1"; });

partForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById("part-form-error");
  errorEl.textContent = "";

  const name        = partNameField.value.trim();
  const brand       = document.getElementById("field-brand")      .value;
  const category    = document.getElementById("field-category")   .value;
  const price       = Number(document.getElementById("field-price").value);
  const stock       = Number(document.getElementById("field-stock").value);
  const fitment     = document.getElementById("field-fitment")    .value.trim();
  const description = document.getElementById("field-description").value.trim();
  let   id          = partIdField.value.trim();

  if (!name || !fitment || isNaN(price) || isNaN(stock)) {
    errorEl.textContent = "Fill in the part name, fitment, price, and stock.";
    return;
  }

  const saveBtn = document.getElementById("part-save-btn");
  saveBtn.disabled    = true;
  saveBtn.textContent = editingId ? "Saving…" : "Adding…";

  try {
    if (editingId) {
      // Resolve image: upload new file, remove, or keep existing
      let imageUpdate = {};
      if (pendingImageFile) {
        try {
          const url = await uploadProductImage(pendingImageFile, editingId);
          imageUpdate = { image: url };
        } catch (imgErr) {
          errorEl.textContent = "Photo upload failed: " + imgErr.message;
          return;
        }
      } else if (pendingImageRemoved) {
        imageUpdate = { image: undefined }; // undefined → remove
      }
      // Build updates — only include image key if it changed
      const updates = { name, brand, category, price, stock, fitment, description, ...imageUpdate };
      const result = await updateProduct(editingId, updates);
      if (!result.ok) { errorEl.textContent = result.error; return; }
      showToast("Part updated");
    } else {
      if (!id) id = suggestProductId(brand, category);
      let imageUrl;
      if (pendingImageFile) {
        try {
          imageUrl = await uploadProductImage(pendingImageFile, id);
        } catch (imgErr) {
          errorEl.textContent = "Photo upload failed: " + imgErr.message;
          return;
        }
      }
      const product = { id, name, brand, category, price, stock, fitment, description, image: imageUrl };
      const result = await addProduct(product);
      if (!result.ok) { errorEl.textContent = result.error; return; }
      showToast("Part added");
    }

    resetPartForm();
    renderPartsTable();
    updatePartCount();
  } finally {
    saveBtn.disabled    = false;
    saveBtn.textContent = editingId ? "Save changes" : "Add part";
  }
});

document.getElementById("part-cancel-btn").addEventListener("click", resetPartForm);

function resetPartForm() {
  editingId           = null;
  pendingImageFile    = null;
  pendingImageRemoved = false;
  if (pendingImagePreview) { URL.revokeObjectURL(pendingImagePreview); pendingImagePreview = null; }
  partForm.reset();
  partIdField.dataset.touched = "";
  partIdField.placeholder = "auto-generated";
  showPhotoPreview(null);
  document.getElementById("part-form-title")  .textContent = "Add a new part";
  document.getElementById("part-save-btn")    .textContent = "Add part";
  document.getElementById("part-cancel-btn")  .hidden      = true;
  document.getElementById("part-form-error")  .textContent = "";
}

function startEditProduct(id) {
  const p = findProduct(id);
  if (!p) return;
  editingId           = id;
  pendingImageFile    = null;
  pendingImageRemoved = false;
  pendingImagePreview = null;

  partIdField.value                                              = p.id;
  partIdField.dataset.touched                                    = "1";
  partNameField.value                                            = p.name;
  document.getElementById("field-brand")    .value              = p.brand    || BRANDS[0];
  document.getElementById("field-category") .value              = p.category || CATEGORIES[0];
  document.getElementById("field-price")    .value              = p.price;
  document.getElementById("field-stock")    .value              = p.stock;
  document.getElementById("field-fitment")  .value              = p.fitment     || "";
  document.getElementById("field-description").value            = p.description || "";
  showPhotoPreview(p.image || null);

  document.getElementById("part-form-title").textContent = `Editing: ${p.name}`;
  document.getElementById("part-save-btn")  .textContent = "Save changes";
  document.getElementById("part-cancel-btn").hidden      = false;
  document.getElementById("part-form-error").textContent = "";
  document.getElementById("part-form-card") .scrollIntoView({ behavior: "smooth", block: "start" });
}

async function deleteProductWithConfirm(id) {
  const p = findProduct(id);
  if (!p) return;
  if (!confirm(`Delete "${p.name}" (${p.id})? This removes it from Supabase immediately.`)) return;
  const result = await deleteProduct(id);
  if (!result.ok) { showToast("Error: " + result.error); return; }
  if (editingId === id) resetPartForm();
  showToast("Part deleted");
  renderPartsTable();
  updatePartCount();
}

/* ─────────────────────────────────────────────────────────────
   Parts table
   ───────────────────────────────────────────────────────────── */

document.getElementById("admin-search").addEventListener("input", (e) => {
  adminFilterQuery = e.target.value;
  renderPartsTable();
});

function renderPartsTable() {
  const q    = adminFilterQuery.trim().toLowerCase();
  const rows = PRODUCTS.filter(p =>
    !q ||
    p.name    .toLowerCase().includes(q) ||
    p.id      .toLowerCase().includes(q) ||
    (p.brand     || "").toLowerCase().includes(q) ||
    (p.category  || "").toLowerCase().includes(q)
  );

  const tbody = document.getElementById("parts-table-body");
  document.getElementById("tab-count-parts").textContent = `(${PRODUCTS.length})`;

  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:30px;">No parts match "${adminFilterQuery}".</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(p => {
    const thumb    = p.image
      ? `<img class="admin-thumb" src="${p.image}" alt="">`
      : `<div class="admin-thumb-empty"></div>`;
    const stockCls = p.stock <= 0 ? "admin-stock-out" : (p.stock <= 5 ? "admin-stock-warning" : "");
    return `
      <tr>
        <td>${thumb}</td>
        <td>
          <span class="admin-part-name">${p.name}</span>
          <span class="admin-part-sku">${p.id}</span>
        </td>
        <td>${p.brand || "—"}</td>
        <td>${p.category}</td>
        <td>${SHOP_CONFIG.currencySymbol} ${Number(p.price).toLocaleString()}</td>
        <td class="${stockCls}">${p.stock}</td>
        <td>
          <div class="row-actions">
            <button class="row-btn" data-edit="${p.id}">Edit</button>
            <button class="row-btn row-btn-danger" data-delete="${p.id}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  tbody.querySelectorAll("[data-edit]")  .forEach(btn => btn.addEventListener("click", ()  => startEditProduct(btn.dataset.edit)));
  tbody.querySelectorAll("[data-delete]").forEach(btn => btn.addEventListener("click", ()  => deleteProductWithConfirm(btn.dataset.delete)));
}

/* ─────────────────────────────────────────────────────────────
   Brands
   ───────────────────────────────────────────────────────────── */

document.getElementById("brand-add-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input   = document.getElementById("brand-add-input");
  const errorEl = document.getElementById("brand-form-error");
  const result  = await addBrand(input.value);
  if (!result.ok) { errorEl.textContent = result.error; return; }
  errorEl.textContent = "";
  input.value = "";
  populateSelects();
  renderBrandList();
  showToast("Brand added");
});

function renderBrandList() {
  const list = document.getElementById("brand-list");
  list.innerHTML = BRANDS.map(b => `
    <span class="tag-pill">${b} <button type="button" data-remove-brand="${b}" title="Remove ${b}">×</button></span>
  `).join("");
  list.querySelectorAll("[data-remove-brand]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const result  = await removeBrand(btn.dataset.removeBrand);
      const errorEl = document.getElementById("brand-form-error");
      if (!result.ok) { errorEl.textContent = result.error; return; }
      errorEl.textContent = "";
      populateSelects();
      renderBrandList();
      showToast("Brand removed");
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   Categories
   ───────────────────────────────────────────────────────────── */

document.getElementById("category-add-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input   = document.getElementById("category-add-input");
  const errorEl = document.getElementById("category-form-error");
  const result  = await addCategory(input.value);
  if (!result.ok) { errorEl.textContent = result.error; return; }
  errorEl.textContent = "";
  input.value = "";
  populateSelects();
  renderCategoryList();
  showToast("Category added");
});

function renderCategoryList() {
  const list = document.getElementById("category-list");
  list.innerHTML = CATEGORIES.map(c => `
    <span class="tag-pill">${c} <button type="button" data-remove-cat="${c}" title="Remove ${c}">×</button></span>
  `).join("");
  list.querySelectorAll("[data-remove-cat]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const result  = await removeCategory(btn.dataset.removeCat);
      const errorEl = document.getElementById("category-form-error");
      if (!result.ok) { errorEl.textContent = result.error; return; }
      errorEl.textContent = "";
      populateSelects();
      renderCategoryList();
      showToast("Category removed");
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   Reset (wipes Supabase and re-seeds from shipped defaults)
   ───────────────────────────────────────────────────────────── */

document.getElementById("reset-btn").addEventListener("click", async () => {
  if (!confirm(
    "Reset the ENTIRE Supabase catalog back to the starter catalog?\n\n" +
    "This will permanently delete every part, brand, and category you've added or changed — " +
    "for every visitor. This cannot be undone."
  )) return;
  const btn = document.getElementById("reset-btn");
  btn.disabled = true; btn.textContent = "Resetting…";
  const result = await resetToShipped();
  btn.disabled = false; btn.textContent = "Reset to shipped catalog";
  if (result.ok) {
    populateSelects(); renderPartsTable(); renderBrandList(); renderCategoryList(); updatePartCount();
    setBannerLive();
    showToast("Reset to starter catalog");
  } else {
    showToast("Reset failed: " + result.error);
  }
});

/* ─────────────────────────────────────────────────────────────
   Toast
   ───────────────────────────────────────────────────────────── */

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
