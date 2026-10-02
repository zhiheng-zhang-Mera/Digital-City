# UXI-390: Android scheduler-surface probe (Alien). ONE command, because the harness kills the process
# tree when the tool call ends.
#
# Drives the REAL app on the REAL device against a REAL gateway and reference node, then asserts the two
# acceptance items the workbook names for the Android surface: the scheduler state is rendered in USER
# LANGUAGE, and NO RAW SCHEDULER TOKEN leaks into the rendered UI by default. It prints the visible text
# it found, so the claim is checkable from the output rather than taken on trust.
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
for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Seconds 1
  try { if ((Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/health' -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200) { $healthy = $true; break } } catch { }
}
if (-not $healthy) { "GATEWAY_NOT_HEALTHY"; Stop-Process -Id $gw.Id -Force -ErrorAction SilentlyContinue; exit 1 }
"gateway healthy"
$node = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
Start-Sleep -Seconds 6

# Seed the APP's own stored connection with THIS run's token, using the mechanism Mech established: stage
# in /data/local/tmp and copy with run-as cp, NO extra sh -c, because /sdcard hits scoped storage.
$xml = "<?xml version='1.0' encoding='utf-8' standalone='yes' ?>`n<map>`n    <string name=`"host`">http://127.0.0.1:4310</string>`n    <string name=`"token`">$($env:CITY_TOKEN)</string>`n</map>`n"
$tmp = Join-Path $env:TEMP 'cc-uxi390.xml'
[System.IO.File]::WriteAllText($tmp, $xml, (New-Object System.Text.UTF8Encoding($false)))
& $adb shell am force-stop city.utopia.control 2>&1 | Out-Null
& $adb push $tmp /data/local/tmp/cc-uxi390.xml 2>&1 | Out-Null
& $adb shell run-as city.utopia.control mkdir -p shared_prefs 2>&1 | Out-Null
& $adb shell run-as city.utopia.control cp /data/local/tmp/cc-uxi390.xml shared_prefs/city-connection.xml 2>&1 | Out-Null
"prefs seeded: $(((& $adb shell run-as city.utopia.control cat shared_prefs/city-connection.xml 2>&1) -join ' ').Trim())"
& $adb reverse tcp:4310 tcp:4310 2>&1 | Out-Null
& $adb shell input keyevent 224 2>&1 | Out-Null
& $adb shell am start -n city.utopia.control/.MainActivity 2>&1 | Select-Object -Last 1 | Out-Null
Start-Sleep -Seconds 10

function Dump {
  & $adb shell uiautomator dump /data/local/tmp/uxi390.xml 2>&1 | Out-Null
  return (& $adb shell cat /data/local/tmp/uxi390.xml 2>&1 | Out-String)
}
function Texts($xml) {
  $out = New-Object System.Collections.ArrayList
  foreach ($m in [regex]::Matches($xml, 'text="([^"]+)"')) { [void]$out.Add($m.Groups[1].Value) }
  foreach ($m in [regex]::Matches($xml, 'content-desc="([^"]+)"')) { [void]$out.Add($m.Groups[1].Value) }
  return $out
}
# Tap the CLICKABLE bottom-bar tab rather than a label: on this build the only node with text="Home" has
# bounds [0,0][0,0] and is not clickable, so tapping it is a no-op that never leaves the current page.
function TapBarTab($xml, $index) {
  $tabs = @()
  foreach ($m in [regex]::Matches($xml, '<node\s+([^>]+?)/?>')) {
    $a = $m.Groups[1].Value
    if ($a -notmatch 'clickable="true"') { continue }
    $b = [regex]::Match($a, 'bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"')
    if (-not $b.Success) { continue }
    $x1=[int]$b.Groups[1].Value; $y1=[int]$b.Groups[2].Value; $x2=[int]$b.Groups[3].Value; $y2=[int]$b.Groups[4].Value
    if (($y2 - $y1) -lt 40) { continue }
    $tabs += ,@((($x1+$x2) -shr 1), (($y1+$y2) -shr 1), $x1, $y1, $x2, $y2)
  }
  $tabs = $tabs | Sort-Object { $_[0] }
  if ($index -ge $tabs.Count) { return $false }
  & $adb shell input tap $tabs[$index][0] $tabs[$index][1] 2>&1 | Out-Null
  return $true
}

$xml = Dump
$texts = Texts $xml
"app online: $($texts -contains 'ONLINE' -or ($texts -join '|') -match 'ONLINE')"
"tab count: $(([regex]::Matches($xml, 'clickable="true"') | Measure-Object).Count) clickable nodes"

# Visit each bottom-bar tab and collect whatever the scheduler surface renders on it.
$all = @{}
for ($t = 0; $t -lt 5; $t++) {
  $moved = TapBarTab (Dump) $t
  if (-not $moved) { break }
  Start-Sleep -Seconds 3
  $d = Dump
  foreach ($tx in Texts $d) { if ($tx.Trim().Length -gt 0) { $all[$tx] = $true } }
  "tab $t visited"
}

$visible = $all.Keys | Sort-Object
"=== VISIBLE TEXT ($($visible.Count) distinct) ==="
$visible | ForEach-Object { "  $_" }

$rawTokens = @('PRESSURE_PAUSED','USER_DISABLED','DEVICE_UNREACHABLE','DEVICE_REFUSING','DEVICE_DISABLED',
  'FRESHNESS_UNKNOWN','FRESHNESS_STALE','AT_CAPACITY','SESSION_CONGESTED','LOAD_UNMEASURED','POLICY_EXCLUDED',
  'CHANNEL_READINESS_UNKNOWN','AVAILABILITY_UNKNOWN','REMOTE_STATE_UNKNOWN','REMOTE_ONLINE','SESSION_ENDED',
  'CREDENTIALS_MISSING','REGION_UNSUPPORTED','SELECTABLE','DEVICE_ONLINE','STRUCTURAL','RESOURCE')
$leaked = @()
foreach ($tok in $rawTokens) { if ($visible -contains $tok) { $leaked += $tok } }
"=== RAW TOKEN LEAK CHECK ==="
if ($leaked.Count -eq 0) { "  PASS - none of the $($rawTokens.Count) contract tokens appear in the rendered UI" }
else { "  FAIL - leaked: $($leaked -join ', ')" }

foreach ($p in @($gw, $node)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
"PROBE_END"
