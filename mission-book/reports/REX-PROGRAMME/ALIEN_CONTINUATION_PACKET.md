# Alien continuation packet — state as of 2026-10-06T04:30Z (Mech)

This is a checkpoint written by Mech for the opposite physical host, not a task-pool completion and not a claim on
Alien's behalf. It supersedes the earlier packet, whose opening sequencing line was overridden by the Owner instruction
Alien itself recorded in `reports/CEX-790/ALIEN_INTEGRATION_REPORT.md` (prioritize CEX-790, make it mergeable, then work
MON directly; SHOW remains excluded).

## What is actually claimable now

```text
claimable_now_for_Mech_in_any_programme: 0
reason: every remaining actionable item is owned by, or owed to, the opposite physical host
```

A fresh scan of the whole mission-book (24 real workbooks, template XX-000 excluded) gives exactly:

| Bucket | Count | Items |
|---|---|---|
| READY and unclaimed | 0 | — |
| Development complete, review unclaimed | 2 | REX-803, MON-903 — both authored by Mech, and §3 forbids self-review |
| Review claimed, verdict pending | 2 | MON-902 → Alien (claimed); REX-804 → Mech (verdict **NOT PASSED**) |
| WAITING_DEPENDENCIES | 5 | REX-805/806/807/890, MON-990 |
| Claimed by Alien, not started | 1 | SHOW-401 |

REX-805 is **not** unlocked by REX-801/802 alone: its `dependencies` field requires
`REX-803:SCENARIO_REPETITION_ENGINE_ACCEPTED`, which does not exist yet.

## What Mech did while the pool was empty (all recorded, none of it a claim)

Three adoptable repair branches and one cross-task defect family, from a deliberate failure-shape sweep. Two of the
three were **adopted by Alien inside PR #33** with provenance, which is recorded as an independent host accepting
published repairs — not as a review of any Mech task.

```text
repair/REX-801-mech-store-guard                            adopted into PR #33
repair/capability-bridge-mech-artifact-store-guard @ 8c67bb2   adopted into PR #33
repair/WBC-604-mech-profile-persist-first           @ 1f2f08c   AVAILABLE, not yet adopted
```

The third is the WBC-604 profile store: a change the City cannot persist used to be half-applied (the running profile
moved while the caller got an exception) and the route surfaced a raw `EPERM` plus an absolute path. Falsified probe
and the measured per-run CI are in `reports/REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md`, which also carries the
reproducible harness (`reports/REX-PROGRAMME/store-shape-sweep-v2.mjs`) and the correction of the first sweep's
overstated table.

## REX-803's completion gate — the blocker is now a named identity, not a host

Re-measured after Alien returned to the control plane at 04:12Z–04:18Z:

```text
EXPERIMENT  mech-alien-android-two-host-repetition   status VALIDATED   replayed true
ATTEMPT     POST /api/v0/research/campaigns {experimentId, scenarioId: WAIT, repetitions: 3, warmup: 1}
RESULT      HTTP 409  TOPOLOGY_NOT_READY   missing: ["alien-reference-node"]
NODES       alien-reference-node  online=FALSE  lastHeartbeatAt 2026-10-05T11:15:06.977Z  (UNCHANGED)
```

Alien is present and working on the control plane while its reference node is not joined to the City. The remaining
action is therefore "join `alien-reference-node`", not "wait for Alien"; the experiment is registered and re-validates
on every attempt, so the run is a single POST once that identity appears.

## What Alien's own queue looks like

1. MON-902 Formal Review — **performed**; six failures plus a cache defect reproduced and repaired at
   `f4988248a3316806fc2e3fa9e62864ed129fe7b3` (PR #34), whose three exact-head runs are now terminal SUCCESS
   (37414577586 / 37414583160 / 37414583135, read per run). What remains is Alien's own decision: the verdict,
   `review_complete`, and any marker, on their head. Mech's author-side acceptance is in
   `reports/MON-902/AUTHOR_ACCEPTANCE_OF_REVIEW.md` and explicitly does not convert green CI into acceptance.
2. MON-903 Formal Review — claimed by Alien at `78bdd9dc873ebc257aedecf421068a1387dbec82`, PR #32; verdict pending.
3. REX-803 Formal Review — still unclaimed and eligible; target `a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df`, PR #31.
4. REX-804 repair — Mech's verdict on `f76ccf53` is **NOT PASSED** (blocking finding B1: an unreadable fault receipt
   stopped the City from starting). Re-verification requires a repaired head.
5. Adoption decisions still open: `repair/WBC-604-mech-profile-persist-first` and
   `repair/mech-readme-city-install-step` (the README's missing second install step, which is what made two suites
   look like they failed for environmental reasons).
6. Alien's own integration PR #33 — independently verified by Mech; see
   `reports/CEX-790/INDEPENDENT_VERIFICATION_Mech.md`. No merge blockers found, and the merge decision is not Mech's.

Mech cannot perform 1–3 (author of all three), nor 4's re-verification on an unchanged head. Item 6 was Mech's to do
and is done.

## Honest limits of this packet

- It contains no invented measurement. Every number is either a scan output, a per-run CI read, or a live City refusal.
- It does not claim Alien's work, does not merge, and does not touch main.
- `owner_required: false`, `terminal_reason: null`, `pool_incomplete: true`.
- wake conditions: the Alien reference node joining the City; a verdict landing on REX-803 or MON-903; a repaired
  REX-804 head; an adoption decision on an open repair branch; or a fresh Owner instruction that opens new work for Mech.

## The REX-803 gate blocker was a secret with no channel, and that is now fixed

Three rounds of measurement all ended with the City refusing `TOPOLOGY_NOT_READY` and naming `alien-reference-node` as
the only missing identity, which reads like a host that will not show up. The real reason is narrower: the shipped
reference node authenticates with `CITY_NODE_TOKEN`, that token is a secret held by the City's own host, the programme
forbids writing secrets into records, and therefore **no channel existed** by which the other physical host could obtain
it. Waiting was never going to change that.

The City already contains the mechanism that removes the secret - `pairing/info` and `pairing/exchange` are public, a
consumed owner-minted short code enrolls the caller and returns a `sess:` credential scoped to its own device, the auth
preamble returns early for a session bearer, and `assertOwnNode` still confines a member to its own node identity. What
was missing was a joiner that uses it:

```text
feat/mech-join-worker-without-node-token @ c19da18   CI push 37428348788 SUCCESS attempt 1
  scripts/join-worker.mjs      consume the short code, become a member, run the reference worker with the session
  tests/join-worker.test.mjs   a real child process joins and the City lists it ONLINE with the capabilities an
                               eligible worker needs; killing it takes it offline
```

What the other host does, once, transporting no secret:

```text
on the City host      POST /api/v0/pairing/session with the owner credential -> a short code
                      read the identity the joiner prints and declare it in the experiment manifest
on the joining host   CITY_URL=http://<city-host>:4310 node scripts/join-worker.mjs --code <shortCode> \
                        --name "alien reference node"
```

This does not close the REX-803 completion gate and is not recorded as if it did: the gate still needs that node live and
a campaign run on the three-end topology. It does mean nothing but one command and one short code now stands in the way.

REX-804 head; an adoption decision on either open repair branch; or a fresh Owner instruction that opens new work for
  Mech.


[完整中文阅读译本 / Chinese reading translation](./zh-CN/ALIEN_CONTINUATION_PACKET.md)
