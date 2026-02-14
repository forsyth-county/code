# Deployment Guide for Code Forsyth

## GitHub Pages Deployment

### Option 1: Using GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./out
          
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v3
```

### Option 2: Manual Deployment

1. Build the project:
```bash
npm run build
```

2. The static files will be in the `out/` directory

3. Deploy the `out/` directory to your hosting service

### GitHub Pages Settings

1. Go to your repository settings
2. Navigate to **Pages**
3. Set source to **GitHub Actions** (if using Option 1)
4. Or upload the `out/` folder contents directly

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` directory with your domain
2. Configure DNS settings with your domain provider
3. Update `next.config.js` to remove the `/code` base path

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Production Build

```bash
# Build for production
npm run build

# The static site will be in the 'out' directory
```

## Environment Variables

No environment variables are required for basic deployment.

For custom configurations, create `.env.local`:

```
NEXT_PUBLIC_BASE_PATH=/your-repo-name
```

## Troubleshooting

### Issue: Assets not loading
- Check that `basePath` in `next.config.js` matches your repository name
- Ensure GitHub Pages is enabled in repository settings

### Issue: Pyodide not loading
- Pyodide loads from CDN, ensure it's not blocked by firewall
- Check browser console for CORS errors

### Issue: Build fails
- Clear cache: `rm -rf .next out node_modules`
- Reinstall: `npm install`
- Rebuild: `npm run build`

## Performance Tips

1. Pyodide (~30MB) loads on first visit to executor page
2. Monaco Editor loads dynamically
3. All pages are pre-rendered for fast initial load
4. Use browser caching for static assets

## Security

- All code execution happens in browser via WebAssembly
- No server-side code execution
- No user data is sent to external servers
- Code sharing uses URL hash (client-side only)
