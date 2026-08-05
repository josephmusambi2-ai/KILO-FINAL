# Kilo Auto Spares — Auto Parts Store (plain HTML/CSS/JS)

A static storefront: no server, no database, no monthly platform fee, and
no limit on how many parts you list. Orders are placed by sending your
cart to the shop via WhatsApp or email — there's no online payment built in.

It now includes an **admin page** (`admin.html`, linked as "Manage store"
in the footer) where you add, edit, and delete parts — including photos —
from a normal form, instead of editing code.

## Files

```
index.html      the shop page customers see
admin.html      the "Manage Store" admin page (password protected)
style.css       styling for the shop page
admin.css       styling for the admin page
config.js       YOUR SHOP SETTINGS — shop name, contact info, brands, categories
products.js     THE STARTER CATALOG — you'll mostly manage this via admin.html now
store.js        data layer shared by the shop and admin pages (read the comment at the top)
cart.js         cart logic (you shouldn't need to touch this)
main.js         search/filter logic for the shop page (you shouldn't need to touch this)
admin.js        logic for the admin page (you shouldn't need to touch this)
CNAME           your GitHub Pages custom domain
```

Everything sits flat in one folder — no subfolders — so it's easy to see
and upload as a whole.

## How the admin panel works — important, please read

This site has no server or database, so there's no way for a website to
"remember" what you typed in from any browser, for every visitor,
automatically. Here's how we made add/edit/delete/photos work anyway:

1. Open `admin.html`, log in with your admin password.
2. Add, edit, or delete parts, brands, or categories, upload photos — it
   all saves **in that browser**, instantly, and you can preview it by
   opening the shop page in a new tab.
3. When you're happy with your changes, click **Download updated files**.
   This downloads a fresh `products.js` (and `config.js`, if you changed
   brands or categories).
4. Replace those two files in your GitHub repo with the downloaded ones,
   and push. **That's the step that makes changes visible to real
   customers** — see `DEPLOY-GITHUB.md` → "Publishing admin changes".

Until step 4, your changes only exist in the browser you made them in —
that's normal, not a bug. If you use two different computers, do your
edits on one, then publish, so both end up in sync.

### About the admin password

`config.js` has an `adminPassword` field. It stops a random visitor from
wandering into your admin page, but since this is a public GitHub repo,
anyone who looks at the code can read it — it is **not** real security.
Don't reuse a password you use elsewhere. If you ever need real
multi-person, always-in-sync admin access (e.g. staff on different
devices editing stock at the same time), that needs an actual backend —
ask and I can help you set one up (e.g. with Firebase, which is free to
start).

## 1. Set up your shop details

Open `config.js` (or the Brands/Categories tabs in `admin.html`) and edit:

- `shopName`, `tagline`
- `whatsappNumber` — international format, digits only, no `+` (e.g. a Kenyan
  number `0712 345 678` becomes `254712345678`)
- `orderEmail` — where email orders go
- `contactPhone`, `contactAddress`
- `currencySymbol`
- `brands` — the vehicle brands you deal in (also editable in admin.html)
- `categoryOrder` — the "aisles" parts are grouped into (also editable in admin.html)
- `adminPassword` — see above

## 2. Manage your products

**Recommended:** use `admin.html` → the Parts tab. Add a part, pick brand
and category from the dropdowns, set price/stock, upload a photo, and
save. Click a part's **Edit** to change it, **Delete** to remove it. There
is no limit on how many parts you can list.

The site ships with a starter catalog in `products.js` covering common
categories (Brakes, Engine, Suspension, Electrical, Filters, Lighting,
Body & Exterior, Cooling System, Oils & Fluids, Bearings) across the
brands you deal in (Toyota, Nissan, Honda, Mazda, Mitsubishi, Subaru,
Suzuki) plus Universal items like oils, batteries, and brake fluid.

**Important:** the prices, stock counts, and exact fitment years in the
starter catalog are placeholders meant to show the shape of a real
listing — go through them in admin.html and correct anything that isn't
right for the parts you actually stock, and delete any you don't carry.

**No real product photos included on purpose.** Parts catalogs online are
almost always copyrighted photos we can't legally reuse, so the starter
catalog ships with plain placeholder tiles instead. Upload your own
photos (of your actual stock) through admin.html — it resizes and
compresses them automatically so they don't bloat the site.

If you'd rather edit `products.js` directly by hand, each part looks like:

```js
{
  id: "BRK-TOY-1001",
  name: "Front Brake Pad Set — Ceramic",
  brand: "Toyota",
  category: "Brakes",
  price: 3500,
  stock: 24,
  fitment: "Toyota Corolla 2010–2019, Toyota Auris 2012–2018",
  description: "Low-dust ceramic compound front brake pads.",
  image: "https://your-image-url.jpg"   // optional — omit for a placeholder tile
}
```

- `id` must be unique — this becomes the SKU shown on the "bin tag".
- `brand` should match one of the brands in `config.js` (or `"Universal"`).
- `category` must match one of the categories listed in `config.js`.

## 3. Test it locally

You can just double-click `index.html` to open it in a browser. For the
closest experience to a real server (recommended before you judge it),
run from inside the `shop` folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser (and
`http://localhost:8000/admin.html` for the admin page).

## 4. Put it on your `.shop` domain

See `DEPLOY-GITHUB.md` for step-by-step GitHub Pages instructions. Any
basic static web host also works (Netlify, Vercel, cPanel, etc.) — this
is just plain files.

## 5. Get listed on Google

- **Google Search Console**: verify your domain, submit it so Google knows
  the site exists — search.google.com/search-console
- **Google Business Profile**: if customers visit you in person, create a
  free listing at google.com/business. If you're online-order-only (no
  walk-in location), Google Business Profile isn't really meant for you
  and pure ecommerce listings sometimes get rejected — lean on Google
  Merchant Center + Google Ads/Shopping instead.
- **Basic SEO**: the page title and meta description are already set in
  `index.html`. Keep product names descriptive ("Front Brake Pad Set —
  Ceramic, Toyota Corolla") since that's what people actually search.
- **Google Merchant Center / Shopping ads**: this static-HTML setup doesn't
  auto-generate a product feed the way Shopify does. If you want to run
  Google Shopping ads later, that needs a product feed file (CSV/XML) — let
  me know and I can generate one from your `products.js` file.

## How orders actually work

1. Customer browses (search by name, part code, brand, or vehicle
   make/model/year), adds parts to cart (saved in their browser).
2. They click **Order via WhatsApp** or **Order via Email**.
3. WhatsApp opens a pre-filled message to your shop's number with the full
   itemized order and total. Email does the same as a draft email.
4. You confirm price, availability, and arrange payment (M-Pesa, cash,
   bank transfer — whatever you use) and delivery/pickup directly with the
   customer.

No payment gateway, no transaction fees, nothing to configure — but it also
means someone has to be checking WhatsApp/email to respond to orders.

## Extending this later

- A real always-in-sync backend (e.g. Firebase) so admin changes go live
  instantly for everyone, from any device, without the download-and-push
  step — worth it once you're updating stock daily or have staff helping
- A proper backend + online payments (Stripe, Pesapal, M-Pesa API) if you
  outgrow the manual WhatsApp/email flow
- A product feed (CSV/XML) for Google Shopping ads

Happy to help with any of these when you're ready.
