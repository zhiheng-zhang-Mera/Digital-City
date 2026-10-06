# REX-803 three-end completion gate — measured status (Mech, 2026-10-06T02:25Z)

The workbook's completion gate is: *"至少一组 controlled campaign 可在 Alien + Mech + Android 基础拓扑运行，并留下完整
research trace/material"*. This file records what this host **measured** on the live City, rather than what it assumed.

## What was done

The Alien + Mech + Android experiment was **registered on the live resident City** (the REX-803 head `57d1c919` is
running there), declaring exactly the identities the City reports, and then a campaign was attempted against it:

```text
EXPERIMENT   mech-alien-android-two-host-repetition     status VALIDATED     registeredAt 2026-10-06T02:25:20.802Z
TOPOLOGY     TWO_HOST_MESH   ("two physical hosts, each running a real worker, sharing one canonical City")
HOSTS        dev-031fdba6e94c4298a0956ff04a65481d   (this host's reference node, online)
             alien-reference-node                    (the Alien host's node - OFFLINE)
WORKERS      the same two
SURFACES     dev-be7832e35fc34b85966c3bb43a992e1d   (physical Android handset OPPO PERM00, controlOnline)
SOFTWARE     utopia@57d1c919ff2fc8bb64ce30bacbfc09ecb60f1fc1
REPETITIONS  3 (+1 warmup), seed policy PER_REPETITION, base seed 20261006
ATTEMPT      POST /api/v0/research/campaigns {experimentId, scenarioId: WAIT, repetitions: 3, warmup: 1}
RESULT       HTTP 409  TOPOLOGY_NOT_READY
```

The City's own refusal, verbatim:

```json
{"apiVersion":0,"schemaVersion":0,"error":"TOPOLOGY_NOT_READY","errorCode":"TOPOLOGY_NOT_READY",
 "detail":{"state":"NOT_READY","missing":["alien-reference-node"],
           "workers":["dev-031fdba6e94c4298a0956ff04a65481d"],
           "surfaces":["dev-be7832e35fc34b85966c3bb43a992e1d"],
           "identitySemantics":"CANONICAL_LIVE_REFS"}}
```

Node state at that moment (`GET /api/v0/city`):

```text
alien-reference-node                        online=FALSE   lastHeartbeatAt 2026-10-05T11:15:06.977Z
dev-031fdba6e94c4298a0956ff04a65481d         online=True    (this host)
dev-e1d87b2a0ec5457e822b91d81e40dc67         online=FALSE
```

## Conclusion

```text
GATE STATUS   PARTIAL / BLOCKED, and now blocked by exactly ONE NAMED IDENTITY rather than by an assumption.
BLOCKER       alien-reference-node is offline. It is the only declared identity the City cannot offer, and the refusal
              says so with the live worker and surface list it CAN offer.
WHAT IS DONE  Mech + Android was exercised end to end (two campaigns, see the sibling evidence files in
              utopia:evidence/raw/mission-book/REX-803/), and the three-end experiment is now REGISTERED, so the run
              is a single command once the Alien host's node is online.
WHAT IS NOT   The Alien half of the topology has never been online during this task (last heartbeat
              2026-10-05T11:15:06Z, before REX-803 development began). No three-end campaign result is claimed.
HOW TO RUN    with the Alien node online, POST /api/v0/research/campaigns
              {"experimentId":"mech-alien-android-two-host-repetition","scenarioId":"WAIT","repetitions":3,"warmup":1}
              and read the receipt at GET /api/v0/research/campaigns/<campaignId>.
```

## Evidence files

```text
this file                                        mission-book/reports/REX-803/THREE_END_GATE_MEASUREMENT.md
the same measurement as machine-readable JSON    local runtime artifact
                                                 D:/utopia-chat/evidence/REX-803/three-end-gate-attempt.json
                                                 (not committed to the implementation repo, because adding it would move
                                                 the reviewed head 57d1c919 and invalidate its recorded exact-head CI)
```

This measurement is **not** the gate and is not recorded as such: it is the gate's current, measured blocker.

## Re-measurement after the opposite host returned (Mech, 2026-10-06T04:2xZ)

The opposite host became active on the control plane again at 2026-10-06T04:12Z–04:18Z (two Digital-City commits by
`Alien-codex`, including the CEX-790 current-main integration and the MON-902 review claim). That is a different
condition from "the other host is away", so the gate was re-measured rather than assumed unchanged:

```text
EXPERIMENT   mech-alien-android-two-host-repetition     status VALIDATED     replayed true (same registration, re-validated)
ATTEMPT      POST /api/v0/research/campaigns {experimentId, scenarioId: WAIT, repetitions: 3, warmup: 1}
RESULT       HTTP 409  TOPOLOGY_NOT_READY   missing: ["alien-reference-node"]
NODES        alien-reference-node                  online=FALSE   lastHeartbeatAt 2026-10-05T11:15:06.977Z  (UNCHANGED)
             dev-031fdba6e94c4298a0956ff04a65481d online=True    lastHeartbeatAt 2026-10-06T04:22:12.061Z  (this host)
             dev-e1d87b2a0ec5457e822b91d81e40dc67 online=FALSE
```

The new information is the distinction, not the refusal: the opposite host is **present and working** on the control
plane while its reference node is **not joined** to the City. So the remaining blocker is not host availability and not
scheduling — it is one identity that has to be brought online, and the City names it. An operator reading this should
join `alien-reference-node`, not "wait for Alien". The experiment stays registered and validated, so the run is still a
single POST once that identity appears.

## Why the third identity has never joined, and the tool that removes the reason

Every measurement of this gate has ended the same way: the City refuses with `TOPOLOGY_NOT_READY` and names
`alien-reference-node` as the only missing identity. Three rounds of that read like a host that will not show up. It is
not that, and the real reason is narrower and fixable.

```text
the shipped reference node authenticates with CITY_NODE_TOKEN   agents/reference-node/main.mjs:2
the node token is a secret held by the City's own host          <runtime>/local-config.json
the programme forbids writing secrets into records              CONSTRUCTION_RULES / PROCESS_DATA_POLICY
=> there was NO CHANNEL by which the second physical host could obtain the credential it needs
```

So the blocker was credential delivery, and no amount of waiting was going to change it. The City already contains the
mechanism that removes the secret; what was missing was a joiner that uses it:

```text
pairing/info, pairing/exchange        PUBLIC routes, no node token and no version header required
a consumed owner-minted short code    ENROLLS the caller and returns a `sess:` credential scoped to its own device
the auth preamble                     returns early for a session bearer, so a session suffices for node/*
assertOwnNode                         still confines a member to its OWN node identity - no authority is widened
the reference agent                   already accepts a credentialProvider instead of a static token
```

`scripts/join-worker.mjs` on `feat/mech-join-worker-without-node-token @ c19da18` is that joiner and nothing more:
consume the short code, become a member, run the reference worker with the session credential, remember the device
identity across restarts. `tests/join-worker.test.mjs` proves it with a real child process - the owner mints a code, a
separate process consumes it, the City lists that identity ONLINE with the execution capabilities an eligible worker
needs, killing the process takes it offline, and where the build has this task's campaign route the City counts it as a
campaign worker (asserted as a 404 elsewhere rather than skipped). CI: V0.2 checks push run 37428348788 COMPLETED SUCCESS (attempt 1) on c19da18, jobs gateway-web and android both green.

What the other host has to do, once, with no secret transported:

```text
on the City host   POST /api/v0/pairing/session with the owner credential  -> a short code
                   read the node identity the joiner prints, and declare it in the experiment manifest
on the joining host
                   CITY_URL=http://<city-host>:4310 node scripts/join-worker.mjs --code <shortCode> \
                     --name "alien reference node"
```

Two of the probe's own drafts were wrong in the way this programme keeps recording, and both are fixed rather than
papered over: the first let an unhandled rejection abort the process so a caller capturing output saw **nothing** - the
least diagnosable failure a tool can have - and the second waited 2800 ms against a 2000 ms heartbeat timeout, so it
passed or failed depending on where the last heartbeat fell. That second one is the "window only just covers the
property" defect this programme has now recorded four times, and the committed probe gives it real margin instead.

**This does not close the gate and is not recorded as if it did.** The gate still requires the Alien host's own node to
be live in the City and a campaign to run on the three-end topology; what has changed is that nothing but one command
and one short code now stands between the programme and that campaign.

## THE GATE IS MET — measured on the live City, 2026-10-06T08:01Z

The completion gate is *"at least one controlled campaign on the Alien + Mech + Android base topology with a full research
trace"*. It has now run, and the thing that had blocked it for days was not the Alien host at all.

### The blocker was a stale identity in the manifest, not an absent host

```text
City reports, live, before the run
  dev-031fdba6e94c4298a0956ff04a65481d  Mega-rep                ONLINE   <- this host
  dev-8128a1ef25c5c4b7f66fc31b21705858  Alien-MERA-ALIANWARE    ONLINE   <- THE ALIEN HOST, live all along
  dev-be7832e35fc34b85966c3bb43a992e1d  Android PERM00          live control surface
  alien-reference-node                  Alien-PC                OFFLINE  <- last heartbeat 2026-10-05T11:15:06Z
```

Every earlier attempt declared `alien-reference-node`, the identity the Alien host used on 2026-10-05, and the City
correctly refused `TOPOLOGY_NOT_READY` because *that* identity was not live. Meanwhile the same host was online under
its canonical enrolled identity `dev-8128a1ef25c5c4b7f66fc31b21705858`. This is finding F8 generalised: a manifest must
declare the identities **the City actually reports**, and a remembered name rots. The gate read as "the other host never
showed up" for two days while the other host was present the whole time.

### The run

```text
City build       8798ba9dd37051626033ad72080b2fad3ff66149   (the REX-803 review candidate; the resident City was
                                                            restarted onto it for this acceptance, data retained)
experiment       rex803-three-end-live-8798ba9dd370   status VALIDATED
manifest         topology TWO_HOST_MESH
                 hosts/workers [dev-031fdba6…, dev-8128a1ef…]
                 controlSurfaces [dev-be7832e35…]     softwareRefs exact 8798ba9…
campaign         POST /api/v0/research/campaigns  ->  200  campaign-966cf439-7017-4bb0-88e8-981e59c18322
seed             rex803-three-end-live-8798ba9dd370-acceptance   (placement predicted BEFORE the run from runSeed)
```

```text
run 0  MEASURED  seed 397343796  assigned dev-031fdba6… (Mech)   task Q-be723362-5e83-4806-8d24-ffd0a60a16b2
run 1  MEASURED  seed 414121415  assigned dev-8128a1ef… (Alien)  task Q-f78eaee3-2380-468e-969d-6012fba109b9
run 2  MEASURED  seed 430899034  assigned dev-031fdba6… (Mech)   task Q-697aab2c-da4a-4e8b-9918-ab2174e47593

summary  planned 3  accounted 3  measured 3  timedOut 0  failed 0  cancelled 0  skipped 0
         terminalAccountingComplete true          state COMPLETED  reason REPETITIONS_FINISHED
```

**Run 1 executed on the Alien host's node and was MEASURED**, and the placement matched the rule predicted before the
run - which is the property the two-worker rehearsal had found dead and this build repairs.

### The material, verified rather than asserted

```text
canonical tasks   all three COMPLETED in the City, each carrying researchRunRef
                  campaign-966cf439-7017-4bb0-88e8-981e59c18322:<index> and assignedNodeId as above
research trace    RESEARCH_CAMPAIGN_STARTED recorded at 2026-10-06T08:00:39.601Z; 195 records; storageState READY;
                  completeness PARTIAL, which is stated rather than rounded up
immutable receipt campaign-966cf439-7017-4bb0-88e8-981e59c18322.json (3 693 bytes) filed under
                  <runtime>/research/campaigns/, written once at completion
evidence file     D:/utopia-chat/evidence/REX-803/three-end-live-2026-10-06T08-01-01-831Z.json
                  (live topology, both identity checks, registration, campaign POST, the pre-run placement
                  prediction, the terminal live state and the full receipt)
```

### What this does and does not settle

```text
SETTLES      the physical half of the completion gate: a controlled campaign ran on the Mech + Alien + Android
             topology with every repetition measured and the material filed.
DOES NOT     release the terminal marker. REX-803's Formal Review belongs to the opposite host, its verdict is theirs,
             and this host is the author. The evidence is handed over; the acceptance decision is not made here.
DOES NOT     claim a second host's hardware beyond what the City recorded: the Alien worker node heartbeated and
             completed a canonical task, and nothing beyond that is asserted about that machine.
```

The resident City was restarted onto `8798ba9` for this acceptance and keeps its data directory, so the cityId, the
store and every enrollment persisted. Restore is the documented pair: `scripts/stop-city.ps1` then
`scripts/start-city.ps1 -BindAddress 172.31.12.151 -Port 4391` from the desired worktree.
