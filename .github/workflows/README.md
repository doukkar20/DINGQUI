# Deployment workflow

`deploy.yml` runs automatically on every push to `main`.

It first runs:

- `npm ci`
- `npm run lint`
- `npm run build`

Then it deploys to Vercel. Add these GitHub repository secrets before expecting the deploy job to succeed:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Optional repository variable:

- `NEXT_PUBLIC_SITE_URL`
