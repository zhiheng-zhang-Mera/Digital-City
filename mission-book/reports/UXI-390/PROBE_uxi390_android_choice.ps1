# UXI-390: Android choice round-trip + non-interactivity proof, sixth pass (Alien).
#
# Two remaining Android items:
#   (1) the choice made THROUGH the Android control must be shown to REACH THE BACKEND, and
#   (2) the unavailable provider entry must be proven NON-INTERACTIVE, because "Not available" is copy and
#       copy is not proof - the web side needed an adversarial lying-DTO test for the same property.
#
# For (2) the dump's own clickable/focusable attributes are read for the specific node, and a tap is aimed
# at it, so non-interactivity is established by the UI tree and by a no-op, not by the label. ONE command.
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
if (-not $healthy) { "S6 gateway not healthy"; Stop-Process -Id $gw.Id -Force -ErrorAction SilentlyContinue; exit 1 }
"S6 gateway healthy"
$node = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
Start-Sleep -Seconds 6

$xml = "<?xml version='1.0' encoding='utf-8' standalone='yes' ?>`n<map>`n    <string name=`"host`">http://127.0.0.1:4310</string>`n    <string name=`"token`">$($env:CITY_TOKEN)</string>`n</map>`n"
$tmp = Join-Path $env:TEMP 'cc-uxi390f.xml'
[System.IO.File]::WriteAllText($tmp, $xml, (New-Object System.Text.UTF8Encoding($false)))
& $adb shell am force-stop city.utopia.control 2>&1 | Out-Null
& $adb push $tmp /data/local/tmp/cc-uxi390f.xml 2>&1 | Out-Null
& $adb shell run-as city.utopia.control mkdir -p shared_prefs 2>&1 | Out-Null
& $adb shell run-as city.utopia.control cp /data/local/tmp/cc-uxi390f.xml shared_prefs/city-connection.xml 2>&1 | Out-Null
& $adb reverse tcp:4310 tcp:4310 2>&1 | Out-Null
& $adb shell input keyevent 224 2>&1 | Out-Null
& $adb shell am start -n city.utopia.control/.MainActivity 2>&1 | Out-Null
Start-Sleep -Seconds 10

function Dump { & $adb shell uiautomator dump /data/local/tmp/uxi390f.xml 2>&1 | Out-Null; return (& $adb shell cat /data/local/tmp/uxi390f.xml 2>&1 | Out-String) }
function Nodes($d) {
  $out = @()
  foreach ($m in [regex]::Matches($d, '<node\s+([^>]+?)/?>')) {
    $a = $m.Groups[1].Value
    $t = [regex]::Match($a, 'text="([^"]*)"').Groups[1].Value
    $c = ($a -match 'clickable="true"')
    $b = [regex]::Match($a, 'bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"')
    $x = 0; $y = 0
    if ($b.Success) { $x = ([int]$b.Groups[1].Value + [int]$b.Groups[3].Value) -shr 1; $y = ([int]$b.Groups[2].Value + [int]$b.Groups[4].Value) -shr 1 }
    $out += [pscustomobject]@{text=$t; clickable=$c; x=$x; y=$y}
  }
  return $out
}
function TapText([string]$label) {
  $n = (Nodes (Dump)) | Where-Object { $_.text -eq $label -and -not ($_.x -eq 0 -and $_.y -eq 0) } | Select-Object -First 1
  if (-not $n) { return "NOT_FOUND $label" }
  & $adb shell input tap $n.x $n.y 2>&1 | Out-Null
  return "TAPPED '$label' at $($n.x),$($n.y) clickable=$($n.clickable)"
}
$h = @{ Authorization = 'Bearer ' + $env:CITY_TOKEN; 'X-City-Api-Version' = '0'; 'X-City-Schema-Version' = '0' }
function TaskOf($id) { try { return ((Invoke-WebRequest -Uri ("http://127.0.0.1:4310/api/v0/tasks/" + $id) -Headers $h -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json) } catch { return $null } }

"S6 nav: $(TapText 'Devices')"
Start-Sleep -Seconds 3
Stop-Process -Id $node.Id -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3
$t = (Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/tasks' -Method POST -Headers $h -Body (@{type='WAIT'}|ConvertTo-Json -Compress) -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json
Start-Sleep -Seconds 5
"S6 task $($t.id)"

$before = TaskOf $t.id
"S6 BEFORE  state=$($before.state) assignedNodeId=$($before.assignedNodeId)"
$nodes = Nodes (Dump)

# (2) NON-INTERACTIVITY of the unavailable provider entry, from the UI tree itself.
$un = $nodes | Where-Object { $_.text -like '*Not available*' } | Select-Object -First 1
if ($un) {
  "S6 unavailable entry: text='$($un.text)' clickable=$($un.clickable) at $($un.x),$($un.y)"
  if ($un.clickable) { "S6 RESULT2 FAIL - the unavailable entry IS clickable in the UI tree" }
  else { "S6 RESULT2 PASS - the unavailable provider entry is NOT clickable in the UI tree" }
  $stateBefore = (TaskOf $t.id).state
  & $adb shell input tap $un.x $un.y 2>&1 | Out-Null
  Start-Sleep -Seconds 3
  $afterTap = (TaskOf $t.id).state
  if ($stateBefore -eq $afterTap) { "S6 tapping the unavailable entry changed nothing (state $stateBefore -> $afterTap), consistent with a no-op" }
  else { "S6 tapping the unavailable entry DID change state $stateBefore -> $afterTap" }
} else { "S6 unavailable entry not present in this dump" }

# (1) the CHOICE through the Android control.
$c = $nodes | Where-Object { $_.text -eq 'Choose another service' } | Select-Object -First 1
if ($c) { "S6 choice control: clickable=$($c.clickable) at $($c.x),$($c.y)" }
"S6 choice tap: $(TapText 'Choose another service')"
Start-Sleep -Seconds 4
$after = TaskOf $t.id
$nv = (Nodes (Dump)) | Where-Object { $_.text.Trim().Length -gt 0 } | ForEach-Object { $_.text } | Sort-Object -Unique
"S6 AFTER TAP state=$($after.state) assignedNodeId=$($after.assignedNodeId)"
"S6 rendered now: $($nv -join ' | ')"
try {
  $ev = ((Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/city' -Headers $h -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json).events | Where-Object { $_.taskId -eq $t.id }
  "S6 events for the task: $(($ev | ForEach-Object { "$($_.type)(actor=$($_.actor))" }) -join ', ')"
} catch { "S6 event read failed" }
"S6_END"
foreach ($p in @($gw)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
