# Deployment workflow

`deploy.yml` runs automatically on every source push to `main` and commits the static Next.js export into the repository root.

It first runs:

- `npm ci`
- `npm run lint`
- `npm run build`

Then it copies the `out` folder into the repository root and commits the generated static files with `[skip ci]`.

This matches GitHub Pages configured as:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`
