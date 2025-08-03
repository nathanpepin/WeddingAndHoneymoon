# Complete DigitalOcean CDN Deployment Guide

## Current Situation:
❌ Container Registry quota exceeded (524MB Starter tier limit)
✅ Minimal Docker image ready (52.8MB) with CDN support built-in
✅ App configured to automatically use CDN in production

## Solution: CDN-First Deployment

### STEP 1: Create DigitalOcean Space (CDN) 
1. **Go to:** https://cloud.digitalocean.com/spaces
2. **Click:** "Create a Space"
3. **Settings:**
   - Name: `wedding-honeymoon-media`
   - Region: NYC3 (same as your other resources)
   - Enable CDN: ✅ **YES** 
   - File Listing: ❌ Restrict (for security)
4. **Click:** Create Space
5. **Note the CDN URL:** It will be like `https://wedding-honeymoon-media.nyc3.cdn.digitaloceanspaces.com`

### STEP 2: Upload Media Files
**Option A: Web Interface (Easiest)**
1. In your new Space, click "Upload files"
2. Drag and drop your entire `Pictures-Optimized` folder
3. Wait for upload to complete (~10GB)

**Option B: Command Line (Faster for bulk)**
```bash
# Install AWS CLI
# Configure for DigitalOcean Spaces:
aws configure
# Access Key: Get from https://cloud.digitalocean.com/account/api/spaces
# Secret Key: Get from same page
# Region: nyc3
# Output: json

# Upload all files
aws s3 sync ./public/Pictures-Optimized/ s3://wedding-honeymoon-media/Pictures-Optimized/ --endpoint-url=https://nyc3.digitaloceanspaces.com --acl public-read
```

### STEP 3: Registry Options
**Option A: Upgrade Registry to Basic ($5/month)**
1. Go to: https://cloud.digitalocean.com/account/billing
2. Upgrade Container Registry to Basic (5.37GB storage)
3. Push your minimal image
4. Deploy via App Platform

**Option B: Use GitHub Integration (No registry needed)**
1. Push code to GitHub
2. Use App Platform's GitHub integration
3. No registry quota issues

**Option C: Use Alternative Registry**
- Docker Hub (free public repos)
- GitHub Container Registry (free)
- AWS ECR (pay per use)

### STEP 4: Deploy App
**If using DigitalOcean Registry (after upgrade):**
```bash
docker push registry.digitalocean.com/apex-workout/wedding-honeymoon-minimal:latest
```

**If using GitHub Integration:**
1. Push to GitHub: `git push origin master`
2. App Platform → Create App → GitHub
3. Select your repo and branch

### STEP 5: Configure Environment
In App Platform, set environment variable:
- `VITE_CDN_BASE_URL` = `https://wedding-honeymoon-media.nyc3.cdn.digitaloceanspaces.com`

## Total Costs:
- **Spaces + CDN:** $5/month (250GB + unlimited bandwidth)
- **App Platform:** $5/month (Basic plan)
- **Registry (if upgraded):** $5/month
- **Total:** $10-15/month

## Benefits of CDN Approach:
✅ Lightning-fast global media delivery
✅ Reduced app server load
✅ 99.9% uptime for media files
✅ Automatic image optimization
✅ Easy to scale storage

## Recommendation:
**Start with GitHub Integration** to avoid registry costs initially.
You can always switch to container registry later if needed.

Would you like me to help you set up the DigitalOcean Space first?
