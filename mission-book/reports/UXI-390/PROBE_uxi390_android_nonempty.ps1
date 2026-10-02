# UXI-390: Android NON-EMPTY scheduler panel probe (Alien), third pass.
#
# Passes 1 and 2 established that the panel exists, renders user language on the Devices page, and leaks no
# contract token. What is still owed is the panel holding a NON-EMPTY state - a state label with providers,
# and a real choice control for a selectable provider - driven THROUGH the Android UI.
#
# The recipe is Mech's own from the Web E2E: KILL THE REAL EXECUTOR FIRST, THEN CREATE REAL WORK. With the
# executor gone, submitted work cannot be assigned and the panel has something true to say, instead of the
# correct "Nothing is waiting to run." that a healthy pool produces. ONE command.
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
"reference node pid=$($node.Id) registered"

$xml = "<?xml version='1.0' encoding='utf-8' standalone='yes' ?>`n<map>`n    <string name=`"host`">http://127.0.0.1:4310</string>`n    <string name=`"token`">$($env:CITY_TOKEN)</string>`n</map>`n"
$tmp = Join-Path $env:TEMP 'cc-uxi390c.xml'
[System.IO.File]::WriteAllText($tmp, $xml, (New-Object System.Text.UTF8Encoding($false)))
& $adb shell am force-stop city.utopia.control 2>&1 | Out-Null
& $adb push $tmp /data/local/tmp/cc-uxi390c.xml 2>&1 | Out-Null
& $adb shell run-as city.utopia.control mkdir -p shared_prefs 2>&1 | Out-Null
& $adb shell run-as city.utopia.control cp /data/local/tmp/cc-uxi390c.xml shared_prefs/city-connection.xml 2>&1 | Out-Null
& $adb reverse tcp:4310 tcp:4310 2>&1 | Out-Null
& $adb shell input keyevent 224 2>&1 | Out-Null
& $adb shell am start -n city.utopia.control/.MainActivity 2>&1 | Out-Null
Start-Sleep -Seconds 10

function Dump { & $adb shell uiautomator dump /data/local/tmp/uxi390c.xml 2>&1 | Out-Null; return (& $adb shell cat /data/local/tmp/uxi390c.xml 2>&1 | Out-String) }
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
    if ($x -eq 0 -and $y -eq 0) { continue }   # zero-bounds node: tapping it is a no-op
    & $adb shell input tap $x $y 2>&1 | Out-Null
    return $true
  }
  return $false
}

"navigate to Devices: $(TapText 'Devices')"
Start-Sleep -Seconds 3
"on Devices, Run Test Task visible: $(((Texts (Dump)) -contains 'Run Test Task'))"

# Mech's recipe: kill the real executor FIRST, so the submitted work genuinely cannot be assigned.
Stop-Process -Id $node.Id -Force -ErrorAction SilentlyContinue
"executor killed"
Start-Sleep -Seconds 2

"tap Run Test Task: $(TapText 'Run Test Task')"
# Dump immediately and repeatedly: the window in which the panel has something to say may be short.
for ($k = 0; $k -lt 4; $k++) {
  Start-Sleep -Seconds 2
  $v = (Texts (Dump)) | Where-Object { $_.Trim().Length -gt 0 } | Sort-Object -Unique
  "--- observation $k ($($v.Count) distinct) ---"
  $v | ForEach-Object { "  $_" }
}

$panelCopy = @("Nothing is waiting to run.", "Scheduling status is not being reported right now.",
  "This task's status is not being reported right now.", "Reconnect to see why this is waiting.",
  "No device is being considered for this yet.")
$final = (Texts (Dump)) | Where-Object { $_.Trim().Length -gt 0 } | Sort-Object -Unique
$found = @(); foreach ($s in $panelCopy) { if (($final -join "`n") -like "*$s*") { $found += $s } }
"=== PANEL STATE ==="
if ($found.Count -gt 0) { "  matched panel copy: $($found -join ' | ')" } else { "  no panel copy string matched; see the observations above" }

foreach ($p in @($gw)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
"PROBE_END"
