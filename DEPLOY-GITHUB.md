# Deploying to GitHub Pages with your `.shop` domain

## 1. Edit the CNAME file
Open the `CNAME` file (no extension, sits at the root of this project) and
replace the placeholder with your real domain, exactly, no `https://` and
no trailing slash:

```
torqueandco.shop
```

## 2. Push everything to a GitHub repo
- Create a new repo on GitHub (public, unless you're on a paid plan).
- Push all these files so `index.html` and `CNAME` sit at the **root** of
  the repo (not inside a subfolder).

```bash
git init
git add .
git commit -m "Launch auto parts shop"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

## 3. Turn on GitHub Pages
- In the repo: **Settings → Pages**
- Under "Build and deployment", set **Source** to `Deploy from a branch`
- Branch: `main`, folder: `/ (root)` → Save

## 4. Point your domain's DNS at GitHub
At your domain registrar (wherever you bought the `.shop` domain), add:

**For the apex domain** (`torqueandco.shop`) — four A records, all pointing
to GitHub Pages:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**For the www subdomain** (`www.torqueandco.shop`) — one CNAME record:
```
YOUR-USERNAME.github.io
```

DNS changes can take anywhere from a few minutes to a few hours to take
effect.

## 5. Confirm the custom domain in GitHub
- Back in **Settings → Pages**, under "Custom domain", enter your domain
  again and save (GitHub checks it matches the `CNAME` file).
- Once DNS has propagated, tick **Enforce HTTPS** — GitHub issues a free
  SSL certificate automatically. This can take a little while to appear
  as an option after DNS first resolves.

## 6. Verify
Visit `https://torqueandco.shop` — you should see your store, padlock and
all. Also check `https://torqueandco.shop/admin.html` — that's your
"Manage Store" admin page; keep the link handy since it isn't advertised
anywhere on the shop page except a small "Manage store" link in the footer.

## Publishing admin changes

Day-to-day, you'll add/edit/delete parts through `admin.html` rather than
editing files by hand. Those changes save in your browser instantly, but
**they don't reach real visitors until you publish them**, because this
site has no server — GitHub only shows visitors whatever is in your repo.

To publish:

1. In `admin.html`, click **Download updated files**. This downloads a
   new `products.js` and, if you changed brands or categories, a new
   `config.js`.
2. On GitHub, open your repo, click into `products.js` (and `config.js`
   if downloaded), click the pencil/edit icon, delete the old contents,
   and paste in the new file's contents — or, if you're comfortable with
   git, just replace the files locally and push:

```bash
git add products.js config.js
git commit -m "Update parts catalog"
git push
```

3. GitHub Pages rebuilds automatically — changes are usually live within
   a minute or two.

This "download, then push" step is the trade-off for a store that costs
nothing to run and needs no server. If you'd rather changes go live the
instant you save them, from any device, that needs a real backend (for
example Firebase's free tier) — ask and I can help you set that up.

## After that: get it listed on Google
- Go to Google Search Console, verify the domain, submit it.
- If you have a physical shop customers visit, set up a free Google
  Business Profile too — this doesn't fit a delivery-only/online-only
  business, which should lean on Google Merchant Center + Shopping ads
  instead.

That's it — same files, same design, now on your own domain.
