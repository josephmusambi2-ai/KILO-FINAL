/* ============================================================
   STORE — the data layer shared by the shop page (index.html)
   and the admin page (admin.html).

   HOW IT WORKS (Supabase edition):

   - Products, brands, and categories are stored in your
     Supabase database. Changes made in admin.html go live
     for every visitor instantly — no download-and-push step.

   - On load, this file fetches the live catalog from Supabase.
     If Supabase is unreachable, it falls back silently to
     the catalog baked into products.js / config.js.

   - The customer shopping cart still uses localStorage
     (it lives in the shopper's own browser, not your database).

   - Call `initStore()` and await it before rendering anything.
     Both index.html (main.js) and admin.html (admin.js) do this.
   ============================================================ */

// Global mutable state — populated by initStore()
let PRODUCTS    = [];
let BRANDS      = [];
let CATEGORIES  = [];

/* ─────────────────────────────────────────────────────────────
   Store initialisation — call once per page load
   ───────────────────────────────────────────────────────────── */

async function initStore() {
  try {
    const [productsRes, brandsRes, categoriesRes] = await Promise.all([
      db.from("products").select("*").order("created_at", { ascending: true }),
      db.from("brands").select("*").order("sort_order", { ascending: true }),
      db.from("categories").select("*").order("sort_order", { ascending: true })
    ]);

    const rawProducts = productsRes.data || [];

    // Normalise: expose image_url as .image so the shop / cart code is unchanged
    PRODUCTS   = rawProducts.map(p => ({ ...p, image: p.image_url || undefined }));
    BRANDS     = (brandsRes.data    || []).map(b => b.name);
    CATEGORIES = (categoriesRes.data || []).map(c => c.name);

    // If the database is empty (first-time setup), fall back to shipped defaults
    const isEmpty = PRODUCTS.length === 0;
    if (isEmpty)           PRODUCTS   = DEFAULT_PRODUCTS.map(p => ({ ...p }));
    if (BRANDS.length === 0)     BRANDS     = [...SHOP_CONFIG.brands];
    if (CATEGORIES.length === 0) CATEGORIES = [...SHOP_CONFIG.categoryOrder];

    return { ok: true, isEmpty };
  } catch (err) {
    console.error("Supabase load failed — using shipped defaults:", err);
    PRODUCTS   = DEFAULT_PRODUCTS.map(p => ({ ...p }));
    BRANDS     = [...SHOP_CONFIG.brands];
    CATEGORIES = [...SHOP_CONFIG.categoryOrder];
    return { ok: false, isEmpty: false, error: err.message };
  }
}

/* ─────────────────────────────────────────────────────────────
   Products
   ───────────────────────────────────────────────────────────── */

function findProduct(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

function productIdExists(id) {
  return PRODUCTS.some(p => p.id === id);
}

function suggestProductId(brand, category) {
  const catCode   = (category || "PRT").replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "PRT";
  const brandCode = (brand    || "UNI").replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "UNI";
  let n = 1, id;
  do {
    id = `${catCode}-${brandCode}-${1000 + n}`;
    n++;
  } while (productIdExists(id) && n < 9999);
  return id;
}

async function addProduct(product) {
  if (!product.id || productIdExists(product.id)) {
    return { ok: false, error: "That part code is empty or already used by another part." };
  }
  const row = {
    id:          product.id,
    name:        product.name,
    brand:       product.brand || "Universal",
    category:    product.category,
    price:       Number(product.price)  || 0,
    stock:       Number(product.stock)  || 0,
    fitment:     product.fitment        || "",
    description: product.description    || "",
    image_url:   product.image          || null
  };
  const { error } = await db.from("products").insert([row]);
  if (error) return { ok: false, error: error.message };
  PRODUCTS.push({ ...row, image: row.image_url || undefined });
  return { ok: true };
}

async function updateProduct(id, updates) {
  const p = findProduct(id);
  if (!p) return { ok: false, error: "Part not found." };
  const row = {
    name:        updates.name,
    brand:       updates.brand,
    category:    updates.category,
    price:       Number(updates.price)  || 0,
    stock:       Number(updates.stock)  || 0,
    fitment:     updates.fitment        || "",
    description: updates.description    || ""
  };
  if ("image" in updates) row.image_url = updates.image || null;

  const { error } = await db.from("products").update(row).eq("id", id);
  if (error) return { ok: false, error: error.message };

  Object.assign(p, updates);
  if ("image" in updates) p.image_url = updates.image || null;
  return { ok: true };
}

async function deleteProduct(id) {
  const { error } = await db.from("products").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  PRODUCTS = PRODUCTS.filter(p => p.id !== id);
  return { ok: true };
}

/* ─────────────────────────────────────────────────────────────
   Brands
   ───────────────────────────────────────────────────────────── */

async function addBrand(name) {
  name = (name || "").trim();
  if (!name) return { ok: false, error: "Enter a brand name." };
  if (BRANDS.some(b => b.toLowerCase() === name.toLowerCase())) {
    return { ok: false, error: "That brand already exists." };
  }
  const { error } = await db.from("brands").insert([{ name, sort_order: BRANDS.length }]);
  if (error) return { ok: false, error: error.message };
  BRANDS.push(name);
  return { ok: true };
}

async function removeBrand(name) {
  const inUse = PRODUCTS.some(p => p.brand === name);
  if (inUse) return { ok: false, error: "Some parts still use this brand. Reassign or delete them first." };
  const { error } = await db.from("brands").delete().eq("name", name);
  if (error) return { ok: false, error: error.message };
  BRANDS = BRANDS.filter(b => b !== name);
  return { ok: true };
}

/* ─────────────────────────────────────────────────────────────
   Categories
   ───────────────────────────────────────────────────────────── */

async function addCategory(name) {
  name = (name || "").trim();
  if (!name) return { ok: false, error: "Enter a category name." };
  if (CATEGORIES.some(c => c.toLowerCase() === name.toLowerCase())) {
    return { ok: false, error: "That category already exists." };
  }
  const { error } = await db.from("categories").insert([{ name, sort_order: CATEGORIES.length }]);
  if (error) return { ok: false, error: error.message };
  CATEGORIES.push(name);
  return { ok: true };
}

async function removeCategory(name) {
  const inUse = PRODUCTS.some(p => p.category === name);
  if (inUse) return { ok: false, error: "Some parts still use this category. Reassign or delete them first." };
  const { error } = await db.from("categories").delete().eq("name", name);
  if (error) return { ok: false, error: error.message };
  CATEGORIES = CATEGORIES.filter(c => c !== name);
  return { ok: true };
}

/* ─────────────────────────────────────────────────────────────
   Seed from shipped defaults (first-time setup)
   ───────────────────────────────────────────────────────────── */

async function seedFromDefaults() {
  try {
    const brandRows = SHOP_CONFIG.brands.map((name, i) => ({ name, sort_order: i }));
    const catRows   = SHOP_CONFIG.categoryOrder.map((name, i) => ({ name, sort_order: i }));
    const productRows = DEFAULT_PRODUCTS.map(p => ({
      id:          p.id,
      name:        p.name,
      brand:       p.brand       || "Universal",
      category:    p.category,
      price:       Number(p.price)  || 0,
      stock:       Number(p.stock)  || 0,
      fitment:     p.fitment        || "",
      description: p.description    || "",
      image_url:   p.image          || null
    }));

    await db.from("brands").upsert(brandRows,    { onConflict: "name" });
    await db.from("categories").upsert(catRows,  { onConflict: "name" });
    const { error } = await db.from("products").upsert(productRows, { onConflict: "id" });
    if (error) return { ok: false, error: error.message };

    return await initStore();
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/* ─────────────────────────────────────────────────────────────
   Reset to shipped catalog (deletes ALL Supabase data then
   re-seeds from products.js / config.js defaults)
   ───────────────────────────────────────────────────────────── */

async function resetToShipped() {
  try {
    // Delete all rows — .not("id","is",null) matches every row
    await Promise.all([
      db.from("products").delete().not("id",   "is", null),
      db.from("brands")  .delete().not("name", "is", null),
      db.from("categories").delete().not("name","is", null)
    ]);
    return await seedFromDefaults();
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/* ─────────────────────────────────────────────────────────────
   Image helpers
   ───────────────────────────────────────────────────────────── */

/**
 * Resize a File to at most maxDimension × maxDimension at the
 * given quality, and return a Blob ready for Supabase Storage.
 */
function resizeImageFile(file, maxDimension = 900, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload  = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file doesn't look like an image."));
      img.onload  = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round(height * (maxDimension / width));
            width  = maxDimension;
          } else {
            width  = Math.round(width * (maxDimension / height));
            height = maxDimension;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width  = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Resize failed.")), "image/jpeg", quality);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Resize then upload an image file to Supabase Storage.
 * Returns the public URL string.
 */
async function uploadProductImage(file, productId) {
  const blob = await resizeImageFile(file);
  const path = `${productId.replace(/[^a-zA-Z0-9_-]/g, "_")}-${Date.now()}.jpg`;
  const { error } = await db.storage
    .from("product-images")
    .upload(path, blob, { contentType: "image/jpeg", upsert: true });
  if (error) throw new Error(error.message);
  const { data: { publicUrl } } = db.storage.from("product-images").getPublicUrl(path);
  return publicUrl;
}
