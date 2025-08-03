# Quick setup and upload script for DigitalOcean Spaces

Write-Host "=== DigitalOcean Spaces Upload Setup ===" -ForegroundColor Green
Write-Host ""

# Check if AWS CLI is installed
$awsInstalled = $false
try {
    $awsVersion = aws --version 2>$null
    if ($awsVersion) {
        Write-Host "✅ AWS CLI is already installed: $awsVersion" -ForegroundColor Green
        $awsInstalled = $true
    }
} catch {
    # AWS CLI not found
    $awsInstalled = $false
}

if (-not $awsInstalled) {
    Write-Host "❌ AWS CLI not found. Installing now..." -ForegroundColor Yellow
    Write-Host ""
    
    # Try to install via winget first (Windows 10/11)
    try {
        Write-Host "📦 Attempting to install AWS CLI via winget..." -ForegroundColor Yellow
        winget install Amazon.AWSCLI
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ AWS CLI installed successfully!" -ForegroundColor Green
            Write-Host "🔄 Please restart PowerShell and run this script again." -ForegroundColor Yellow
            exit 0
        }
    } catch {
        Write-Host "⚠️ Winget installation failed, trying chocolatey..." -ForegroundColor Yellow
    }
    
    # Try chocolatey
    try {
        choco install awscli -y
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ AWS CLI installed via Chocolatey!" -ForegroundColor Green
            Write-Host "🔄 Please restart PowerShell and run this script again." -ForegroundColor Yellow
            exit 0
        }
    } catch {
        Write-Host "⚠️ Chocolatey not found or failed." -ForegroundColor Yellow
    }
    
    # Manual installation instructions
    Write-Host ""
    Write-Host "❌ Automatic installation failed. Please install manually:" -ForegroundColor Red
    Write-Host ""
    Write-Host "Option 1 - Download MSI installer:" -ForegroundColor Yellow
    Write-Host "https://awscli.amazonaws.com/AWSCLIV2.msi" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Option 2 - Use Chocolatey (if you have it):" -ForegroundColor Yellow
    Write-Host "choco install awscli" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 3 - Use winget (Windows 10/11):" -ForegroundColor Yellow
    Write-Host "winget install Amazon.AWSCLI" -ForegroundColor White
    Write-Host ""
    Write-Host "After installation, restart PowerShell and run:" -ForegroundColor Green
    Write-Host "./upload-media-to-spaces.ps1" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "🔑 Now we need your DigitalOcean Spaces API credentials" -ForegroundColor Yellow
Write-Host "Get them from: https://cloud.digitalocean.com/account/api/spaces" -ForegroundColor Blue
Write-Host ""

# Run the main upload script
if (Test-Path "./upload-media-to-spaces.ps1") {
    ./upload-media-to-spaces.ps1
} else {
    Write-Host "❌ Upload script not found. Please make sure upload-media-to-spaces.ps1 exists." -ForegroundColor Red
}
