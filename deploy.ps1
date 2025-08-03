# Wedding & Honeymoon Site - Docker Deployment Script
# Run this script after Docker Desktop is running

param(
    [Parameter(Mandatory=$true)]
    [string]$RegistryName,
    
    [Parameter(Mandatory=$false)]
    [string]$ImageTag = "latest"
)

Write-Host "🏔️ Deploying Wedding & Honeymoon Site to DigitalOcean" -ForegroundColor Green
Write-Host "Registry: $RegistryName" -ForegroundColor Yellow
Write-Host "Tag: $ImageTag" -ForegroundColor Yellow
Write-Host ""

# Check if Docker is running
try {
    docker version | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if doctl is installed
try {
    doctl version | Out-Null
    Write-Host "✅ doctl CLI is available" -ForegroundColor Green
} catch {
    Write-Host "❌ doctl CLI not found. Please install it from:" -ForegroundColor Red
    Write-Host "   https://github.com/digitalocean/doctl/releases" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🔨 Building Docker image..." -ForegroundColor Blue
docker build -t wedding-honeymoon .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed" -ForegroundColor Red
    exit 1
}

Write-Host "🏷️ Tagging image for registry..." -ForegroundColor Blue
$fullImageName = "registry.digitalocean.com/$RegistryName/wedding-honeymoon:$ImageTag"
docker tag wedding-honeymoon $fullImageName

Write-Host "🔐 Logging into DigitalOcean Container Registry..." -ForegroundColor Blue
doctl registry login
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Registry login failed" -ForegroundColor Red
    exit 1
}

Write-Host "📤 Pushing image to registry (this may take several minutes with large media files)..." -ForegroundColor Blue
docker push $fullImageName
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Image push failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Successfully deployed to Container Registry!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to: https://cloud.digitalocean.com/apps" -ForegroundColor White
Write-Host "2. Create App → Container Registry" -ForegroundColor White
Write-Host "3. Select registry: $RegistryName" -ForegroundColor White
Write-Host "4. Select image: wedding-honeymoon:$ImageTag" -ForegroundColor White
Write-Host "5. Configure:" -ForegroundColor White
Write-Host "   - Container Port: 80" -ForegroundColor White
Write-Host "   - HTTP Routes: /" -ForegroundColor White
Write-Host "   - Instance Size: Basic (\$5/month)" -ForegroundColor White
Write-Host ""
Write-Host "Your wedding site will be available at the provided App Platform URL!" -ForegroundColor Green

# Optional cleanup
$cleanup = Read-Host "Clean up local Docker images? (y/N)"
if ($cleanup -eq "y" -or $cleanup -eq "Y") {
    Write-Host "🧹 Cleaning up local images..." -ForegroundColor Blue
    docker rmi wedding-honeymoon
    docker rmi $fullImageName
    Write-Host "✅ Cleanup complete" -ForegroundColor Green
}
