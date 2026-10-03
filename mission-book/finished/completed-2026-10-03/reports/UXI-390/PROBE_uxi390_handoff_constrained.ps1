# UXI-390: the handoff drive with the FIFTH condition - the target must sit on a CONSTRAINED device.
#
# Round 181 satisfied four conditions and produced nothing, because the target landed on the FREE node and a
# healthy run has no reason to be rerouted. So this run forces the target onto A while A is the only device,
# then makes A constrained by queueing work behind it, then brings B up as the free alternate, then declines.
# Everything must happen inside the ~6 s WAIT window, so the sleeps are deliberately minimal.
$ErrorActionPreference = 'Continue'
$root = 'D:\utopia-uxi390'
$port = Get-Random -Minimum 5300 -Maximum 5399
$env:CITY_TOKEN = 'alien-h5'; $env:CITY_NODE_TOKEN = 'alien-h5-node'
$env:CITY_PORT = "$port"; $env:CITY_HOST = '127.0.0.1'
$env:CITY_URL = "http://127.0.0.1:$port"; $env:CITY_ROOMS_URL = "http://127.0.0.1:$($port+1)"
$fresh = Join-Path $env:TEMP ('uxi390-h5-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path (Join-Path $fresh 'workspace') | Out-Null
$env:CITY_DATA = $fresh; $env:CITY_WORKSPACE = Join-Path $fresh 'workspace'
Remove-Item Env:CITY_TELEMETRY_DISABLED -ErrorAction SilentlyContinue
Set-Location $root
$gw = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'services/dev-gateway/main.mjs' -WorkingDirectory $root -RedirectStandardError "$root\.runtime\gw-h5.log"
$ok = $false
for ($i = 0; $i -lt 25; $i++) { Start-Sleep -Seconds 1; try { if ((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/health" -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200) { $ok = $true; break } } catch { } }
if (-not $ok) { "H5 gateway not healthy"; exit 1 }
$h = @{ Authorization = 'Bearer ' + $env:CITY_TOKEN; 'X-City-Api-Version' = '0'; 'X-City-Schema-Version' = '0' }
function NodeIds { try { return @((((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/city" -Headers $h -UseBasicParsing -TimeoutSec 4).Content | ConvertFrom-Json).nodes) | ForEach-Object { $_.id }) } catch { return @() } }
function NewTask { return (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks" -Method POST -Headers $h -Body (@{type='WAIT'} | ConvertTo-Json -Compress) -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json }
function State($id) { try { return ((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks/$id" -Headers $h -UseBasicParsing -TimeoutSec 4).Content | ConvertFrom-Json) } catch { return $null } }

# A ONLY, so the target is forced onto A.
$a = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
$n = @()
for ($i = 0; $i -lt 25 -and $n.Count -lt 1; $i++) { Start-Sleep -Seconds 1; $n = NodeIds }
"H5 A only: $($n -join ', ')"
if ($n.Count -lt 1) { "H5 REFUSING: A not registered"; exit 1 }

$t = NewTask
"H5 target $($t.id) created with ONLY A present, so it must be assigned to A"
$assign = $null
for ($i = 0; $i -lt 20 -and -not $assign; $i++) { Start-Sleep -Milliseconds 200; $c = State $t.id; if ($c.state -eq 'RUNNING' -and $c.assignedNodeId) { $assign = $c.assignedNodeId } }
"H5 target assigned to $assign"
if (-not $assign -or $assign -ne 'alien-reference-node') { "H5 REFUSING: target did not land on A, so the fifth condition cannot be built"; foreach ($p in @($gw,$a)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }; "H5_END"; exit 1 }

# Constrain A immediately by queueing behind the target.
$behind = @()
for ($i = 0; $i -lt 3; $i++) { $behind += (NewTask).id }
"H5 queued $($behind.Count) behind the target so A reports AT_CAPACITY"
# Bring B up as the FREE alternate.
$b = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList '.runtime/node-b.mjs' -WorkingDirectory $root
$n2 = @()
for ($i = 0; $i -lt 20 -and $n2.Count -lt 2; $i++) { Start-Sleep -Milliseconds 250; $n2 = NodeIds }
"H5 nodes now: $($n2 -join ', ')"
try { $d = Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks/$($t.id)/switch-declined" -Method POST -Headers $h -Body '{}' -ContentType 'application/json' -UseBasicParsing; "H5 switch-declined -> $($d.StatusCode)" } catch { "H5 switch-declined -> $($_.Exception.Message.Substring(0,[Math]::Min(60,$_.Exception.Message.Length)))" }

$saw = $false
for ($i = 0; $i -lt 14; $i++) {
  Start-Sleep -Milliseconds 400
  $c = State $t.id
  $pres = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/presentation" -Headers $h -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json
  $entry = @($pres.tasks) | Where-Object { $_.taskId -eq $t.id } | Select-Object -First 1
  $st = if ($entry) { $entry.dto.state } else { '(none)' }
  $tm = if ($entry) { ($entry.dto.terms -join '+') } else { '' }
  if ($st -eq 'REMOTE_HANDOFF') { $saw = $true }
  "H5 t+$($i+1) backend=$($c.state) assigned=$($c.assignedNodeId) presentation=$st terms=$tm"
}
"H5 RESULT remote handoff observed: $saw"
"H5_END"
foreach ($p in @($gw, $a, $b)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
