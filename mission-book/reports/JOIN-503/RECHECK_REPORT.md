# JOIN-503 — Formal review, RE-CHECK after the repair

> **Workbook:** [JOIN-503-device-enrollment-and-tokenless-reconnect.md](../../connection-onboarding/JOIN-503-device-enrollment-and-tokenless-reconnect.md)  
> **Original review:** [REVIEW_REPORT.md](./REVIEW_REPORT.md) — REPAIR REQUIRED (D-1, D-2) at `ede6fa2`  
> **Re-checked head:** `77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f` on `join/JOIN-503-device-enrollment-and-tokenless-reconnect`  
> **Repair author:** Alien (development host) — **re-check by Mech** (different physical host)  
> **Hosted CI on the re-checked head:** run `37120646153` COMPLETED SUCCESS on exactly `77f7f2a`, branch `join/JOIN-503-device-enrollment-and-tokenless-reconnect` (workflow *V0.2 checks*), re-queried by head_sha  
> **Verdict:** **PASS** — D-1 and D-2 are closed, and the repair is strictly stronger than the minimum requested. `review_complete: true`.

## 1. What was re-checked, and why it was not taken on trust

The repair commit message is persuasive, and that is exactly why it was not believed. Three things were measured:

1. **The repair is NOT a cherry-pick of the reviewer's patch.** `git merge-base --is-ancestor a3b9ab3 77f7f2a` fails, so `77f7f2a` is an independent re-application. It therefore has to be verified on its own merits rather than by identity with the reviewed patch.
2. **The reviewer's own guard was re-run against the new head.** `tests/join503-review-privilege.test.mjs` (written by Mech for the finding) → **PASS** on `77f7f2a`. The author also carried that file onto the development branch, so the guard the review wrote reaches the branch that will merge and gets its own exact-head CI.
3. **The author's guard and the original suite were run too.** `tests/join503-session-scope.test.mjs` + `tests/join503-enrollment.test.mjs` + the reviewer's guard → **14 tests, 14 pass, 0 fail**.

## 2. Independent measurement of the repaired behaviour

Measured directly against a real gateway at `77f7f2a`, with a deliberately injected duplicate credential fingerprint so that the clone scan had something real to find:

| Actor | `scope` | installations visible | `cloneFindings` | cross-installation revoke |
|---|---|---|---|---|
| owner (control token) | `CITY` | 2 | 341 chars — the population scan keeps working | allowed, as before |
| session (`sess:` credential) | `OWN_INSTALLATION` | **1 (itself)** | **`[]`** | **403 `SESSION_CANNOT_REVOKE_OTHER`** |

…and after that refused revoke, the would-be victim's session still authenticated (`200`). So D-1 is closed (no cross-installation authority), D-2 is closed (no roster for a session), and the owner's authority is unchanged.

## 3. The repair goes one step beyond the minimum that was requested

The minimum boundary in the original review covered the `installations` array. The author also scoped **`cloneFindings`**, on the reasoning that a population-level clone scan *names other installations' ids and credential fingerprints* — so scoping the array alone would still have handed a session a map of every duplicated credential in the City. Measured above: the owner sees a 341-character scan, the session sees `[]`. **The reviewer accepts this as correct and as a genuine improvement on the requested minimum**; it is inside the defect's boundary (the same missing "a session is scoped to one installation" rule on the same route), not a widening of scope.

`scope` (`OWN_INSTALLATION` / `CITY`) is now stated in the payload rather than left to be inferred — which is also why the repaired response is self-describing to a client.

## 4. Findings still open, and findings closed

| ID | Status |
|---|---|
| D-1 (cross-installation revoke) | **CLOSED** — 403 with a typed code; victim verified untouched |
| D-2 (roster readable by a session) | **CLOSED** — one row, its own; `cloneFindings` empty |
| D-3 (auth routes on the literal `sess:` prefix, so a control token with that shape would be refused) | **OPEN, note only** — fail-closed, no generated token has that shape; carried to the phase integration, not a blocker |
| D-4 (two-physical-host acceptance, workbook §9) | **DEFERRED, unchanged** — this reviewer has one host. The enrollment/restart/revoke *mechanism* is verified; the two-machine topology belongs to the phase integration. `deferred != passed` |

## 5. Limits of this re-check

- The verdict is on `77f7f2a` and only on `77f7f2a`. Any later commit needs its own CI and would need this re-check re-applied, not inherited.
- One host was available to the reviewer; §9's two-machine path remains deferred as declared before the original review ran.
- `merge_authority` is untouched: the phase merge lock in the programme README still requires all three JOIN tasks to be development-complete **with opposite-host reviews**. JOIN-501 and JOIN-503 are now in that state; JOIN-502 is development-complete on Mech and still awaits a review this host cannot give, so the phase gate is unchanged by this task.
