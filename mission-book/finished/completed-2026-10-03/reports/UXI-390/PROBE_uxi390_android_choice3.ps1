# UXI-390: Android choice round-trip, seventh pass (Alien) - TIMING FIX.
#
# Round 137 measured the exclusivity: node dead -> task waits but nothing is selectable; node alive -> the
# provider is selectable but the task completes before the panel is dumped. The fix is to LENGTHEN THE
# WINDOW instead of racing it: submit a BATCH of WAIT tasks so the node stays busy for tens of seconds
# while work is genuinely waiting, which is the only state in which both halves of the condition exist.
# The dump is then taken IMMEDIATELY on creation, with no intervening API read.
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
if (-not $healthy) { "S8 gateway not healthy"; Stop-Process -Id $gw.Id -Force -ErrorAction SilentlyContinue; exit 1 }
"S8 gateway healthy"
$node = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
Start-Sleep -Seconds 6

$xml = "<?xml version='1.0' encoding='utf-8' standalone='yes' ?>`n<map>`n    <string name=`"host`">http://127.0.0.1:4310</string>`n    <string name=`"token`">$($env:CITY_TOKEN)</string>`n</map>`n"
$tmp = Join-Path $env:TEMP 'cc-uxi390h.xml'
[System.IO.File]::WriteAllText($tmp, $xml, (New-Object System.Text.UTF8Encoding($false)))
& $adb shell am force-stop city.utopia.control 2>&1 | Out-Null
& $adb push $tmp /data/local/tmp/cc-uxi390h.xml 2>&1 | Out-Null
& $adb shell run-as city.utopia.control mkdir -p shared_prefs 2>&1 | Out-Null
& $adb shell run-as city.utopia.control cp /data/local/tmp/cc-uxi390h.xml shared_prefs/city-connection.xml 2>&1 | Out-Null
& $adb reverse tcp:4310 tcp:4310 2>&1 | Out-Null
& $adb shell input keyevent 224 2>&1 | Out-Null
& $adb shell am start -n city.utopia.control/.MainActivity 2>&1 | Out-Null
Start-Sleep -Seconds 10

function Dump { & $adb shell uiautomator dump /data/local/tmp/uxi390h.xml 2>&1 | Out-Null; return (& $adb shell cat /data/local/tmp/uxi390h.xml 2>&1 | Out-String) }
function Texts($x) { $o = New-Object System.Collections.ArrayList; foreach ($m in [regex]::Matches($x, 'text="([^"]+)"')) { [void]$o.Add($m.Groups[1].Value) }; return $o }
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
    return "TAPPED '$label' at $x,$y"
  }
  return "NOT_FOUND $label"
}
$h = @{ Authorization = 'Bearer ' + $env:CITY_TOKEN; 'X-City-Api-Version' = '0'; 'X-City-Schema-Version' = '0' }

"S8 nav: $(TapText 'Devices')"
Start-Sleep -Seconds 3

# THE TIMING FIX: a batch of WAIT tasks. Each holds the node ~6090ms and they queue, so the node stays
# busy and work stays waiting for tens of seconds - both halves of the condition at once.
$ids = @()
for ($i = 0; $i -lt 10; $i++) {
  $r = (Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/tasks' -Method POST -Headers $h -Body (@{type='WAIT'}|ConvertTo-Json -Compress) -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json
  $ids += $r.id
}
"S8 created $($ids.Count) WAIT tasks; last=$($ids[-1])"

$found = $false
for ($k = 0; $k -lt 8 -and -not $found; $k++) {
  $v = (Texts (Dump)) | Where-Object { $_.Trim().Length -gt 0 } | Sort-Object -Unique
  $joined = $v -join ' | '
  $nQueued = 0; $nRunning = 0
  try {
    $ts = ((Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/tasks' -Headers $h -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json).tasks
    $nQueued = ($ts | Where-Object { $_.state -eq 'QUEUED' }).Count
    $nRunning = ($ts | Where-Object { $_.state -eq 'RUNNING' }).Count
  } catch { }
  "S8 obs$k backend QUEUED=$nQueued RUNNING=$nRunning"
  "S8 obs$k panel: $joined"
  if ($joined -like '*Choose another service*') { $found = $true; "S8 CHOICE CONTROL PRESENT at observation $k" }
}

if ($found) {
  "S8 choice tap: $(TapText 'Choose another service')"
  Start-Sleep -Seconds 3
  $t = ((Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/tasks' -Headers $h -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json).tasks | Where-Object { $_.id -eq $ids[-1] }
  "S8 after tap: last task state=$($t.state) assignedNodeId=$($t.assignedNodeId)"
  try {
    $ev = ((Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/city' -Headers $h -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json).events | Where-Object { $_.taskId -eq $ids[-1] }
    "S8 events for the last task: $(($ev | ForEach-Object { "$($_.type)(actor=$($_.actor))" }) -join ', ')"
    $user = ($ev | Where-Object { $_.actor -eq 'user' }).Count
    if ($user -gt 0) { "S8 RESULT1 PASS - the backend recorded a USER-actor event, so the choice REACHED it through the Android UI" }
    else { "S8 RESULT1 not yet - no user-actor event for that task" }
  } catch { "S8 event read failed" }
  $nv = (Texts (Dump)) | Where-Object { $_.Trim().Length -gt 0 } | Sort-Object -Unique
  "S8 rendered after: $($nv -join ' | ')"
} else { "S8 choice control never appeared in 8 observations" }
"S8_END"
foreach ($p in @($gw, $node)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
