# UXI-390: Android device failure AND RECOVERY, on a PER-RUN PORT.
#
# Rounds 161-164 established why this probe kept measuring a contaminated city and why that cannot be fixed
# by cleanup: two leaked reference nodes were alive (pids 21704 and 70444, command lines read and matched),
# and killing them TRIPPED THE HARNESS JOB RUNNER, because they were started by earlier harness-managed
# commands and sit inside the runner's managed process range.
#
# So the fix is not a better sweep. A leaked node is HARDWIRED to port 4310, so a gateway on a per-run port
# cannot have it attach: the contamination becomes impossible BY CONSTRUCTION, with nothing to kill. The
# probe therefore also seeds the app's own stored host with that port and reverses it.
$ErrorActionPreference = 'Continue'
$root = 'D:\utopia-uxi390'
$adb = 'C:\Users\15601\AppData\Local\Android\Sdk\platform-tools\adb.exe'
$port = Get-Random -Minimum 4500 -Maximum 4599
$hub = $port + 1
$env:CITY_TOKEN = 'alien-rec'; $env:CITY_NODE_TOKEN = 'alien-rec-node'
$env:CITY_PORT = "$port"; $env:CITY_HOST = '127.0.0.1'
$env:CITY_URL = "http://127.0.0.1:$port"; $env:CITY_ROOMS_URL = "http://127.0.0.1:$hub"
$env:ADB = $adb
Remove-Item Env:CITY_TELEMETRY_DISABLED -ErrorAction SilentlyContinue
# Fresh registry too, for the same reason: control the population the measurement depends on.
$fresh = Join-Path $env:TEMP ('uxi390-rec-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path (Join-Path $fresh 'workspace') | Out-Null
$env:CITY_DATA = $fresh; $env:CITY_WORKSPACE = Join-Path $fresh 'workspace'
Set-Location $root
foreach ($p in $port, $hub) {
  Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}
Start-Sleep -Seconds 2
$gw = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'services/dev-gateway/main.mjs' -WorkingDirectory $root -RedirectStandardError "$root\.runtime\gw-rec2.log"
$healthy = $false
for ($i = 0; $i -lt 25; $i++) { Start-Sleep -Seconds 1; try { if ((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/health" -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200) { $healthy = $true; break } } catch { } }
if (-not $healthy) { "S16 gateway not healthy on port $port"; exit 1 }
"S16 gateway healthy on PER-RUN port $port (a leaked node on 4310 cannot attach)"
$nA = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
Start-Sleep -Seconds 8
$h = @{ Authorization = 'Bearer ' + $env:CITY_TOKEN; 'X-City-Api-Version' = '0'; 'X-City-Schema-Version' = '0' }
function Pop { try { return @(((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/city" -Headers $h -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json).nodes) } catch { return @() } }
$pop = @(Pop)   # @() here, because a function return UNROLLS a one-element array and .Count on a bare object is null
"S16 node population: $($pop.Count) -> $(($pop | ForEach-Object { $_.id }) -join ', ')"
if ($pop.Count -ne 1) { "S16 POPULATION IS NOT 1 - the measurement is not controlled; stopping"; foreach ($p in @($gw,$nA)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }; "S16_END"; exit 1 }

$xmlc = "<?xml version='1.0' encoding='utf-8' standalone='yes' ?>`n<map>`n    <string name=`"host`">http://127.0.0.1:$port</string>`n    <string name=`"token`">$($env:CITY_TOKEN)</string>`n</map>`n"
$tmp = Join-Path $env:TEMP 'cc-rec2.xml'
[System.IO.File]::WriteAllText($tmp, $xmlc, (New-Object System.Text.UTF8Encoding($false)))
& $adb shell am force-stop city.utopia.control 2>&1 | Out-Null
& $adb push $tmp /data/local/tmp/cc-rec2.xml 2>&1 | Out-Null
& $adb shell run-as city.utopia.control mkdir -p shared_prefs 2>&1 | Out-Null
& $adb shell run-as city.utopia.control cp /data/local/tmp/cc-rec2.xml shared_prefs/city-connection.xml 2>&1 | Out-Null
& $adb reverse "tcp:$port" "tcp:$port" 2>&1 | Out-Null
& $adb shell input keyevent 224 2>&1 | Out-Null
& $adb shell am start -n city.utopia.control/.MainActivity 2>&1 | Out-Null
Start-Sleep -Seconds 10

function Dump { & $adb shell uiautomator dump /data/local/tmp/rec2.xml 2>&1 | Out-Null; return (& $adb shell cat /data/local/tmp/rec2.xml 2>&1 | Out-String) }
function Texts($x) { $o = New-Object System.Collections.ArrayList; foreach ($m in [regex]::Matches($x, 'text="([^"]+)"')) { [void]$o.Add($m.Groups[1].Value) }; return $o }
function NavDevices { $d = Dump; foreach ($m in [regex]::Matches($d, '<node\s+([^>]+?)/?>')) { $a = $m.Groups[1].Value; if ($a -notmatch 'text="Devices"') { continue }; $b = [regex]::Match($a, 'bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"'); if (-not $b.Success) { continue }; $x = ([int]$b.Groups[1].Value + [int]$b.Groups[3].Value) -shr 1; $y = ([int]$b.Groups[2].Value + [int]$b.Groups[4].Value) -shr 1; if ($x -eq 0 -and $y -eq 0) { continue }; & $adb shell input tap $x $y 2>&1 | Out-Null; return $true }; return $false }

NavDevices | Out-Null
Start-Sleep -Seconds 3
$base = (Texts (Dump)) | Where-Object { $_.Trim().Length -gt 0 } | Sort-Object -Unique
"S16 BASELINE: $($base -join ' | ')"

Stop-Process -Id $nA.Id -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 14
$down = (Texts (Dump)) | Where-Object { $_.Trim().Length -gt 0 } | Sort-Object -Unique
"S16 AFTER KILL: $($down -join ' | ')"
$downJ = $down -join '|'
$sawFailure = $downJ -match 'OFFLINE|Cached|Reconnect'

"S16 RESTARTING the node"
$nA2 = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
Start-Sleep -Seconds 18
$up = (Texts (Dump)) | Where-Object { $_.Trim().Length -gt 0 } | Sort-Object -Unique
"S16 AFTER RECOVERY: $($up -join ' | ')"
$upJ = $up -join '|'
$sawRecovery = ($upJ -match 'ONLINE') -and -not ($upJ -match 'Cached|Reconnect')

"S16 RESULT failure observed truthfully : $sawFailure"
"S16 RESULT recovery observed          : $sawRecovery"
"S16 backend nodes now: $(((Pop) | ForEach-Object { $_.id }) -join ', ')"
"S16 gateway exited: $($gw.HasExited)"
"S16_END"
foreach ($p in @($gw, $nA2)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
