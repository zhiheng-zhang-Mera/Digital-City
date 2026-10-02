# UXI-390: why does node B not register against a FRESH data directory? Read its OWN output, not the city list.
#
# Every attempt so far inferred registration from the gateway node list, which cannot distinguish a process
# that FAILED from one that registered LATE. This runs node B alone against a fresh gateway and captures both
# the node's own stdout/stderr and the gateway log, which is the distinction that matters.
$ErrorActionPreference = 'Continue'
$root = 'D:\utopia-uxi390'
$port = Get-Random -Minimum 5000 -Maximum 5099
$env:CITY_TOKEN = 'alien-b1'; $env:CITY_NODE_TOKEN = 'alien-b1-node'
$env:CITY_PORT = "$port"; $env:CITY_HOST = '127.0.0.1'
$env:CITY_URL = "http://127.0.0.1:$port"; $env:CITY_ROOMS_URL = "http://127.0.0.1:$($port+1)"
$fresh = Join-Path $env:TEMP ('uxi390-b1-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path (Join-Path $fresh 'workspace') | Out-Null
$env:CITY_DATA = $fresh; $env:CITY_WORKSPACE = Join-Path $fresh 'workspace'
Remove-Item Env:CITY_TELEMETRY_DISABLED -ErrorAction SilentlyContinue
Set-Location $root
"B1 fresh data dir: $fresh"
$gw = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'services/dev-gateway/main.mjs' -WorkingDirectory $root -RedirectStandardOutput "$root\.runtime\gw-b-out.log" -RedirectStandardError "$root\.runtime\gw-b-err.log"
$ok = $false
for ($i = 0; $i -lt 25; $i++) { Start-Sleep -Seconds 1; try { if ((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/health" -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200) { $ok = $true; break } } catch { } }
if (-not $ok) { "B1 gateway not healthy"; exit 1 }
"B1 gateway healthy on $port"
# NODE B ALONE, with its own output captured.
$nB = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList '.runtime/node-b.mjs' -WorkingDirectory $root -RedirectStandardOutput "$root\.runtime\nodeb-out.log" -RedirectStandardError "$root\.runtime\nodeb-err.log"
Start-Sleep -Seconds 14
$h = @{ Authorization = 'Bearer ' + $env:CITY_TOKEN; 'X-City-Api-Version' = '0'; 'X-City-Schema-Version' = '0' }
$city = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/city" -Headers $h -UseBasicParsing).Content | ConvertFrom-Json
"B1 nodeB exited: $($nB.HasExited)"
"B1 city nodes: $(@($city.nodes).Count) -> $((@($city.nodes) | ForEach-Object { $_.id }) -join ', ')"
"B1 nodeB STDOUT: $((Get-Content "$root\.runtime\nodeb-out.log" -Raw -ErrorAction SilentlyContinue))"
"B1 nodeB STDERR: $((Get-Content "$root\.runtime\nodeb-err.log" -Raw -ErrorAction SilentlyContinue))"
"B1 gateway STDOUT tail: $(((Get-Content "$root\.runtime\gw-b-out.log" -Tail 8 -ErrorAction SilentlyContinue) -join ' / '))"
"B1 gateway STDERR tail: $(((Get-Content "$root\.runtime\gw-b-err.log" -Tail 8 -ErrorAction SilentlyContinue) -join ' / '))"
foreach ($p in @($gw, $nB)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
"B1_END"
