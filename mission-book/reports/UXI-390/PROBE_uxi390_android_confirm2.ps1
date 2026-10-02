# UXI-390: Android CONFIRM actionability diagnostic, tenth pass (Alien).
#
# Round 143 tapped the node whose TEXT is 'Confirm' and got no user event. But a tap is a coordinate, and
# this series already measured that a control's LABEL node can report clickable=False while its parent
# Button is the actionable control. So before concluding anything about the product, this pass answers one
# question with the UI tree itself: IS THERE A CLICKABLE NODE CONTAINING THE CONFIRM CENTRE, AND WHICH IS IT?
#
# It does not parse parent links; it finds every clickable node whose bounds CONTAIN the Confirm centre and
# takes the SMALLEST such node, which is the actionable ancestor in practice. If none contains it, the tap
# could never have reached a control and the earlier negative means nothing.
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
$gw = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'services/dev-gateway/main.mjs' -WorkingDirectory $root -RedirectStandardError "$root\.runtime\gw-out.log"
$healthy = $false
for ($i = 0; $i -lt 30; $i++) { Start-Sleep -Seconds 1; try { if ((Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/health' -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200) { $healthy = $true; break } } catch { } }
if (-not $healthy) { "S12 gateway not healthy"; exit 1 }
"S12 gateway healthy"
$nodeA = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
$nodeB = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList '.runtime/node-b.mjs' -WorkingDirectory $root
Start-Sleep -Seconds 8
$h = @{ Authorization = 'Bearer ' + $env:CITY_TOKEN; 'X-City-Api-Version' = '0'; 'X-City-Schema-Version' = '0' }
$xmlc = "<?xml version='1.0' encoding='utf-8' standalone='yes' ?>`n<map>`n    <string name=`"host`">http://127.0.0.1:4310</string>`n    <string name=`"token`">$($env:CITY_TOKEN)</string>`n</map>`n"
$tmp = Join-Path $env:TEMP 'cc-uxi390l.xml'
[System.IO.File]::WriteAllText($tmp, $xmlc, (New-Object System.Text.UTF8Encoding($false)))
& $adb shell am force-stop city.utopia.control 2>&1 | Out-Null
& $adb push $tmp /data/local/tmp/cc-uxi390l.xml 2>&1 | Out-Null
& $adb shell run-as city.utopia.control mkdir -p shared_prefs 2>&1 | Out-Null
& $adb shell run-as city.utopia.control cp /data/local/tmp/cc-uxi390l.xml shared_prefs/city-connection.xml 2>&1 | Out-Null
& $adb reverse tcp:4310 tcp:4310 2>&1 | Out-Null
& $adb shell input keyevent 224 2>&1 | Out-Null
& $adb shell am start -n city.utopia.control/.MainActivity 2>&1 | Out-Null
Start-Sleep -Seconds 10

function Dump { & $adb shell uiautomator dump /data/local/tmp/uxi390l.xml 2>&1 | Out-Null; return (& $adb shell cat /data/local/tmp/uxi390l.xml 2>&1 | Out-String) }
function Nodes($d) {
  $out = @()
  foreach ($m in [regex]::Matches($d, '<node\s+([^>]+?)/?>')) {
    $a = $m.Groups[1].Value
    $b = [regex]::Match($a, 'bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"')
    if (-not $b.Success) { continue }
    $x1=[int]$b.Groups[1].Value; $y1=[int]$b.Groups[2].Value; $x2=[int]$b.Groups[3].Value; $y2=[int]$b.Groups[4].Value
    $out += [pscustomobject]@{
      text=[regex]::Match($a,'text="([^"]*)"').Groups[1].Value
      cls=[regex]::Match($a,'class="([^"]*)"').Groups[1].Value
      clickable=($a -match 'clickable="true"'); enabled=($a -match 'enabled="true"')
      x1=$x1; y1=$y1; x2=$x2; y2=$y2; area=[math]::Abs(($x2-$x1)*($y2-$y1))
    }
  }
  return $out
}
function TapAt($x,$y){ & $adb shell input tap $x $y 2>&1 | Out-Null }
function Texts($x){ $o=New-Object System.Collections.ArrayList; foreach($m in [regex]::Matches($x,'text="([^"]+)"')){[void]$o.Add($m.Groups[1].Value)}; return $o }

Start-Sleep -Seconds 1
$devices = (Nodes (Dump)) | Where-Object { $_.text -eq 'Devices' } | Select-Object -First 1
if ($devices) { TapAt (($devices.x1+$devices.x2) -shr 1) (($devices.y1+$devices.y2) -shr 1) }
Start-Sleep -Seconds 3
Stop-Process -Id $nodeA.Id -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3
$ids=@(); for($i=0;$i -lt 10;$i++){ $r=(Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/tasks' -Method POST -Headers $h -Body (@{type='WAIT'}|ConvertTo-Json -Compress) -ContentType 'application/json' -UseBasicParsing).Content|ConvertFrom-Json; $ids+=$r.id }
$target=$ids[-1]
"S12 target=$target"

$nodes = Nodes (Dump)
$conf = $nodes | Where-Object { $_.text -eq 'Confirm' } | Select-Object -First 1
if (-not $conf) { "S12 Confirm not present"; foreach($p in @($gw,$nodeB)){Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue}; "S12_END"; exit 0 }
$cx = ($conf.x1 + $conf.x2) -shr 1
$cy = ($conf.y1 + $conf.y2) -shr 1
"S12 Confirm label: class=$($conf.cls) clickable=$($conf.clickable) enabled=$($conf.enabled) bounds=[$($conf.x1),$($conf.y1)][$($conf.x2),$($conf.y2)] centre=$cx,$cy"

$containing = @($nodes | Where-Object { $_.clickable -and $_.x1 -le $cx -and $_.x2 -ge $cx -and $_.y1 -le $cy -and $_.y2 -ge $cy } | Sort-Object area)
"S12 clickable nodes containing the Confirm centre: $($containing.Count)"
$containing | Select-Object -First 4 | ForEach-Object { "   class=$($_.cls) area=$($_.area) text='$($_.text)' bounds=[$($_.x1),$($_.y1)][$($_.x2),$($_.y2)] enabled=$($_.enabled)" }

if ($containing.Count -eq 0) {
  "S12 NO CLICKABLE NODE CONTAINS THE CONFIRM CENTRE - the earlier tap could not have reached a control, so that negative MEANS NOTHING about the product"
} else {
  $act = $containing[0]
  "S12 acting on the SMALLEST containing clickable node, class=$($act.cls)"
  $ax = ($act.x1 + $act.x2) -shr 1; $ay = ($act.y1 + $act.y2) -shr 1
  TapAt $ax $ay
  Start-Sleep -Seconds 5
  $ev = @()
  try { $ev = (((Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/city' -Headers $h -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json).events | Where-Object { $_.taskId -eq $target }) } catch {}
  "S12 events: $(($ev | ForEach-Object { "$($_.type)(actor=$($_.actor))" }) -join ', ')"
  $user = @($ev | Where-Object { $_.actor -eq 'user' })
  if ($user.Count -gt 0) { "S12 RESULT1 PASS - $($user.Count) user-actor event(s): $(($user | ForEach-Object { $_.type }) -join ', ')" } else { "S12 RESULT1 not achieved - no user-actor event" }
  $post = Texts (Dump)
  "S12 panel post: $(($post | Where-Object { $_.Trim().Length -gt 0 } | Sort-Object -Unique) -join ' | ')"
}
"S12 gateway exited: $($gw.HasExited)"
"S12_END"
foreach($p in @($gw,$nodeB)){Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue}
