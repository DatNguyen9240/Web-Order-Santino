# BUILD SCRIPT - Gom CSS + JS thanh bundle cho Web-Order-Santino
# Chay: .\build.ps1

$root = "$PSScriptRoot\src"

# ====== DANH SACH CSS ======
$cssFiles = @(
  "css\design-tokens.css",
  "css\global.css",
  "components\ui-utils\shared-dropdown.css",
  "components\data-combobox\combobox.css",
  "components\pagination\pagination.css"
)

# ====== DANH SACH JS (Core + Components + Data) ======
$jsFiles = @(
  "data\translations.js",
  "js\http.js",
  "js\services\product.service.js",
  "js\services\category.service.js",
  "js\services\order.service.js",
  "js\utils.js",
  "components\ui-utils\UIUtils.js",
  "components\data-combobox\DataComboBox.js",
  "components\confirm-modal\ConfirmModal.js",
  "components\modal\Modal.js",
  "components\pagination\Pagination.js",
  "js\core\router.js",
  "js\core\sound.js",
  "js\core\app.js"
)

# --- Build CSS ---
$css = ""
$count = 0
foreach ($f in $cssFiles) {
  $path = Join-Path $root $f
  if (Test-Path $path) {
    $name = Split-Path $f -Leaf
    $css += "/* --- $name --- */`r`n"
    $css += (Get-Content $path -Raw -Encoding UTF8)
    $css += "`r`n`r`n"
    $count++
  } else {
    Write-Host "WARNING: Missing CSS file: $path" -ForegroundColor Yellow
  }
}
$cssOut = Join-Path $root "css\styles.bundle.css"
[System.IO.File]::WriteAllText($cssOut, $css, [System.Text.Encoding]::UTF8)
$cssKB = [math]::Round((Get-Item $cssOut).Length / 1024, 1)
Write-Host "CSS: $count files -> styles.bundle.css (${cssKB}KB)" -ForegroundColor Green

# --- Build JS ---
$js = ""
$count = 0
foreach ($f in $jsFiles) {
  $path = Join-Path $root $f
  if (Test-Path $path) {
    $name = Split-Path $f -Leaf
    $js += "/* --- $name --- */`r`n"
    $js += (Get-Content $path -Raw -Encoding UTF8)
    $js += "`r`n`r`n"
    $count++
  } else {
    Write-Host "WARNING: Missing JS file: $path" -ForegroundColor Yellow
  }
}
$jsOut = Join-Path $root "js\app.bundle.js"
[System.IO.File]::WriteAllText($jsOut, $js, [System.Text.Encoding]::UTF8)
$jsKB = [math]::Round((Get-Item $jsOut).Length / 1024, 1)
Write-Host "JS:  $count files -> app.bundle.js (${jsKB}KB)" -ForegroundColor Green

Write-Host "`nDone! Da tao bundle thanh cong. Nho cap nhat index.html de dung bundle!" -ForegroundColor Cyan
