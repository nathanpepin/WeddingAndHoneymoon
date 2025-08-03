# PowerShell script to upload media files to DigitalOcean Spaces
# This script uses AWS CLI configured for DigitalOcean Spaces

param(
    [Parameter(Mandatory=$false)]
    [string]$AccessKey = "",
    
    [Parameter(Mandatory=$false)]
    [string]$SecretKey = "",
    
    [Parameter(Mandatory=$false)]
    [string]$SpaceName = "laura-nathan-wedding-photos",
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "nyc3",
    
    [Parameter(Mandatory=$false)]
    [string]$SourcePath = "./public/Pictures-Optimized",
    
    [Parameter(Mandatory=$false)]
    [string]$DestinationPath = "Pictures-Optimized"
)

Write-Host "=== DigitalOcean Spaces Upload Script ===" -ForegroundColor Green
Write-Host ""

# Check if AWS CLI is installed
try {
    $awsVersion = aws --version
    Write-Host "✅ AWS CLI found: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "Download from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    Write-Host "Or install via chocolatey: choco install awscli" -ForegroundColor Yellow
    exit 1
}

# Check if source directory exists
if (-not (Test-Path $SourcePath)) {
    Write-Host "❌ Source directory not found: $SourcePath" -ForegroundColor Red
    Write-Host "Please make sure your Pictures-Optimized folder exists" -ForegroundColor Yellow
    exit 1
}

# Get directory size
$sourceSize = (Get-ChildItem -Path $SourcePath -Recurse | Measure-Object -Property Length -Sum).Sum
$sourceSizeGB = [math]::Round($sourceSize / 1GB, 2)
Write-Host "📁 Source directory: $SourcePath" -ForegroundColor Cyan
Write-Host "📊 Total size: $sourceSizeGB GB" -ForegroundColor Cyan
Write-Host ""

# If credentials not provided via parameters, prompt for them
if ([string]::IsNullOrEmpty($AccessKey) -or [string]::IsNullOrEmpty($SecretKey)) {
    Write-Host "🔑 DigitalOcean Spaces API Credentials Required" -ForegroundColor Yellow
    Write-Host "Get your credentials from: https://cloud.digitalocean.com/account/api/spaces" -ForegroundColor Yellow
    Write-Host ""
    
    if ([string]::IsNullOrEmpty($AccessKey)) {
        $AccessKey = Read-Host "Enter your Spaces Access Key"
    }
    
    if ([string]::IsNullOrEmpty($SecretKey)) {
        $SecretKey = Read-Host "Enter your Spaces Secret Key" -AsSecureString
        $SecretKey = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecretKey))
    }
}

Write-Host "⚙️ Configuring AWS CLI for DigitalOcean Spaces..." -ForegroundColor Yellow

# Configure AWS CLI for DigitalOcean Spaces
$env:AWS_ACCESS_KEY_ID = $AccessKey
$env:AWS_SECRET_ACCESS_KEY = $SecretKey
$env:AWS_DEFAULT_REGION = $Region

# Test connection
Write-Host "🔗 Testing connection to Space..." -ForegroundColor Yellow
try {
    $testResult = aws s3 ls s3://$SpaceName --endpoint-url=https://$Region.digitaloceanspaces.com 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Connection successful!" -ForegroundColor Green
    } else {
        Write-Host "❌ Connection failed: $testResult" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Connection failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Starting upload..." -ForegroundColor Green
Write-Host "Source: $SourcePath" -ForegroundColor Cyan
Write-Host "Destination: s3://$SpaceName/$DestinationPath" -ForegroundColor Cyan
Write-Host "Endpoint: https://$Region.digitaloceanspaces.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏱️ This may take 30-60 minutes for $sourceSizeGB GB..." -ForegroundColor Yellow
Write-Host ""

# Perform the sync
$startTime = Get-Date
try {
    aws s3 sync $SourcePath s3://$SpaceName/$DestinationPath --endpoint-url=https://$Region.digitaloceanspaces.com --acl public-read --progress
    
    if ($LASTEXITCODE -eq 0) {
        $endTime = Get-Date
        $duration = $endTime - $startTime
        Write-Host ""
        Write-Host "✅ Upload completed successfully!" -ForegroundColor Green
        Write-Host "⏱️ Total time: $($duration.ToString('hh\:mm\:ss'))" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Your media is now available at:" -ForegroundColor Cyan
        Write-Host "https://$SpaceName.$Region.digitaloceanspaces.com/$DestinationPath" -ForegroundColor Blue
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Deploy your app via GitHub to DigitalOcean App Platform" -ForegroundColor White
        Write-Host "2. Set environment variable: VITE_CDN_BASE_URL=https://$SpaceName.$Region.digitaloceanspaces.com" -ForegroundColor White
    } else {
        Write-Host "❌ Upload failed with exit code: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Upload failed: $_" -ForegroundColor Red
    exit 1
}

# Clean up environment variables
Remove-Item Env:AWS_ACCESS_KEY_ID -ErrorAction SilentlyContinue
Remove-Item Env:AWS_SECRET_ACCESS_KEY -ErrorAction SilentlyContinue
Remove-Item Env:AWS_DEFAULT_REGION -ErrorAction SilentlyContinue
