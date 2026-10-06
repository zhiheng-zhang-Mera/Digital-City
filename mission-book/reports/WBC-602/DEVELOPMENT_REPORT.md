# WBC-602 — Development Report

```text
TASK_ID            WBC-602  (Node Role / Capability / Resource Descriptor, backward compatible)
PROGRAMME          WORKBENCH_COMPATIBILITY_MIGRATION
ROLE               Development
IMPLEMENTATION     zhiheng-zhang-Mera/utopia
CONTROL REPO       zhiheng-zhang-Mera/Digital-City
HOST               Mech  (COMPUTERNAME MEGA-REP; City node identity Mech-Win)
BRANCH             wbc/WBC-602-node-descriptor
BASELINE_SHA       0e9bea3ce739b979e582a428af8fb233045a5e75
REQUIRED_ANCESTOR  9f3e20e8ec99d591812430bee71d27e68c4ad498  -> verified ancestor of baseline
HEAD_SHA           c312a60b4d73f02597bde1f106372b253067fe33
TERMINAL_MARKER    NODE_CAPABILITY_RESOURCE_COMPAT_ACCEPTED  (development side complete)
REVIEW             PENDING — opposite-host Formal Review not performed from this session
```

---

## 1. Claim

Atomic claim per `CONSTRUCTION_RULES.md` §2 / §2A.2, in Digital-City commit `623190f` (since rebased:
`623190f` on main). Claim-time measurements, full 40-char SHAs only:

```text
utopia refs/heads/main            0e9bea3ce739b979e582a428af8fb233045a5e75
required_ancestor_shas[0]         9f3e20e8ec99d591812430bee71d27e68c4ad498  ANCESTOR_OK
required CI on the baseline       V0.2 checks        37205444427  completed / success
                                  City linkage check 37205444385  completed / success
                                  (both read from the Actions API and matched on headSha)
worktree                          D:/utopia-wbc602   branch wbc/WBC-602-node-descriptor
```

**Independence from WBC-601 was MEASURED, not assumed.** The programme allows WBC-601 and WBC-602 to be developed
in parallel but forbids sibling-merging them, and the two tasks share one hot file
(`services/dev-gateway/server.mjs`). WBC-601's head (`d65dbd3af2d8903aca13726f74110e1f2f6b9b65`) is **not** an
ancestor of this baseline — it is unreviewed and unmerged — so WBC-602 is built on `main` *without* the execution
backend seam. The consequence was recorded in the claim: this task must not copy WBC-601's relocation of the
`node/claim` and `node/report` route bodies, and its own change had to stay additive. That is what happened; §3
and §4 show a change confined to the descriptor projection plus the registration-adjacent read path.

## 2. The engineering problem

The City can execute work, but it selects an execution endpoint by *machine*: `Alien-Win` and `Mech-Win` are
distinguished by their node ids and by the fact that they are Windows and online. The workbook's target model is
"which node can do this, with enough of the right resources, right now", and the obstacle is that no stable
contract expresses a node that way — a node's capabilities are a bare string array, resources only exist inside an
optional telemetry blob, and there is no vocabulary for what a node *is* (worker, control surface, validation
node, storage, accelerator).

The answer is a descriptor contract, not a scheduler:

```text
canonical node record (unchanged: the City's only stored node truth)
        ↓  read-time projection
node-descriptor-v1  (roles, capabilities, bounded resources, availability, health, trust ref)
        ↓
what WBC-603/604 will be able to route on
```

## 3. Locked decisions (problem → choice → why)

**D1 — Stored descriptor or read-time projection?**
Choice: read-time projection; the canonical node record is untouched.
Why: a descriptor stored next to the record goes stale the moment the next heartbeat or sharing change lands, and
a stale descriptor beside the canonical truth is exactly how a second, disagreeing source of node truth starts.
The projection cannot disagree because it is recomputed from the same record the claim path reads.

**D2 — A sibling field or a replaced node shape?**
Choice: `/api/v0/nodes` keeps returning the raw `nodes` array unchanged and adds `nodeDescriptors` beside it.
Why: additive is the workbook's hard rule and also the honest test of it — any existing surface (Web, Android,
tests, the reference agent) that knows nothing about descriptors must see byte-identical input. Replacing the
array would have made every consumer a migration.

**D3 — What is the legacy default role?**
Choice: `EXECUTION_NODE`, and the descriptor records `roleSource: LEGACY_DEFAULT` so it is distinguishable from a
declared role.
Why: that is what the existing product already treats a registered City node as (it registers, it advertises
`task.execute.safe`, it claims). Defaulting to *nothing* would have made every existing node unroutable by any
future capability scheduler; defaulting to more than one role would have invented authority that was never
declared. The `roleSource` field is what keeps this from being an assumption: a reader can always tell.

**D4 — How is a missing resource represented?**
Choice: `presence: UNKNOWN` with a `value: null` and a reason (`NOT_REPORTED` / `MALFORMED_MEASUREMENT`), and a
separate `UNSUPPORTED` for a fact the release deliberately does not model (GPU).
Why: this is the single most likely way an additive resource model becomes a scheduling regression. `0` would
make every unmeasured node look empty; `unavailable` would make it look broken. `measurement()` also refuses a
negative or non-finite number as `MALFORMED_MEASUREMENT` rather than accepting it as a small value.

**D5 — Does a requirement that names an unmeasured resource fail?**
Choice: no. `explainRequirementFit` returns `RESOURCE_UNKNOWN:<kind>` and `decided: false`; only a *measured*
value below the minimum is `RESOURCE_BELOW_MINIMUM`.
Why: "we did not measure this" and "this node is too small" are different answers, and conflating them would make
a legacy node silently unroutable the day requirements are introduced. The helper is explicitly descriptive
(`schedulingAuthority: 'NONE'`) so it cannot quietly become the scheduler.

**D6 — Where does Android go?**
Choice: Android is described by `describeAndroidControlSurface` with `isExecutionResource: false` and
`roles: ['CONTROL_SURFACE']`; it is **not** a City node and never appears in the node descriptor list.
Why: the workbook requires that the current role truth be expressible *and* that Android not be auto-registered
as a worker. Expressing it as a descriptor of an entity the City already knows as a control surface satisfies both
without adding Android to the node registry. The contract then enforces the rule instead of trusting callers:
`nodeDescriptor` throws `INVALID_ROLE` for a non-execution entity holding `EXECUTION_NODE`, and
`assertNodeDescriptor` refuses the same pair in either direction. This is the negative control the review is asked
to attack, so it is a contract-level refusal, not a convention.

**D7 — Is the descriptor authority?**
Choice: no. Identity stays in the City registry; `trustRef` carries `authority: 'CITY_NODE_REGISTRY'` and
`descriptorIsNotAuthority: true`; a resource report is a node's claim about itself.
Why: the workbook forbids making a resource report an authority and forbids creating a second trust/identity.

**D8 — Where does the code live?**
Choice: `contracts/node-descriptor-v1/` for the pure contract, with the gateway holding only the projection.
Why: matches every other contract in this repository, and keeps the descriptor testable without a gateway. It also
kept the hot-file change small — the deliberate consequence of D1 measured in §1.

## 4. What changed

| File | Nature |
|---|---|
| `contracts/node-descriptor-v1/node-descriptor.mjs` | **new** — role/resource/presence vocabularies, `nodeDescriptor`, `describeLegacyNode`, `describeControlSurface`/`describeAndroidControlSurface`, `taskRequirements`, `explainRequirementFit`, `assertNodeDescriptor` |
| `contracts/node-descriptor-v1/index.mjs` | **new** — public surface |
| `contracts/node-descriptor-v1/tests/conformance.test.mjs` | **new** — 8 contract tests |
| `services/dev-gateway/server.mjs` | **modified** — import; `nodeDescriptors()` projection; `/api/v0/nodes` publishes `nodeDescriptors` beside the untouched `nodes`; new read-only `POST /api/v0/node/descriptor` |
| `tests/wbc602-node-descriptor.test.mjs` | **new** — 5 live-gateway tests |
| `docs/{en,zh-CN}/NODE_DESCRIPTOR_ROLES_RESOURCES.md` | **new** — paired capability documentation |

Not changed: the node registration payload and its validation, `capabilities`, `sharingEnabled`, the strict-target
guard, the claim/report transitions, the task schema, pairing/enrollment, and any UI. The claim decision is
untouched — WBC-602 does not relocate it and does not duplicate it.

## 5. Defect found by this task's own test, and its repair (recorded, not cleaned up)

**Observation.** The first version of `nodeDescriptors()` passed the Core verdict straight through as
`acceptingWork` and computed `reason` independently. Measured result for a node whose owner had withdrawn sharing:

```text
availability: { state: "ONLINE", acceptingWork: true, sharingEnabled: false, reason: "SHARING_DISABLED_BY_OWNER" }
```

**Why that is a real defect and not a test artifact.** The descriptor contradicted itself on the one question a
scheduler reads it for — "will this node take work right now" — while looking correct field by field. Any future
router reading `acceptingWork` would have placed work on a device whose owner had switched sharing off.

**Repair.** `acceptingWork` is now the conjunction the claim path actually applies (the Core accepts the node AND
its owner still shares it), with the reason ordered `ENDPOINT_OFFLINE` → `SHARING_DISABLED_BY_OWNER` →
`ENDPOINT_NOT_ACCEPTING_WORK` → `null`. Three facts are now stated separately and consistently:
`isExecutionResource` (what the node is), the Core's capability/liveness verdict, and `acceptingWork` (whether it
will take work now).

**Regression guard.** `tests/wbc602-node-descriptor.test.mjs` asserts the contradiction directly: after sharing is
withdrawn, `availability.state === 'ONLINE'`, `availability.acceptingWork === false`,
`availability.sharingEnabled === false`, `availability.reason === 'SHARING_DISABLED_BY_OWNER'`, and
`health.state === 'HEALTHY'`.

**Second, smaller finding kept in the record (MEASUREMENT_DEFECT, not a product defect).** A test assertion of mine
expected `resources.network.reachable === true` on an online node. The legacy translation sets `reachable` from the
node record's own liveness, and in that fixture the agent was not online, so the assertion was wrong rather than the
product. It was corrected to assert the facts the descriptor really separates (sharing off, state ONLINE, health
HEALTHY) instead of a value that depended on a fixture detail the test was not about.

## 6. Evidence

```text
node --test contracts/node-descriptor-v1/tests/conformance.test.mjs tests/wbc602-node-descriptor.test.mjs
  13 tests / 13 pass / 0 fail

pnpm test                                   (full root suite on this branch)
  1250 tests / 1247 pass / 3 fail    <- the 3 pre-existing environmental failures, §7
  (baseline 0e9bea3 carried 1219 root tests: +31 from this task, no regression in the existing 1219)

node city/test-all.mjs
  1984 tests / 1977 pass / 7 skipped / 0 fail

node --test apps/rooms/tests/*.test.mjs
  69 tests / 69 pass / 0 fail

node scripts/check-bilingual.mjs
  docs / evidence / data-records = SYNCHRONIZED

node scripts/verify-promotion-history.mjs
  10 record(s) verified against local Git history at 0e9bea3ce739
```

Workbook completion gates, mapped:

| Gate | Where proved |
|---|---|
| 1 stable descriptor contract exists | `contracts/node-descriptor-v1`; conformance tests |
| 2 legacy translation / defaults exist | `describeLegacyNode`; "an old node record with no new fields still yields a usable descriptor" |
| 3 old node/task not invalidated by missing fields | live-gateway test: old registration payload registers, claims, completes; requirements test: unmeasured resource is undecided, not refused |
| 4 current Alien/Mech/Android role truth expressible | conformance test "the current Alien/Mech/Android role truth is expressible without registering Android as a worker" |
| 5 no real Workbench dependency | no new dependency at all; the descriptor is computed in-process from existing records |
| 6 opposite-host Review PASS | **PENDING** — not claimed |
| 7 exact-head CI green | §8 |
| 8 terminal marker | development side only |

## 7. Honest failure classification

The same three `tests/host-city-launcher.test.mjs` failures reported in WBC-601 remain, for the same reason: a
resident City on this host holds the fixed coordination port 4389, so those tests refuse to run by design. They are
byte-identical to the baseline file and unrelated to this change. Classified `ENVIRONMENTAL_PRE_EXISTING`; the run
is not "green" on this host and this report does not say it is.

## 8. Head and CI

```text
development_head_sha   c312a60b4d73f02597bde1f106372b253067fe33
development_ci         V0.2 checks run 37206331839  completed / success  on headSha c312a60b4d73f02597bde1f106372b253067fe33
                       jobs: gateway-web success, android success
                       (no earlier failed run on this branch; the defect in section 5 was found and repaired
                        locally before the first push, which is the opposite order from WBC-601's CI-caught defect)
```

CI result is recorded in the workbook frontmatter after the push, so the head CI verifies contains this report.

### 8.1 A recording error in this report, corrected before it was published

The first draft of this file carried `HEAD_SHA = c312a60b6bb6fbcc7cb0ee3ecab90dc9d64d8daf`. Only the first seven
characters were real; the remainder was written from memory and does not exist in the repository. It was caught by
reading the actual push (`git rev-parse HEAD` → `c312a60b4d73f02597bde1f106372b253067fe33`, cross-checked against
the CI `headSha`) before the report was committed, and corrected here.

This is recorded rather than quietly fixed because it is precisely the class of error the rules exist to prevent: a
full SHA is the one machine-readable anchor the whole control plane binds to, and an invented suffix is
indistinguishable from a real one to a reader. The rule that makes the mistake visible is the cheap one — **never
write an identity from memory; resolve it from the source and paste it**. `scripts/verify-promotion-history.mjs`
and the CI `headSha` both act as independent checks on the values that matter.

语言配对 / Language pair: [English](./DEVELOPMENT_REPORT.md) · [中文](./zh-CN/DEVELOPMENT_REPORT.md)
