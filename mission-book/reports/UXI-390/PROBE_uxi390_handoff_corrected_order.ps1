# UXI-390: the handoff seam, in the CORRECTED ORDER.
#
# Rounds 174-177 each failed for a different reason, and the last one read the cause out of the planner code:
# routeStageFor finds the index of the CURRENTLY ASSIGNED device among the candidates and returns null if it
# is not there. So the seam needs the SAME TASK to be both assigned-and-in-flight AND the task whose switch
# the user declines. This does exactly that, in that order, and nothing else.
$ErrorActionPreference = 'Continue'
$root = 'D:\utopia-uxi390'
$port = Get-Random -Minimum 4900 -Maximum 4999
$env:CITY_TOKEN = 'alien-hc'; $env:CITY_NODE_TOKEN = 'alien-hc-node'
$env:CITY_PORT = "$port"; $env:CITY_HOST = '127.0.0.1'
$env:CITY_URL = "http://127.0.0.1:$port"; $env:CITY_ROOMS_URL = "http://127.0.0.1:$($port+1)"
# SHARED data directory deliberately: the fresh one suppressed the second node registration last round.
Remove-Item Env:CITY_DATA -ErrorAction SilentlyContinue
Remove-Item Env:CITY_WORKSPACE -ErrorAction SilentlyContinue
Remove-Item Env:CITY_TELEMETRY_DISABLED -ErrorAction SilentlyContinue
Set-Location $root
$gw = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'services/dev-gateway/main.mjs' -WorkingDirectory $root -RedirectStandardError "$root\.runtime\gw-hc.log"
$healthy = $false
for ($i = 0; $i -lt 25; $i++) { Start-Sleep -Seconds 1; try { if ((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/health" -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200) { $healthy = $true; break } } catch { } }
if (-not $healthy) { "HC gateway not healthy"; exit 1 }
$nA = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
$nB = Start-Process -PassThru -WindowStyle Hidden -FilePath '.runtime/node-b.mjs' -WorkingDirectory $root
$h = @{ Authorization = 'Bearer ' + $env:CITY_TOKEN; 'X-City-Api-Version' = '0'; 'X-City-Schema-Version' = '0' }
$cands = 0
for ($i = 0; $i -lt 40 -and $cands -lt 2; $i++) { Start-Sleep -Seconds 1; try { $cands = @(((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/city" -Headers $h -UseBasicParsing -TimeoutSec 4).Content | ConvertFrom-Json).nodes).Count } catch { } }
"HC candidates: $cands"
if ($cands -lt 2) { "HC REFUSING TO MEASURE: needs two candidates"; foreach ($p in @($gw,$nA,$nB)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }; "HC_END"; exit 1 }

# ONE holding task, then WAIT for it to be assigned and running BEFORE any decline.
$t = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks" -Method POST -Headers $h -Body (@{type='WAIT'} | ConvertTo-Json -Compress) -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json
"HC task $($t.id)"
$assigned = $false
for ($i = 0; $i -lt 20 -and -not $assigned; $i++) {
  Start-Sleep -Milliseconds 400
  $cur = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks/$($t.id)" -Headers $h -UseBasicParsing -TimeoutSec 4).Content | ConvertFrom-Json
  if ($cur.state -eq 'RUNNING' -and $cur.assignedNodeId) { $assigned = $true; "HC observed RUNNING on $($cur.assignedNodeId) - declining NOW, inside the ~6s window" }
}
if (-not $assigned) { "HC never observed the task assigned and running; refusing to interpret a decline without it" }
try { $d = Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks/$($t.id)/switch-declined" -Method POST -Headers $h -Body '{}' -ContentType 'application/json' -UseBasicParsing; "HC switch-declined -> $($d.StatusCode)" } catch { "HC switch-declined -> $($_.Exception.Message.Substring(0,[Math]::Min(70,$_.Exception.Message.Length)))" }

for ($i = 0; $i -lt 10; $i++) {
  Start-Sleep -Milliseconds 700
  $cur = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks/$($t.id)" -Headers $h -UseBasicParsing -TimeoutSec 4).Content | ConvertFrom-Json
  $pres = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/presentation" -Headers $h -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json
  $entry = @($pres.tasks) | Where-Object { $_.taskId -eq $t.id } | Select-Object -First 1
  $st = if ($entry) { $entry.dto.state } else { '(none)' }
  $tm = if ($entry) { ($entry.dto.terms -join '+') } else { '' }
  "HC t+$($i+1) backendState=$($cur.state) assigned=$($cur.assignedNodeId) presentationState=$st terms=$tm"
}
"HC_END"
foreach ($p in @($gw, $nA, $nB)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
