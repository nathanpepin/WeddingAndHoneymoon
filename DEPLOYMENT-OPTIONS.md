# Quick Deployment Options for Wedding Gallery

## Option 1: GitHub Pages (Recommended - FREE)

1. **First, commit your current work:**
   ```bash
   git add .
   git commit -m "Add optimized media and minimal Docker setup"
   git push origin master
   ```

2. **Enable GitHub Pages:**
   - Go to: https://github.com/nathanpepin/WeddingAndHoneymoon/settings/pages
   - Source: "GitHub Actions"
   - The workflow file `.github/workflows/deploy.yml` is already created

3. **Your site will be live at:**
   `https://nathanpepin.github.io/WeddingAndHoneymoon/`

## Option 2: Netlify (EASIEST - Drag & Drop)

1. **Build your project locally:**
   ```bash
   npm run build
   ```

2. **Deploy:**
   - Go to: https://netlify.com
   - Drag the `dist` folder to the deploy area
   - Done! You'll get a random URL like `https://amazing-site-123456.netlify.app`

## Option 3: Vercel (FAST)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose "yes" for all questions
   - Done! You'll get a URL like `https://wedding-honeymoon-xyz.vercel.app`

## Option 4: DigitalOcean App Platform (Once quota clears)

1. **Wait for garbage collection to complete**
2. **Try pushing the minimal image again:**
   ```bash
   docker push registry.digitalocean.com/apex-workout/wedding-honeymoon-minimal:latest
   ```

## File Sizes Summary:
- Minimal Docker image: 52.8MB ✅
- All optimized videos: Under 100MB each ✅
- Total project size: ~10GB (fine for GitHub/Netlify/Vercel)

## Recommendation:
**Use Netlify drag-and-drop** for fastest deployment (5 minutes)
**Use GitHub Pages** for permanent free hosting with custom domain support

Both options support your optimized media files and will work perfectly!
