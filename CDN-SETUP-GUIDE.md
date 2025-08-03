# DigitalOcean Spaces CDN Setup Guide

## Step 1: Create a DigitalOcean Space
1. Go to: https://cloud.digitalocean.com/spaces
2. Click "Create a Space"
3. Choose region: NYC3 (same as your apps)
4. Name: `wedding-honeymoon-media`
5. Enable CDN: ✅ Yes
6. Restrict File Listing: ✅ Yes (for security)
7. Create Space

## Step 2: Upload Media Files
You can upload via:
- Web interface (drag & drop)
- Command line (s3cmd or aws cli)
- Or use the upload script below

## Step 3: Get CDN URL
After creation, you'll get a CDN URL like:
`https://wedding-honeymoon-media.nyc3.cdn.digitaloceanspaces.com`

## Step 4: Update Your App
- Modify mediaData.js to use CDN URLs
- Deploy minimal Docker image
- Test media loading

## Cost: $5/month for 250GB storage + CDN bandwidth
