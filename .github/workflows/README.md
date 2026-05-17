# Deployment workflow

`deploy.yml` runs automatically on every push to `main` and publishes the static Next.js export to GitHub Pages.

It first runs:

- `npm ci`
- `npm run lint`
- `npm run build`

Then it uploads the `out` folder and deploys it with GitHub Pages. No Vercel secrets are required.
