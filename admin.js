/* =========================================================
   Kilo Auto Spares Ltd — Admin Panel Logic
   ---------------------------------------------------------
   SECURITY NOTE: this is a client-side password screen, fine
   for keeping casual visitors out of the back office on a
   small static site, but anyone who reads the page source can
   find the password below. Do not treat it as real security —
   if this ever needs to be tamper-proof, it needs a real login
   system with a backend (e.g. Firebase Auth).
   Change the password by editing ADMIN_PASSWORD below.
   ========================================================= */

const ADMIN_PASSWORD = "kilo2026";
const SESSION_KEY = "kilo_admin_authed";

let editingImageDataUrl = null;

function attemptLogin() {
  const input = document.getElementById('adminPassword');
  const error = document.getElementById('loginError');
  if (input.value === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, '1');
    showDashboard();
  } else {
    error.classList.remove('hidden');
    input.value = '';
    input.focus();
  }
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  document.getElementById('adminDashboard').classList.add('hidden');
  document.getElementById('logoutBtn').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
}

function showDashboard() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('adminDashboard').classList.remove('hidden');
  document.getElementById('logoutBtn').classList.remove('hidden');
  populateCategoryDropdowns();
  renderAdminTable();
}

function populateCategoryDropdowns() {
  const filterSelect = document.getElementById('adminCategoryFilter');
  const formSelect = document.getElementById('pCategory');

  CATEGORIES.forEach(cat => {
    const opt1 = document.createElement('option');
    opt1.value = cat; opt1.textContent = cat;
    filterSelect.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = cat; opt2.textContent = cat;
    formSelect.appendChild(opt2);
  });

  formSelect.addEventListener('change', () => updateSubcategoryOptions(formSelect.value));
  updateSubcategoryOptions(formSelect.value);
}

// Refreshes the subcategory suggestion list to match the real,
// verified subcategories for whichever category is selected.
function updateSubcategoryOptions(category) {
  const datalist = document.getElementById('pSubcategoryOptions');
  const subs = CATEGORY_STRUCTURE[category] || [];
  datalist.innerHTML = subs.map(s => `<option value="${s}"></option>`).join('');
}

function renderAdminTable() {
  const products = loadDraftProducts();
  const search = document.getElementById('adminSearch').value.trim().toLowerCase();
  const categoryFilter = document.getElementById('adminCategoryFilter').value;

  const filtered = products.filter(p => {
    const matchesSearch = !search || `${p.name} ${p.brand || ''}`.toLowerCase().includes(search);
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const tbody = document.getElementById('adminProductTable');

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-10 text-slate-500">No products found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => `
    <tr class="hover:bg-slate-900/50 transition">
      <td class="px-4 py-3"><img src="${p.image}" alt="${p.name}" class="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-800"></td>
      <td class="px-4 py-3 text-white font-medium">${p.name}</td>
      <td class="px-4 py-3 text-slate-400">${p.brand || '—'}</td>
      <td class="px-4 py-3 text-slate-400">${p.category}</td>
      <td class="px-4 py-3 text-red-400 font-bold">${p.price.toLocaleString()}</td>
      <td class="px-4 py-3 text-right whitespace-nowrap">
        <button onclick="openProductModal(${p.id})" class="text-slate-400 hover:text-white p-2" title="Edit"><i class="fa-solid fa-pen"></i></button>
        <button onclick="deleteProduct(${p.id})" class="text-slate-400 hover:text-red-400 p-2" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

function openProductModal(id) {
  const form = document.getElementById('productForm');
  form.reset();
  editingImageDataUrl = null;
  document.getElementById('pImagePreview').classList.add('hidden');
  document.getElementById('pImageUrl').value = '';

  if (id) {
    const products = loadDraftProducts();
    const product = products.find(p => p.id === id);
    if (!product) return;
    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('pId').value = product.id;
    document.getElementById('pName').value = product.name;
    document.getElementById('pBrand').value = product.brand || '';
    document.getElementById('pPrice').value = product.price;
    document.getElementById('pCategory').value = product.category;
    updateSubcategoryOptions(product.category);
    document.getElementById('pSubcategory').value = product.subcategory || '';
    document.getElementById('pDescription').value = product.description || '';
    document.getElementById('pImageUrl').value = product.image || '';
    editingImageDataUrl = product.image;
    const preview = document.getElementById('pImagePreview');
    preview.src = product.image;
    preview.classList.remove('hidden');
  } else {
    document.getElementById('modalTitle').textContent = 'Add Product';
    document.getElementById('pId').value = '';
    document.getElementById('pCategory').value = CATEGORIES[0];
    updateSubcategoryOptions(CATEGORIES[0]);
  }

  document.getElementById('productModal').classList.remove('hidden');
}

function closeProductModal() {
  document.getElementById('productModal').classList.add('hidden');
}

function discardDraftClick() {
  if (!confirm('Discard all unpublished changes in this browser and reload the current live catalogue?')) return;
  discardDraft();
  renderAdminTable();
}

function deleteProduct(id) {
  if (!confirm('Remove this product from the catalogue? This cannot be undone.')) return;
  const products = loadDraftProducts().filter(p => p.id !== id);
  saveDraftProducts(products);
  renderAdminTable();
}

function exportProducts() {
  const products = loadDraftProducts();
  const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  // Named to match the live file exactly — upload this straight over
  // js/products-data.json in your GitHub repo to publish your changes.
  a.download = 'products-data.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importProducts(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) throw new Error('File must contain a list of products.');
      saveDraftProducts(data);
      renderAdminTable();
      alert(`Imported ${data.length} products successfully.`);
    } catch (err) {
      alert('Could not import this file: ' + err.message);
    }
  };
  reader.readAsText(file);
}

/* =========================================================
   Bulk Add from Excel/CSV — scoped to whatever Category and
   Subcategory are currently picked in the Add/Edit Product
   modal. Every row in the file becomes a product filed under
   that Category/Subcategory. If the spreadsheet has actual
   pictures pasted into cells (not just links), those are
   pulled out automatically and matched to their row.
   ========================================================= */

const FIELD_ALIASES = {
  name: ['name', 'productname', 'title', 'part', 'partname'],
  brand: ['brand', 'make', 'manufacturer'],
  price: ['price', 'sellingprice', 'cost', 'kes', 'kshs', 'pricekshs', 'amount'],
  originalprice: ['originalprice', 'oldprice', 'wasprice', 'rrp', 'listprice', 'beforeprice'],
  subcategory: ['subcategory', 'sub', 'subcat'],
  description: ['description', 'desc', 'details', 'notes', 'makemodel', 'compatibility', 'compatiblewith'],
  image: ['image', 'imageurl', 'photo', 'photourl', 'picture', 'img', 'productimagelink']
};

function normalizeKey(s) {
  return String(s || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function buildHeaderLookup(headers) {
  const lookup = {};
  headers.forEach(h => {
    const norm = normalizeKey(h);
    Object.entries(FIELD_ALIASES).forEach(([canonical, aliases]) => {
      if (aliases.includes(norm)) lookup[norm] = canonical;
    });
  });
  return lookup;
}

// Given one raw row (object keyed by whatever headers were in the
// file) and a lookup from normalized-header -> canonical field name,
// returns a clean product object, or null if it's missing the bare
// minimum (name + price). Category/Subcategory are filled in by the
// caller from the modal's current selection, not from the file.
function normalizeRow(rawRow, headerLookup) {
  const out = {};
  Object.keys(rawRow).forEach(rawKey => {
    const canonical = headerLookup[normalizeKey(rawKey)];
    if (canonical) out[canonical] = rawRow[rawKey];
  });

  const name = String(out.name || '').trim();
  const priceRaw = (out.price !== undefined && out.price !== null) ? out.price : '';
  const price = parseFloat(String(priceRaw).replace(/[^0-9.]/g, ''));
  if (!name || isNaN(price)) return null;

  const originalPriceRaw = out.originalprice;
  const originalPrice = originalPriceRaw ? parseFloat(String(originalPriceRaw).replace(/[^0-9.]/g, '')) : null;

  return {
    name,
    brand: String(out.brand || '').trim(),
    price,
    originalPrice: (originalPrice && originalPrice > price) ? originalPrice : null,
    subcategoryFromFile: String(out.subcategory || '').trim(),
    description: String(out.description || '').trim(),
    image: String(out.image || '').trim() || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&q=80'
  };
}

// Appends normalized products to the draft (existing products untouched) and refreshes the table.
function addBulkRows(rows, sourceLabel, imagesFoundCount) {
  const products = loadDraftProducts();
  rows.forEach(rawRow => {
    products.push({ ...rawRow, id: nextProductId(products) });
  });
  saveDraftProducts(products);
  renderAdminTable();
  alert(`${sourceLabel}: added ${rows.length} product(s) to your draft` +
    (imagesFoundCount ? ` (${imagesFoundCount} picked up an embedded photo automatically)` : '') +
    `.\n\nRemember: this is still a draft. Click "Export Product Data" and push the file to GitHub to make it live.`);
}

// xlsx files are zip archives. This digs into xl/drawings + xl/media to
// find pictures pasted into cells and which spreadsheet row they sit on,
// so they can be matched up to the right product automatically. Falls
// back to no images (not an error) if the file has none, or if the
// layout doesn't match what this parses.
async function extractEmbeddedImages(arrayBuffer) {
  const rowImages = {};
  try {
    const zip = await JSZip.loadAsync(arrayBuffer);
    const drawingFiles = Object.keys(zip.files).filter(n => /^xl\/drawings\/drawing\d+\.xml$/.test(n));

    for (const drawingPath of drawingFiles) {
      const drawingXml = await zip.file(drawingPath).async('string');
      const relsPath = drawingPath.replace('xl/drawings/', 'xl/drawings/_rels/') + '.rels';
      const relsFile = zip.file(relsPath);
      if (!relsFile) continue;
      const relsXml = await relsFile.async('string');

      const relMap = {};
      const relRegex = /<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/g;
      let m;
      while ((m = relRegex.exec(relsXml))) {
        relMap[m[1]] = m[2].replace(/^\.\.\//, 'xl/');
      }

      const anchorRegex = /<xdr:(twoCellAnchor|oneCellAnchor)[^>]*>([\s\S]*?)<\/xdr:\1>/g;
      let am;
      while ((am = anchorRegex.exec(drawingXml))) {
        const block = am[2];
        const rowMatch = block.match(/<xdr:from>[\s\S]*?<xdr:row>(\d+)<\/xdr:row>/);
        const embedMatch = block.match(/r:embed="([^"]+)"/);
        if (!rowMatch || !embedMatch) continue;
        const excelRow = parseInt(rowMatch[1], 10);
        const mediaPath = relMap[embedMatch[1]];
        const mediaFile = mediaPath && zip.file(mediaPath);
        if (!mediaFile) continue;

        const base64 = await mediaFile.async('base64');
        const ext = mediaPath.split('.').pop().toLowerCase();
        const mime = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif' }[ext] || 'image/png';
        rowImages[excelRow] = `data:${mime};base64,${base64}`;
      }
    }
  } catch (e) {
    console.warn('No embedded images found (or this file\'s layout could not be parsed):', e);
  }
  return rowImages;
}

// Main entry point: reads an xlsx/csv file, applies the Category/Subcategory
// currently selected in the modal to every row, and pulls in any pasted-in
// photos automatically.
async function importBulkExcelForCategory(file, category, subcategory) {
  try {
    const arrayBuffer = await file.arrayBuffer();

    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    // header:1 -> array-of-arrays, so row indexes line up with Excel's own row numbers.
    const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    if (raw.length < 2) throw new Error('No product rows found (need a header row plus at least one product row).');

    const headers = raw[0];
    const headerLookup = buildHeaderLookup(headers);
    const dataRows = raw.slice(1);

    const rowImages = file.name.toLowerCase().endsWith('.csv') ? {} : await extractEmbeddedImages(arrayBuffer);
    let imagesFoundCount = 0;

    const normalized = [];
    dataRows.forEach((rowArr, idx) => {
      const rawRow = {};
      headers.forEach((h, i) => { rawRow[h] = rowArr[i] !== undefined ? rowArr[i] : ''; });
      const product = normalizeRow(rawRow, headerLookup);
      if (!product) return;
      product.category = category;
      product.subcategory = product.subcategoryFromFile || subcategory || '';
      delete product.subcategoryFromFile;
      // Header is Excel row 0, so this data row is Excel row (idx + 1).
      const excelRow = idx + 1;
      if (rowImages[excelRow]) {
        product.image = rowImages[excelRow];
        imagesFoundCount++;
      }
      normalized.push(product);
    });

    if (normalized.length === 0) throw new Error('No valid rows found — every row needs at least a Name and a Price.');

    addBulkRows(normalized, `Excel bulk upload (${category}${subcategory ? ' / ' + subcategory : ''})`, imagesFoundCount);
  } catch (err) {
    alert('Could not read this file: ' + err.message);
  }
}

/* =========================================================
   Reusable drag-and-drop + clipboard-paste helper.
   Lets a box accept a file three ways: the normal file-picker
   button inside it, dragging a file onto it from the desktop/
   Files app, or clicking the box and pasting (Ctrl/Cmd+V) a
   file that's on the clipboard.
   ========================================================= */
function setupDropAndPasteZone({ zoneEl, accepts, onFile, activeClasses, clickOpensFileInput }) {
  if (!zoneEl) return;

  const setActive = (on) => {
    activeClasses.forEach(c => zoneEl.classList.toggle(c, on));
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!accepts(file)) {
      alert(`"${file.name}" isn't a supported file type for this box.`);
      return;
    }
    onFile(file);
  };

  ['dragenter', 'dragover'].forEach(evt => {
    zoneEl.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      setActive(true);
    });
  });

  ['dragleave', 'dragend'].forEach(evt => {
    zoneEl.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      setActive(false);
    });
  });

  zoneEl.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(false);
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    handleFile(file);
  });

  // Click-to-focus so paste (below) knows this box is the target,
  // and optionally opens the real file picker for accessibility.
  zoneEl.addEventListener('click', (e) => {
    // Don't double-trigger when the click landed on the actual <label>/<input>
    // inside the zone — that already opens its own file picker.
    if (e.target.closest('label')) return;
    zoneEl.focus();
    if (clickOpensFileInput) clickOpensFileInput.click();
  });

  zoneEl.addEventListener('paste', (e) => {
    const items = e.clipboardData && e.clipboardData.files;
    if (items && items[0]) {
      e.preventDefault();
      handleFile(items[0]);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem(SESSION_KEY) === '1') {
    showDashboard();
  }

  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.getElementById('adminSearch').addEventListener('input', renderAdminTable);
  document.getElementById('adminCategoryFilter').addEventListener('change', renderAdminTable);
  document.getElementById('importFileInput').addEventListener('change', (e) => {
    if (e.target.files[0]) importProducts(e.target.files[0]);
    e.target.value = '';
  });

  document.getElementById('pBulkExcelInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const category = document.getElementById('pCategory').value;
    const subcategory = document.getElementById('pSubcategory').value.trim();
    importBulkExcelForCategory(file, category, subcategory);
    e.target.value = '';
  });

  setupDropAndPasteZone({
    zoneEl: document.getElementById('jsonImportDropzone'),
    accepts: (file) => /\.json$/i.test(file.name) || file.type === 'application/json',
    onFile: (file) => importProducts(file),
    activeClasses: ['border-emerald-500', 'bg-slate-700']
  });

  setupDropAndPasteZone({
    zoneEl: document.getElementById('bulkDropzone'),
    accepts: (file) => /\.(xlsx|xls|csv)$/i.test(file.name),
    onFile: (file) => {
      const category = document.getElementById('pCategory').value;
      const subcategory = document.getElementById('pSubcategory').value.trim();
      importBulkExcelForCategory(file, category, subcategory);
    },
    activeClasses: ['border-emerald-400', 'bg-slate-800/60'],
    clickOpensFileInput: document.getElementById('pBulkExcelInput')
  });

  // Image file -> base64 preview
  document.getElementById('pImageFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      editingImageDataUrl = ev.target.result;
      document.getElementById('pImageUrl').value = '';
      const preview = document.getElementById('pImagePreview');
      preview.src = editingImageDataUrl;
      preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  });

  // Pasted URL overrides uploaded file preview
  document.getElementById('pImageUrl').addEventListener('input', (e) => {
    if (e.target.value.trim()) {
      editingImageDataUrl = e.target.value.trim();
      const preview = document.getElementById('pImagePreview');
      preview.src = editingImageDataUrl;
      preview.classList.remove('hidden');
    }
  });

  document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('pId').value;
    const name = document.getElementById('pName').value.trim();
    const brand = document.getElementById('pBrand').value.trim();
    const price = parseFloat(document.getElementById('pPrice').value);
    const category = document.getElementById('pCategory').value;
    const subcategory = document.getElementById('pSubcategory').value.trim();
    const description = document.getElementById('pDescription').value.trim();
    const image = editingImageDataUrl || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&q=80';

    const products = loadDraftProducts();

    if (id) {
      const idx = products.findIndex(p => p.id === parseInt(id));
      if (idx !== -1) {
        products[idx] = { ...products[idx], name, brand, price, category, subcategory, description, image };
      }
    } else {
      products.push({ id: nextProductId(products), name, brand, price, category, subcategory, description, image });
    }

    saveDraftProducts(products);
    closeProductModal();
    renderAdminTable();
  });
});
