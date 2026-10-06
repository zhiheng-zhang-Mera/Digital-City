# RF-006 Correction Report — Secure Transport Path Manager + Relay Fallback

```text
MISSION              = RF-006 (Remote Fabric programme, task 6 of 10)
PROGRAMME            = REMOTE_FABRIC_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/remote/RF-006-secure-transport-path-manager.md
CLAIM_COMMIT         = 4957569 (Digital-City main, claim of RF-006 Correction by Alien)
CLAIMED_AT           = 2026-09-30T17:32:00Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 251e20bc3af4a2db57253a1a1e5332c976d17d51
DEVELOPMENT_CI       = 36739459945-success
CORRECTION_BRANCH    = remote/RF-006-secure-transport-path-manager
CORRECTION_HEAD_SHA  = 8fbd71df10535456cddd8146e28b08fd7684d714
BRANCH_CI            = 36752017760-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = RF-006 12 pass, root 113 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at 251e20b
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI — blocked interval (resolved)

**RESOLVED — GitHub Actions billing/spending was restored by the Owner, and the already-pushed head was
re-run with no code change.** The re-attempt executed both jobs on the exact corrected head and passed,
so this Correction now satisfies its completion criterion:

```text
corrected head   = 8fbd71d
green run        = 36752017760-gateway-web-success-android-success
local checks     = all green (see LOCAL_CHECK_SUMMARY above)
```

The blocked interval is retained below verbatim as history. Nothing was rewritten, and the old blocked
attempts were never relabelled as success; local PASS was never substituted for hosted CI.

```text
blocked interval (retained history)
  run 36751505413  first pass      android X 2s   gateway-web X 2s   0 steps
  run 36752017760  second pass     android X 2s   gateway-web X 2s   0 steps
  run 36752017760  round-20 retry  android X 3s   gateway-web X 2s   job ids 110142514472/110142514368
resolution
  run 36752017760  re-attempt 23:55:46Z   android OK 1m8s (110151153729)  gateway-web OK 2m28s (110151154092)
```

### Retained original record

The typed external blocker below was reported while the account state refused to start any job:

Both corrected heads are pushed and every local check the gate runs is green, but GitHub Actions still
refuses to start jobs on this account. For this task:

```text
run 36751505413 (first pass)   android X 2s   gateway-web X 2s
run 36752017760 (second pass)  android X 2s   gateway-web X 2s
    "The job was not started because recent account payments have failed or your
     spending limit needs to be increased. Please check the 'Billing & plans' section"
```

This is the **fourth consecutive attempt** (two for GAI-004, two here) and it is environmental, not
code: the jobs never start, no steps run, and Mech's EM-011 succeeded at 17:14:47 on the same repository
while these refuse. Recorded as a typed pending seam — `CORRECTION_COMPLETE = false`, workbook stays
`IN_PROGRESS` — never rewritten as success. **Owner action: restore GitHub Actions billing/spending.**

## 2. Review method

Byte-verified immutable export before review (`frozen-251e20b`, four files `match=True`); the workbook's
own acceptance list read before judging; an independent adversarial probe on the same frozen copy. My own
review found five defects, the probe found twelve and confirmed three of mine. Two passes, both pushed.

## 3. Repaired

| id | found by | severity | mechanism | repair |
| --- | --- | --- | --- | --- |
| C1 | both | **high** | caller policy could reorder `preference` so `RELAY` came first and was adopted while every direct probe answered available — against the header's "fixed preference order" and the acceptance line "prefers usable direct routes and falls back to relay honestly" | the list may narrow the canonical order, never promote a class |
| C2 | both | **high** | after `onPathLost()` the path was deleted but `send()` still called the adapter and returned `sent: true`; `session.path_lost` was recorded and read by nobody | a lost path refuses (`NO_USABLE_PATH`) until a migration succeeds, and `migrate` clears the flag |
| C3 | me | **high** | `pathDescriptor` hardcoded `authenticated: true, encrypted: true`, so a policy that waived the requirement produced a plaintext path still *described* as protected | the descriptor reports what the adapter measured |
| C4 | both | medium | caller-supplied `at` was never validated on any path (`connect`, `send`, `migrate`, `onPathLost`, `close`) | validated everywhere, with a real-instant round-trip |
| C5 | me | medium | an adapter fault during `send` escaped as a raw error while `connect` was wrapped | typed result, no command recorded, so a retry is still the first attempt |
| C6 | me | medium | `findSecretFields` missed non-enumerable own keys and threw an untyped `RangeError` on a cyclic record | `Reflect.ownKeys` + visited set |
| C7 | probe | medium | `max_probe_ms` accepted `-1`/`Infinity`/`MAX_SAFE_INTEGER`; a `preference` list with 5 000 duplicate entries produced 5 000 probes and 5 000 connects from one call | bounded probe budget, duplicates refused |
| C8 | probe | medium | `paths.set` overwrote a `path_ref` with no uniqueness check, so two paths could share one reference and `onPathLost`/`close` could act on the wrong session | a duplicate path reference is refused and its transport closed |
| C9 | probe | medium | `peer`/`trust` were never shape-checked and were forwarded verbatim to the adapter, so a `session_key` travelled to the transport | secret-shaped fields are refused on both |
| C10 | probe | medium | `migrate` hardcoded `trust_state: 'TRUSTED'` instead of reusing any trust | the session records the trust it was opened with and migration reuses it |
| C11 | probe | low | `RELAY_CANNOT_AUTHORIZE` was thrown *after* `adapter.connect` ran, leaving the transport open | the transport is closed before the refusal |

## 4. Reviewer findings recorded but NOT repaired (with reasons)

1. **A payload that omits `protected` is still forwarded** (probe D3, high). I implemented
   "`protected` must be explicitly `true`" and **three tests failed** — two of mine and one of the
   author's, because the contract's convention is that an envelope *is* an end-to-end protected payload
   unless it opts out. Requiring the flag is a strictness upgrade that changes that convention and
   breaks the Development fixtures, so I reverted it rather than rewrite their tests. **Recorded for the
   Owner**: the relay-forwarding rule is enforced only against envelopes that explicitly declare
   plaintext.
2. **Retry dedupe is keyed on the caller's `command_ref` + `action_key`** (probe D5). A retry with a
   fresh reference re-invokes the transport. Content-keyed dedupe needs a payload digest the contract
   does not define, and `DUPLICATE_COMMAND` is declared but never thrown. Recorded.
3. **`session_ref` remains guessable** (`session:${device_id}:${counter}`, probe D9). An unguessable
   reference needs an injected entropy source; this module's ports are adapters and a clock. The
   path-reference half of D9 **is** repaired (C8). Recorded as a seam.
4. **`DataCloneError` can still escape** `send`/`policy` for an uncloneable value (probe D11), and a
   policy getter error propagates out of `createPathManager`. Recorded; guarding every `clone` would
   change error shapes the suite may rely on.
5. **`MIGRATION_RACE_LOST` is dead vocabulary** — the module is synchronous, so the code is never
   thrown (the probe's finding, confirmed by grep). Recorded.

## 5. Local verification (the CI gate's own commands)

```text
node --test contracts/remote-path-manager-v1/tests/conformance.test.mjs -> 12 pass, 0 fail
node --test tests/*.test.mjs                -> 113 pass, 0 fail
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at 251e20b)
```

Author suite **7/7 pass unchanged**. Suite extended **7 → 12 tests**, every negative assertion paired
with a legitimate neighbour (a reordered preference is refused *and* a narrower subsequence still
prefers direct; a plaintext path is refused under the default policy *and* a descriptor that does adopt
one tells the truth; a lost path refuses *and* a migrated one sends again).

## 6. Unstated decisions (problem / choice / rationale)

1. **How much policy may change path selection.** *Choice:* policy may drop transport classes but not
   reorder them. *Rationale:* the header makes preference order part of the contract and the workbook
   asks for honest relay fallback; a reordered list let a caller promote the worst transport to first.
2. **What a lost path means for sending.** *Choice:* a refusal until a migration succeeds, with the flag
   cleared on success. *Rationale:* the module recorded the loss and then ignored it; my first version of
   the gate forgot to clear the flag and broke the author's path-loss test, which is what forced the
   complete fix.
3. **What a descriptor may assert.** *Choice:* only what the adapter reported. *Rationale:* a hardcoded
   `authenticated: true` was true only while the requirement was enforced; once policy could waive it,
   the constant became a false assurance on the exact property the acceptance line protects.
4. **Where a path reference is unique.** *Choice:* in the registry, refusing a duplicate. *Rationale:* an
   unbound handle meant two sessions could share one reference.
5. **Whether to record a synthetic trust on migration.** *Choice:* no — keep the trust the session was
   opened with. *Rationale:* a fabricated `TRUSTED` record is indistinguishable from a real one at the
   adapter boundary.

## 7. Honest self-errors

- I implemented a hardening (require `protected: true`) that broke the contract's own convention and
  three tests; the tests were right and I reverted my change. This is the **third time** this session an
  author test corrected my judgement, and the pattern is now clear enough to state: when a hardening
  breaks an author test, check whether the test encodes a *convention* rather than a defect — and if it
  does, record the hardening as an Owner ruling.
- My `path_lost` gate was incomplete on the first attempt (it refused sending forever after a successful
  migration). The author's path-loss test caught it; the fix was to clear the flag where the path is
  replaced.
- Two of my own new tests used a bare `{}` envelope and failed for that reason during the revert
  experiment — the same convention issue, seen from the other side.
- I again pushed while a probe was in flight: `bc34327` went up before the probe's report arrived, and
  its D1/D2 findings were then repaired in a second pass. The evidence is pushed and green locally, but
  the sequencing lesson from the last two rounds has still not been fully applied.

## 8. Result

Eleven mechanisms repaired across two passes, with paired regression tests, five boundaries recorded
with reasons — including one hardening I implemented, measured, and deliberately reverted — and a typed
external blocker recorded for the second time.

```text
CORRECTION_COMPLETE = false
BLOCKER             = GITHUB_ACTIONS_BILLING_OR_SPENDING_LIMIT (Owner action; 4 consecutive refusals)
PENDING_SEAM        = hosted CI for remote/RF-006-secure-transport-path-manager @ 8fbd71d
CONTROL_BOOK_UPDATED = mission-book/remote/RF-006-secure-transport-path-manager.md
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/CORRECTION_REPORT.md)
