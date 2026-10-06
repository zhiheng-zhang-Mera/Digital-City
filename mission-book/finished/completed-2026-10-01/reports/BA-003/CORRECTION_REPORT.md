# BA-003 Correction Report — Device Embodiment + Foreground Binding

```text
MISSION              = BA-003 (Butler Assistant programme)
PROGRAMME            = BUTLER_ASSISTANT_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/butler-assistant/BA-003-device-embodiment-binding.md
CLAIM_COMMIT         = ffb3aad (Digital-City main, claim of BA-003 Correction by Alien)
CLAIMED_AT           = 2026-09-30T13:20:00Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = eb3b1a1233a05c056dcc366341c76e0a20faa2f5
DEVELOPMENT_CI       = 36717697673 — gateway-web success, android success
CORRECTION_BRANCH    = assistant/BA-003-device-embodiment-binding
CORRECTION_HEAD_SHA  = 4bfd2562fdf31b9a86f980fd8ad9b4a2a0a14b7e
BRANCH_CI            = 36721785776 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = root 123 pass, rooms 69 pass, city 1801 pass, promotion-history OK, docs SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

## 1. Independent review method

Two reviews again, for the same reason as GAI-001: the overlap is partial and the
disagreements are informative.

1. **This host's probe**, aimed at the defect classes that had already been confirmed real
   in three sibling contracts in this session (raw-spelling comparisons, `key in spec`,
   reserved prototype keys, counter-derived identity).
2. **A separate-context review agent**, given the guarantees to falsify and asked for
   reproducible findings only.

The agent found five defects this host had not reached, and this host found the two
highest-severity ones. Eight confirmed defects in total; the Development suite caught none.

**A process defect in this review is recorded rather than hidden.** The agent reviewed a
worktree this host was editing concurrently, so its first report claimed that the
*committed* revision fails its own conformance suite. That is a revision misreading and it
is **wrong**: the committed test file contains 14 tests, and `git show HEAD:` confirms
committed `descriptors.mjs` still has `key in EMBODIMENT_DESCRIPTOR_SPEC` while committed
`registry.mjs` still mints `foreground-${bindingCounter}` — i.e. the committed source and
its committed tests agree, which is why the Development CI run 36717697673 was green. The
17-test file the agent measured against that source was *this worktree's uncommitted
repair*, so the agent compared committed source with working-tree tests. The lesson is
recorded: a correction review must be handed a frozen copy, not a tree the reviewer's
own host is mid-repair inside. Its other findings were unaffected and were confirmed
independently.

## 2. Independent review findings

### DEFECT 1 (high) — undeclared descriptor keys inherited from `Object.prototype`

`descriptors.mjs` used `if (!(key in EMBODIMENT_DESCRIPTOR_SPEC))`. `in` walks the
prototype chain, so `toString`, `valueOf`, `hasOwnProperty`, `constructor`,
`isPrototypeOf`, `propertyIsEnumerable` and `toLocaleString` were all accepted as declared
descriptor fields, and a `JSON.parse`-produced `__proto__` own key passed as well. This is
the fourth contract in this repository with the same mistake (BA-001, GAI-001, and now
BA-003); the fix is the same own-key lookup plus a reserved-key refusal at every depth.

### DEFECT 2 (high) — the competing-identity guard compared raw key spellings

`COMPETING_IDENTITY_FIELDS` is a hand-maintained list with two spellings per concept
(`butler_device_id` and `butlerDeviceId`), which is exactly the maintenance that goes stale.
The following all name a competing physical-device identity and all passed:

```text
deviceKey   deviceTrustState   DEVICE_KEY   local_device_identity
localDeviceIdentity   butlerDeviceKey   butler_device_identity   device_identity_key
```

That guard is the only thing stopping Butler from minting its own physical-device identity
namespace, which the workbook forbids and which Remote Fabric owns. Names are now
normalised and matched by a pattern over the *concept*, and the one legitimate field
(`device_identity_ref`) is asserted to still pass, so the stronger rule cannot be satisfied
by refusing everything.

### DEFECT 3 (high) — physical-device uniqueness was checked only on first registration

`registerEmbodiment` ran the global duplicate-device check **below** the `if (existing)`
refresh branch, so it never ran for a refresh. A device could therefore be modelled twice:

```text
register  embodiment-a  -> device X
register  embodiment-b  -> identity_source UNAVAILABLE (no device yet)
refresh   embodiment-b  -> device X                     -> ACCEPTED
bind      both to foreground                            -> both hold a foreground assistant
assertSingleForegroundPerDevice()                       -> { devices: 2, ok: true }
```

Two foreground assistants answering for one physical device is precisely what guarantee 1
forbids, and the invariant the suite uses to certify it reported success. The check is now
hoisted above the refresh branch, so the state is unreachable by construction.

### DEFECT 4 (high) — the single-foreground invariant could not fail

`assertSingleForegroundPerDevice` counted entries of a `Map` keyed by `embodiment_ref`
*under that same key*. One entry per key can never exceed one, so the assertion was
vacuous — which is why Defect 3 was invisible to a green suite. It is now keyed by the
physical device identity (falling back to the embodiment reference when a device has no
Remote Fabric identity yet), and a regression test checks the reported device count against
an independent computation.

### DEFECT 5 (high) — a foreground binding reference was a counter that restarts

`binding_ref` was `foreground-${bindingCounter}` from a counter reset by
`restoreEmbodimentRegistry`, and the snapshot's own `binding_ref` values were discarded and
re-derived. So a pre-restart reference string was re-issued to a *different* binding, and
`revalidateEmbodiment` compares exactly that value:

```text
before restart:  device A -> foreground-1
after  restart:  device B -> foreground-1          (same string, different binding)
device A revalidates with its pre-restart reference
                 -> ok: true, AUTHORITATIVE_AGREEMENT
```

The module's own recovery contract says "every device must revalidate before it may act, so
a restarted host never continues from its own stale local assumptions", and its D7 built
four distinct revalidation reasons to keep those cases apart. A reused identifier let a
stale belief be reported as agreement. This is the same defect this host confirmed and
repaired in BA-002 (`emb-1`), where the author had reasoned about record-id collisions but
not applied it to the session identifier.

References are now epoch-scoped (`foreground-e<epoch>-<n>`), the epoch advances on restore,
and a pre-restart reference can no longer equal a post-restart one. The author's test that
asserted `AUTHORITATIVE_AGREEMENT` after a restore is corrected to expect
`STALE_LOCAL_BINDING`, with the reason recorded in the test itself.

### DEFECT 6 (medium) — restored bindings reported `LIVE_SESSION`

`restoreEmbodimentRegistry` returned `restored_foreground` with
`source: 'RESTORED_FROM_AUTHORITY'`, but never wrote that provenance, so the very next
`getForeground` or `snapshot` reported the same binding as `LIVE_SESSION`. `BINDING_SOURCES`
was otherwise unused. Recovery provenance is now written on the write path by
`markForegroundRestored`, which is a separate method so `bindForeground` cannot be told what
provenance to claim.

### DEFECT 7 (medium) — the compare-and-set token was the wrong field

`switchForeground` compared `expectedForegroundRef` against `assistant_ref`. A caller doing
CAS with the binding handle it was told to hold always received `FOREGROUND_MISMATCH`,
while passing an assistant name silently worked — and the stale-view defence was therefore
defeated by the very sequence it exists for: a device that went A → B → A accepted a stale
A-held view, because the assistant matched again. It now compares the binding reference, and
the author's three call sites are updated to the correct token plus a case asserting that an
assistant name is refused.

### DEFECT 8 (medium) — untyped `session_ref`, and a stale re-attach

`attachAssistant` stored whatever object it was handed straight into durable authority
state, and re-attaching with a *different* session returned `idempotent: true` while keeping
the stale session recorded as current — so a later reader would believe the old session was
still attached. `session_ref` is now typed (text or null), and a different session is a
session change (`session_updated: true`, `idempotent: false`).

## 3. Attacked and found sound (no repair needed)

| Attack | Result |
|---|---|
| binding a second foreground assistant on one device | refused (`FOREGROUND_ALREADY_BOUND`) |
| foreground for an assistant that is not attached | refused (`ASSISTANT_NOT_ATTACHED`) |
| stale-view CAS | refused with no state mutation |
| detach then re-attach | cannot restore foreground |
| forged duplicate-foreground snapshot | refused atomically |
| every task-mutation attempt | refused; task table byte-identical across switch/detach, and the port exposes observation methods only |
| device-local state on switch / detach / restore | released, and absent from `snapshot()` by construction |
| unknown field spellings, plain and JSON-escaped | refused (the agent could not bypass the guard with `"\u005f\u005fproto\u005f\u005f"`) |
| `ui_surfaces: ['NONE']` exclusivity | refused |
| `identity_source` ↔ `device_identity_ref` disagreement | refused in both directions |
| `deviceIdentityReference` shape and the `dev-<32 hex>` pattern | enforced |

## 4. Decisions not specified by the book

**C1 — Was the agent's "committed revision fails its own suite" finding accepted?** No, and the
reason is recorded above: `git show HEAD:` proves the committed tests and committed source
agree, and the Development CI was green. Accepting it would have meant "repairing" a revision
that was never broken, and it would have put a false statement into the record.

**C2 — Fix the invariant's key, or remove the vacuous assertion?** Fix the key. The assertion is
worth having; it was measuring the wrong thing. Removing it would have left guarantee 1 with no
cross-device check at all.

**C3 — Where the CAS token change lands.** The workbook says foreground switching must not be
driven from a stale view; it does not name a token. `binding_ref` is the only value that changes
when the binding changes, so it is the only token that can detect a stale view. The author's
tests were updated rather than keeping a token that cannot do the job — recorded because a
reviewer could otherwise read the test change as weakening the suite, when it is the opposite.

**C4 — Re-attach semantics.** The workbook does not define attaching the same assistant to the
same device with a new session. Options: refuse, ignore, or treat as a session change. Chosen:
a session change, because the attachment is presence (not authority) and a new session is a real
event; refusing would make a reconnecting client unable to re-attach. Recorded because it is a
policy choice.

**C5 — Android / Computer-Use acceptance.** Not used, consistent with the Development report's
D11: this is a contract/session layer with no UI and no device interaction surface. The Owner
authorised Android Studio and a Computer-Use plugin *if acceptance required them*; it did not,
so no device observation is claimed.

**C6 — Evolution-feed record.** Not written, consistent with BA-001 D11 / BA-002 C5 / EM-001 D13
/ GAI-001 C6 / RF-001 D8 / RF-002 D13: the `contracts/evolution` event schema is migration-scoped,
so no BA-003 event validates and extending it would touch the frozen `contracts/**` surface.

## 5. Defects fixed, with regression tests

| File | Change |
|---|---|
| `contracts/assistant-embodiment-v1/descriptors.mjs` | own-key descriptor check; reserved prototype keys; `normalizeFieldName`; concept-level competing-identity pattern; reserved-key scan |
| `contracts/assistant-embodiment-v1/registry.mjs` | duplicate-device check hoisted above the refresh branch; invariant keyed by physical device; epoch-scoped `binding_ref`; `markForegroundRestored`; CAS on the binding reference; typed `session_ref` with session-change semantics |
| `contracts/assistant-embodiment-v1/tests/conformance.test.mjs` | 8 regression tests, plus two author tests corrected (the recovery expectation that encoded Defect 5, and the CAS token that encoded Defect 7) |

Regression tests added:

1. `undeclared keys inherited from Object.prototype are refused, and a prototype key never is a descriptor field`
2. `a competing physical-device identity is refused in every spelling`
3. `a foreground binding reference is never re-issued across a restart`
4. `a physical device cannot be claimed twice, including by refreshing an unidentified embodiment`
5. `the single-foreground invariant is derived from physical device identity`
6. `a restored binding keeps its recovery provenance on every later read`
7. `the foreground compare-and-set token is the binding reference, not the assistant`
8. `re-attaching with a different session is a session change, not an idempotent repeat`

Each negative assertion is paired with a legitimate neighbour that must still pass — the
clean descriptor, `device_identity_ref`, a repeat attach with the same session, a genuine
snapshot that must still restore, `ENGINEERING`-style ordinary values — so no guard can be
satisfied by refusing everything.

## 6. Test summary

| Check | Result |
|---|---|
| hostile probes (this host's, plus the agent's per-revision probes) | every confirmed defect reproduced before repair and refused after |
| `node --test contracts/assistant-embodiment-v1/tests/conformance.test.mjs` | 22 pass / 0 fail (14 Development + 8 new) |
| `node --test tests/*.test.mjs` | 123 pass / 0 fail |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass / 0 fail |
| `node city/test-all.mjs` | 1801 pass / 0 fail |
| `node scripts/verify-promotion-history.mjs` | 10 record(s) verified against local Git history at eb3b1a1233a0 |
| `node scripts/check-bilingual.mjs` | docs / evidence / data-records PAIRED |
| GitHub CI 36721785776 on 4bfd2562fdf31b9a86f980fd8ad9b4a2a0a14b7e | **gateway-web success, android success** |

FAILURE_REPAIR_SUMMARY: after the repairs, two of the author's tests failed — deliberately.
They encoded Defects 5 and 7 (a recovery expectation that only held because the counter
restarted, and a CAS token that cannot detect a stale view). Both were corrected with the
reason written into the test, and every other Development test passed unchanged. No repair
was reverted at any point.

## 7. Cross-task seams recorded (not solved here)

- **BA-009 (duties/permission policy)** and **BA-008 (lease/reconnect safety)** consume
  embodiment attachment. `session_ref` is now text-or-null and a changed session is reported
  as `session_updated`; a consumer that treated a re-attach as a no-op must handle the change.
- **BA-007 (settings surface)** and the Web/Android clients read `getForeground`/`snapshot`
  for provenance. A restored binding now says `RESTORED_FROM_AUTHORITY`, which is the value a
  client should branch on to decide whether to re-fetch before acting.
- **The device clients** are the real consumers of guarantee 1. With Defect 3 closed, "one
  foreground interaction assistant per physical device" now holds by construction, and the
  invariant that certifies it is no longer vacuous — but nothing in the repository consumes
  this contract yet, so every defect found here was latent rather than user-visible.
- **RF-001** owns physical device identity. This contract now refuses a second embodiment for
  one `device_id` on every path, which is the shape RF-001's registry will need to agree with.

## 8. Open items for the Owner

1. Review isolation is a process question this task exposed: a correction review must be given a
   frozen revision. This host edited the worktree while the agent reviewed it, which produced one
   measurably wrong finding. Recommend the remaining Corrections hand the reviewer a copy or a
   separate worktree.
2. The `identity_source: UNAVAILABLE` case means an embodiment can exist before Remote Fabric
   identity is available. Whether such a device may hold foreground at all is a product question
   this contract answers "yes, keyed by itself"; the Owner may prefer to require a `device_id`
   before a foreground binding is allowed.
3. The evolution-feed question (C6) remains open for the Owner.

```text
CORRECTION_COMPLETE = true
DEVELOPMENT_HOST    = Mech
CORRECTION_HOST     = Alien   (different physical host — two-host gate satisfied)
CORRECTION_HEAD_SHA = 4bfd2562fdf31b9a86f980fd8ad9b4a2a0a14b7e
BRANCH_CI           = 36721785776 — gateway-web success, android success
MERGE_STATUS        = FORBIDDEN_UNTIL_BUTLER_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/CORRECTION_REPORT.md)
