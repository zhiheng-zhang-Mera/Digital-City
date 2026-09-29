# Migration Report — MB-006

```text
MISSION = MB-006
ROLE = MIGRATION
HOST = Alien
CLAIM_COMMIT = 3bb6a1c3ea80781a4912b604d388b8bf7fa4b139
DONOR_BASELINE = zhiheng-zhang-Mera/dsh-restart @ e20fb6cc43e27cedf6303471e5b8ee18e1383ecd
IMPLEMENTATION_BRANCH = mission/MB-006-restart-recovery
IMPLEMENTATION_HEAD = 9584b98bd9f2bacad93274c74716281c7e0b2b1e
IMPLEMENTATION_CI = 36574888667 PASS (gateway-web + android)
MIGRATION_HEAD = dab820b37ff39d1581b19dd43e75771507fb7139
MIGRATION_CI = 36575418378 PASS (gateway-web + android)
MIGRATION_COMPLETE = true
```

The implementation SHA carries the migration; the migration head is that tree plus the closing
process-event commit, whose only content is
`data-records/evolution/inbox/mission-book/MB-006/events.jsonl`. Both SHAs were run through the
required CI and both are green. The intermediate head `d5587756` was also green (runs
`36574760625`, `36574754834`, `36574753356`), as was the claim-stage push `52946b69`
(run `36572337586`).

Sections 4 and 5 are the required record of what this mission did not decide for itself.
Section 5 is the one that matters most here: this migration's real difficulty was **fidelity**,
not porting, and the failures below were caught by review after the tests were already green.

---

## 1. 落地边界 / Landing boundary

Target building: **`city/02-engineering/04-restart-recovery-station`** — a NEW building in the
existing `02-engineering` district.

| Module | Donor source (frozen SHA above) | Tests |
| --- | --- | --- |
| `restart-protocol` | `src/shared/protocol.ts`, `src/shared/types.ts`, `src/plugin/request-validator.ts` | 36 |
| `restart-lock` | `src/plugin/restart-lock.ts` | 10 |
| `checkpoint-gate` | `src/plugin/checkpoint-gate.ts` | 11 |
| `restart-ticket` | `src/plugin/ticket-store.ts`, `src/plugin/atomic.ts` | 19 |

76 new module tests. Every module carries a `DONOR.json` naming its donor paths, adaptation,
known differences, parity vectors and a four-way classification; all four declare
`UTOPIA_EXTENSION: []`.

**The donor's structure is preserved, and that is the load-bearing part of this boundary.**
In the donor, `src/shared/{protocol,types}.ts` is the single source for the vocabularies,
`canonicalJson` and the port contracts, and `src/plugin/*.ts` imports it. `restart-protocol`
is the port of that shared layer; `restart-lock`, `checkpoint-gate` and `restart-ticket`
import from it across module boundaries rather than re-declaring anything. A function that
*defines* a checksum, and a vocabulary a state machine *depends on*, must have one home.
`restart-ticket`'s digest is defined by `restart-protocol/canonical-json.mjs`, and the pinned
digest `sha256:c12d61303692fea8ab4ab0f238efd78bbdb6554d6c154a2e587c5f07739185762` was
re-verified after the import replaced the inlined copy.

- **Preserved behavior** (each vector is asserted in that module's tests; the full list is in
  its `DONOR.json`)

  - `restart-protocol`: the protocol/schema versions; the mode, priority, reason-code,
    request-state, lock-state and supervisor-state vocabularies; `canonicalJson` exactly
    (`JSON.stringify(v) ?? 'null'`, element-wise arrays, `undefined` dropped from objects, the
    `a < b` comparator, no-whitespace emission); the fourteen self reason codes; and
    `validateShape` + `validateRequest` with the donor's ladder order, refusal codes and detail
    strings, the four `MAX_*` bounds (128/64/64/500), the trimming and control-character rules,
    the `priority` default, the `createdAt` epoch default and `requestFingerprint`. A fresh
    transcription of the donor validator was compared against the port over **32,801
    comparisons with 0 mismatches**.
  - `restart-lock`: all six declared states, the eleven legal edges (all 36 state pairs walked),
    the verbatim refusal detail `illegal restart lock transition <from> -> <to>; allowed: …`,
    the `entering REQUESTED requires a request id` refusal, the holder being set only on
    `IDLE → REQUESTED` and cleared on `→ IDLE`, `heldForMs()`, the request-state mapping, the
    bounded history dropping oldest first, and `release(reason)` from every non-idle state plus
    its `null` no-op.
  - `checkpoint-gate`: the unbound port's exact answer and `acknowledgeResume`; `available`;
    `authorized = required ? outcome.safe && outcome.completed : true`; the
    ` (checkpoint not required for this request)` suffix only when the checkpoint was not
    required and the outcome was not safe; a throwing port → `checkpoint_threw`; and the
    timeout path (`checkpoint port <id> did not answer within <timeoutMs> ms`), with
    `timeoutMs <= 0` meaning no timeout.
  - `restart-ticket`: `ticketChecksum`, `buildTicket` and `verifyTicket` as the donor's exact
    **six** rungs in the donor's order with the donor's detail strings and no seventh rung, and
    `emptyLedger`.

- **Explicitly not migrated** (all recorded per module)

  - `restart-manager.ts` (the orchestration that drives one restart end to end),
    `bin/supervisor.mjs`, the supervisor in full (heartbeat, pid watch, relaunch, crash-loop
    breaker, safe mode), the audit log, and `src/shared/config.ts`'s resolver and defaults.
  - All file I/O: `TicketStore` and its methods, `writeFileAtomic` / `writeJsonAtomic` /
    `readJson` / `mtimeMs` / `sizeBytes`. The ticket's **atomicity contract** (sibling temp file
    → `fsync` → `rename`, so a crash leaves old or new and never a mixture) is preserved as
    documentation in `restart-ticket`'s `DONOR.json` and as `ATOMICITY_CONTRACT` in `ticket.mjs`,
    because the document is what was migrated and the storage layer is not.
  - `health-scheduler-bridge.ts`, the Windows helper scripts (`scripts/*.ps1`), process exit,
    signalling and launch of any kind.
  - The donor's `now()`/`Date.now()` defaults: `nowMs` is already a parameter of the ticket
    functions, and the two objects that read a clock take an injected one. `restart-lock`'s
    `now` defaults to a fixed epoch 0 clock rather than `Date.now`; that is recorded as a
    deliberate difference.

- **Contract / interface boundary**

  Pure functions over plain serializable values: no fs, no network, no `process.env`, no
  `Date.now`, no `Math.random`. The single ambient dependency in the whole building is the
  `setTimeout` used by the checkpoint gate's timeout — the donor used ambient timers, and
  inventing a fake-timer seam would have been a new interface, so the timeout path is tested
  with a real short budget instead.

- **Existing Utopia UI / real-consumption path**

  `services/dev-gateway/server.mjs` — the task/control flow Web and Android drive. The
  post-restart sweep that decides whether interrupted work may resume no longer decides by an
  inline state test; it asks the migrated `checkpoint-gate`, with Utopia's policy supplied as
  data: a task still `QUEUED` never started, so `required` is false and the gate authorizes it
  (it stays queued); a task that had started would lose work, and Utopia binds no checkpoint
  port, so the donor's fail-closed default refuses it — the same outcome, error text and event
  the inline sweep produced. `timeoutMs` is 0 because the unbound port answers synchronously.
  `tests/gateway.test.mjs` drives a real gateway over a real store, restarts it, and asserts
  both branches plus that the Core reaches the same two verdicts for the same policy. No new UI
  was built.

---

## 2. 测试与运行 / Tests & runtime

- **Unit / contract / parity**: 76 module tests. Full CI-equivalent suite on this branch:
  `pnpm test` 59/59, `apps/rooms` 67/67, `node city/test-all.mjs` 206/206,
  `node scripts/verify-promotion-history.mjs` 10 records verified, `pnpm check:docs`
  `PAIR_STATUS = SYNCHRONIZED` for docs, evidence and data-records.
- **Real consumption**: `tests/gateway.test.mjs :: the post-restart resume decision is owned by
  the migrated checkpoint gate`.
- **Failures encountered**: three fidelity defects plus one corrupted literal, recorded as
  `TEST_FAIL` (`MB-006:71ea239e0c6e2ac4`). See section 5.
- **Repairs applied** (`MB-006:a22d9f115d9943bb`): see section 5.
- **Known limitations**: see section 6.

---

## 3. Utopia 狗粮 / Evolution handoff

- **Evolution inbox**: `data-records/evolution/inbox/mission-book/MB-006/events.jsonl`.

  | Event | Type | Outcome |
  | --- | --- | --- |
  | `MB-006:28d31927fea95493` | MISSION_CLAIMED | INFO |
  | `MB-006:0bc66c175382bd0d` | ATTEMPT_STARTED | INFO |
  | `MB-006:a6f18c389c31fc58` | CHANGE_APPLIED | INFO |
  | `MB-006:71ea239e0c6e2ac4` | TEST_FAIL | FAIL |
  | `MB-006:336d28b3d853cfa6` | RUNTIME_PASS | PASS |
  | `MB-006:1c1e491fc1260a46` | TEST_PASS | PASS |
  | `MB-006:a22d9f115d9943bb` | REPAIR_APPLIED | REPAIRED |

  `CI_RESULT` and `MIGRATION_COMPLETE` are appended once the hosted run settles; the head above
  is the branch head before that append, which adds process data only.
- **Candidate evidence**: nothing published to `evidence/raw/mission-book/MB-006/`.
- **`.runtime` evidence** (git-ignored, this host):
  `.runtime/evidence/mission-book/MB-006/run-001/WORKING_STATE.md` — the durable handoff note
  written before the ports started, including the measured donor inventory.

---

## 4. 施工中的问题、选择与判断逻辑 / Problems, choices and the reasoning

**D1 — MB-004 was skipped, and MB-006 claimed instead.**
*Problem:* MB-004 is the lowest-sequence unclaimed migration, but it declares
`依赖 Mission: MB-003`, and MB-003 is `migration_complete` while its Verification stage is
open and its branch is **not merged**. Rule 7 cuts every migration branch from the target
repo's latest `main`, so an MB-004 branch today would not contain the Worker Gateway adapter
layer it depends on. The mission-book never defines when a dependency counts as satisfied.
*Choice:* the conservative reading — satisfied once the dependency's artifacts are in `main` —
so MB-004 stays unclaimed and MB-006 (no dependency) was claimed. *Why:* building the Foreman
on a tree without its declared dependency would produce a branch that cannot honestly consume
it. *Cost:* MB-004 is now waiting on a *third* host, because MB-003's verification needs a host
other than `Alien`. Recorded in the City mission index so the next host does not have to
rediscover it.

**D2 — The donor's shared layer had to stay one layer.**
*Problem:* the first ports re-declared things. `restart-ticket` inlined its own copy of
`canonicalJson`; `restart-lock` re-declared the two state vocabularies; `checkpoint-gate`
re-declared `checkpointOutcome`. *Choice:* `restart-protocol` owns them and the other three
import from it, mirroring `src/plugin/*.ts → src/shared/*.ts`. *Why:* `canonicalJson` **defines**
the ticket checksum — two copies that drift make a ticket built by one module stop verifying in
the other, silently, with no test able to see it. *Cost:* the tree now has its first
cross-module import inside a building; that is recorded in both architecture docs and in each
`DONOR.json`. Identity assertions were added so a re-declared copy cannot return unnoticed: a
`deepEqual` copy would pass a value test but fails an identity test.

**D3 — `capabilityProvider: false`, again.**
*Problem:* adding four modules to a **domain** district makes the capability registry advertise
them to Web and Android as `inputKind: 'unavailable'` capabilities awaiting a bridge.
*Choice:* a module-level `"capabilityProvider": false`, validated in `city/manifest.mjs`, with
`services/capability-bridge/registry.mjs` skipping such modules — the same mechanism MB-003
uses, written with the same wording so the two changes are textually identical. *Why:* these
modules are restart infrastructure and expose no capability; the alternative (editing the two
count assertions) would leave the pollution in the product surface. *Cost:* see D4.

**D4 — ⚠ MB-001, MB-003 and MB-006 now each carry the same governance change.**
All three branched from `c7ef3cd` and all three edit `city/CITY_IMPLEMENTATION_MANIFEST.json`,
`city/tests/manifest.test.mjs` and `city/docs/{en,zh-CN}/ARCHITECTURE.md`. MB-001 keeps kernel
modules out of the capability surface with a **district-level** `kind: "infrastructure"`;
MB-003 and MB-006 use a **module-level** `capabilityProvider: false`. MB-003 and MB-006 add
byte-identical registry and `manifest.mjs` hunks, so those should merge cleanly; the manifest
bodies, the census lists and the docs will conflict.
*This is a finding about the mission-book itself, not about any host:* missions branch from
`main` and share city files, so this is structural. Only the merge order or an Owner ruling can
resolve it, and the third copy makes it more urgent. MB-001's report raised it first; this one
confirms it with a third instance and recommends generalising to the module-level flag and
retiring the district-level `kind`.

**D5 — Only one of the four modules could be consumed without inventing semantics.**
*Choice:* consume `checkpoint-gate` in the gateway's post-restart sweep; land the other three
with parity tests and record them as landed-but-unconsumed boundaries. *Why:*
- `restart-protocol` — its ladder validates a restart *request* with source, mode, priority and
  cooldown concepts. Utopia's task command admission (`validateCommand`) rejects any key other
  than `type`; there is no source, mode, priority or cooldown to map onto, and inventing the
  mapping is what `MIGRATION_ONLY` forbids.
- `restart-lock` — Utopia has no exclusive restart lock. The gateway's nearest invariant is
  one task per node, which is per-node, has no state machine, and is not persisted; replacing it
  would change task semantics.
- `restart-ticket` — the ticket is a document another process verifies before acting. Utopia's
  only such document is `.runtime/processes.json`, which is read by
  `scripts/restart-gateway.ps1` — PowerShell, which cannot import a module — and whose identity
  check is a command-line match rather than a checksum. The nearest Node consumer,
  `scripts/audit-delivery.mjs`, verifies per-file SHA-256 against bare hex, while the donor's
  helper emits `sha256:<hex>`; adopting it would change the comparison, not rewire it.
  *Cost:* three of four modules ship without a consumer, which is the same shape as MB-001
  (one of four) and MB-003 (one of three), and is again recorded rather than papered over.

**D6 — The gate's two branches are both genuinely used.**
Because "consumption" here is a mechanism rewiring rather than a new screen, it is worth
stating why the wiring is not decorative: the sweep has exactly two cases, and the gate answers
them through **both** of its branches. A never-started task takes `required: false` →
`authorized: true`; a started task takes `required: true` with an unbound port → not authorized.
The port is bound to the donor's own `UnboundCheckpointPort`, whose entire purpose is to say
"cannot verify", so the fail-closed answer is the donor's rule and not a constant the wiring
supplies.

**D7 — The donor's declared limitations, recorded verbatim and not repaired.**
MB-006 requires the donor's known limitations to be recorded as they are and not fixed in
passing. They live in `restart-protocol/DONOR.json` under `donorLimitations` with their donor
file and line references:

1. **`WAITING_FOR_EXIT` has no deadline** — `docs/failure-modes.md`: "There is **no timeout** on
   `WAITING_FOR_EXIT`, and **no \"dirty restart\" record** is written anywhere."
2. **`safety.allowForceTerminate` is declared, validated and never consulted** — `README.md`:
   "declared, validated, **never consulted** by this release".

Two further donor gaps are recorded beside them: `STOPPED` is declared in the `SupervisorState`
union and never assigned by any code path, and the cross-restart cooldown bound is not enforced
because cooldown state is in-memory. None of the code that would exhibit any of these was
migrated, so nothing here is a claim about the ported modules — the block exists so a later
mission does not silently close a donor gap and call it migration.

**D8 — Environment and tooling facts.** `pnpm` is not on `PATH`; use
`corepack pnpm@11.19.0`. `pnpm mission:event -- --mission …` forwards a literal `--` and fails;
use `pnpm mission:event --mission …`. A `mission:event` summary longer than 1000 characters is
refused with exit 2 — one event in this mission had to be shortened and re-recorded.
`node --test <dir>` is not accepted by this Node build; name files or glob them.

---

## 5. 保真度：测试全绿之后才发现的缺陷 / Fidelity: defects found after the tests were green

This is the part of MB-006 a verifier should read most carefully, because every item below was
in a module whose own tests passed.

**F1 — `verifyTicket` had grown a seventh rung.** The port rejected documents with a missing or
undeclared field as `malformed`. The donor has exactly six rungs — `missing`, `malformed` (only
for a non-object), `schema_version`, `checksum`, `expired`, `wrong_pid` — and it hashes whatever
it received, so a missing or hand-edited field already fails the `checksum` rung. The added
rung changed the verdict for documents the donor **accepts**. Repaired: the rung and the
`Array.isArray` special case are gone, and tests now assert the *donor's* behaviour for those
inputs (an extra field with a covering checksum **verifies**; a missing field with the old
checksum is `checksum`; with a recomputed checksum it reaches `expired`). A table test asserts
no code outside the six can fire.

**F2 — `buildTicket` had grown a draft guard.** The donor does not validate the draft; it calls
`new Date(...).toISOString()`, which throws the donor's own `RangeError` for an invalid instant.
Repaired: the guard is deleted and tests pin equivalence, including that `ttlMs: 0`, a negative
`ttlMs` and the maximum instant still build. The justification originally given for the guard —
that the donor would build a ticket with a `null` `expiresAt` — was **factually wrong** and has
been deleted from every file.

**F3 — A test asserted a leniency the port had invented.** `checkpoint-gate`'s local constructor
read an absent required field as `null` and substituted text for an empty string. The donor
declares all six `CheckpointOutcome` fields as required and every donor path supplies them, so
the stricter shared constructor is the faithful one. The assertion now asserts the refusal (plus
a positive companion proving the unbound port's own complete answer still constructs, stays
frozen and keeps all six members), and the adjudication is recorded in `DONOR.json` — including
that this is a fail-closed restatement of the donor's declared types, **not** a behaviour the
donor performs.

**F4 — A 71-character digest literal was silently corrupted on disk.** The pinned ticket digest
was written with one extra character, so two runs compared two different strings that printed
identically. It was found by comparing `String.length` and character codes rather than by eye,
repaired with a length-verified write, and the suite now asserts the literal's 71-char/64-hex
shape so a truncated or padded literal cannot pass again. **This is a hazard for any module that
pins a long literal, in this mission and the earlier ones**, and the guard is cheap.

The lesson this mission records: a green test suite proves the tests agree with the code, not
that the code agrees with the donor. Every defect above was caught by reading the donor source
against the port, and the repair in each case was to delete something the port had added.

---

## 6. 已知限制 / Known limitations

1. `restart-protocol`, `restart-lock` and `restart-ticket` have **no product consumer** (D5).
   If the verifier judges that MB-006 requires all four to be consumed, this migration is not
   complete.
2. The consumption is a **mechanism** rewiring of an existing behaviour (D6), not a new product
   surface. A reviewer who requires a user-visible behaviour change will not find one, because
   inventing one is forbidden.
3. **MB-001, MB-003 and MB-006 will conflict at merge time** (D4) — same manifest, same census
   test, same bilingual docs, two different mechanisms for one concern.
4. The donor's `restart-manager.ts`, its supervisor and its durable storage were **not**
   migrated, so the ported modules are the contract, the lock, the gate and the ticket — not a
   working restart. A mission that wants an executable restart must migrate the manager and the
   supervisor, and must preserve D7's limitations while doing it.
5. The donor's two declared limitations and two further gaps are preserved as-is (D7). In
   particular a hung shutdown is still waited on indefinitely and force-terminate is still never
   consulted, **in the donor**; neither behaviour exists in this tree at all.
6. The **Verification gate for this mission requires a real controlled process restart/relaunch
   on both hosts**, reusing the donor's reboot path where safe, and it forbids inventing one.
   The migration host did not attempt that gate. The verification host must establish which
   restart path is actually available on its machine; if none is safe, that gate is BLOCKED and
   must be reported as such rather than simulated.
7. The hosted CI result is recorded in `IMPLEMENTATION_CI`; the branch was not merged to `main`,
   as the mission-book requires of the migration host.

---

## 7. 交给验证主机 / Handoff to verifier

Independent-review hints only; no conclusion is suggested.

- `city/02-engineering/04-restart-recovery-station/*/DONOR.json` — the declared boundary per
  module. `restart-protocol/DONOR.json` also carries `donorLimitations` (D7) and
  `restart-ticket/DONOR.json` carries `verdictParity` and the atomicity contract.
- The three repaired items are the highest-value review targets: `restart-ticket/ticket.mjs`
  (`verifyTicket`'s six rungs and `buildTicket`'s absent guard), and
  `checkpoint-gate/contracts.mjs` plus its `DONOR.json` (the stricter outcome constructor).
  Compare them against `D:\dsh-restart-donor` at `e20fb6cc` rather than against the report.
- `services/dev-gateway/server.mjs` (`resumeGate`, the sweep) and `tests/gateway.test.mjs` —
  the real-consumption claim (D5, D6).
- `services/capability-bridge/registry.mjs` and `city/manifest.mjs` — the `capabilityProvider`
  flag (D3).
- `city/docs/{en,zh-CN}/ARCHITECTURE.md` §7 — the documented reconciliation.
- The cross-module imports from `restart-protocol` into the other three modules (D2) — check
  that no vocabulary or checksum-defining function has a second declaration anywhere in the
  building.
- `city/CITY_IMPLEMENTATION_MANIFEST.json` versus MB-001's and MB-003's branches — the D4
  conflict.

- Verification must be performed by a **different host**. This host (`Alien`) has participated
  in MB-006 and may not claim its Verification stage.
- Branch HEAD: `dab820b37ff39d1581b19dd43e75771507fb7139` on `zhiheng-zhang-Mera/utopia`,
  branch `mission/MB-006-restart-recovery`.
- Hosted CI: implementation `36574888667` PASS, final branch `36575418378` PASS, claim-stage
  push `36572337586` PASS.
- The migration host did **not** merge, and did **not** run `pnpm mission:finalize`.
