# Upload all media to DigitalOcean Spaces
param(
    [string]$AccessKey = "DO007YNVPU9YVFUFPWG4",
    [string]$SpaceName = "laura-nathan-wedding-photos",
    [string]$Region = "nyc3"
)

Write-Host "=== Uploading All Media to DigitalOcean Spaces ===" -ForegroundColor Green

# Clear any existing AWS environment variables
$env:AWS_ACCESS_KEY_ID = $null
$env:AWS_SECRET_ACCESS_KEY = $null
$env:AWS_DEFAULT_REGION = $null

# Get secret key
$SecretKey = Read-Host "Enter your DigitalOcean Spaces Secret Key" -AsSecureString
$SecretKeyPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecretKey))

# Set credentials
$env:AWS_ACCESS_KEY_ID = $AccessKey
$env:AWS_SECRET_ACCESS_KEY = $SecretKeyPlain
$env:AWS_DEFAULT_REGION = $Region

Write-Host "🔗 Testing connection..." -ForegroundColor Yellow

# Test connection
$testResult = aws s3 ls s3://$SpaceName --endpoint-url=https://$Region.digitaloceanspaces.com 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Connection failed: $testResult" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Connection successful!" -ForegroundColor Green

# Get total size
$sourceSize = (Get-ChildItem -Path "public\Pictures-Optimized" -Recurse | Measure-Object -Property Length -Sum).Sum
$sourceSizeGB = [math]::Round($sourceSize / 1GB, 2)
Write-Host "📊 Total size to upload: $sourceSizeGB GB" -ForegroundColor Cyan

Write-Host "🚀 Starting full media upload..." -ForegroundColor Green
Write-Host "⏱️ This may take 30-60 minutes..." -ForegroundColor Yellow

$startTime = Get-Date

# Upload all media with progress
aws s3 sync "public\Pictures-Optimized" "s3://$SpaceName/Pictures-Optimized" --endpoint-url=https://$Region.digitaloceanspaces.com --acl=public-read

$endTime = Get-Date
$duration = $endTime - $startTime

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ All media uploaded successfully!" -ForegroundColor Green
    Write-Host "⏱️ Upload completed in: $($duration.ToString())" -ForegroundColor Cyan
} else {
    Write-Host "❌ Upload failed" -ForegroundColor Red
}

# Clear credentials
$env:AWS_ACCESS_KEY_ID = $null
$env:AWS_SECRET_ACCESS_KEY = $null
