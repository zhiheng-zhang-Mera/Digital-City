# UXI-390: THE HANDOFF DRIVE, with the last condition read out of the code rather than guessed.
#
# planRoute stage 1 returns DIRECT - which routeStageFor maps to NULL - while the current device is ELIGIBLE.
# So the decline must be issued AFTER the gateway reports the current device refusing. Round 184 declined
# inside the 6s hold window, when the gateway still called A healthy, and that is why nothing appeared.
#
# Killing the executor also leaves the task STALLED in RUNNING, so the window is no longer the hold length -
# it is as long as the reclassification takes. The wait is DRIVEN BY THE TERMS, not by a clock.
$ErrorActionPreference = 'Continue'
$root = 'D:\utopia-uxi390'
$port = Get-Random -Minimum 5500 -Maximum 5599
$env:CITY_TOKEN = 'alien-h7'; $env:CITY_NODE_TOKEN = 'alien-h7-node'
$env:CITY_PORT = "$port"; $env:CITY_HOST = '127.0.0.1'
$env:CITY_URL = "http://127.0.0.1:$port"; $env:CITY_ROOMS_URL = "http://127.0.0.1:$($port+1)"
$fresh = Join-Path $env:TEMP ('uxi390-h7-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path (Join-Path $fresh 'workspace') | Out-Null
$env:CITY_DATA = $fresh; $env:CITY_WORKSPACE = Join-Path $fresh 'workspace'
Remove-Item Env:CITY_TELEMETRY_DISABLED -ErrorAction SilentlyContinue
Set-Location $root
$gw = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'services/dev-gateway/main.mjs' -WorkingDirectory $root -RedirectStandardError "$root\.runtime\gw-h7.log"
$ok = $false
for ($i = 0; $i -lt 25; $i++) { Start-Sleep -Seconds 1; try { if ((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/health" -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200) { $ok = $true; break } } catch { } }
if (-not $ok) { "H7 FAIL: gateway not healthy"; exit 1 }
$h = @{ Authorization = 'Bearer ' + $env:CITY_TOKEN; 'X-City-Api-Version' = '0'; 'X-City-Schema-Version' = '0' }
function NodeIds { try { return @((((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/city" -Headers $h -UseBasicParsing -TimeoutSec 4).Content | ConvertFrom-Json).nodes) | ForEach-Object { $_.id }) } catch { return @() } }
function Pres($id) { try { $p = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/presentation" -Headers $h -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json; return @($p.tasks) | Where-Object { $_.taskId -eq $id } | Select-Object -First 1 } catch { return $null } }

$a = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
$n = @(); for ($i = 0; $i -lt 25 -and $n.Count -lt 1; $i++) { Start-Sleep -Seconds 1; $n = NodeIds }
if ($n.Count -lt 1) { "H7 FAIL: A not registered"; exit 1 }
$t = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks" -Method POST -Headers $h -Body (@{type='WAIT'} | ConvertTo-Json -Compress) -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json
$assign = $null
for ($i = 0; $i -lt 20 -and -not $assign; $i++) { Start-Sleep -Milliseconds 200; $c = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks/$($t.id)" -Headers $h -UseBasicParsing -TimeoutSec 4).Content | ConvertFrom-Json; if ($c.state -eq 'RUNNING' -and $c.assignedNodeId) { $assign = $c.assignedNodeId } }
if ($assign -ne 'alien-reference-node') { "H7 FAIL: target not assigned to A (got '$assign')"; exit 1 }
"H7 target $($t.id) RUNNING on A"
$b = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList '.runtime/node-b.mjs' -WorkingDirectory $root
$n2 = @(); for ($i = 0; $i -lt 24 -and $n2.Count -lt 2; $i++) { Start-Sleep -Milliseconds 250; $n2 = NodeIds }
if ($n2.Count -lt 2) { "H7 FAIL: two candidates required, got $($n2.Count)"; exit 1 }
"H7 two candidates: $($n2 -join ', ')"
Stop-Process -Id $a.Id -Force -ErrorAction SilentlyContinue
$aDead = $false
for ($j = 0; $j -lt 20 -and -not $aDead; $j++) { Start-Sleep -Milliseconds 500; $aDead = (Get-Process -Id $a.Id -ErrorAction SilentlyContinue) -eq $null }
"H7 A stopped after bounded wait: $aDead"
if (-not $aDead) { "H7 FAIL: A still alive"; exit 1 }

# TERMS-DRIVEN WAIT: the code requires the CURRENT DEVICE to be ineligible before a declined switch means
# anything, so wait for the gateway to say so rather than declining on a clock.
$ineligible = $false
for ($i = 0; $i -lt 60 -and -not $ineligible; $i++) {
  Start-Sleep -Seconds 1
  $e = Pres $t.id
  $tm = if ($e) { ($e.dto.terms -join '+') } else { '(none)' }
  $st = if ($e) { $e.dto.state } else { '(none)' }
  if ($tm -match 'DEVICE_REFUSING|DEVICE_UNREACHABLE|DEVICE_DISABLED|SESSION_ENDED') { $ineligible = $true; "H7 current device reported INELIGIBLE at t+$($i+1)s: terms=$tm state=$st" }
  elseif ($i % 5 -eq 4) { "H7 waiting, t+$($i+1)s terms=$tm state=$st" }
}
if (-not $ineligible) { "H7 FAIL: the current device was never reported ineligible, so a decline still cannot mean anything"; "H7_END"; foreach ($p in @($gw,$b)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }; exit 1 }
try { $d = Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks/$($t.id)/switch-declined" -Method POST -Headers $h -Body '{}' -ContentType 'application/json' -UseBasicParsing; "H7 switch-declined -> $($d.StatusCode)" } catch { "H7 switch-declined -> $($_.Exception.Message.Substring(0,[Math]::Min(60,$_.Exception.Message.Length)))" }
$saw = $false
for ($i = 0; $i -lt 12; $i++) {
  Start-Sleep -Milliseconds 500
  $c = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks/$($t.id)" -Headers $h -UseBasicParsing -TimeoutSec 4).Content | ConvertFrom-Json
  $e = Pres $t.id
  $st = if ($e) { $e.dto.state } else { '(none)' }
  $tm = if ($e) { ($e.dto.terms -join '+') } else { '' }
  if ($st -eq 'REMOTE_HANDOFF') { $saw = $true }
  "H7 t+$($i+1) backend=$($c.state) assigned=$($c.assignedNodeId) presentation=$st terms=$tm"
}
"H7 RESULT remote handoff observed: $saw"
"H7_END"
foreach ($p in @($gw, $b)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
