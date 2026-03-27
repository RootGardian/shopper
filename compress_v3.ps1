Add-Type -AssemblyName System.Drawing
$folder = "c:\Users\alber\Documents\morocco_shopper\assets\img"
$files = Get-ChildItem -Path $folder -Include *.png,*.jpg,*.jpeg -Recurse

Write-Host "Standardisation des images: 960x1280 (Ratio 3:4) et JPEG 60%"

$jsFile = "c:\Users\alber\Documents\morocco_shopper\assets\js\products.js"
$jsContent = Get-Content $jsFile -Raw

$targetW = [float]960
$targetH = [float]1280

foreach ($file in $files) {
    Write-Host "Traitement de $($file.Name)..." -NoNewline
    try {
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        
        $newImg = New-Object System.Drawing.Bitmap([int]$targetW, [int]$targetH)
        $g = [System.Drawing.Graphics]::FromImage($newImg)
        
        # Remplir le fond d'abord 
        $brush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#faf9f6"))
        $g.FillRectangle($brush, 0, 0, [int]$targetW, [int]$targetH)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        
        # Cadrage pour garder le ratio d'aspect
        $ratioW = $targetW / $img.Width
        $ratioH = $targetH / $img.Height
        $ratio = if ($ratioW -lt $ratioH) { $ratioW } else { $ratioH }
        
        $drawW = [int]($img.Width * $ratio)
        $drawH = [int]($img.Height * $ratio)
        $drawX = [int](($targetW - $drawW) / 2)
        $drawY = [int](($targetH - $drawH) / 2)
        
        $g.DrawImage($img, $drawX, $drawY, $drawW, $drawH)
        
        $img.Dispose()
        $g.Dispose()
        $brush.Dispose()
        
        $newName = $file.Name -ireplace '\.png$','.jpg' -ireplace '\.jpeg$','.jpg'
        $newPath = Join-Path $file.Directory.FullName $newName
        
        $encoders = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()
        $jpgEncoder = $encoders | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $qualityParam = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]60)
        $encoderParams.Param[0] = $qualityParam
        
        $tmpPath = $newPath + ".tmp"
        $newImg.Save($tmpPath, $jpgEncoder, $encoderParams)
        $newImg.Dispose()
        
        if ($file.Name -ne $newName) {
            $oldNamePattern = [regex]::Escape($file.Name)
            $jsContent = [regex]::Replace($jsContent, $oldNamePattern, $newName)
        }
        
        Remove-Item -Path $file.FullName -Force
        Move-Item -Path $tmpPath -Destination $newPath -Force
        
        Write-Host " -> OK ($newName)" -ForegroundColor Green
    } catch {
        Write-Host " Erreur: $_" -ForegroundColor Red
        if ($null -ne $img) { $img.Dispose() }
    }
}

Set-Content -Path $jsFile -Value $jsContent
Write-Host "products.js mis a jour avec les chemins .jpg !"
