# REX-801 — Development Report

```text
TASK_ID            REX-801  (Experiment Manifest + Registry)
PROGRAMME          RESEARCH_STRENGTHENING
ROLE               Development
IMPLEMENTATION     zhiheng-zhang-Mera/utopia
CONTROL REPO       zhiheng-zhang-Mera/Digital-City
HOST               Mech  (COMPUTERNAME MEGA-REP; City node identity Mech-Win)
BRANCH             rex/REX-801-experiment-manifest-registry
BASELINE_SHA       0e9bea3ce739b979e582a428af8fb233045a5e75
REQUIRED_ANCESTOR  69a097b5394a9fece39dd11cc13f04c9b4d28bfe  -> verified ancestor of baseline
HEAD_SHA           8f8c521fc299d622093776615b653457d8833f96
CI                 V0.2 checks run 37241196692 on HEAD_SHA
TERMINAL_MARKER    EXPERIMENT_MANIFEST_REGISTRY_ACCEPTED  (development side)
REVIEW             PENDING — opposite-host Formal Review not performed from this session
```

---

## 1. Claim

Atomic claim per `CONSTRUCTION_RULES.md` §2 / §2A.2, Digital-City commit `52c0c63` (since rebased and republished
on top of `fd0fc87`). Measurements, full 40-char SHAs only:

```text
utopia refs/heads/main            0e9bea3ce739b979e582a428af8fb233045a5e75
required_ancestor_shas[0]         69a097b5394a9fece39dd11cc13f04c9b4d28bfe  ANCESTOR_OK
required CI on the baseline       V0.2 checks 37205444427 success; City linkage check 37205444385 success
                                  (Actions API, matched on headSha — not read from UTOPIA_LIVE_STATUS.json)
worktree                          D:/utopia-rex801   branch rex/REX-801-experiment-manifest-registry
```

**Why the baseline was re-measured although WBC-602 claimed the same SHA.** A matching value is not evidence that
it is still the value; carrying it over would have made a `STALE_EXECUTION_IDENTITY` indistinguishable from a
correct one. The claim records the measurement instead of the memory of it.

**Independence recorded in the claim.** WBC-601 (execution backend seam) and WBC-602 (node descriptor) were both
unreviewed and unmerged at claim time, so neither is an ancestor of this baseline. REX-801 is therefore a
research-layer contract built on accepted `main` and imports neither task's new modules. That held: this branch's
only shared hot file is `services/dev-gateway/server.mjs`, where the change is additive (one import, one registry
construction, one route block, one `auth` refinement, one error-mapping branch).

**A note added after the fact, from the refreshed board.** By the time this report was written, the other host had
completed the opposite-host review of both earlier tasks and moved them to `COMPLETE`. That does not change this
task's baseline: an `IMMUTABLE_EXACT_SHA` claim binds to the SHA that was resolved at claim time, and rebasing a
development branch onto later `main` is the integration step (§11), not a claim.

## 2. The engineering problem

The programme turns Utopia into a place where a research question can be *run as an experiment*. Every part of
that requires the experiment to be described before it runs, and nothing in the product could describe one: there
was no place to record what is varied, what is measured, how many times, with which seed, needing which
capabilities, stopping when, keeping what, judged how, and on exactly which code. Without that, "five repetitions"
is five ad-hoc runs and a result cannot be attributed to a configuration.

REX-801 supplies the description layer and stops there:

```text
question ──► Experiment Manifest (validated against real topologies + real capability vocabulary)
                     │
                     ▼
            Experiment Registry (list / inspect / validate / register)
                     │
                     X   no execution — that is REX-803's seam
```

## 3. Locked decisions (problem → choice → why)

**D1 — Where do experiment documents live?**
Problem: the City's store is the canonical task/node/action truth and every table is keyed by a task-shaped `id`.
Choice: a **file-backed** registry under `<runtime>/research/experiments/`, written atomically (temp file +
`rename`).
Why: putting descriptions in the task-keyed store would mean either pretending a manifest is a task record or
adding a research table to the task schema — both erode the boundary this task exists to hold. A crash mid-write
leaves the previous document rather than a truncated one, which matters because a half-written manifest that still
parses would be a silently wrong description.

**D2 — Is a registered manifest editable?**
Choice: no `update` exists. Identical re-registration is idempotent (`replayed: true`); different content under the
same id is `IMMUTABLE_MANIFEST` (409).
Why: a describe-before-you-run registry whose description can be edited afterwards cannot support a reproducibility
claim, because the text a result is attributed to would no longer be the text that was registered. A changed
experiment is a new experiment id. This is also why `expectedVersion`-style optimistic editing was rejected: it
would still allow the published description to change.

**D3 — What happens to an invalid manifest?**
Choice: it is **persisted as a `REJECTED` record with its whole issue list**, and the HTTP answer is a typed 422
carrying every issue at once.
Why: the REX evidence protocol requires negative results to survive. A registry that only stores successes loses
exactly the evidence that shows validation works. Answering with all issues at once is also a deliberate
correction of the usual one-error-per-round-trip behaviour, because a caller fixing a manifest field by field would
make the *manifest* the product of the validator's ordering.

**D4 — How is "unknown capability" decided?**
Choice: against the **live** capability list from the capability bridge, read on each request.
Why: the gate is only meaningful if it answers "can this City do it right now". A copied constant would drift, and
a workspace where the answer defaults to "accept" is worse than no gate. An empty vocabulary therefore refuses
every requirement — "we know of no capabilities" must not read as "anything is fine".

**D5 — How is an impossible topology detected?**
Choice: each topology carries its own required shape, and the manifest must **declare what it will run on**
(`hosts` / `workers` / `controlSurfaces`), which is then checked: host count, at least N real workers, at least N
control surfaces, a topology that requires Android must name an Android surface, and a worker must be one of the
declared hosts.
Why: this is the only way "impossible" becomes decidable. `TWO_HOST_MESH` with one host is not a typo to smooth
over — it is a design that cannot be executed as written, and saying so at registration is cheaper than
discovering it after four repetitions. The declarations are stated for validation and are explicitly **not** a
resource reservation, so nothing here runs.

**D6 — What counts as software identity?**
Choice: `component@identity` where identity is a **full 40-character SHA** (`exact: true`) or an explicit version
label (`exact: false`, e.g. `dsh@1.0.0-alien-rebuild`). A hex-looking identity of 4–39 characters that is not a
version label is refused by name.
Why: it implements §2A.1 at the manifest level. A short SHA looks authoritative and is not an anchor; a branch name
is a moving target that should be visible *as* a label rather than passing for a pin. The predicate is generated
from the parse result rather than from a hand-typed list, which is a deliberate correction recorded in §5.

**D7 — Seed determinism.**
Choice: `deriveSeed` is a pure FNV-1a over `experimentId \0 seedPolicy \0 baseSeed \0 index-or-variant`. No clock,
no randomness, no dependency.
Why: a repetition is only a repetition if it is reproducible. `FIXED` must collapse to one seed across repetitions,
`PER_REPETITION` must produce distinct seeds, and `PER_VARIANT` must be stable per variant — all three are asserted,
because a "repetition engine" that quietly uses one seed five times is worse than no engine.

**D8 — Does this become a second task database?**
Choice: no. The contract refuses task-domain keys (`tasks`, `assignments`, `leases`, `claims`, `assignedNodeId`,
`taskId`, `results`, `executionState`) on the raw input, there is no run endpoint, and the responses state
`ownsTaskState` / `grantFaultAuthority` / `executesExperiments` as `false`.
Why: this is the workbook's explicit prohibition, and a prohibition that lives only in a comment is not a control.
The check is on the raw input rather than the projected manifest because the projection would have dropped exactly
the keys being looked for — see §5 D1.

**D9 — Fault profiles.**
Choice: `faultProfileRef` is carried as an opaque string with `referenceIsNotAuthorisation: true`; nothing resolves
it, and nothing here enables an injection.
Why: the workbook forbids the manifest gaining dangerous fault authority by existing. The reference exists so a
future fault layer can be named; the authority stays with the future, explicitly confirmed, injection surface.

**D10 — Who may register?**
Choice: research routes are **control-credential** routes, derived by narrowing the existing `nodeRoute` test rather
than adding a second auth mechanism.
Why: an experiment description names required capabilities, stop conditions and acceptance criteria for work placed
on workers. A worker that could register the experiment it will be judged by would make the acceptance criteria
self-certified.

## 4. What changed

| File | Nature |
|---|---|
| `contracts/experiment-manifest-v1/manifest.mjs` | **new** — topology/seed/stop/retention vocabularies, `validateExperimentManifest`, `deriveSeed`, `seedSequence`, `parseSoftwareRef`, `assertNotATaskStore` |
| `contracts/experiment-manifest-v1/index.mjs` | **new** — public surface |
| `contracts/experiment-manifest-v1/tests/conformance.test.mjs` | **new** — 9 contract tests |
| `services/dev-gateway/research/registry.mjs` | **new** — file-backed registry (list/inspect/validate/register/seeds) |
| `services/dev-gateway/server.mjs` | **modified** — registry construction, `researchFacts()` vocabulary publication, five research routes, control-credential auth refinement, typed manifest-error mapping |
| `tests/rex801-experiment-manifest.test.mjs` | **new** — 5 live-gateway tests |
| `docs/{en,zh-CN}/EXPERIMENT_MANIFEST_REGISTRY.md` | **new** — paired capability documentation |

Nothing in the task/node/action domain was changed: no task schema, no targeting, no claim/report transition, no
pairing, no UI.

## 5. Defects found and repaired during development (recorded, not cleaned up)

**D1 — The task-domain guard could never fire (LOGIC_CONFLICT, my own).**
`assertExperimentManifest` called `assertNotATaskStore` on the **validated** manifest, and
`validateExperimentManifest` builds a fresh object from known fields — so a manifest carrying `tasks` had them
dropped by the projection and the guard inspected a clean object. The guard was real code that could not do its
job. Repaired: the check now runs on the **raw input** in both `assertExperimentManifest` and
`registry.register`, before validation. Regression guard: the conformance test asserts all eight task-domain keys
are refused, and a nested `{tasks: []}` is accepted (the guard is about the manifest's own keys, not a false
positive on data it may legitimately describe).

**D2 — The short-SHA detector had a hole and a mis-classification (LOGIC_CONFLICT, my own).**
The first predicate was `/^[0-9a-f]{7,39}$/`, which (a) accepted a hex-looking string of length 4–6 such as
`utopia@abc12` and (b) classified the branch name `main` as a malformed SHA, which is the wrong refusal: `main` is
a *label*, not a broken anchor. Repaired: the detector now applies only when the identity is **not** a well-formed
version label, and the label form is accepted with `exact: false` so a caller can refuse to treat a label as a pin.
The test that had encoded the wrong expectation was corrected with it — the expectation was wrong, not the product.

**D3 — A fixture asserted a capability vocabulary I had assumed rather than read (MEASUREMENT_DEFECT).**
The live-gateway tests required `task.execute.safe`, which is a **worker task capability**, not one of the City's
provider capability ids. The real vocabulary is `planning.document.intake`, `planning.knowledge.query`,
`engineering.skill.inspect`, `research.evidence.review`, `presentation.theme.lab`. The manifest was refused with
`UNKNOWN_CAPABILITY` — the gate working correctly against a fixture that was wrong. Repaired in the fixtures, and
the test now asserts positively that a task capability is **not** accepted as a City capability, which turns the
mistake into a property.

**D4 — A flaky pre-existing test under full-suite load (MEASUREMENT/ENVIRONMENT, not this task).**
`tests/theme-build-bridge.test.mjs` → "D9 Bridge builds retained sandbox artifacts with canonical bounded results
and typed refusal" failed in one full-suite run (32 720 ms) and passes standalone (29 548 ms) and in the re-run.
No path this task touched is involved; it is a heavy sandbox-build integration test and the failure is
timing/parallel-load sensitive. Classified `FLAKY_PRE_EXISTING`; recorded rather than dropped, and **not** used to
claim a fully green local board.

## 6. Evidence

```text
node --test contracts/experiment-manifest-v1/tests/conformance.test.mjs tests/rex801-experiment-manifest.test.mjs
  14 tests / 14 pass / 0 fail

pnpm test                          (full root suite)
  1251 tests / 1247 pass / 4 fail   <- 3 environmental (resident City holds coordination port 4389) + 1 flaky (D4)
  baseline 0e9bea3 carried 1219 root tests: +32 from this task

node city/test-all.mjs
  1984 tests / 1977 pass / 7 skipped / 0 fail

node scripts/verify-promotion-history.mjs
  10 record(s) verified against local Git history at 0e9bea3ce739

node --test apps/rooms/tests/*.test.mjs / node scripts/check-bilingual.mjs
  recorded in the workbook frontmatter with the CI result
```

Workbook completion gates, mapped:

| Gate | Where proved |
|---|---|
| stable manifest (最低字段全覆盖) | `validateExperimentManifest`; conformance test "a missing field is reported, never defaulted" enumerates every required path |
| registry | `services/dev-gateway/research/registry.mjs`; survives a gateway restart with the same seed sequence |
| validation | malformed / unknown capability / impossible topology / conflicting variables / duplicated id / same-seed determinism are all asserted |
| direct-control contract | five authenticated research routes; validate-before-run does not register; no run endpoint exists |
| opposite-host Review | **PENDING** — not claimed |
| exact-head CI | §7 |
| PAPER_MATERIAL_INDEX | `mission-book/reports/REX-801/PAPER_MATERIAL_INDEX.md` |
| exposure gate PASS | §8 Capability Exposure Decision |

## 7. Head and CI

```text
development_head_sha   8f8c521fc299d622093776615b653457d8833f96
development_ci         V0.2 checks run 37241196692 -> COMPLETED SUCCESS on that exact SHA
```

### 7.1 Integration-ready candidate (§7 reconciliation, recorded without pre-empting the review)

`main` moved while this task was in flight: `0e9bea3ce739b979e582a428af8fb233045a5e75` →
`d3262ce2dd81e51a53e39e6f9add8dee650a7682` (the other host merged an unrelated pairing fix). Rather than leave a
reviewer to discover a stale base, the branch was rebased onto current `main` and force-pushed **with lease**:

```text
integration_candidate_sha   ef89e917c0468b38ade26e666ca98c754ef8945a   (rebased onto d3262ce…, conflict-free)
acceptance re-run on it     14/14 REX-801 tests pass; 4/4 tests/gateway.test.mjs pass;
                            check-bilingual = SYNCHRONIZED
candidate CI                V0.2 checks run 37241780688 -> COMPLETED SUCCESS on ef89e917… (gateway-web, android)
```

**Why `development_head_sha` was NOT changed to the candidate.** `development_head_sha` names the head the
development evidence was produced on, and that evidence is real and still valid for `8f8c521`. Recording the
rebased head as if the development had happened there would be a provenance mismatch — the same class of error as
writing a SHA from memory. Which head the opposite-host review verifies is the reviewer's decision under §2A.6, so
the candidate is recorded *beside* the verified development head, with neither replacing the other.

## 8. Capability Exposure Decision (`CONSTRUCTION_RULES.md` §14A)

```text
user_exposure_class    = DIRECT_CONTROL
user_exposure_surface  = the research route family GET/POST /api/v0/research/experiments[...]
user_exposure_nesting  = L3_ADVANCED (namespace reserved for the Research / Advanced layer)
backend_wiring         = VERIFIED — every operation reaches the real registry: list and inspect read the stored
                         documents, create/import validates against the live capability vocabulary and persists,
                         validate never persists, seeds are computed from the stored manifest
ui_exemption_reason    = not INTERNAL_ONLY, so no exemption is claimed
```

**Honest note on the UI half.** The workbook places this capability in `Research/Advanced` and says the initial UI
"不要求挤进主导航"; the programme's own `RESEARCH_CONTROL_SURFACE.md` assigns the layered Research interface to a
later task, and `REX-807` is that task ("research control surface and progressive disclosure", currently
`WAITING_DEPENDENCIES`). This task therefore ships the **complete control contract** — authenticated, discoverable
from the contract itself (each response publishes the topologies, seed policies, stop-condition kinds, retention
levels and the live capability vocabulary a caller needs to build a valid manifest) — and no new navigation entry.

What this means for §14A.3, stated plainly rather than glossed: the backend wiring is complete and verified, and
the *presentation* layer is deferred to the task that owns the presentation layer. The capability is therefore
recorded as `DIRECT_CONTROL` with an open UI seam, not as complete user exposure. A reviewer should treat
"a normal user can reach it in one or two steps from a fresh start" as **NOT YET MET**, and that is the intended
state for a first component in a programme whose last exposure task owns the surface.

## 9. What is NOT claimed

* **Opposite-host Formal Review is PENDING.** This session runs on Mech only; `CONSTRUCTION_RULES.md` §3 requires a
  different physical host, and the workbook's `review_host` / `review_complete` fields are left untouched.
* **No experiment was executed**, so no measurement, hardware, performance or multi-host claim is made. There is no
  run/stop/export path in this task, by design (REX-803..806 own those).
* **No fault injection authority** is granted anywhere: `faultProfileRef` is an opaque reference and
  `grantsFaultAuthority` is `false`.
