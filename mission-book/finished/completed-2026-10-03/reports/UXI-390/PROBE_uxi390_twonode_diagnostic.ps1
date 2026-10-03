# UXI-390: is the second-node suppression a RACE or a RULE? Read both nodes' own output as it happens.
#
# Round 179 showed node B registers fine alone, so the loss happens only when both are present. Every earlier
# attempt inferred this from the city list afterwards, which cannot tell a rejected registration from a
# colliding one. This samples the list WHILE capturing both processes' stdout/stderr.
$ErrorActionPreference = 'Continue'
$root = 'D:\utopia-uxi390'
$port = Get-Random -Minimum 5100 -Maximum 5199
$env:CITY_TOKEN = 'alien-2n'; $env:CITY_NODE_TOKEN = 'alien-2n-node'
$env:CITY_PORT = "$port"; $env:CITY_HOST = '127.0.0.1'
$env:CITY_URL = "http://127.0.0.1:$port"; $env:CITY_ROOMS_URL = "http://127.0.0.1:$($port+1)"
$fresh = Join-Path $env:TEMP ('uxi390-2n-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path (Join-Path $fresh 'workspace') | Out-Null
$env:CITY_DATA = $fresh; $env:CITY_WORKSPACE = Join-Path $fresh 'workspace'
Remove-Item Env:CITY_TELEMETRY_DISABLED -ErrorAction SilentlyContinue
Set-Location $root
$gw = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'services/dev-gateway/main.mjs' -WorkingDirectory $root -RedirectStandardOutput "$root\.runtime\gw2n-out.log" -RedirectStandardError "$root\.runtime\gw2n-err.log"
$ok = $false
for ($i = 0; $i -lt 25; $i++) { Start-Sleep -Seconds 1; try { if ((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/health" -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200) { $ok = $true; break } } catch { } }
if (-not $ok) { "N2 gateway not healthy"; exit 1 }
"N2 gateway healthy on $port (fresh data dir)"
$h = @{ Authorization = 'Bearer ' + $env:CITY_TOKEN; 'X-City-Api-Version' = '0'; 'X-City-Schema-Version' = '0' }
function Nodes { try { return (@(((Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/v0/city" -Headers $h -UseBasicParsing -TimeoutSec 4).Content | ConvertFrom-Json).nodes) | ForEach-Object { $_.id }) -join ',' } catch { return '<read failed>' } }

# STEP 1: node A ALONE, and confirm it registers before B exists.
$a = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'agents/reference-node/main.mjs' -WorkingDirectory $root -RedirectStandardOutput "$root\.runtime\nodea-out.log" -RedirectStandardError "$root\.runtime\nodea-err.log"
Start-Sleep -Seconds 8
"N2 after A alone: nodes=[$(Nodes)] A-exited=$($a.HasExited)"
"N2 A stdout: $((Get-Content "$root\.runtime\nodea-out.log" -Raw -ErrorAction SilentlyContinue).Trim())"

# STEP 2: node B, sampling while both are live.
$b = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList '.runtime/node-b.mjs' -WorkingDirectory $root -RedirectStandardOutput "$root\.runtime\nodeb2-out.log" -RedirectStandardError "$root\.runtime\nodeb2-err.log"
for ($i = 1; $i -le 10; $i++) {
  Start-Sleep -Seconds 1
  "N2 t+${i}s nodes=[$(Nodes)]  A-exited=$($a.HasExited) B-exited=$($b.HasExited)"
}
"N2 A stdout tail: $(((Get-Content "$root\.runtime\nodea-out.log" -ErrorAction SilentlyContinue) | Select-Object -Last 4) -join ' / ')"
"N2 A stderr tail: $(((Get-Content "$root\.runtime\nodea-err.log" -ErrorAction SilentlyContinue) | Select-Object -Last 4) -join ' / ')"
"N2 B stdout tail: $(((Get-Content "$root\.runtime\nodeb2-out.log" -ErrorAction SilentlyContinue) | Select-Object -Last 4) -join ' / ')"
"N2 B stderr tail: $(((Get-Content "$root\.runtime\nodeb2-err.log" -ErrorAction SilentlyContinue) | Select-Object -Last 4) -join ' / ')"
"N2 gateway stdout tail: $(((Get-Content "$root\.runtime\gw2n-out.log" -ErrorAction SilentlyContinue) | Select-Object -Last 10) -join ' / ')"
"N2 gateway stderr tail: $(((Get-Content "$root\.runtime\gw2n-err.log" -ErrorAction SilentlyContinue) | Select-Object -Last 6) -join ' / ')"
"N2_END"
foreach ($p in @($gw, $a, $b)) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
