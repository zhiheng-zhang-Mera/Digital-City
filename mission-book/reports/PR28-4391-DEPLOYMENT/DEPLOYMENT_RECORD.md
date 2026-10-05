# PR #28 deployment to the resident 4391 City / 4391 常驻城市部署到 PR #28

```text
KIND                OWNER_DIRECTED_DEPLOYMENT (not a claim; no workbook, no marker)
AUTHORITY           owner instruction, 2026-10-05: "更新目前的4391端口到云端PR#28"
PERFORMED BY        Mech (MEGA-REP), role Mech-DS
HOST                http://172.31.12.151:4391   City 031fdba6-e94c-4298-a095-6ff04a65481d
DATA DIR            C:\ProgramData\Utopia\host\city   (unchanged; identity, members and history preserved)
PREVIOUS CODE ROOT  D:\utopia      @ 48cbc21376007c5461e8e456a898c3f788f0fa77  (= current origin/main lineage)
NEW CODE ROOT       D:\utopia-pr28 @ 0ea9203d3409a59194675d48d93950c7af9fb92f  (PR #28 review/JOIN-590-Alien-codex)
PREVIOUS PID        24100
NEW PID             5092
```

## 1. What was deployed and why it is safe to run

PR #28 (`fix(JOIN-590): durable Android membership and secure reconnect`) was the target of the owner's instruction. Its
exact head was read from the API rather than from a branch name:

```text
PR #28   base main   head review/JOIN-590-Alien-codex   headRefOid 0ea9203d3409a59194675d48d93950c7af9fb92f
CI       gateway-web SUCCESS x2, android SUCCESS x2, reciprocal-contract SUCCESS   mergeable MERGEABLE
DELTA vs the previously deployed code (48cbc21): 100 files, +7472 / -224 - the JOIN-590 Android enrollment,
         relay joining, short-code entry and reacceptance evidence.
```

The previously running City was on the `origin/main` lineage, so this is an upgrade along the JOIN-590 dimension only;
nothing that was working on 4391 was replaced by an older revision.

## 2. How the swap was performed, and why it preserved the City

```text
1  git worktree add -b deploy/PR28-4391 D:\utopia-pr28 0ea9203d3409a59194675d48d93950c7af9fb92f
2  npm ci  +  npm install --prefix city          (the worktree's own dependencies)
3  PRE-FLIGHT: the new tree's launcher was asked what City it sees, BEFORE anything was stopped
     -> {"endpoint":"http://172.31.12.151:4391","cityId":"031fdba6-e94c-4298-a095-6ff04a65481d",
         "gatewayPid":24100,"dataDir":"C:\\ProgramData\\Utopia\\host\\city"}
   This is the step that makes the swap safe: a worktree that could NOT see the same state directory would have
   started a second, unrelated City in a fresh directory.
4  scripts\stop-city.ps1   (validates the PID owns services/dev-gateway/main.mjs before killing it)
     -> "Stopped host City 031fdba6-… Data retained at C:\ProgramData\Utopia\host\city"; coordination port released
5  scripts\start-city.ps1 -BindAddress 172.31.12.151 -Port 4391     (the same options the City already ran with:
     CITY_MANAGE_SERVICES=1, rooms 4320, discovery and telemetry enabled)
     -> "Utopia Host running at http://172.31.12.151:4391; City 031fdba6-…; Gateway pid 5092"
```

## 3. Verification after the swap

```text
coordination 127.0.0.1:4389    state=ONLINE  gatewayPid=5092  endpoint=http://172.31.12.151:4391  servicesManaged=true
city identity                031fdba6-e94c-4298-a095-6ff04a65481d  (UNCHANGED)
credential                   local-config.json token SHA-256 prefix 71EF027362A8, identical to before the swap, so the
                             owner's existing page session stayed valid instead of being logged out by a new token
web surface                  GET / -> 200, GET /app.js -> 200
rooms                        http://127.0.0.1:4320/ -> OK
event continuity             last event before the swap was seq 128; after the restart 129 CITY_STARTED,
                             130 NODE_ONLINE, 131 CLIENT_CONNECTED (clientLabel Mech-rep) with no later
                             CLIENT_DISCONNECTED - the open page reconnected by itself and stayed connected
```

## 4. A defect found during the previous diagnosis that this deployment FIXES

The owner's report ("4391 城市没有在线") was investigated before this deployment and produced a real finding that PR #28
happens to repair:

```text
FINDING (pre-#28 code)  the City's own local worker agent registered with a HARDCODED identity taken from one
                        developer's machine: agents/reference-node/agent.mjs startAgent() defaulted to
                        id='alien-reference-node' / displayName='Alien-PC', and services/dev-gateway/main.mjs called
                        it without an identity. So on this host the local agent was ONLINE but labelled "Alien-PC",
                        while this host's own node id sat offline - exactly the kind of "the city is not online"
                        reading the owner reported.
EVIDENCE (pre-#28)      nodes: alien-reference-node online=true heartbeat 10:11:57Z (telemetry uptime 4996s, i.e. the
                        process the City started minutes earlier) and dev-031fdba6…e94c4298a0956ff04a65481d
                        online=false heartbeat 03:25:11Z.
FIXED BY PR #28         main.mjs:59 now passes id:'dev-'+cityId and displayName: config.deviceName||hostname();
                        agent.mjs defaults are now id='host-'+hostname() / displayName=hostname().
EVIDENCE (post-#28)     nodes: Mega-rep online=true heartbeat 11:15:35Z; Alien-PC online=false (a stale row left by
                        the pre-#28 process that this deployment stopped).
```

The stale `Alien-PC` row is deliberately NOT deleted: the owner said 暂时不动 and removing a device row is a change to
City state, not to the deployment.

## 5. Deliberately not done

```text
- the stale offline node row is left in place (§4)
- no pairing session was generated for the handset
- no workbook was opened for the agent-identity defect, because PR #28 already fixes it on the live path
- the handset's earlier join request (join-eab97ea241) was APPROVED but never collected: the phone disconnected before
  the approval. It must retry once; that is a client action, not a City action.
```

## 6. Rollback

```text
cd D:\utopia-pr28 ; .\scripts\stop-city.ps1
cd D:\utopia      ; .\scripts\start-city.ps1 -BindAddress 172.31.12.151 -Port 4391
```

The previous revision is still checked out in `D:\utopia` at `48cbc21376007c5461e8e456a898c3f788f0fa77`, and the data
directory was never moved, so a rollback restores exactly the pre-deployment City.
