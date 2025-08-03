# GitHub + DigitalOcean Spaces Deployment Guide

## Overview
This approach separates your app code (GitHub) from media files (DigitalOcean Spaces):
- ✅ App code: Deployed via GitHub to DigitalOcean App Platform
- ✅ Media files: Stored in DigitalOcean Spaces with CDN
- ✅ Cost: ~$5-10/month total

## Step 1: Prepare Your Repository

### 1.1 Check Git Status
```bash
git status
```

### 1.2 Commit Current Changes
```bash
git add .
git commit -m "Add CDN support and prepare for GitHub deployment"
git push origin master
```

## Step 2: Create DigitalOcean Space for Media

### 2.1 Create Space
1. Go to: https://cloud.digitalocean.com/spaces
2. Click "Create a Space"
3. Settings:
   - **Name:** `wedding-honeymoon-media`
   - **Region:** NYC3
   - **Enable CDN:** ✅ YES
   - **File Listing:** ❌ Restrict
4. Click "Create Space"

### 2.2 Upload Media Files
**Option A: Web Interface**
1. In your Space dashboard, click "Upload files"
2. Drag your entire `public/Pictures-Optimized` folder
3. Wait for upload (~10GB may take 30-60 minutes)

**Option B: Command Line (Faster)**
```bash
# Install s3cmd
pip install s3cmd

# Configure s3cmd
s3cmd --configure
# When prompted:
# Access Key: Get from https://cloud.digitalocean.com/account/api/spaces
# Secret Key: Get from same page
# Default Region: nyc3
# S3 Endpoint: nyc3.digitaloceanspaces.com

# Upload files
s3cmd sync ./public/Pictures-Optimized/ s3://wedding-honeymoon-media/Pictures-Optimized/ --acl-public
```

### 2.3 Note Your CDN URL
After creation, your CDN URL will be:
`https://wedding-honeymoon-media.nyc3.cdn.digitaloceanspaces.com`

## Step 3: Deploy App via GitHub Integration

### 3.1 Via Web Interface (Recommended)
1. Go to: https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Choose "GitHub" as source
4. Select repository: `nathanpepin/WeddingAndHoneymoon`
5. Branch: `master`
6. Auto-deploy: ✅ Enable
7. Environment Variables:
   ```
   VITE_USE_CDN=true
   VITE_CDN_BASE_URL=https://wedding-honeymoon-media.nyc3.cdn.digitaloceanspaces.com
   VITE_APP_TITLE=Wedding & Honeymoon Gallery
   ```
8. Plan: Basic Static Site ($0/month for static sites!)

### 3.2 Via Command Line (Alternative)
```bash
doctl apps create github-app-spec.yaml
```

## Step 4: Test Deployment

1. Wait for build to complete (~5-10 minutes)
2. Get your app URL from the DigitalOcean dashboard
3. Test that:
   - ✅ App loads correctly
   - ✅ Images load from CDN
   - ✅ Videos play properly

## Step 5: Configure Custom Domain (Optional)

1. In App Platform, go to "Settings" → "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. Enable HTTPS (automatic)

## Cost Breakdown
- **Static Site Hosting:** $0/month (DigitalOcean App Platform free tier)
- **DigitalOcean Spaces:** $5/month (250GB storage + CDN)
- **Total:** $5/month

## Benefits
✅ No Docker quota issues
✅ Automatic deployments on git push
✅ Global CDN for fast media delivery
✅ Easy to maintain and update
✅ Cost-effective scaling
✅ 99.9% uptime

## Next Steps
1. Commit and push your code
2. Create the DigitalOcean Space
3. Upload media files
4. Deploy via App Platform

Ready to start? Let's push your code to GitHub first!
