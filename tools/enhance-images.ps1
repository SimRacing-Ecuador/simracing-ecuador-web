param(
  [string]$InputDirectory = (Get-Location).Path,
  [string]$OutputDirectory = (Join-Path (Get-Location).Path 'optimized')
)

Add-Type -AssemblyName System.Drawing

$imageNames = @(
  'sim racing.png',
  'cover.png',
  'r3-bundle.png',
  'r3-base.png',
  'r3-wheel.png',
  'r3-pedals.png',
  'r3-compatibility.png',
  'infografia soporte.png',
  'simulador vuelo.png',
  'tripode-cockpit.png',
  'tripode-ajuste.png',
  'tripode-pies.png',
  'tripode-plegado.png',
  'tripode-volante.png'
)

New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null

function Get-Scale([int]$width, [int]$height) {
  $shortEdge = [Math]::Min($width, $height)
  if ($shortEdge -le 180) { return 4.0 }
  if ($shortEdge -le 600) { return 3.0 }
  if ($shortEdge -le 1100) { return 2.0 }
  return 1.5
}

foreach ($name in $imageNames) {
  $sourcePath = Join-Path $InputDirectory $name
  if (-not (Test-Path -LiteralPath $sourcePath)) {
    throw "Missing image: $sourcePath"
  }

  $source = [System.Drawing.Image]::FromFile($sourcePath)
  try {
    $scale = Get-Scale $source.Width $source.Height
    $width = [int][Math]::Round($source.Width * $scale)
    $height = [int][Math]::Round($source.Height * $scale)
    $hasAlpha = $source.PixelFormat.ToString() -match 'Argb|PArgb|Alpha'
    $targetExtension = if ($hasAlpha) { '.png' } else { '.jpg' }
    $targetName = [System.IO.Path]::GetFileNameWithoutExtension($name) + $targetExtension
    $targetPath = Join-Path $OutputDirectory $targetName
    $target = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
      $target.SetResolution(96, 96)
      $graphics = [System.Drawing.Graphics]::FromImage($target)
      try {
        $graphics.Clear([System.Drawing.Color]::Transparent)
        $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::GammaCorrected
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.DrawImage($source, 0, 0, $width, $height)
      } finally {
        $graphics.Dispose()
      }
      if ($hasAlpha) {
        $target.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
      } else {
        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $jpegQuality = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $jpegQuality.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]92)
        $target.Save($targetPath, $jpegCodec, $jpegQuality)
        $jpegQuality.Dispose()
      }
    } finally {
      $target.Dispose()
    }
    Write-Output ("{0} -> {1}x{2}" -f $name, $width, $height)
  } finally {
    $source.Dispose()
  }
}
