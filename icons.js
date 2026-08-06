/* ============================================================
   CATEGORY ICONS — original line-art SVGs, one per catalog
   category. Used on the home page category grid and as the
   placeholder graphic on product cards that have no uploaded
   photo yet. All hand-built here (no external/stock imagery),
   so there is nothing to license or attribute.
   ============================================================ */

const CATEGORY_ICONS = {
  "Brakes": `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="6"/><path d="M24 7v6M24 35v6M41 24h-6M13 24H7M35.5 12.5l-4.2 4.2M16.7 31.3l-4.2 4.2M35.5 35.5l-4.2-4.2M16.7 16.7l-4.2-4.2"/></svg>`,

  "Engine": `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="18" width="24" height="16" rx="1.5"/><path d="M30 22h6a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-6"/><path d="M12 18v-5h8v5M22 18v-5"/><path d="M11 34v4M17 34v4M23 34v4"/></svg>`,

  "Suspension": `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6l-4 4 4 4-4 4 4 4-4 4 4 4-4 4"/><path d="M14 6h8M14 42h8"/><path d="M30 10v28"/><rect x="27" y="10" width="6" height="6" rx="1"/><rect x="27" y="32" width="6" height="6" rx="1"/></svg>`,

  "Electrical": `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M26 4 10 26h10l-4 18 20-26H26l4-14z"/></svg>`,

  "Filters": `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 8h32l-11 16v14l-10 4V24L8 8z"/></svg>`,

  "Lighting": `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 6h10l7 12-7 12H17l-7-12 7-12z"/><path d="M24 18v6M28 34l3 8M20 34l-3 8"/></svg>`,

  "Body & Exterior": `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 30l3-10a4 4 0 0 1 3.8-2.7h22.4A4 4 0 0 1 39 20l3 10"/><path d="M6 30h36v6a2 2 0 0 1-2 2h-3v-4H11v4H8a2 2 0 0 1-2-2v-6z"/><circle cx="14" cy="30" r="3"/><circle cx="34" cy="30" r="3"/></svg>`,

  "Cooling System": `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="8" width="30" height="32" rx="2"/><path d="M16 8v32M24 8v32M32 8v32"/></svg>`,

  "Oils & Fluids": `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 6c6 8 11 14.8 11 21a11 11 0 1 1-22 0c0-6.2 5-13 11-21z"/><path d="M19 30a5 5 0 0 0 5 5"/></svg>`,

  "Bearings": `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="16"/><circle cx="24" cy="24" r="6"/><circle cx="24" cy="10" r="2.3" fill="currentColor" stroke="none"/><circle cx="35.9" cy="17" r="2.3" fill="currentColor" stroke="none"/><circle cx="35.9" cy="31" r="2.3" fill="currentColor" stroke="none"/><circle cx="24" cy="38" r="2.3" fill="currentColor" stroke="none"/><circle cx="12.1" cy="31" r="2.3" fill="currentColor" stroke="none"/><circle cx="12.1" cy="17" r="2.3" fill="currentColor" stroke="none"/></svg>`
};

/* Generic fallback wrench icon for any category without a specific match */
const CATEGORY_ICON_FALLBACK = `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M33 6a9 9 0 0 0-11.6 11.6L6 33v6l3 3 6-15.4A9 9 0 0 0 26.4 15L33 6z"/></svg>`;

/* Original generic car silhouette — used in the brand slider. Not a
   logo or trademark of any manufacturer, just a simple vehicle glyph
   paired with the brand's name as text. */
const CAR_ICON = `<svg viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 26l4-11a5 5 0 0 1 4.7-3h14.6a5 5 0 0 1 4.7 3l4 11"/><path d="M4 26h56v7a2 2 0 0 1-2 2h-4v-5H10v5H6a2 2 0 0 1-2-2v-7z"/><circle cx="16" cy="26" r="4"/><circle cx="48" cy="26" r="4"/><path d="M4 22h56"/></svg>`;

function categoryIcon(category) {
  return CATEGORY_ICONS[category] || CATEGORY_ICON_FALLBACK;
}
