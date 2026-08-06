/* ============================================================
   SHOP CONFIG — edit this file to set up your store
   No coding needed below, just change the values in quotes.
   ============================================================ */

const SHOP_CONFIG = {
  shopName: "KILO AUTO SPARES LTD.",
  tagline: "Genuine & Aftermarket Auto Parts",

  // Where orders get sent. Use full international format, no + or spaces.
  // Example: Kenya number 0712 345 678 -> "254712345678"
  whatsappNumber: "254725789415",

  // Orders will also be offered as an email option
  orderEmail: "orders@yourshop.shop",

  currencySymbol: "KSh",

  // Shown in the footer
  contactPhone: "+254 725 789415",
  contactAddress: "Enterprise Road, Industrial Area, Nairobi",

  // Aisle order — controls the order categories appear on the page.
  // You can also add/remove categories from the "Manage Store" admin
  // page (admin.html) without touching this file — this list is just
  // the starting point / factory default.
  categoryOrder: [
    "Brakes",
    "Engine",
    "Suspension",
    "Electrical",
    "Filters",
    "Lighting",
    "Body & Exterior",
    "Cooling System",
    "Oils & Fluids",
    "Bearings"
  ],

  // Vehicle brands you deal in. Shown as filter chips on the site and
  // as the brand dropdown in admin.html. Also editable from the admin
  // page — this list is just the starting point / factory default.
  brands: [
    "Toyota",
    "Nissan",
    "Honda",
    "Mazda",
    "Mitsubishi",
    "Subaru",
    "Suzuki",
    "Universal"
  ],

  // ------------------------------------------------------------
  // ADMIN PANEL PASSWORD (protects admin.html — the "Manage Store"
  // page where you add/edit/delete parts and upload photos).
  //
  // IMPORTANT — read this: this is a simple lock, not real security.
  // Anyone who views this file's source (or your GitHub repo, since
  // it's public) can read this password in plain text. It's enough
  // to stop a random customer from stumbling into your admin page,
  // but it will NOT stop someone determined to look at your code.
  // Don't use a password here that you use anywhere else.
  // ------------------------------------------------------------
  adminPassword: "kilo2026"
};
