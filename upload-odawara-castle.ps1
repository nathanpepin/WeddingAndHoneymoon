# Upload all Odawara Castle & Travel Back media files to DigitalOcean Spaces

$sourceBase = "c:\Users\Pepin\source\repos\WeddingAndHoneymoon\public\Pictures-Optimized\2025-08-01_Odawara Castle_Travel Back"
$bucket = "laura-nathan-wedding-photos"
$endpoint = "nyc3.digitaloceanspaces.com"

# Upload 0_Travel files
Write-Host "Uploading 0_Travel files..."
aws s3 cp "$sourceBase\0_Travel\20250801_090203.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/0_Travel/20250801_090203.jpg" --endpoint-url "https://$endpoint"

# Upload 1_Odawara Castle files
Write-Host "Uploading 1_Odawara Castle files..."
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_112038.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_112038.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_112743.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_112743.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_112842.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_112842.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_112907.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_112907.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_113005.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_113005.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_113854.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_113854.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_113909.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_113909.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_113944.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_113944.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_113945.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_113945.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_114011.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_114011.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_114627.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_114627.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_114635_01.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_114635_01.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_114635_02.mp4" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_114635_02.mp4" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_114635_03.mp4" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_114635_03.mp4" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_114635_04.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_114635_04.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_114635_99.mp4" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_114635_99.mp4" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_120825.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_120825.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_120839.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_120839.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_120852.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_120852.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_120939.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_120939.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_121009.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_121009.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\1_Odawara Castle\20250801_121125.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle/20250801_121125.jpg" --endpoint-url "https://$endpoint"

# Upload 2_Travel Home files
Write-Host "Uploading 2_Travel Home files..."
aws s3 cp "$sourceBase\2_Travel Home\20250801_180843.mp4" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/2_Travel Home/20250801_180843.mp4" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\2_Travel Home\20250801_181240.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/2_Travel Home/20250801_181240.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\2_Travel Home\20250801_181244.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/2_Travel Home/20250801_181244.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\2_Travel Home\20250801_181317.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/2_Travel Home/20250801_181317.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\2_Travel Home\20250801_181320.mp4" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/2_Travel Home/20250801_181320.mp4" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\2_Travel Home\20250801_181419.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/2_Travel Home/20250801_181419.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\2_Travel Home\20250801_181433.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/2_Travel Home/20250801_181433.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\2_Travel Home\20250801_185308.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/2_Travel Home/20250801_185308.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\2_Travel Home\20250801_191937.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/2_Travel Home/20250801_191937.jpg" --endpoint-url "https://$endpoint"
aws s3 cp "$sourceBase\2_Travel Home\20250801_215445.jpg" "s3://$bucket/Pictures-Optimized/2025-08-01_Odawara Castle_Travel Back/2_Travel Home/20250801_215445.jpg" --endpoint-url "https://$endpoint"

Write-Host "Upload complete!"
