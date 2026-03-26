Add-Type -AssemblyName System.Drawing
$folder = "c:\Users\alber\Documents\morocco_shopper\assets\img"
$files = Get-ChildItem -Path $folder -Include *.png,*.jpg,*.jpeg -Recurse

Write-Host "Recherche des grandes images dans $folder..."

foreach ($file in $files) {
    if ($file.Length -gt 500000) { # Images faisant plus de 500 Ko
        Write-Host "Compression de $($file.Name)..." -NoNewline
        try {
            $img = [System.Drawing.Image]::FromFile($file.FullName)
            $maxWidth = 800.0
            $ratio = $maxWidth / $img.Width
            
            if ($ratio -lt 1) {
                $newWidth = [int]$maxWidth
                $newHeight = [int]($img.Height * $ratio)
                
                $newImg = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
                $g = [System.Drawing.Graphics]::FromImage($newImg)
                $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $g.DrawImage($img, 0, 0, $newWidth, $newHeight)
                
                $img.Dispose()
                $g.Dispose()
                
                $tempFile = $file.FullName + ".tmp"
                if ($file.Extension -match "(?i)\.png$") {
                    $newImg.Save($tempFile, [System.Drawing.Imaging.ImageFormat]::Png)
                } else {
                    $newImg.Save($tempFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)
                }
                $newImg.Dispose()
                
                Move-Item -Path $tempFile -Destination $file.FullName -Force
                Write-Host " [OK]" -ForegroundColor Green
            } else {
                $img.Dispose()
                Write-Host " [Ignoré] (déjà petite en largeur)" -ForegroundColor Yellow
            }
        } catch {
            Write-Host " [Erreur] $_" -ForegroundColor Red
        }
    }
}
Write-Host "Terminé !"
