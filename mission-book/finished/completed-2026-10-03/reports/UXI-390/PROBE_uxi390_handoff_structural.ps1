# UXI-390: SIXTH CONDITION, written fresh rather than patched (a patch whose anchor misses silently no-ops,
# which is exactly what happened last round). Every precondition is asserted and the script EXITS rather than
# interpreting anything if one fails.
#
#   2 candidates -> target ASSIGNED and RUNNING on A -> B up as free alternate -> STOP A (structural, not
#   merely full) -> decline -> read the presentation state.
$ErrorActionPreference = 'Continue'
$root = 'D:\utopia-uxi390'
$port = Get-Random -Minimum 5400 -Maximum 5499
$env:CITY_TOKEN = 'alien-s6'; $env:CITY_NODE_TOKEN = 'alien-s6-node'
$env:CITY_PORT = "$port"; $env:CITY_HOST = '127.0.0.1'
$env:CITY_URL = "http://127.0.0.1:$port"; $env:CITY_ROOMS_URL = "http://127.0.0.1:$($port+1)"
$fresh = Join-Path $env:TEMP ('uxi390-s6-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path (Join-Path $fresh 'workspace') | Out-Null
$env:CITY_DATA = $fresh; $env:CITY_WORKSPACE = Join-Path $fresh 'workspace'
Remove-Item Env:CITY_TELEMETRY_DISABLED -ErrorAction SilentlyContinue
Set-Location $root
$gw = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'services/dev-gateway/main.mjs' -WorkingDirectory $root -RedirectStandardError "$root\.runtime\gw-s6.log"
$ok = $false
for ($i = 0; $i -lt 25; $i++) { Start-Sleep -Seconds 1; try { if ((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/health" -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200) { $ok = $true; break } } catch { } }
if (-not $ok) { "S6 FAIL: gateway not healthy"; exit 1 }
$h = @{ Authorization = 'Bearer ' + $env:CITY_TOKEN; 'X-City-Api-Version' = '0'; 'X-City-Schema-Version' = '0' }
function NodeIds { try { return @((((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/city" -Headers $h -UseBasicParsing -TimeoutSec 4).Content | ConvertFrom-Json).nodes) | ForEach-Object { $_.id }) } catch { return @() } }
function NewW { return (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks" -Method POST -Headers $h -Body (@{type='WAIT'} | ConvertTo-Json -Compress) -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json }
function St($id) { try { return ((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks/$id" -Headers $h -UseBasicParsing -TimeoutSec 4).Content | ConvertFrom-Json) } catch { return $null } }

$a = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
$n = @()
for ($i = 0; $i -lt 25 -and $n.Count -lt 1; $i++) { Start-Sleep -Seconds 1; $n = NodeIds }
if ($n.Count -lt 1) { "S6 FAIL: A did not register"; exit 1 }
"S6 A registered: $($n -join ', ')"
$t = NewW
$assign = $null
for ($i = 0; $i -lt 20 -and -not $assign; $i++) { Start-Sleep -Milliseconds 200; $c = St $t.id; if ($c.state -eq 'RUNNING' -and $c.assignedNodeId) { $assign = $c.assignedNodeId } }
if ($assign -ne 'alien-reference-node') { "S6 FAIL: target did not land on A (got '$assign')"; foreach ($p in @($gw,$a)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }; exit 1 }
"S6 target $($t.id) ASSIGNED and RUNNING on $assign"
$b = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList '.runtime/node-b.mjs' -WorkingDirectory $root
$n2 = @()
for ($i = 0; $i -lt 24 -and $n2.Count -lt 2; $i++) { Start-Sleep -Milliseconds 250; $n2 = NodeIds }
if ($n2.Count -lt 2) { "S6 FAIL: two candidates required, got $($n2.Count)"; foreach ($p in @($gw,$a,$b)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }; exit 1 }
"S6 two candidates: $($n2 -join ', ')"
# THE SIXTH CONDITION, APPLIED AND ASSERTED: stop A so the ASSIGNED device is structurally unreachable.
Stop-Process -Id $a.Id -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
$aDead = (Get-Process -Id $a.Id -ErrorAction SilentlyContinue) -eq $null
"S6 A STOPPED and confirmed gone: $aDead"
if (-not $aDead) { "S6 FAIL: A is still alive, so the condition was not applied"; exit 1 }
try { $d = Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks/$($t.id)/switch-declined" -Method POST -Headers $h -Body '{}' -ContentType 'application/json' -UseBasicParsing; "S6 switch-declined -> $($d.StatusCode)" } catch { "S6 switch-declined -> $($_.Exception.Message.Substring(0,[Math]::Min(60,$_.Exception.Message.Length)))" }
$saw = $false
for ($i = 0; $i -lt 14; $i++) {
  Start-Sleep -Milliseconds 400
  $c = St $t.id
  $pres = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/presentation" -Headers $h -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json
  $e = @($pres.tasks) | Where-Object { $_.taskId -eq $t.id } | Select-Object -First 1
  $st = if ($e) { $e.dto.state } else { '(none)' }
  $tm = if ($e) { ($e.dto.terms -join '+') } else { '' }
  if ($st -eq 'REMOTE_HANDOFF') { $saw = $true }
  "S6 t+$($i+1) backend=$($c.state) assigned=$($c.assignedNodeId) presentation=$st terms=$tm"
}
"S6 RESULT remote handoff observed: $saw"
"S6_END"
foreach ($p in @($gw, $b)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
