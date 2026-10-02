# UXI-390: Android choice round-trip, eighth pass (Alien) - TWO NODES.
#
# Rounds 136-138 established the two halves separately and showed they never coincided:
#   node dead  -> STRUCTURAL refusal, choice control APPEARS, but nothing selectable to pick
#   node busy  -> RESOURCE refusals only, so no choice control (correctly: waiting is the honest offer)
# This pass presents BOTH AT ONCE with two nodes of distinct identity:
#   node A : KILLED  -> OFFLINE -> DEVICE_UNREACHABLE -> STRUCTURAL, so provider_choice_required is true
#   node B : ALIVE and BUSY with a batch of WAIT tasks -> a real service exists to choose
# Then the choice is opened and a service is picked, and the backend event log is read for actor=user.
$ErrorActionPreference = 'Continue'
$root = 'D:\utopia-uxi390'
$adb = 'C:\Users\15601\AppData\Local\Android\Sdk\platform-tools\adb.exe'
$env:CITY_TOKEN = 'alien-uxi390-android-control'
$env:CITY_NODE_TOKEN = 'alien-uxi390-android-node'
$env:CITY_PORT = '4310'
$env:CITY_HOST = '127.0.0.1'
$env:CITY_URL = 'http://127.0.0.1:4310'
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
if (-not $healthy) { "S9 gateway not healthy"; Stop-Process -Id $gw.Id -Force -ErrorAction SilentlyContinue; exit 1 }
"S9 gateway healthy"
$nodeA = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
$nodeB = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList '.runtime/node-b.mjs' -WorkingDirectory $root
Start-Sleep -Seconds 8
$h = @{ Authorization = 'Bearer ' + $env:CITY_TOKEN; 'X-City-Api-Version' = '0'; 'X-City-Schema-Version' = '0' }
$city = (Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/city' -Headers $h -UseBasicParsing).Content | ConvertFrom-Json
"S9 nodes registered = $($city.nodes.Count): $(($city.nodes | ForEach-Object { $_.id }) -join ', ')"

$xml = "<?xml version='1.0' encoding='utf-8' standalone='yes' ?>`n<map>`n    <string name=`"host`">http://127.0.0.1:4310</string>`n    <string name=`"token`">$($env:CITY_TOKEN)</string>`n</map>`n"
$tmp = Join-Path $env:TEMP 'cc-uxi390i.xml'
[System.IO.File]::WriteAllText($tmp, $xml, (New-Object System.Text.UTF8Encoding($false)))
& $adb shell am force-stop city.utopia.control 2>&1 | Out-Null
& $adb push $tmp /data/local/tmp/cc-uxi390i.xml 2>&1 | Out-Null
& $adb shell run-as city.utopia.control mkdir -p shared_prefs 2>&1 | Out-Null
& $adb shell run-as city.utopia.control cp /data/local/tmp/cc-uxi390i.xml shared_prefs/city-connection.xml 2>&1 | Out-Null
& $adb reverse tcp:4310 tcp:4310 2>&1 | Out-Null
& $adb shell input keyevent 224 2>&1 | Out-Null
& $adb shell am start -n city.utopia.control/.MainActivity 2>&1 | Out-Null
Start-Sleep -Seconds 10

function Dump { & $adb shell uiautomator dump /data/local/tmp/uxi390i.xml 2>&1 | Out-Null; return (& $adb shell cat /data/local/tmp/uxi390i.xml 2>&1 | Out-String) }
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
function EventsFor($id) {
  try { return (((Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/city' -Headers $h -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json).events | Where-Object { $_.taskId -eq $id }) } catch { return @() }
}

"S9 nav: $(TapText 'Devices')"
Start-Sleep -Seconds 3
# node A killed -> STRUCTURAL (DEVICE_UNREACHABLE); node B alive -> a real service to choose.
Stop-Process -Id $nodeA.Id -Force -ErrorAction SilentlyContinue
"S9 node A killed; nodes now: $((($city = (Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/city' -Headers $h -UseBasicParsing).Content | ConvertFrom-Json).nodes | ForEach-Object { $_.id }) -join ', ')"
Start-Sleep -Seconds 3

# Keep B busy so the new task genuinely waits AND B remains a real, addressable service.
$ids = @()
for ($i = 0; $i -lt 10; $i++) {
  $r = (Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/tasks' -Method POST -Headers $h -Body (@{type='WAIT'}|ConvertTo-Json -Compress) -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json
  $ids += $r.id
}
"S9 created $($ids.Count) WAIT tasks; last=$($ids[-1])"

$seen = $false
for ($k = 0; $k -lt 6 -and -not $seen; $k++) {
  $v = (Texts (Dump)) | Where-Object { $_.Trim().Length -gt 0 } | Sort-Object -Unique
  $joined = $v -join ' | '
  "S9 obs$k panel: $joined"
  if ($joined -like '*Choose another service*') { $seen = $true; "S9 CHOICE CONTROL PRESENT at obs$k" }
}

if ($seen) {
  "S9 open choice: $(TapText 'Choose another service')"
  Start-Sleep -Seconds 3
  $after = (Texts (Dump)) | Where-Object { $_.Trim().Length -gt 0 } | Sort-Object -Unique
  "S9 after opening: $($after -join ' | ')"
  $pick = $after | Where-Object { $_ -like '*Available*' } | Select-Object -First 1
  if ($pick) {
    "S9 picking: $pick"
    "S9 pick tap: $(TapText $pick)"
  } else { "S9 no selectable entry offered to pick" }
  Start-Sleep -Seconds 4
  $t = ((Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/tasks' -Headers $h -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json).tasks | Where-Object { $_.id -eq $ids[-1] }
  "S9 last task state=$($t.state) assignedNodeId=$($t.assignedNodeId)"
  $ev = EventsFor $ids[-1]
  "S9 events: $(($ev | ForEach-Object { "$($_.type)(actor=$($_.actor))" }) -join ', ')"
  $userEvents = @($ev | Where-Object { $_.actor -eq 'user' })
  if ($userEvents.Count -gt 0) { "S9 RESULT1 PASS - $($userEvents.Count) USER-actor event(s) recorded, so the choice REACHED the backend through the Android UI" }
  else { "S9 RESULT1 not achieved - no user-actor event for that task" }
  "S9 final render: $(((Texts (Dump)) | Where-Object { $_.Trim().Length -gt 0 } | Sort-Object -Unique) -join ' | ')"
} else { "S9 choice control never appeared" }
"S9_END"
foreach ($p in @($gw, $nodeB)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
