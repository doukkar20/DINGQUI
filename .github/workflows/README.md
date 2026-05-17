# Deployment workflow

`deploy.yml` runs automatically on every push to `main` and publishes the static Next.js export to the `gh-pages` branch.

It first runs:

- `npm ci`
- `npm run lint`
- `npm run build`

Then it force-pushes the `out` folder to the `gh-pages` branch. No Vercel secrets are required.

In GitHub, set **Settings -> Pages -> Build and deployment -> Source** to **Deploy from a branch**, then choose:

- Branch: `gh-pages`
- Folder: `/ (root)`
