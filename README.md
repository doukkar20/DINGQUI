# DINGQI GROS

Luxury black and gold e-commerce website for DingQi professional tools. The catalog is imported from DingQi product URLs, images are downloaded locally, and orders/reservations are sent to WhatsApp.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Cheerio scraper with Playwright fallback
- Local JSON product catalog
- Local product images in `public/products`

## Install

```bash
npm install
```

## Import DingQi products

The importer reads URLs from `urls.txt`, visits each DingQi product page, extracts product title, category, images, description, specifications, product ID, and source URL, then writes:

- `data/products.json`
- `public/products/<product-id>/...`
- `logs/errors.txt`

The importer uses Cheerio first and falls back to Playwright if a page needs browser rendering. Install the fallback browser once when needed:

```bash
npm run playwright:install
```

Run:

```bash
npm run import:products
```

The current catalog has already been imported from the requested 21 DingQi URLs. If `logs/errors.txt` is empty, the import completed without failures.

## Start the website

```bash
npm run dev
```

Then open the local URL shown by Next.js, usually `http://localhost:3000`.

## Edit prices

Prices are intentionally empty. To add or change a price, edit `data/products.json`:

```json
{
  "title": "CORDLESS BLOWER JE08001",
  "price": "Quote on request"
}
```

Leave `"price": ""` to show `Price on request`. No importer code invents prices.

## WhatsApp orders

WhatsApp orders are sent to `+212626018950` (`0626-018950`) with a pre-filled Darija message:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

The order form sends customer details, product name, quantity, notes, and cart lines when available.

## Build for production

```bash
npm run lint
npm run build
npm run start
```

## Deploy on Vercel

1. Push the project to GitHub, GitLab, or Bitbucket.
2. Import the repository in Vercel.
3. Add environment variables:
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy.

For catalog updates after deployment, run `npm run import:products`, commit the updated `data/products.json` and `public/products` files, then redeploy.
