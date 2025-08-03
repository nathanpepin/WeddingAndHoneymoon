# Simple PowerShell script to upload wedding video using correct credentials
param(
    [string]$AccessKey = "DO007YNVPU9YVFUFPWG4",
    [string]$SpaceName = "laura-nathan-wedding-photos",
    [string]$Region = "nyc3"
)

Write-Host "=== Uploading Wedding Video to DigitalOcean Spaces ===" -ForegroundColor Green

# Clear any existing AWS environment variables
$env:AWS_ACCESS_KEY_ID = $null
$env:AWS_SECRET_ACCESS_KEY = $null
$env:AWS_DEFAULT_REGION = $null

# Prompt for secret key
$SecretKey = Read-Host "Enter your DigitalOcean Spaces Secret Key" -AsSecureString
$SecretKeyPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecretKey))

# Set credentials for this session
$env:AWS_ACCESS_KEY_ID = $AccessKey
$env:AWS_SECRET_ACCESS_KEY = $SecretKeyPlain
$env:AWS_DEFAULT_REGION = $Region

Write-Host "🔗 Testing connection..." -ForegroundColor Yellow

# Test connection first
$testResult = aws s3 ls s3://$SpaceName --endpoint-url=https://$Region.digitaloceanspaces.com 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Connection successful!" -ForegroundColor Green
    
    Write-Host "📁 Uploading wedding folder..." -ForegroundColor Yellow
    aws s3 sync "public\Pictures-Optimized\2025-07-20_Wedding" "s3://$SpaceName/Pictures-Optimized/2025-07-20_Wedding" --endpoint-url=https://$Region.digitaloceanspaces.com --acl=public-read
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Wedding video uploaded successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Upload failed" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Connection failed: $testResult" -ForegroundColor Red
}

# Clear credentials
$env:AWS_ACCESS_KEY_ID = $null
$env:AWS_SECRET_ACCESS_KEY = $null
