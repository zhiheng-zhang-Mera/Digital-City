# UXI-390: Android NON-EMPTY panel, fifth pass (Alien).
#
# The fourth pass proved the empty panel was SUBMIT-FAILURE, not a rendering defect: Run Test Task is
# emitted for page in listOf(Home, Tasks) while the PANEL lives on Devices, so the probe tapped a control
# that was never on the screen it was looking at. This pass removes that dependency entirely by creating
# the waiting task THROUGH THE API with the executor dead, so the task stays QUEUED and cannot complete
# before the panel is dumped. ONE command.
$ErrorActionPreference = 'Continue'
$root = 'D:\utopia-uxi390'
$adb = 'C:\Users\15601\AppData\Local\Android\Sdk\platform-tools\adb.exe'
$env:CITY_TOKEN = 'alien-uxi390-android-control'
$env:CITY_NODE_TOKEN = 'alien-uxi390-android-node'
$env:CITY_PORT = '4310'
$env:CITY_HOST = '127.0.0.1'
$env:CITY_ROOMS_URL = 'http://127.0.0.1:4320'
$env:ADB = $adb
Remove-Item Env:CITY_TELEMETRY_DISABLED -ErrorAction SilentlyContinue
cd $root
foreach ($port in 4310, 4320) {
  Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}
Start-Sleep -Seconds 2
$gw = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'services/dev-gateway/main.mjs' -WorkingDirectory $root
$healthy = $false
for ($i = 0; $i -lt 30; $i++) { Start-Sleep -Seconds 1; try { if ((Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/health' -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200) { $healthy = $true; break } } catch { } }
if (-not $healthy) { "NE5 gateway not healthy"; Stop-Process -Id $gw.Id -Force -ErrorAction SilentlyContinue; exit 1 }
"NE5 gateway healthy"
$node = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
Start-Sleep -Seconds 6

$xml = "<?xml version='1.0' encoding='utf-8' standalone='yes' ?>`n<map>`n    <string name=`"host`">http://127.0.0.1:4310</string>`n    <string name=`"token`">$($env:CITY_TOKEN)</string>`n</map>`n"
$tmp = Join-Path $env:TEMP 'cc-uxi390e.xml'
[System.IO.File]::WriteAllText($tmp, $xml, (New-Object System.Text.UTF8Encoding($false)))
& $adb shell am force-stop city.utopia.control 2>&1 | Out-Null
& $adb push $tmp /data/local/tmp/cc-uxi390e.xml 2>&1 | Out-Null
& $adb shell run-as city.utopia.control mkdir -p shared_prefs 2>&1 | Out-Null
& $adb shell run-as city.utopia.control cp /data/local/tmp/cc-uxi390e.xml shared_prefs/city-connection.xml 2>&1 | Out-Null
& $adb reverse tcp:4310 tcp:4310 2>&1 | Out-Null
& $adb shell input keyevent 224 2>&1 | Out-Null
& $adb shell am start -n city.utopia.control/.MainActivity 2>&1 | Out-Null
Start-Sleep -Seconds 10

function Dump { & $adb shell uiautomator dump /data/local/tmp/uxi390e.xml 2>&1 | Out-Null; return (& $adb shell cat /data/local/tmp/uxi390e.xml 2>&1 | Out-String) }
function Texts($x) { $o = New-Object System.Collections.ArrayList; foreach ($m in [regex]::Matches($x, 'text="([^"]+)"')) { [void]$o.Add($m.Groups[1].Value) }; foreach ($m in [regex]::Matches($x, 'content-desc="([^"]+)"')) { [void]$o.Add($m.Groups[1].Value) }; return $o }
function TapText([string]$label) {
  $d = Dump
  foreach ($m in [regex]::Matches($d, '<node\s+([^>]+?)/?>')) {
    $a = $m.Groups[1].Value
    if ($a -notmatch ('text="' + [regex]::Escape($label) + '"')) { continue }
    $b = [regex]::Match($a, 'bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"')
    if (-not $b.Success) { continue }
    $x = ([int]$b.Groups[1].Value + [int]$b.Groups[3].Value) -shr 1
    $y = ([int]$b.Groups[2].Value + [int]$b.Groups[4].Value) -shr 1
    if ($x -eq 0 -and $y -eq 0) { continue }
    & $adb shell input tap $x $y 2>&1 | Out-Null
    return "TAPPED $label at $x,$y"
  }
  return "NOT_FOUND $label"
}
$h = @{ Authorization = 'Bearer ' + $env:CITY_TOKEN; 'X-City-Api-Version' = '0'; 'X-City-Schema-Version' = '0' }

"NE5 nav: $(TapText 'Devices')"
Start-Sleep -Seconds 3
# Kill the executor FIRST so the new task can never be assigned.
Stop-Process -Id $node.Id -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3
"NE5 executor killed"

$t = (Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/tasks' -Method POST -Headers $h -Body (@{type='WAIT'}|ConvertTo-Json -Compress) -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json
"NE5 created $($t.id) type=WAIT with the executor dead, so it must stay QUEUED"

for ($k = 0; $k -lt 5; $k++) {
  Start-Sleep -Seconds 3
  $cur = ((Invoke-WebRequest -Uri ("http://127.0.0.1:4310/api/v0/tasks/" + $t.id) -Headers $h -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json)
  $v = (Texts (Dump)) | Where-Object { $_.Trim().Length -gt 0 } | Sort-Object -Unique
  $isWaiting = ($v -join ' | ')
  "NE5 t+$($k*3+3)s backendState=$($cur.state)  panelText=$isWaiting"
}
"NE5_END"
foreach ($p in @($gw)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
