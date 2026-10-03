# UXI-390: Android user-event round-trip, ninth pass (Alien) - GATEWAY HARDENED.
#
# Round 140 tapped CONFIRM and recorded no user event, but the app had LOST its gateway connection mid-run
# ("unexpected end of stream"), and that probe captured neither the gateway's exit nor its output - my
# omission, which made the loss undiagnosable. This pass fixes the instrument first:
#   - the gateway's stdout/stderr go to a log and its exit state is read at the end;
#   - the app's connection state is checked BEFORE the tap, so a dead connection can never again be
#     mistaken for an ignored control;
#   - the tap is retried on the live control rather than assumed.
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
$gwLog = "$root\.runtime\gw-uxi390.log"
Remove-Item $gwLog -ErrorAction SilentlyContinue
$gw = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'services/dev-gateway/main.mjs' -WorkingDirectory $root -RedirectStandardOutput "$root\.runtime\gw-out.log" -RedirectStandardError $gwLog
$healthy = $false
for ($i = 0; $i -lt 30; $i++) { Start-Sleep -Seconds 1; try { if ((Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/health' -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200) { $healthy = $true; break } } catch { } }
if (-not $healthy) { "S11 gateway not healthy"; exit 1 }
"S11 gateway healthy pid=$($gw.Id)"
$nodeA = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
$nodeB = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList '.runtime/node-b.mjs' -WorkingDirectory $root
Start-Sleep -Seconds 8
$h = @{ Authorization = 'Bearer ' + $env:CITY_TOKEN; 'X-City-Api-Version' = '0'; 'X-City-Schema-Version' = '0' }
$city = (Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/city' -Headers $h -UseBasicParsing).Content | ConvertFrom-Json
"S11 nodes = $(($city.nodes | ForEach-Object { $_.id }) -join ', ')"

$xml = "<?xml version='1.0' encoding='utf-8' standalone='yes' ?>`n<map>`n    <string name=`"host`">http://127.0.0.1:4310</string>`n    <string name=`"token`">$($env:CITY_TOKEN)</string>`n</map>`n"
$tmp = Join-Path $env:TEMP 'cc-uxi390k.xml'
[System.IO.File]::WriteAllText($tmp, $xml, (New-Object System.Text.UTF8Encoding($false)))
& $adb shell am force-stop city.utopia.control 2>&1 | Out-Null
& $adb push $tmp /data/local/tmp/cc-uxi390k.xml 2>&1 | Out-Null
& $adb shell run-as city.utopia.control mkdir -p shared_prefs 2>&1 | Out-Null
& $adb shell run-as city.utopia.control cp /data/local/tmp/cc-uxi390k.xml shared_prefs/city-connection.xml 2>&1 | Out-Null
& $adb reverse tcp:4310 tcp:4310 2>&1 | Out-Null
& $adb shell input keyevent 224 2>&1 | Out-Null
& $adb shell am start -n city.utopia.control/.MainActivity 2>&1 | Out-Null
Start-Sleep -Seconds 10

function Dump { & $adb shell uiautomator dump /data/local/tmp/uxi390k.xml 2>&1 | Out-Null; return (& $adb shell cat /data/local/tmp/uxi390k.xml 2>&1 | Out-String) }
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
function Live($texts) { return -not (($texts -join '|') -match 'connection is not live|Reconnect to see') }

"S11 nav: $(TapText 'Devices')"
Start-Sleep -Seconds 3
Stop-Process -Id $nodeA.Id -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3
$ids = @()
for ($i = 0; $i -lt 10; $i++) {
  $r = (Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/tasks' -Method POST -Headers $h -Body (@{type='WAIT'}|ConvertTo-Json -Compress) -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json
  $ids += $r.id
}
$target = $ids[-1]
"S11 created $($ids.Count) tasks; target=$target"

# HARDENING: confirm the app is CONNECTED before interpreting any tap.
$pre = Texts (Dump)
"S11 app connected before tap: $(Live $pre)"
"S11 panel pre: $(($pre | Where-Object { $_.Trim().Length -gt 0 } | Sort-Object -Unique) -join ' | ')"

$taps = @()
for ($k = 0; $k -lt 3; $k++) {
  $r = TapText 'Confirm'
  $taps += $r
  if ($r -like 'TAPPED*') { break }
  Start-Sleep -Seconds 2
}
"S11 taps: $($taps -join ' ; ')"
Start-Sleep -Seconds 5

$ev = @()
try { $ev = (((Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/city' -Headers $h -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json).events | Where-Object { $_.taskId -eq $target }) } catch { }
"S11 events for target: $(($ev | ForEach-Object { "$($_.type)(actor=$($_.actor))" }) -join ', ')"
$user = @($ev | Where-Object { $_.actor -eq 'user' })
if ($user.Count -gt 0) { "S11 RESULT1 PASS - $($user.Count) user-actor event(s): $(($user | ForEach-Object { $_.type }) -join ', ')" } else { "S11 RESULT1 not achieved - no user-actor event for the target task" }

$post = Texts (Dump)
"S11 app connected after tap: $(Live $post)"
"S11 panel post: $(($post | Where-Object { $_.Trim().Length -gt 0 } | Sort-Object -Unique) -join ' | ')"
"S11 gateway exited: $($gw.HasExited)"
if (Test-Path $gwLog) { "S11 gateway stderr tail: $((Get-Content $gwLog -Tail 6) -join ' / ')" } else { "S11 gateway log empty" }
"S11_END"
foreach ($p in @($gw, $nodeB)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
