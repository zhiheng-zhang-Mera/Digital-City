# UXI-301 handoff-seam premise probe (Alien).
#
# Tests the premise behind Mech's deferral: that the City "can create only one task type and it finishes
# in well under a second", and that there is therefore "no way to HOLD a node occupied". This measures the
# OCCUPANCY of each task type directly, by creating one of each and recording the state transitions with
# millisecond timestamps. It does not touch Mech's branch or app code; it drives the frozen City's HTTP API.
#
# One command, because the harness kills the process tree when a tool call ends.
$ErrorActionPreference = 'Continue'
$root = 'D:\utopia-rs290'   # product tree is byte-identical to frozen main 1a5bc0e (verified)
$env:CITY_TOKEN = 'alien-uxi301-premise-probe'
$env:CITY_NODE_TOKEN = 'alien-uxi301-premise-node'
$env:CITY_PORT = '4310'
$env:CITY_HOST = '127.0.0.1'
$env:CITY_ROOMS_URL = 'http://127.0.0.1:4320'
Remove-Item Env:CITY_TELEMETRY_DISABLED -ErrorAction SilentlyContinue
cd $root

foreach ($port in 4310, 4320) {
  Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}
Start-Sleep -Seconds 2

$gw = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'services/dev-gateway/main.mjs' -WorkingDirectory $root
$healthy = $false
for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Seconds 1
  try { if ((Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/health' -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200) { $healthy = $true; break } } catch { }
}
if (-not $healthy) { "GATEWAY_NOT_HEALTHY"; Stop-Process -Id $gw.Id -Force -ErrorAction SilentlyContinue; exit 1 }
"gateway healthy"

$node = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root
Start-Sleep -Seconds 6

$h = @{ Authorization = 'Bearer ' + $env:CITY_TOKEN; 'X-City-Api-Version' = '0'; 'X-City-Schema-Version' = '0' }
$city = (Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/city' -Headers $h -UseBasicParsing).Content | ConvertFrom-Json
"registered nodes = $($city.nodes.Count)  node ids = $(($city.nodes | ForEach-Object { $_.id }) -join ',')"

foreach ($type in @('WAIT', 'CHECKPOINT_DEMO')) {
  $body = @{ type = $type } | ConvertTo-Json -Compress
  $t = (Invoke-WebRequest -Uri 'http://127.0.0.1:4310/api/v0/tasks' -Method POST -Headers $h -Body $body -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json
  $start = Get-Date
  $firstRunningMs = $null
  $terminalMs = $null
  $transitions = New-Object System.Collections.ArrayList
  for ($j = 0; $j -lt 120; $j++) {
    Start-Sleep -Milliseconds 200
    $cur = (Invoke-WebRequest -Uri ("http://127.0.0.1:4310/api/v0/tasks/" + $t.id) -Headers $h -UseBasicParsing).Content | ConvertFrom-Json
    $ms = [int]((Get-Date) - $start).TotalMilliseconds
    $last = if ($transitions.Count -gt 0) { ($transitions[$transitions.Count - 1] -split ':')[1] } else { $null }
    if ($cur.state -ne $last) { [void]$transitions.Add("${ms}ms:$($cur.state)") }
    if ($cur.state -eq 'RUNNING' -and $null -eq $firstRunningMs) { $firstRunningMs = $ms }
    if ($cur.state -in @('COMPLETED', 'FAILED', 'CANCELLED')) { $terminalMs = $ms; break }
  }
  $occupancy = if ($null -ne $firstRunningMs -and $null -ne $terminalMs) { $terminalMs - $firstRunningMs } else { 'n/a' }
  "TYPE=$type  created_id=$($t.id)  created_type=$($t.type)"
  "  transitions      : $($transitions -join ' -> ')"
  "  terminal at      : ${terminalMs}ms"
  "  RUNNING occupancy: ${occupancy}ms"
}
foreach ($p in @($gw, $node)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
"PROBE_END"
