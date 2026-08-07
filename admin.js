/* ============================================================
   ADMIN.JS — logic for admin.html (Manage Store).
   Handles the login gate, tab switching, part add/edit/delete,
   brand & category management, and the "reset to shipped
   catalog" danger-zone action. Talks to Supabase entirely
   through the helpers already defined in store.js.
   ============================================================ */

const ADMIN_SESSION_KEY = "kilo_admin_logged_in";

let editingId        = null; // product id currently being edited, or null = "add" mode
let selectedImageFile = null; // File picked in the photo input, not yet uploaded
let removeImageFlag   = false; // true if the user clicked "Remove photo" on an existing part

/* ---------- small helpers ---------- */

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function $(id) { return document.getElementById(id); }

/* ---------- login gate ---------- */

function showAdmin() {
  $("login-screen").hidden = true;
  $("admin-wrap").hidden = false;
}

function showLogin() {
  $("login-screen").hidden = false;
  $("admin-wrap").hidden = true;
}

function initLoginGate() {
  if (sessionStorage.getItem(ADMIN_SESSION_KEY) === "yes") {
    showAdmin();
    initAdmin();
  }

  $("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const entered = $("login-password").value;
    if (entered === SHOP_CONFIG.adminPassword) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "yes");
      $("login-error").textContent = "";
      $("login-password").value = "";
      showAdmin();
      initAdmin();
    } else {
      $("login-error").textContent = "Incorrect password. Try again.";
    }
  });

  $("logout-btn").addEventListener("click", () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    showLogin();
  });
}

/* ---------- init (after login) ---------- */

let adminInitialized = false;

async function initAdmin() {
  if (adminInitialized) return; // don't re-run store load every time login gate opens
  adminInitialized = true;

  document.querySelectorAll(".js-currency").forEach(el => el.textContent = SHOP_CONFIG.currencySymbol);

  $("publish-banner").innerHTML = `<div class="publish-banner-text">Connecting to Supabase…</div>`;
  const result = await initStore();
  renderPublishBanner(result);

  initTabs();
  populateFieldDropdowns();
  renderPartsTable();
  renderBrandList();
  renderCategoryList();
  initPartForm();
  initBrandForm();
  initCategoryForm();
  initResetButton();

  $("admin-search").addEventListener("input", renderPartsTable);
}

function renderPublishBanner(result) {
  const el = $("publish-banner");
  if (result && result.ok) {
    if (result.isEmpty) {
      el.innerHTML = `<div class="publish-banner-text"><strong>Your Supabase database is empty.</strong> Add parts below, or use the browser console to run <code>seedFromDefaults()</code> to load the starter catalog.</div>`;
    } else {
      el.innerHTML = `<div class="publish-banner-text"><strong>Changes save to Supabase instantly</strong> — live for every visitor the moment you click Save.</div>`;
    }
  } else {
    el.innerHTML = `<div class="publish-banner-text"><strong>Could not reach Supabase</strong> — showing the shipped catalog from products.js instead. Changes here won't be saved. Check supabase-config.js and your internet connection.</div>`;
  }
}

/* ---------- tabs ---------- */

function initTabs() {
  document.querySelectorAll(".admin-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      $("panel-parts").hidden      = tab !== "parts";
      $("panel-brands").hidden     = tab !== "brands";
      $("panel-categories").hidden = tab !== "categories";
    });
  });
}

/* ---------- dropdowns (brand / category) shared by the part form ---------- */

function populateFieldDropdowns() {
  const brandSel = $("field-brand");
  const catSel   = $("field-category");
  brandSel.innerHTML = BRANDS.map(b => `<option value="${b}">${b}</option>`).join("");
  catSel.innerHTML   = CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join("");
}

/* ---------- parts table ---------- */

function renderPartsTable() {
  $("tab-count-parts").textContent = `(${PRODUCTS.length})`;
  const q = ($("admin-search").value || "").trim().toLowerCase();
  const rows = PRODUCTS.filter(p =>
    !q ||
    p.name.toLowerCase().includes(q) ||
    p.id.toLowerCase().includes(q) ||
    (p.brand || "").toLowerCase().includes(q)
  );

  const body = $("parts-table-body");
  if (rows.length === 0) {
    body.innerHTML = `<tr><td colspan="7" style="color:var(--text-muted); padding:18px 10px;">No parts match.</td></tr>`;
    return;
  }

  body.innerHTML = rows.map(p => {
    const thumb = p.image
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
        <td>${p.brand || ""}</td>
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

  body.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", () => startEditPart(btn.dataset.edit));
  });
  body.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", () => handleDeletePart(btn.dataset.delete));
  });
}

async function handleDeletePart(id) {
  const p = findProduct(id);
  if (!p) return;
  if (!confirm(`Delete "${p.name}" (${id})? This can't be undone.`)) return;
  const res = await deleteProduct(id);
  if (!res.ok) {
    showToast(res.error || "Could not delete that part.");
    return;
  }
  showToast("Part deleted");
  renderPartsTable();
  if (editingId === id) resetPartForm();
}

/* ---------- part form (add / edit) ---------- */

function initPartForm() {
  $("part-image-input").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    selectedImageFile = file;
    removeImageFlag = false;
    const reader = new FileReader();
    reader.onload = () => {
      $("photo-preview").innerHTML = `<img src="${reader.result}" alt="">`;
    };
    reader.readAsDataURL(file);
  });

  $("photo-remove-btn").addEventListener("click", () => {
    selectedImageFile = null;
    removeImageFlag = true;
    $("part-image-input").value = "";
    $("photo-preview").innerHTML = "No photo";
  });

  $("part-cancel-btn").addEventListener("click", resetPartForm);

  $("part-form").addEventListener("submit", handlePartFormSubmit);
}

function startEditPart(id) {
  const p = findProduct(id);
  if (!p) return;
  editingId = id;
  selectedImageFile = null;
  removeImageFlag = false;

  $("part-form-title").textContent = `Edit part — ${p.id}`;
  $("field-name").value = p.name;
  $("field-brand").value = p.brand || "Universal";
  $("field-category").value = p.category;
  $("field-price").value = p.price;
  $("field-stock").value = p.stock;
  $("field-id").value = p.id;
  $("field-id").disabled = true; // don't let the SKU change on an existing part
  $("field-fitment").value = p.fitment || "";
  $("field-description").value = p.description || "";
  $("photo-preview").innerHTML = p.image ? `<img src="${p.image}" alt="">` : "No photo";

  $("part-save-btn").textContent = "Save changes";
  $("part-cancel-btn").hidden = false;
  $("part-form-error").textContent = "";

  $("part-form-card").scrollIntoView({ behavior: "smooth" });
}

function resetPartForm() {
  editingId = null;
  selectedImageFile = null;
  removeImageFlag = false;
  $("part-form").reset();
  $("field-id").disabled = false;
  $("photo-preview").innerHTML = "No photo";
  $("part-form-title").textContent = "Add a new part";
  $("part-save-btn").textContent = "Add part";
  $("part-cancel-btn").hidden = true;
  $("part-form-error").textContent = "";
}

async function handlePartFormSubmit(e) {
  e.preventDefault();
  const errEl = $("part-form-error");
  errEl.textContent = "";

  const brand    = $("field-brand").value;
  const category = $("field-category").value;
  const data = {
    name:        $("field-name").value.trim(),
    brand,
    category,
    price:       $("field-price").value,
    stock:       $("field-stock").value,
    fitment:     $("field-fitment").value.trim(),
    description: $("field-description").value.trim()
  };

  if (!data.name || !data.fitment) {
    errEl.textContent = "Please fill in the required fields.";
    return;
  }

  $("part-save-btn").disabled = true;

  try {
    // Upload a new photo if one was picked
    if (selectedImageFile) {
      const tempId = editingId || $("field-id").value.trim() || suggestProductId(brand, category);
      data.image = await uploadProductImage(selectedImageFile, tempId);
    } else if (removeImageFlag) {
      data.image = null;
    }

    let res;
    if (editingId) {
      res = await updateProduct(editingId, data);
    } else {
      const id = $("field-id").value.trim() || suggestProductId(brand, category);
      res = await addProduct({ ...data, id });
    }

    if (!res.ok) {
      errEl.textContent = res.error || "Could not save that part.";
      return;
    }

    showToast(editingId ? "Part updated" : "Part added");
    resetPartForm();
    renderPartsTable();
  } catch (err) {
    errEl.textContent = err.message || "Something went wrong saving that part.";
  } finally {
    $("part-save-btn").disabled = false;
  }
}

/* ---------- brands tab ---------- */

function renderBrandList() {
  const list = $("brand-list");
  list.innerHTML = BRANDS.map(b => `
    <span class="tag-pill">${b} <button data-remove-brand="${b}" aria-label="Remove ${b}">×</button></span>
  `).join("");
  list.querySelectorAll("[data-remove-brand]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const res = await removeBrand(btn.dataset.removeBrand);
      if (!res.ok) { showToast(res.error); return; }
      renderBrandList();
      populateFieldDropdowns();
      showToast("Brand removed");
    });
  });
}

function initBrandForm() {
  $("brand-add-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = $("brand-add-input");
    const errEl = $("brand-form-error");
    const res = await addBrand(input.value);
    if (!res.ok) { errEl.textContent = res.error; return; }
    errEl.textContent = "";
    input.value = "";
    renderBrandList();
    populateFieldDropdowns();
    showToast("Brand added");
  });
}

/* ---------- categories tab ---------- */

function renderCategoryList() {
  const list = $("category-list");
  list.innerHTML = CATEGORIES.map(c => `
    <span class="tag-pill">${c} <button data-remove-cat="${c}" aria-label="Remove ${c}">×</button></span>
  `).join("");
  list.querySelectorAll("[data-remove-cat]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const res = await removeCategory(btn.dataset.removeCat);
      if (!res.ok) { showToast(res.error); return; }
      renderCategoryList();
      populateFieldDropdowns();
      showToast("Category removed");
    });
  });
}

function initCategoryForm() {
  $("category-add-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = $("category-add-input");
    const errEl = $("category-form-error");
    const res = await addCategory(input.value);
    if (!res.ok) { errEl.textContent = res.error; return; }
    errEl.textContent = "";
    input.value = "";
    renderCategoryList();
    populateFieldDropdowns();
    showToast("Category added");
  });
}

/* ---------- danger zone ---------- */

function initResetButton() {
  $("reset-btn").addEventListener("click", async () => {
    if (!confirm("This deletes EVERYTHING in your Supabase database and replaces it with the starter catalog from products.js. This affects every visitor immediately and cannot be undone. Continue?")) return;
    $("reset-btn").disabled = true;
    const res = await resetToShipped();
    $("reset-btn").disabled = false;
    if (!res.ok) { showToast(res.error || "Reset failed."); return; }
    showToast("Reset to shipped catalog");
    renderPublishBanner(res);
    populateFieldDropdowns();
    renderPartsTable();
    renderBrandList();
    renderCategoryList();
  });
}

/* ---------- boot ---------- */

document.addEventListener("DOMContentLoaded", initLoginGate);
