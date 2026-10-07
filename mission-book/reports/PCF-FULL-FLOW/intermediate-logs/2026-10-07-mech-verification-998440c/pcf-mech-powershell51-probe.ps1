$ErrorActionPreference='Continue'
Set-Location 'D:\utopia-pcf-verify'
Write-Output "=== case 1: opt-out refusal under PowerShell 5.1 (the candidate's suite drives this through pwsh, absent here) ==="
$out = & powershell -NoProfile -File scripts\pcf-service.ps1 -Action INSTALL -CandidateDirectory 'Z:/missing-candidate' -ConfigFile 'Z:/missing-config' 2>&1
Write-Output ("exit=" + $LASTEXITCODE)
Write-Output ($out -join " | ")
Write-Output "=== case 2: ancestor-junction refusal under PowerShell 5.1 ==="
$fx = Join-Path $env:TEMP 'pcf-mech-ps51-junction'
if (Test-Path $fx) { cmd /c "rmdir /s /q $fx" | Out-Null }
New-Item -ItemType Directory -Force -Path (Join-Path $fx 'actual') | Out-Null
'{"schemaVersion":1}' | Set-Content -Path (Join-Path $fx 'config.json') -Encoding ASCII
New-Item -ItemType Junction -Path (Join-Path $fx 'alias') -Target (Join-Path $fx 'actual') | Out-Null
& powershell -NoProfile -File scripts\pcf-service.ps1 -Action INSTALL -CandidateDirectory (Join-Path $fx 'alias\candidate') -ConfigFile (Join-Path $fx 'config.json') -OptIn -Apply 2>&1 | Select-Object -First 8
Write-Output ("exit=" + $LASTEXITCODE)
Write-Output ("manifestCreated=" + (Test-Path (Join-Path $fx 'actual\candidate\pcf-candidate-manifest.json')))
cmd /c "rmdir /s /q $fx" | Out-Null
