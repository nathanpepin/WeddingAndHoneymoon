# PowerShell script to identify missing media files
Write-Host "🔍 Scanning for missing media files..." -ForegroundColor Yellow

$basePath = "public\Pictures-Optimized"
$missingFiles = @()

# Check specific problematic files
$problematicFiles = @(
    @{Day="2025-07-31_Black Eggs_Ship_Fireworks"; Subfolder="1_Black Egg Monument"; File="20250731_105143.jpg"},
    @{Day="2025-08-01_Odawara Castle_Travel Back"; Subfolder="1_Odawara Castle"; File="20250801_112743.jpg"},
    @{Day="2025-08-01_Odawara Castle_Travel Back"; Subfolder="1_Odawara Castle"; File="20250801_112842.jpg"},
    @{Day="2025-08-01_Odawara Castle_Travel Back"; Subfolder="1_Odawara Castle"; File="20250801_113005.jpg"},
    @{Day="2025-08-01_Odawara Castle_Travel Back"; Subfolder="1_Odawara Castle"; File="20250801_113854.jpg"},
    @{Day="2025-08-01_Odawara Castle_Travel Back"; Subfolder="2_Travel Home"; File="20250801_180843.mp4"}
)

Write-Host "`n📅 Checking specific problematic files:" -ForegroundColor Cyan

foreach ($item in $problematicFiles) {
    $filePath = Join-Path $basePath $item.Day $item.Subfolder $item.File
    $exists = Test-Path $filePath
    
    if ($exists) {
        Write-Host "  ✅ Found: $($item.Day)/$($item.Subfolder)/$($item.File)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Missing: $($item.Day)/$($item.Subfolder)/$($item.File)" -ForegroundColor Red
        $missingFiles += $item
    }
}

Write-Host "`n📁 Checking what files actually exist in these folders:" -ForegroundColor Cyan

# Check Black Eggs folder
$blackEggsPath = Join-Path $basePath "2025-07-31_Black Eggs_Ship_Fireworks"
if (Test-Path $blackEggsPath) {
    Write-Host "`n🥚 Black Eggs folder contents:" -ForegroundColor Yellow
    Get-ChildItem $blackEggsPath -Recurse | Select-Object Name, FullName | Format-Table -AutoSize
} else {
    Write-Host "`n❌ Black Eggs folder not found!" -ForegroundColor Red
}

# Check Odawara Castle folder
$odawaraPath = Join-Path $basePath "2025-08-01_Odawara Castle_Travel Back"
if (Test-Path $odawaraPath) {
    Write-Host "`n🏯 Odawara Castle folder contents:" -ForegroundColor Yellow
    Get-ChildItem $odawaraPath -Recurse | Select-Object Name, FullName | Format-Table -AutoSize
} else {
    Write-Host "`n❌ Odawara Castle folder not found!" -ForegroundColor Red
}

Write-Host "`n📊 Summary:" -ForegroundColor Green
Write-Host "Missing files: $($missingFiles.Count)" -ForegroundColor $(if ($missingFiles.Count -gt 0) { "Red" } else { "Green" })

if ($missingFiles.Count -gt 0) {
    Write-Host "`n💡 Next steps:" -ForegroundColor Yellow
    Write-Host "1. The media data references files that don't exist" -ForegroundColor White
    Write-Host "2. Either find the missing files or remove them from media data" -ForegroundColor White
    Write-Host "3. Run the media data update script to clean up references" -ForegroundColor White
}
