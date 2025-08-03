# Simple upload script for DigitalOcean Spaces
param(
    [string]$SpaceName = "laura-nathan-wedding-photos",
    [string]$Region = "nyc3"
)

Write-Host "=== DigitalOcean Spaces Upload ===" -ForegroundColor Green
Write-Host ""

# Check if AWS CLI is installed
Write-Host "🔍 Checking for AWS CLI..." -ForegroundColor Yellow
$awsCommand = Get-Command aws -ErrorAction SilentlyContinue

if ($null -eq $awsCommand) {
    Write-Host "❌ AWS CLI not found." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install AWS CLI first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://awscli.amazonaws.com/AWSCLIV2.msi" -ForegroundColor Blue
    Write-Host "2. Or use chocolatey: choco install awscli" -ForegroundColor Blue
    Write-Host "3. Or use winget: winget install Amazon.AWSCLI" -ForegroundColor Blue
    Write-Host ""
    Write-Host "After installation, restart PowerShell and run this script again." -ForegroundColor Green
    exit 1
}

$awsVersion = aws --version
Write-Host "✅ AWS CLI found: $awsVersion" -ForegroundColor Green
Write-Host ""

# Check source directory
$sourcePath = "./public/Pictures-Optimized"
if (-not (Test-Path $sourcePath)) {
    Write-Host "❌ Source directory not found: $sourcePath" -ForegroundColor Red
    Write-Host "Please make sure your Pictures-Optimized folder exists in the public directory." -ForegroundColor Yellow
    exit 1
}

# Get directory size
$items = Get-ChildItem -Path $sourcePath -Recurse
$totalSize = ($items | Measure-Object -Property Length -Sum).Sum
$totalSizeGB = [math]::Round($totalSize / 1GB, 2)
$fileCount = $items.Count

Write-Host "📁 Source: $sourcePath" -ForegroundColor Cyan
Write-Host "📊 Files: $fileCount" -ForegroundColor Cyan
Write-Host "📊 Size: $totalSizeGB GB" -ForegroundColor Cyan
Write-Host ""

# Get credentials
Write-Host "🔑 DigitalOcean Spaces API Credentials" -ForegroundColor Yellow
Write-Host "Get your credentials from: https://cloud.digitalocean.com/account/api/spaces" -ForegroundColor Blue
Write-Host ""

$accessKey = Read-Host "Enter your Spaces Access Key"
$secureSecretKey = Read-Host "Enter your Spaces Secret Key" -AsSecureString
$secretKey = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureSecretKey))

Write-Host ""
Write-Host "⚙️ Configuring AWS CLI..." -ForegroundColor Yellow

# Set environment variables
$env:AWS_ACCESS_KEY_ID = $accessKey
$env:AWS_SECRET_ACCESS_KEY = $secretKey
$env:AWS_DEFAULT_REGION = $Region

# Test connection
Write-Host "🔗 Testing connection..." -ForegroundColor Yellow
$endpoint = "https://$Region.digitaloceanspaces.com"

try {
    aws s3 ls s3://$SpaceName --endpoint-url=$endpoint | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Connection successful!" -ForegroundColor Green
    } else {
        Write-Host "❌ Connection failed. Please check your credentials and space name." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Connection failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Starting upload to s3://$SpaceName/Pictures-Optimized" -ForegroundColor Green
Write-Host "⏱️ Estimated time: 30-60 minutes for $totalSizeGB GB" -ForegroundColor Yellow
Write-Host ""

# Start upload
$startTime = Get-Date
aws s3 sync $sourcePath s3://$SpaceName/Pictures-Optimized --endpoint-url=$endpoint --acl public-read

if ($LASTEXITCODE -eq 0) {
    $endTime = Get-Date
    $duration = $endTime - $startTime
    Write-Host ""
    Write-Host "✅ Upload completed!" -ForegroundColor Green
    Write-Host "⏱️ Duration: $($duration.ToString('hh\:mm\:ss'))" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Your media is now available at:" -ForegroundColor Cyan
    Write-Host "https://$SpaceName.$Region.digitaloceanspaces.com/Pictures-Optimized" -ForegroundColor Blue
} else {
    Write-Host "❌ Upload failed!" -ForegroundColor Red
    exit 1
}

# Clean up
Remove-Item Env:AWS_ACCESS_KEY_ID -ErrorAction SilentlyContinue
Remove-Item Env:AWS_SECRET_ACCESS_KEY -ErrorAction SilentlyContinue
Remove-Item Env:AWS_DEFAULT_REGION -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "✨ Next: Deploy your app via GitHub to DigitalOcean App Platform!" -ForegroundColor Green
