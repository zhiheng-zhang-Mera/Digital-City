# UXI-390: THE HANDOFF DRIVE, every precondition now measured rather than hoped.
#
#   fresh data directory  -> no stale registrations                 (round 178)
#   A then B sequentially -> two candidates, asserted               (round 180: back-to-back is a RACE)
#   one holding task      -> observed ASSIGNED and RUNNING first    (round 177: the planner guard needs it)
#   decline inside window -> switch-declined for THAT SAME TASK     (round 176: only this sets the flag)
#   then read the presentation state                                -> REMOTE_HANDOFF?
$ErrorActionPreference = 'Continue'
$root = 'D:\utopia-uxi390'
$port = Get-Random -Minimum 5200 -Maximum 5299
$env:CITY_TOKEN = 'alien-hd'; $env:CITY_NODE_TOKEN = 'alien-hd-node'
$env:CITY_PORT = "$port"; $env:CITY_HOST = '127.0.0.1'
$env:CITY_URL = "http://127.0.0.1:$port"; $env:CITY_ROOMS_URL = "http://127.0.0.1:$($port+1)"
$fresh = Join-Path $env:TEMP ('uxi390-hd-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path (Join-Path $fresh 'workspace') | Out-Null
$env:CITY_DATA = $fresh; $env:CITY_WORKSPACE = Join-Path $fresh 'workspace'
Remove-Item Env:CITY_TELEMETRY_DISABLED -ErrorAction SilentlyContinue
Set-Location $root
$gw = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'services/dev-gateway/main.mjs' -WorkingDirectory $root -RedirectStandardError "$root\.runtime\gw-hd.log"
$ok = $false
for ($i = 0; $i -lt 25; $i++) { Start-Sleep -Seconds 1; try { if ((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/health" -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200) { $ok = $true; break } } catch { } }
if (-not $ok) { "HD gateway not healthy"; exit 1 }
$h = @{ Authorization = 'Bearer ' + $env:CITY_TOKEN; 'X-City-Api-Version' = '0'; 'X-City-Schema-Version' = '0' }
function NodeIds { try { return @((((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/city" -Headers $h -UseBasicParsing -TimeoutSec 4).Content | ConvertFrom-Json).nodes) | ForEach-Object { $_.id }) } catch { return @() } }

# SEQUENTIAL, ASSERTED: A first, confirmed; then B, then both confirmed.
$a = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
$n = @()
for ($i = 0; $i -lt 25 -and $n.Count -lt 1; $i++) { Start-Sleep -Seconds 1; $n = NodeIds }
"HD after A: $($n.Count) -> $($n -join ', ')"
if ($n.Count -lt 1) { "HD REFUSING: node A did not register"; foreach ($p in @($gw,$a)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }; "HD_END"; exit 1 }
$b = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList '.runtime/node-b.mjs' -WorkingDirectory $root
for ($i = 0; $i -lt 25 -and $n.Count -lt 2; $i++) { Start-Sleep -Seconds 1; $n = NodeIds }
"HD after B: $($n.Count) -> $($n -join ', ')"
if ($n.Count -lt 2) { "HD REFUSING: two candidates required and only $($n.Count) registered"; foreach ($p in @($gw,$a,$b)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }; "HD_END"; exit 1 }

# ONE holding task, then WAIT for OBSERVED assignment before any decline.
$t = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks" -Method POST -Headers $h -Body (@{type='WAIT'} | ConvertTo-Json -Compress) -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json
"HD task $($t.id)"
$assignedNode = $null
for ($i = 0; $i -lt 30 -and -not $assignedNode; $i++) {
  Start-Sleep -Milliseconds 300
  $cur = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks/$($t.id)" -Headers $h -UseBasicParsing -TimeoutSec 4).Content | ConvertFrom-Json
  if ($cur.state -eq 'RUNNING' -and $cur.assignedNodeId) { $assignedNode = $cur.assignedNodeId }
}
if (-not $assignedNode) { "HD REFUSING: the task was never observed assigned and running, so a decline cannot be interpreted"; foreach ($p in @($gw,$a,$b)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }; "HD_END"; exit 1 }
"HD ASSIGNED and RUNNING on $assignedNode - declining NOW"
try { $d = Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks/$($t.id)/switch-declined" -Method POST -Headers $h -Body '{}' -ContentType 'application/json' -UseBasicParsing; "HD switch-declined -> $($d.StatusCode)" } catch { "HD switch-declined -> $($_.Exception.Message.Substring(0,[Math]::Min(70,$_.Exception.Message.Length)))" }

$sawHandoff = $false
for ($i = 0; $i -lt 12; $i++) {
  Start-Sleep -Milliseconds 500
  $cur = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks/$($t.id)" -Headers $h -UseBasicParsing -TimeoutSec 4).Content | ConvertFrom-Json
  $pres = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/presentation" -Headers $h -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json
  $entry = @($pres.tasks) | Where-Object { $_.taskId -eq $t.id } | Select-Object -First 1
  $st = if ($entry) { $entry.dto.state } else { '(none)' }
  $tm = if ($entry) { ($entry.dto.terms -join '+') } else { '' }
  if ($st -eq 'REMOTE_HANDOFF') { $sawHandoff = $true }
  "HD t+$($i+1) backend=$($cur.state) assigned=$($cur.assignedNodeId) presentation=$st terms=$tm"
}
"HD RESULT remote handoff observed : $sawHandoff"
"HD final nodes: $((NodeIds) -join ', ')"
"HD_END"
foreach ($p in @($gw, $a, $b)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
