/* =========================================================
   Kilo Auto Spares Ltd — Product Data Layer
   ---------------------------------------------------------
   THE SINGLE SOURCE OF TRUTH FOR THE LIVE SITE IS THE FILE
   products-data.json, sitting in the same root folder as every
   other file on this site (no subfolders — GitHub upload stays
   simple). Every visitor's Home/Shop/etc pages read straight
   from that file — nothing is stored per-browser for them, so
   everyone always sees the same catalogue.

   The Admin page is different: it works on a private DRAFT
   copy saved in this browser's local storage, so you can add
   photos/prices without affecting the live site immediately.
   When you're happy with your changes, click "Export Product
   Data" in Admin — that downloads the FULL updated catalogue
   as products-data.json. Upload that file to your GitHub repo
   at the root (overwriting the old one) and your changes go
   live for everyone.
   ========================================================= */

const DRAFT_STORAGE_KEY = 'kilo_products_draft_v1';

// Category > Subcategory structure, mirrors the mega-menu and
// the "Shop by Category" grid on the homepage.
// This mirrors the full verified structure of onestopautogarage.co.ke
// (researched August 2026) so the Admin dropdowns/URLs/menus match
// a real, established auto-parts catalogue.
const CATEGORY_STRUCTURE = {
  "Suspension Parts": [
    "Ball Joints", "Boot Struts", "Brake Discs", "Center Bearing Assembly",
    "Coil Springs", "Control Arms", "CV Joints", "Drive Shafts",
    "Engine Mounts", "Oil Seals", "Power Steering Pumps", "Power Steering Rack",
    "Rubber Arm Bushes", "Rubber Boots", "Shock Absorbers", "Shock Mounts",
    "Stabilizer Links", "Steering Knuckle", "Steering Rack End",
    "Steering Tie Rod End", "Suspension Airbag", "Wheel Bearings", "Wheel Hubs"
  ],
  "Service Parts": [
    "Air Filters", "Brake Adjuster Kit", "Brake Calipers", "Brake Cylinders",
    "Brake Fluid", "Brake Pad Sensor", "Brake Pads", "Brake Shoes",
    "Cabin Filter", "Cooling System", "Diesel Filter", "Engine Oil",
    "Fan Belt", "Fan Belt Tensioner", "Fuel Filters",
    "Gear Box Transmission Oil ATF CVT", "Ignition Coils", "Oil Filter",
    "Radiator Coolant", "Spark Plugs", "Timing Belt", "Timing Kits",
    "Transmission Filters", "Wheel Rings & Caps", "Wipers"
  ],
  "Engine Parts": [
    "Coolant Reservoir", "Engine Radiators", "Engine Sumps",
    "Gasket Head Cover", "Gasket Rubber", "Gear Parts", "Hoses",
    "Oil Pumps", "Oxygen Sensor", "Pulleys", "Radiator Cap", "Sensors",
    "Starter Motor", "Transmission Filters", "Turbo Valves", "Water Pumps"
  ],
  // Cross-cutting brand/origin tag (BMW, Audi, VW, Mercedes, etc.) —
  // no subcategories on the real site, so left empty here too.
  "German Parts": [],
  "Service Kits": ["German Cars", "Japanese Cars"],
  // Flat listings — no subcategories on the real site.
  "Car Batteries": [],
  "Tyres": []
};

const CATEGORIES = Object.keys(CATEGORY_STRUCTURE);

// Icon shown on the homepage category tiles (Font Awesome class).
const CATEGORY_ICONS = {
  "Suspension Parts": "fa-solid fa-car-side",
  "Service Parts": "fa-solid fa-oil-can",
  "Engine Parts": "fa-solid fa-gears",
  "German Parts": "fa-solid fa-flag",
  "Service Kits": "fa-solid fa-toolbox",
  "Car Batteries": "fa-solid fa-car-battery",
  "Tyres": "fa-solid fa-circle-dot"
};

// Fallback only — used if products-data.json can't be fetched
// (e.g. you open the HTML file directly instead of via a server).
const DEFAULT_PRODUCTS = [
  { id: 1,  name: "Front Shock Absorber",           brand: "Sachs",          category: "Suspension Parts", subcategory: "Shock Absorbers",   price: 13500, originalPrice: 14500, image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&q=80", description: "Genuine-spec front shock absorber for German saloons. Sold individually." },
  { id: 2,  name: "Rear Shock Absorber Set",        brand: "KYB",            category: "Suspension Parts", subcategory: "Shock Absorbers",   price: 8500,  originalPrice: null,  image: "https://images.unsplash.com/photo-1552930219-29d889622d2e?w=600&q=80", description: "Matched pair for Japanese saloons and light SUVs, direct fit." },
  { id: 3,  name: "Front Control Arm Assembly",     brand: "Moog",           category: "Suspension Parts", subcategory: "Control Arms",      price: 11000, originalPrice: 12000, image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80", description: "Complete assembly with bushings and ball joint, ready to bolt on." },
  { id: 4,  name: "Stabilizer Link Kit",            brand: "Febi",           category: "Suspension Parts", subcategory: "Stabilizer Links",  price: 3200,  originalPrice: null,  image: "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&q=80", description: "Heavy-duty front stabilizer links, sold as a pair." },
  { id: 13, name: "Front Wheel Bearing Kit",        brand: "SKF",            category: "Suspension Parts", subcategory: "Wheel Bearings",    price: 5200,  originalPrice: 5800,  image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80", description: "Sealed wheel bearing kit with hub, direct fit for most Japanese saloons." },
  { id: 14, name: "Rubber Arm Bush (Pair)",         brand: "Febest",         category: "Suspension Parts", subcategory: "Rubber Arm Bushes", price: 1800,  originalPrice: null,  image: "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&q=80", description: "Front lower arm bushings, sold as a matched pair." },
  { id: 6,  name: "Ventilated Brake Discs (Pair)",  brand: "Brembo",         category: "Suspension Parts", subcategory: "Brake Discs",       price: 16500, originalPrice: 18000, image: "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=600&q=80", description: "Performance ventilated discs for improved cooling under braking." },
  { id: 5,  name: "Ceramic Brake Pads (Front)",     brand: "Bosch",          category: "Service Parts",    subcategory: "Brake Pads",        price: 6000,  originalPrice: 6500,  image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&q=80", description: "Low-dust ceramic compound, quiet and long-lasting." },
  { id: 7,  name: "Engine Oil Filter",              brand: "Mann",           category: "Service Parts",    subcategory: "Oil Filter",        price: 1500,  originalPrice: null,  image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&q=80", description: "OEM-spec spin-on oil filter." },
  { id: 8,  name: "Cabin & Air Filter Combo",       brand: "Bosch",          category: "Service Parts",    subcategory: "Air Filters",       price: 3200,  originalPrice: 3500,  image: "https://images.unsplash.com/photo-1552930219-29d889622d2e?w=600&q=80", description: "High-flow engine air filter with matching cabin filter." },
  { id: 9,  name: "Iridium Spark Plugs (Set of 4)", brand: "NGK",            category: "Service Parts",    subcategory: "Spark Plugs",       price: 5500,  originalPrice: 6000,  image: "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&q=80", description: "Long-life iridium tips for smoother idle and better fuel economy." },
  { id: 15, name: "Synthetic Engine Oil 5W-30 (4L)",brand: "Total",          category: "Service Parts",    subcategory: "Engine Oil",        price: 7200,  originalPrice: 7800,  image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&q=80", description: "Fully synthetic 5W-30, ILSAC GF-6A rated. 4 litre container." },
  { id: 12, name: "Ignition Coil Pack",             brand: "Delphi",         category: "Service Parts",    subcategory: "Ignition Coils",    price: 5000,  originalPrice: 5500,  image: "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=600&q=80", description: "Heavy-duty coil pack, direct OEM replacement." },
  { id: 11, name: "Oxygen (O2) Lambda Sensor",      brand: "Denso",          category: "Engine Parts",     subcategory: "Sensors",           price: 9500,  originalPrice: null,  image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80", description: "Direct-fit lambda sensor for accurate fuel mixture control." },
  { id: 17, name: "Water Pump Assembly",            brand: "Aisin",          category: "Engine Parts",     subcategory: "Water Pumps",       price: 8800,  originalPrice: 9500,  image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&q=80", description: "Complete water pump assembly, gasket included." },
  { id: 18, name: "Timing Belt Tensioner Roller",   brand: "Febi",           category: "German Parts",     subcategory: "",                  price: 6200,  originalPrice: 6999,  image: "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&q=80", description: "OEM-spec tensioning roller for German engines." },
  { id: 19, name: "Front Suspension Strut",         brand: "Sachs",          category: "German Parts",     subcategory: "",                  price: 15600, originalPrice: 17000, image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&q=80", description: "Complete front strut assembly for German saloons and SUVs." },
  { id: 10, name: "Maintenance-Free Battery (65Ah)",brand: "Bosch",          category: "Car Batteries",    subcategory: "",                  price: 13000, originalPrice: 13500, image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&q=80", description: "Sealed DIN battery, no top-up required." },
  { id: 16, name: "NS60 Chloride Exide Battery",    brand: "Chloride Exide", category: "Car Batteries",    subcategory: "",                  price: 8000,  originalPrice: 8500,  image: "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=600&q=80", description: "Reliable starter battery for popular Japanese saloons." },
  { id: 20, name: "Toyota Full Service Kit",        brand: "Assorted",       category: "Service Kits",     subcategory: "Japanese Cars",     price: 9000,  originalPrice: 10000, image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&q=80", description: "Complete service kit: oil filter, air filter, fuel filter and engine oil bundled together." },
  { id: 21, name: "195/65R15 Car Tyre",             brand: "Petromax",       category: "Tyres",            subcategory: "",                  price: 7000,  originalPrice: 7800,  image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&q=80", description: "Reliable all-round tyre size 195/65R15, price inclusive of professional fitment." }
];

// Reads the live catalogue file. Synchronous on purpose so every
// page can call loadProducts() the same simple way it always did.
function fetchLiveProducts() {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'products-data.json', false);
    xhr.send(null);
    if (xhr.status === 200 || xhr.status === 0) {
      return JSON.parse(xhr.responseText);
    }
  } catch (e) {
    console.warn('Could not load js/products-data.json (are you opening this file directly instead of through a server?). Using built-in defaults instead.', e);
  }
  return DEFAULT_PRODUCTS.slice();
}

// Used by Home, Shop, and every public page — always the live,
// published catalogue that every visitor sees identically.
function loadProducts() {
  return fetchLiveProducts();
}

// Percentage discount, rounded — returns 0 if there's no valid original price.
function discountPercent(product) {
  if (!product.originalPrice || product.originalPrice <= product.price) return 0;
  return Math.round((1 - product.price / product.originalPrice) * 100);
}

// --- Admin-only draft workflow below ---

// Admin's private working copy, saved only in this browser.
function loadDraftProducts() {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Could not read draft, starting a fresh one from the live catalogue.', e);
  }
  return fetchLiveProducts();
}

function saveDraftProducts(products) {
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(products));
}

// Throws away local admin edits and starts over from the live file.
function discardDraft() {
  localStorage.removeItem(DRAFT_STORAGE_KEY);
}

function nextProductId(products) {
  return products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
}
