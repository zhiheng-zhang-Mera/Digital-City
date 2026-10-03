# UXI-390: can the REMOTE_HANDOFF condition be PRODUCED? Mech could not, and neither host has driven it.
#
# Last round proved the ingredient: a reference node IS held occupied by WAIT work for ~6s, serially. This
# uses it - hold node A busy, with node B eligible as an alternate, and ask the presentation feed what route
# stage the planner reports. The question is narrow and the answer is a state, not a story.
$ErrorActionPreference = 'Continue'
$root = 'D:\utopia-uxi390'
$port = Get-Random -Minimum 4800 -Maximum 4899
$env:CITY_TOKEN = 'alien-ho'; $env:CITY_NODE_TOKEN = 'alien-ho-node'
$env:CITY_PORT = "$port"; $env:CITY_HOST = '127.0.0.1'
$env:CITY_URL = "http://127.0.0.1:$port"; $env:CITY_ROOMS_URL = "http://127.0.0.1:$($port+1)"
# DIAGNOSTIC VARIANT: SHARED data directory, to distinguish 'fresh data dir' from 'second node never'
# registers' as the cause of the one-candidate result.
# CITY_DATA/CITY_WORKSPACE deliberately NOT set, so the gateway uses the repo .runtime as before.
Remove-Item Env:CITY_TELEMETRY_DISABLED -ErrorAction SilentlyContinue
Set-Location $root
$gw = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'services/dev-gateway/main.mjs' -WorkingDirectory $root -RedirectStandardError "$root\.runtime\gw-ho.log"
$healthy = $false
for ($i = 0; $i -lt 25; $i++) { Start-Sleep -Seconds 1; try { if ((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/health" -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200) { $healthy = $true; break } } catch { } }
if (-not $healthy) { "SV gateway not healthy"; exit 1 }
$nA = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
$nB = Start-Process -PassThru -WindowStyle Hidden -FilePath '.runtime/node-b.mjs' -WorkingDirectory $root
# PRECONDITION FIRST: the seam needs TWO registered candidates because routeStageFor returns null below two.
# Waiting for the population and REFUSING to measure otherwise is the discipline that turned the Android
# recovery item from four contaminated rounds into one clean pass.
$h0 = @{ Authorization = 'Bearer ' + $env:CITY_TOKEN; 'X-City-Api-Version' = '0'; 'X-City-Schema-Version' = '0' }
$cands = 0
for ($i = 0; $i -lt 40 -and $cands -lt 2; $i++) {
  Start-Sleep -Seconds 1
  try { $cands = @(((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/city" -Headers $h0 -UseBasicParsing -TimeoutSec 4).Content | ConvertFrom-Json).nodes).Count } catch { }
}
"SV candidates registered: $cands"
if ($cands -lt 2) {
  "SV REFUSING TO MEASURE: routeStageFor needs at least two candidates and only $cands registered, so the handoff condition cannot exist and any state read would be meaningless"
  "SV nodeB exited: $($nB.HasExited)"
  if (Test-Path "$root\.runtime\node-b-error.log") { "SH nodeB stderr tail: $((Get-Content "$root\.runtime\node-b-error.log" -Tail 4) -join ' / ')" }
  "SV_END"
  foreach ($p in @($gw, $nA, $nB)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
  exit 1
}
$h = @{ Authorization = 'Bearer ' + $env:CITY_TOKEN; 'X-City-Api-Version' = '0'; 'X-City-Schema-Version' = '0' }
$city = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/city" -Headers $h -UseBasicParsing).Content | ConvertFrom-Json
"SV nodes: $(@($city.nodes).Count) -> $((@($city.nodes) | ForEach-Object { $_.id }) -join ', ')"

# Hold A busy with WAIT work (proven to claim and occupy ~6s each).
$hold = @()
for ($i = 0; $i -lt 4; $i++) {
  $r = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks" -Method POST -Headers $h -Body (@{type='WAIT'} | ConvertTo-Json -Compress) -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json
  $hold += $r.id
}
$target = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks" -Method POST -Headers $h -Body (@{type='WAIT'} | ConvertTo-Json -Compress) -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json
"SV holding A with $($hold.Count) tasks; observing target $($target.id)"
# THE MISSING INGREDIENT: RS-202 planner reaches ALTERNATE_DEVICE only when userDeclinedSwitch is set, and
# only switch-declined sets it. This is the endpoint that exists on the backend and that NO surface calls.
try { $dec = Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks/$($target.id)/switch-declined" -Method POST -Headers $h -Body '{}' -ContentType 'application/json' -UseBasicParsing; "SV switch-declined -> $($dec.StatusCode)" } catch { "SV switch-declined -> $($_.Exception.Message.Substring(0,[Math]::Min(70,$_.Exception.Message.Length)))" }
for ($t = 0; $t -lt 10; $t++) {
  Start-Sleep -Seconds 1
  $all = @(((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks" -Headers $h -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json).tasks)
  $tgt = $all | Where-Object { $_.id -eq $target.id }
  $busy = @($all | Where-Object { $hold -contains $_.id -and $_.state -eq 'RUNNING' }).Count
  $queued = @($all | Where-Object { $hold -contains $_.id -and $_.state -eq 'QUEUED' }).Count
  $pres = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/presentation" -Headers $h -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json
  $entry = @($pres.tasks) | Where-Object { $_.taskId -eq $target.id } | Select-Object -First 1
  $state = if ($entry) { $entry.dto.state + "/terms=" + (($entry.dto.terms) -join "+") } else { '(no entry)' }
  "SV t+$($t+1)s targetState=$($tgt.state) assigned=$($tgt.assignedNodeId) holdRunning=$busy holdQueued=$queued presentationState=$state"
}
"SV routeStage candidates: $((@($pres.candidates)).Count)"
"SV_END"
foreach ($p in @($gw, $nA, $nB)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
