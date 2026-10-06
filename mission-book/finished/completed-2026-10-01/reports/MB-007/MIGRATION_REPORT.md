# Migration Report — MB-007

```text
MISSION = MB-007
ROLE = MIGRATION
HOST = Alien
CLAIM_COMMIT = c6ff44f4bd6e2a711a2e838d1efd04e61fd0b5e4
DONOR_BASELINE = zhiheng-zhang-Mera/Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080
IMPLEMENTATION_BRANCH = mission/MB-007-research-institute
IMPLEMENTATION_HEAD = 71267e83570f5749bb2d1cf9537040ef0af869eb
IMPLEMENTATION_CI = 36577840443 PASS (gateway-web + android)
MIGRATION_HEAD = 68015caa71b7788f700abb1c7918d1b5ee8f9e8c
MIGRATION_CI = 36578310170 PASS (gateway-web + android)
MIGRATION_COMPLETE = false
```

> ## ⚠ THIS MIGRATION IS NOT COMPLETE, AND THE HOST IS NOT CLAIMING IT IS
>
> The port is done, tested and green. The Mission's own gate — *"至少完成一次真实产品消费；
> UI/客户端要求仅复用当前存在的 Utopia 消费面"* — is **unmet**, and section 4 explains exactly
> why it cannot be met inside this mission's boundaries. Under mission-book rule 13 the host
> therefore marks MB-007 `BLOCKED_OWNER_DECISION` rather than `migration_complete: true`.
>
> **What the Owner is being asked to decide** is set out in section 4, D1. Nothing else in this
> report is blocked: the five modules are landed, parity-tested, registered, and green on the
> required CI.

---

## 1. 落地边界 / Landing boundary

Target building: **`city/06-research/01-research-institute`** — an EXISTING building that already
owns the migrated `evidence-engine`. The five new modules are siblings. `evidence-engine` was not
read for behaviour, wrapped, re-exported or forked, and two modules assert in their own suites
that their sources never mention it.

| Module | Donor source (frozen SHA above) | Tests |
| --- | --- | --- |
| `research-protocol` | `src/shared/research-ir.ts`, `research-protocol.ts`, `research-contract.ts`, `research-roles.ts`, `research-command.ts` | 35 |
| `research-provenance` | `src/shared/research-citation.ts`, `research-bibliography.ts`, `research-input.ts` | 18 |
| `research-statistics` | `src/shared/research-statistics.ts`, `research-battery.ts` | 24 |
| `research-manuscript` | `src/shared/research-figures.ts`, `research-manuscript.ts` | 21 |
| `research-review` | `src/shared/research-review.ts`, `research-adjudicate.ts`, `research-levela.ts`, `research-levelb.ts`, `research-capability-registry.ts` | 44 |

142 new module tests. All seventeen donor files are pure (the whole set has five import lines, four
of them type-only, and no `node:` builtin), so the boundary is the donor's own pure layer; the
runtime layer under `electron/research/**` was left alone. Every module carries a `DONOR.json`
with the mission block, and four declare `UTOPIA_EXTENSION: []`.

- **Independent parity evidence, not self-consistency**
  - `research-manuscript`: the **real donor modules were executed** under Node 24's type-stripping
    and diffed against the port over **1 590 comparisons, 0 mismatches**, covering every reachable
    export and NaN/Infinity/negative/empty/41-bar/long-label/malformed inputs. `validateManuscriptPlan`
    was compared against donor *source text* because the donor never exports it, so it is erased at
    runtime and unreachable in the donor.
  - `research-statistics`: all **16 ported function bodies** were extracted from both sides with
    TypeScript annotations neutralised and compared — identical — and all **49** reason strings,
    missing labels, scenario labels and numeric defaults were confirmed verbatim in the donor.
  - `research-protocol`: all **136 one-line string literals** in the five donor files were confirmed
    present in the port except two deliberate differences (the donor's `./research-ir` import
    specifier and template quote style).
  - `research-provenance`: all **13 refusal messages** byte-identical to the donor, including the en
    dashes in `(1–20000 chars)` and `1–5 runtime ids`.
  - `research-review`: vocabularies compared byte-for-byte against the read-only donor; the Level-A
    arithmetic checked against a line-by-line transcription for 8 input combinations before its
    expected numbers were pinned.

- **Donor defects preserved verbatim, never repaired.** This is the discipline MB-006's report
  argues for, and it was made an explicit instruction to every port here. Each defect below has a
  test pinning the *actual* behaviour, and each is in `knownDifferences`:
  - `research-statistics`: the unreachable `READY → REPLICATION_FAILED` downgrade is carried as-is;
    a `READY` outcome still ignores `replication`; `INCONCLUSIVE` and `INSUFFICIENT_EVIDENCE` still
    read only their own two inputs; `bootstrapCi` at `alpha = 1` still returns `lower > upper`
    (2.75 / 2.25); no rounding or clamping was added — `confidenceInterval([1,3]).lower` is pinned
    at `0.040000000000000036`.
  - `research-manuscript`: `evidenceCheckDraft`'s `asserted` list is filtered with
    `!allowedEvidenceIds.includes(id)`, discarding exactly the briefed-but-unavailable ids it was
    meant to report; its `.slice(0, 20)` runs before references are merged, so 25 out-of-scope
    references all come back and the documented 20-item bound does not hold; `metricFigureSvg`
    prints `n/a` for non-finite values yet still emits `y="NaN" height="NaN"`;
    `resultTableToMarkdown` escapes only the row label and footnote.
  - `research-review`: `adjudicateClaim` still ignores the `verifiedCitations` its own interface
    declares — no citation ladder was invented into it. The `?? "no evidence"` fallback and the
    dead `AVAILABLE` initial value are kept rather than "cleaned up".
  - `research-provenance`: unchecked `proposedAuthors` / `proposedVenue` / `sourceRef` / `updatedAt`;
    unchecked reviewer entries; `bibliographyEntries` validating and deduplicating nothing (the same
    record twice renders twice and order is preserved); `summarizeCitationAudit().ok` false only for
    `UNSUPPORTED`/`CONTRADICTED`.
  - `research-protocol`: `scientificCore` / `diffProtocol` keep the donor's lenient reading and do
    not call the protocol factory.

- **Explicitly not migrated**: the whole `electron/research/**` runtime plane — `research-conductor.ts`,
  `research-service.ts`, `research-supervisor.ts`, `research-ledger.ts` (D7), the `protocol-manager`,
  the literature `host-retrieval`, the manuscript `latex-compiler` and `manuscript-assembler`, the
  runtime `process-runner`, and the durable ledger/resume path. The mission's
  "durable ledger/resume/partial-failure honesty" group is therefore **not covered**, because every
  file that implements it is fs-coupled; that is recorded here rather than silently omitted.

- **Contract / interface boundary**: pure functions over plain serializable values. No fs, no
  network, no `process.env`. Time and ids are injected: `research-provenance` replaced the donor's
  `Math.random` with an injectable `hexDigit` defaulting to `crypto.randomInt(16)` (same 0–15 range
  and id shape) and made `now` a required parameter; `research-review` made
  `buildExperimentSpec`'s clock an injected `now` defaulting to a deterministic epoch sentinel;
  `research-statistics` needed no injection at all because the donor's only generator is its own
  seeded `mulberry32`. The donor's `new Date(0).toISOString()` epoch defaults are kept verbatim.

- **Existing Utopia UI / real-consumption path**: **none — see section 4.**

---

## 2. 测试与运行 / Tests & runtime

- **Unit / contract / parity**: 142 module tests. Full CI-equivalent suite on this branch:
  `pnpm test` 58/58, `apps/rooms` 67/67, `node city/test-all.mjs` 272/272,
  `node scripts/verify-promotion-history.mjs` 10 records verified, `pnpm check:docs`
  `PAIR_STATUS = SYNCHRONIZED`.
- **Real consumption**: **none** (section 4, D1).
- **Failures encountered**: no fidelity defect required a correction in this mission — the explicit
  "do not add policy the donor does not have" instruction was given to every port, and this time it
  held. The only transient failures were sibling-module `ENOENT`s while the five ports landed
  concurrently, which resolved on their own. Recorded as `TEST_PASS` (`MB-007:7e34545988213a8f`)
  with no `TEST_FAIL` event, which is itself the honest record.
- **Known limitations**: section 6.

---

## 3. Utopia 狗粮 / Evolution handoff

- **Evolution inbox**: `data-records/evolution/inbox/mission-book/MB-007/events.jsonl`.

  | Event | Type | Outcome |
  | --- | --- | --- |
  | `MB-007:aed2f98461218646` | MISSION_CLAIMED | INFO |
  | `MB-007:7f6b677adfbaac18` | ATTEMPT_STARTED | INFO |
  | `MB-007:fc41b3618a0f97f8` | CHANGE_APPLIED | INFO |
  | `MB-007:7e34545988213a8f` | TEST_PASS | PASS |
  | `MB-007:7d6c861428278c83` | RUNTIME_FAIL | BLOCKED — the consumption gate |
  | `MB-007:4b2456330916b878` | CI_RESULT | PASS — CI only, **not** completion |

  There is deliberately **no `MIGRATION_COMPLETE` event**: the gate is unmet.

- **Candidate evidence**: nothing published to `evidence/raw/mission-book/MB-007/`.
- **`.runtime` evidence**: the donor inventory was taken directly from the checkout; no separate
  survey artifact was produced for this mission.

---

## 4. 施工中的问题、选择与判断逻辑 / Problems, choices and the reasoning

**D1 — ⚠ The product-consumption gate is unmet, and the mission is blocked on an Owner decision.**
*The problem.* MB-007's Migration gate requires *"至少完成一次真实产品消费；UI/客户端要求仅复用当前
存在的 Utopia 消费面"*. The five migrated modules are a research pipeline — IR/protocol, provenance,
statistics, manuscript assembly, review/adjudication. I searched the running product for a consumer
and there is exactly one place where research behaviour is consumed:
`services/capability-bridge/registry.mjs` binds the single capability `research.evidence.review` to
`evidence-engine`, and `services/capability-bridge/adapters.mjs` invokes it. That is the same
building, but a *different* module — one MB-007 explicitly forbids re-implementing, and whose
verdicts the Verification gate requires to keep passing unchanged.

*Why nothing fits.* Every candidate rewiring fails for a stated reason:
- Pointing the evidence capability at any of these modules, or having them own its verdict, changes
  the Evidence Engine's behaviour — forbidden by both the "no second Evidence Engine" clause and the
  Verification gate's "Evidence Engine 现有验收与引用关系保持通过".
- Adding an operation to `research.evidence.review`, or adding a new adapter for a research chain,
  changes the capability list that Web and Android read and breaks the five-adapter census that
  `tests/capability-adapters.test.mjs` and `tests/capability-bridge.test.mjs` assert. That is a new
  product surface, which rule 14 forbids presenting as a migration, and MB-007 separately forbids
  *"为迁移新增新的论文工作流或外部数据源"*.
- The one equivalence-preserving rewiring that does exist is `mean` inside
  `scripts/resource-pilot.mjs`, which aggregates RSS samples inline. `scripts/` is not one of the
  consumption surfaces rule 14 names, and replacing one arithmetic expression would be a decoration,
  not a consumption. Recording it as "real product consumption" would be exactly the overclaiming
  rule 14 exists to prevent.
- The Verification gate's own wording — *"使用 donor 已有能力完成一个有界的
  protocol→evidence/statistics→manuscript/PDF 或等价既有链路"* — shows that a full research chain is
  expected to be **run**, and that run belongs to the Verification host. A verification run is not a
  product consumption.

*The choice.* Do **not** invent a surface, do **not** touch the Evidence Engine, and do **not** mark
the mission complete. Record the gate as unmet, mark `BLOCKED_OWNER_DECISION` per rule 13, and put
the decision to the Owner. *Why:* the alternative — a new capability wired in to satisfy a gate —
would be a product decision disguised as a migration, and it is precisely what the mission-book's
rules 1, 11 and 14 forbid in three different places.

*The Owner's options, stated concretely:*
1. **Accept the boundary.** Treat "the migrated modules are exercised by the Verification host's
   bounded research chain" as satisfying the gate, and mark MB-007 complete on that basis. This
   requires editing MB-007's Migration gate or issuing an explicit ruling, not a host decision.
2. **Authorise a specific consumption.** Name the surface (for example, a bounded research chain
   exposed through the existing services page) and say explicitly that it is authorised for MB-007,
   since it adds a capability to the Web/Android list.
3. **Supersede MB-007.** Rule 13 forbids a third host from quietly taking over; if the port should
   land without consumption, an explicit superseding Mission is the sanctioned route.

*What is already true regardless of the ruling:* the port is complete, parity-tested against the
donor with independent differential evidence, registered in the manifest behind the
`capabilityProvider: false` flag so the product surface is unchanged, and green on the required CI.

**D2 — Ordering: why MB-007 and not MB-004.**
At claim time MB-004 was still unclaimed but declares `依赖 Mission: MB-003`, which was
`migration_complete` while unverified and unmerged; a branch cut from `main` could not contain it. I
took the conservative reading of "依赖满足" and skipped it. Host `Mech` subsequently claimed MB-004
under the looser reading. Both readings are now recorded in the mission index so the question is not
re-litigated, and it will matter again at MB-004's verification and at merge time.

**D3 — `capabilityProvider: false`, third use.**
Five new modules in a **domain** district would otherwise be advertised to Web and Android as
`unavailable` capabilities awaiting a bridge. They declare `"capabilityProvider": false`, and
`services/capability-bridge/registry.mjs` skips such modules. The registry and `manifest.mjs` hunks
are byte-identical to MB-003's and MB-006's so they should merge cleanly. **MB-001 uses a
district-level `kind: "infrastructure"` for the same purpose**, so four missions now carry this
concern; see the merge note below.

**D4 — ⚠ Four missions have now edited the same city files.**
MB-001, MB-003, MB-006 and MB-007 all branched from `c7ef3cd` and all edit
`city/CITY_IMPLEMENTATION_MANIFEST.json`, `city/tests/manifest.test.mjs` and
`city/docs/{en,zh-CN}/ARCHITECTURE.md`. This is structural to the mission-book, not a mistake by any
host, and it is now the largest single risk to landing this work. The recommendation from MB-003's
report stands and is now four times better supported: **resolve it by generalising to the
module-level `capabilityProvider` flag and retiring MB-001's district-level `kind`**, and resolve the
census conflicts by taking the union of the module lists.

**D5 — The type-only dependency in `research-input.ts`.**
`research-input.ts` references `ResearchIR` from `research-ir.ts` by type only. `research-protocol`
ports that shape. Because the donor edge carried no runtime dependency, the module declares the
minimal produced shape locally rather than importing across modules: `humanResearchToIR` is a
*producer*, so there is no caller-supplied boundary value to validate, and the local typedef covers
exactly the fields the donor's literal assigns. The other type-only edge
(`research-bibliography.ts → CitationRecord`/`CitationStatus`) is replaced by frozen vocabularies.
Both are recorded in the module's `DONOR.json`.

**D6 — Environment facts.** `pnpm` is not on `PATH`; use `corepack pnpm@11.19.0`.
`pnpm mission:event -- --mission …` forwards a literal `--` and fails. A `mission:event` summary over
1000 characters is refused with exit 2 — hit twice in this mission, both times on a summary that had
to be trimmed and re-recorded. `node --test <dir>` is not accepted by this Node build.

---

## 5. 交给验证主机 / Handoff to verifier

**MB-007's Verification stage is NOT open.** Rule 13: a mission marked `BLOCKED_OWNER_DECISION` must
not be taken over by a third host, and the Owner decides whether a superseding Mission is created.
A host that believes it can verify this work should first confirm with the Owner that the
consumption gate has been resolved.

Independent-review hints, if and when verification proceeds:

- `city/06-research/01-research-institute/*/DONOR.json` — the declared boundary per module. The
  `knownDifferences` blocks are the highest-value reading: they enumerate the donor defects that were
  deliberately preserved, and each has a test pinning the actual behaviour.
- `research-manuscript/manuscript.mjs` and `figures.mjs` — the 1 590-comparison differential harness
  lived outside the repo and was deleted, so the parity claim must be re-derived by the verifier from
  the donor at `D:\Codex-Boss-donor`, not taken from this report.
- `research-statistics/statistics.mjs` — the pinned float literals (for example
  `confidenceInterval([1,3]).lower = 0.040000000000000036`) are the fastest way to detect an
  accidental "cleanup".
- `services/capability-bridge/registry.mjs` and `city/manifest.mjs` — the `capabilityProvider` flag.
- Section 4, D1 — the blocking decision, with the three options.

- Branch HEAD: `68015caa71b7788f700abb1c7918d1b5ee8f9e8c` on `zhiheng-zhang-Mera/utopia`, branch
  `mission/MB-007-research-institute`.
- Hosted CI: implementation `36577840443` PASS; claim-stage push `36576078261` PASS.
- The migration host did **not** merge, and did **not** run `pnpm mission:finalize`.

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/MIGRATION_REPORT.md)
