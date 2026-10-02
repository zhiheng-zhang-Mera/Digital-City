# UXI-390: resolve the WAIT-assignment discrepancy between Mech's harness and mine.
#
# Mech reports ten of ten WAIT tasks staying QUEUED and unassigned for twelve seconds with node A online.
# My records say WAIT tasks are observed RUNNING with a ~6090 ms hold. One of us is measuring something the
# other is not, so this reproduces MY claim minimally and prints the whole histogram, so the difference is
# visible rather than argued: if WAIT runs here, Mech's harness omits something; if it does not, my earlier
# reading was wrong and I must withdraw it.
$ErrorActionPreference = 'Continue'
$root = 'D:\utopia-uxi390'
$port = Get-Random -Minimum 4700 -Maximum 4799
$env:CITY_TOKEN = 'alien-wait'; $env:CITY_NODE_TOKEN = 'alien-wait-node'
$env:CITY_PORT = "$port"; $env:CITY_HOST = '127.0.0.1'
$env:CITY_URL = "http://127.0.0.1:$port"; $env:CITY_ROOMS_URL = "http://127.0.0.1:$($port+1)"
$fresh = Join-Path $env:TEMP ('uxi390-wait-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path (Join-Path $fresh 'workspace') | Out-Null
$env:CITY_DATA = $fresh; $env:CITY_WORKSPACE = Join-Path $fresh 'workspace'
Remove-Item Env:CITY_TELEMETRY_DISABLED -ErrorAction SilentlyContinue
Set-Location $root
$gw = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'services/dev-gateway/main.mjs' -WorkingDirectory $root -RedirectStandardError "$root\.runtime\gw-wait.log"
$healthy = $false
for ($i = 0; $i -lt 25; $i++) { Start-Sleep -Seconds 1; try { if ((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/health" -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200) { $healthy = $true; break } } catch { } }
if (-not $healthy) { "SW gateway not healthy on $port"; Stop-Process -Id $gw.Id -Force -ErrorAction SilentlyContinue; exit 1 }
"SW gateway healthy on per-run port $port"
$node = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
Start-Sleep -Seconds 8
$h = @{ Authorization = 'Bearer ' + $env:CITY_TOKEN; 'X-City-Api-Version' = '0'; 'X-City-Schema-Version' = '0' }
$city = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/city" -Headers $h -UseBasicParsing).Content | ConvertFrom-Json
"SW nodes registered: $(@($city.nodes).Count) -> $((@($city.nodes) | ForEach-Object { $_.id }) -join ', ')"
"SW node capabilities: $((@($city.nodes) | ForEach-Object { ($_.capabilities -join '+') }) -join ' | ')"

$ids = @()
for ($i = 0; $i -lt 10; $i++) {
  $r = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks" -Method POST -Headers $h -Body (@{type='WAIT'} | ConvertTo-Json -Compress) -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json
  $ids += $r.id
}
"SW created 10 WAIT tasks"
for ($t = 0; $t -lt 12; $t++) {
  Start-Sleep -Seconds 1
  $ts = @(((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/tasks" -Headers $h -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json).tasks)
  $hist = @{}
  foreach ($task in $ts) {
    if ($ids -notcontains $task.id) { continue }
    $k = "$($task.state)/$(if ($task.assignedNodeId) { 'assigned' } else { 'unassigned' })"
    if (-not $hist.ContainsKey($k)) { $hist[$k] = 0 }
    $hist[$k]++
  }
  $s = ($hist.GetEnumerator() | Sort-Object Name | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join ' '
  "SW t+$($t+1)s  $s"
}
"SW_END"
foreach ($p in @($gw, $node)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
