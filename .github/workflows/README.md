# Deployment workflow

`deploy.yml` runs automatically on every push to `main` and publishes the static Next.js export to GitHub Pages.

It first runs:

- `npm ci`
- `npm run lint`
- `npm run build`

Then it uploads the `out` folder and deploys it with GitHub Pages. No Vercel secrets are required.

The workflow passes `enablement: true` to `actions/configure-pages` so the first run can enable Pages for the repository when it has not been configured yet.
