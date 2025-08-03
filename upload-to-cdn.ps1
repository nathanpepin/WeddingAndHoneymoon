# Upload media to DigitalOcean Spaces
# You'll need to install and configure s3cmd or use the web interface

# Install s3cmd (if using command line upload)
# pip install s3cmd

# Configure s3cmd for DigitalOcean Spaces
# s3cmd --configure
# When prompted:
# - Access Key: Get from https://cloud.digitalocean.com/account/api/spaces
# - Secret Key: Get from same location above  
# - Default Region: nyc3
# - S3 Endpoint: nyc3.digitaloceanspaces.com
# - DNS-style bucket+hostname:port template: %(bucket)s.nyc3.digitaloceanspaces.com

# Upload all media files (run from project root)
# s3cmd sync ./public/Pictures-Optimized/ s3://wedding-honeymoon-media/Pictures-Optimized/ --acl-public

# Or upload via web interface:
# 1. Go to your Space in DigitalOcean control panel
# 2. Drag and drop the Pictures-Optimized folder
# 3. Set permissions to public-read for each folder

Write-Host "CDN Setup Options:"
Write-Host "1. Use DigitalOcean web interface (easiest)"
Write-Host "2. Use s3cmd for bulk upload (faster for large files)"
Write-Host "3. Use AWS CLI configured for DO Spaces"
Write-Host ""
Write-Host "After upload, update the CDN_BASE_URL in your app"
