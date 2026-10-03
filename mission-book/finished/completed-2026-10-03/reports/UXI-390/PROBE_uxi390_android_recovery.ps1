# UXI-390: Android device failure AND RECOVERY, driven on the real surface.
#
# The failure half is already verified (executor loss renders OFFICE/Cached truthfully). The RECOVERY half -
# the surface returning to a live state when the device comes back - is the acceptance item still owed, and
# it is cheap because the recipe already exists: kill a node, observe, restart it, observe again.
$ErrorActionPreference = 'Continue'
$root = 'D:\utopia-uxi390'
$adb = 'C:\Users\15601\AppData\Local\Android\Sdk\platform-tools\adb.exe'
$env:CITY_TOKEN = 'alien-uxi390-android-control'; $env:CITY_NODE_TOKEN = 'alien-uxi390-android-node'
$env:CITY_PORT = '4310'; $env:CITY_HOST = '127.0.0.1'; $env:CITY_URL = 'http://127.0.0.1:4310'
$env:CITY_ROOMS_URL = 'http://127.0.0.1:4320'; $env:ADB = $adb
# FRESH REGISTRY PER RUN: the gateway persists its node registry under CITY_DATA, and reusing the
# repository .runtime let a node registered by an EARLIER probe be reloaded on this gateway start, so the
# population was 2 before anything of ours ran and killing one node could not degrade the surface. A
# per-run directory makes the population one node BY CONSTRUCTION rather than by hoping.
$fresh = Join-Path $env:TEMP ('uxi390-fresh-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path $fresh | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $fresh 'workspace') | Out-Null
$env:CITY_DATA = $fresh
$env:CITY_WORKSPACE = Join-Path $fresh 'workspace'
"S15 fresh CITY_DATA: $fresh"
Remove-Item Env:CITY_TELEMETRY_DISABLED -ErrorAction SilentlyContinue
Set-Location $root
foreach ($p in 4310,4320) { Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } }
Start-Sleep -Seconds 2
$gw = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'services/dev-gateway/main.mjs' -WorkingDirectory $root -RedirectStandardError "$root\.runtime\gw-rec.log"
for ($i=0;$i -lt 25;$i++){ Start-Sleep -Seconds 1; try { if ((Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/health' -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200) { break } } catch {} }
# SWEEP strays FIRST: a leaked neighbor from an earlier probe keeps the city populated, so killing our own
# node would not degrade the surface and the measurement would describe an environment we do not control.
# This is the remedy established for the five leaked detached agents behind the RS-290 recovery failure.
$strayCmd = "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -match 'reference-node|node-b' } | ForEach-Object { $_.ProcessId } | ConvertTo-Json -Compress"
$strays = @(); try { $strays = @(powershell.exe -NoProfile -Command $strayCmd | ConvertFrom-Json) } catch {}
foreach ($s in $strays) { try { Stop-Process -Id ([int]$s) -Force -ErrorAction SilentlyContinue } catch {} }
Start-Sleep -Seconds 2
"S15 swept strays: $($strays.Count)"
$nA = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
Start-Sleep -Seconds 7
$h=@{Authorization='Bearer '+$env:CITY_TOKEN;'X-City-Api-Version'='0';'X-City-Schema-Version'='0'}
$pop=((Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/city' -Headers $h -UseBasicParsing).Content|ConvertFrom-Json).nodes
"S15 node population: $($pop.Count) -> $(($pop | ForEach-Object { $_.id }) -join ', ')"

$xmlc = "<?xml version='1.0' encoding='utf-8' standalone='yes' ?>`n<map>`n    <string name=`"host`">http://127.0.0.1:4310</string>`n    <string name=`"token`">$($env:CITY_TOKEN)</string>`n</map>`n"
$tmp = Join-Path $env:TEMP 'cc-rec.xml'
[System.IO.File]::WriteAllText($tmp, $xmlc, (New-Object System.Text.UTF8Encoding($false)))
& $adb shell am force-stop city.utopia.control 2>&1 | Out-Null
& $adb push $tmp /data/local/tmp/cc-rec.xml 2>&1 | Out-Null
& $adb shell run-as city.utopia.control mkdir -p shared_prefs 2>&1 | Out-Null
& $adb shell run-as city.utopia.control cp /data/local/tmp/cc-rec.xml shared_prefs/city-connection.xml 2>&1 | Out-Null
& $adb reverse tcp:4310 tcp:4310 2>&1 | Out-Null
& $adb shell input keyevent 224 2>&1 | Out-Null
& $adb shell am start -n city.utopia.control/.MainActivity 2>&1 | Out-Null
Start-Sleep -Seconds 10
function Dump { & $adb shell uiautomator dump /data/local/tmp/rec.xml 2>&1 | Out-Null; return (& $adb shell cat /data/local/tmp/rec.xml 2>&1 | Out-String) }
function Texts($x){ $o=New-Object System.Collections.ArrayList; foreach($m in [regex]::Matches($x,'text="([^"]+)"')){[void]$o.Add($m.Groups[1].Value)}; return $o }
function NavDevices { $d=Dump; foreach($m in [regex]::Matches($d,'<node\s+([^>]+?)/?>')){ $a=$m.Groups[1].Value; if($a -notmatch 'text="Devices"'){continue}; $b=[regex]::Match($a,'bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"'); if(-not $b.Success){continue}; $x=([int]$b.Groups[1].Value+[int]$b.Groups[3].Value) -shr 1; $y=([int]$b.Groups[2].Value+[int]$b.Groups[4].Value) -shr 1; if($x -eq 0 -and $y -eq 0){continue}; & $adb shell input tap $x $y 2>&1|Out-Null; return $true }; return $false }

NavDevices | Out-Null
Start-Sleep -Seconds 3
$before = (Texts (Dump)) | Where-Object { $_.Trim().Length -gt 0 } | Sort-Object -Unique
"S15 BASELINE: $($before -join ' | ')"

Stop-Process -Id $nA.Id -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 12
$down = (Texts (Dump)) | Where-Object { $_.Trim().Length -gt 0 } | Sort-Object -Unique
"S15 AFTER KILL: $($down -join ' | ')"
$downOffline = ($down -join '|') -match 'OFFLINE|Cached|Reconnect'

"S15 RESTARTING the reference node"
$nA2 = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
Start-Sleep -Seconds 15
$up = (Texts (Dump)) | Where-Object { $_.Trim().Length -gt 0 } | Sort-Object -Unique
"S15 AFTER RECOVERY: $($up -join ' | ')"
$upOnline = (($up -join '|') -match 'ONLINE') -and -not (($up -join '|') -match 'Cached|Reconnect')

"S15 RESULT failure observed truthfully : $downOffline"
"S15 RESULT recovery observed          : $upOnline"
$city=(Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/city' -Headers $h -UseBasicParsing).Content|ConvertFrom-Json
"S15 backend nodes after recovery: $(($city.nodes | ForEach-Object { $_.id }) -join ', ')"
"S15 gateway exited: $($gw.HasExited)"
"S15_END"
foreach ($p in @($gw,$nA2)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
