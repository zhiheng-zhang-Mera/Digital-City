# UXI-390: Android scheduler-panel probe (Alien), second pass.
#
# The first pass reached the bottom-bar tabs and found NO scheduler panel, which was recorded as NOT
# OBSERVED rather than as a product finding. Reading SchedulerPanel.kt explains why: the panel renders only
# when a scheduler FEED exists, and it renders inside the task detail view keyed on a taskId. So this pass
# creates real work, opens a task's detail, and looks for the panel's own copy. ONE command.
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
if (-not $healthy) { "GATEWAY_NOT_HEALTHY"; Stop-Process -Id $gw.Id -Force -ErrorAction SilentlyContinue; exit 1 }
"gateway healthy"
$node = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
Start-Sleep -Seconds 6

$xml = "<?xml version='1.0' encoding='utf-8' standalone='yes' ?>`n<map>`n    <string name=`"host`">http://127.0.0.1:4310</string>`n    <string name=`"token`">$($env:CITY_TOKEN)</string>`n</map>`n"
$tmp = Join-Path $env:TEMP 'cc-uxi390b.xml'
[System.IO.File]::WriteAllText($tmp, $xml, (New-Object System.Text.UTF8Encoding($false)))
& $adb shell am force-stop city.utopia.control 2>&1 | Out-Null
& $adb push $tmp /data/local/tmp/cc-uxi390b.xml 2>&1 | Out-Null
& $adb shell run-as city.utopia.control mkdir -p shared_prefs 2>&1 | Out-Null
& $adb shell run-as city.utopia.control cp /data/local/tmp/cc-uxi390b.xml shared_prefs/city-connection.xml 2>&1 | Out-Null
& $adb reverse tcp:4310 tcp:4310 2>&1 | Out-Null
& $adb shell input keyevent 224 2>&1 | Out-Null
& $adb shell am start -n city.utopia.control/.MainActivity 2>&1 | Out-Null
Start-Sleep -Seconds 10

function Dump { & $adb shell uiautomator dump /data/local/tmp/uxi390b.xml 2>&1 | Out-Null; return (& $adb shell cat /data/local/tmp/uxi390b.xml 2>&1 | Out-String) }
function Texts($x) { $o = New-Object System.Collections.ArrayList; foreach ($m in [regex]::Matches($x, 'text="([^"]+)"')) { [void]$o.Add($m.Groups[1].Value) }; foreach ($m in [regex]::Matches($x, 'content-desc="([^"]+)"')) { [void]$o.Add($m.Groups[1].Value) }; return $o }

# Create real work through the API so a task exists with a live scheduler state.
$h = @{ Authorization = 'Bearer ' + $env:CITY_TOKEN; 'X-City-Api-Version' = '0'; 'X-City-Schema-Version' = '0' }
$t = (Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/tasks' -Method POST -Headers $h -Body (@{type='WAIT'}|ConvertTo-Json -Compress) -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json
"created task $($t.id) type=WAIT (WAIT holds the node ~6s, so a live scheduler state exists while we look)"

# Tap the clickable node that carries the task id, i.e. open that task's detail.
$opened = $false
for ($attempt = 0; $attempt -lt 6 -and -not $opened; $attempt++) {
  $d = Dump
  foreach ($m in [regex]::Matches($d, '<node\s+([^>]+?)/?>')) {
    $a = $m.Groups[1].Value
    if ($a -notmatch [regex]::Escape($t.id)) { continue }
    if ($a -notmatch 'clickable="true"') { continue }
    $b = [regex]::Match($a, 'bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"')
    if (-not $b.Success) { continue }
    $x = ([int]$b.Groups[1].Value + [int]$b.Groups[3].Value) -shr 1
    $y = ([int]$b.Groups[2].Value + [int]$b.Groups[4].Value) -shr 1
    & $adb shell input tap $x $y 2>&1 | Out-Null
    $opened = $true
    "tapped task node at $x,$y"
    break
  }
  if (-not $opened) { Start-Sleep -Seconds 2 }
}
if (-not $opened) { "TASK_NODE_NOT_CLICKABLE - the task row was not a tap target on this screen" }
Start-Sleep -Seconds 4

$after = Dump
$visible = (Texts $after) | Where-Object { $_.Trim().Length -gt 0 } | Sort-Object -Unique
"=== VISIBLE TEXT AFTER OPENING THE TASK ($($visible.Count) distinct) ==="
$visible | ForEach-Object { "  $_" }

$panelCopy = @("Nothing is waiting to run.", "Scheduling status is not being reported right now.",
  "This task's status is not being reported right now.", "Reconnect to see why this is waiting.",
  "No device is being considered for this yet.")
$found = @()
foreach ($s in $panelCopy) { if (($visible -join "`n") -like "*$s*") { $found += $s } }
"=== SCHEDULER PANEL COPY ==="
if ($found.Count -gt 0) { "  PANEL PRESENT - matched: $($found -join ' | ')" } else { "  none of the panel's own copy strings appeared" }

foreach ($p in @($gw, $node)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
"PROBE_END"
