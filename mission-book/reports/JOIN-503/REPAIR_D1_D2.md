# JOIN-503 — Author's repair record for review findings D-1 / D-2

> Workbook: [JOIN-503-device-enrollment-and-tokenless-reconnect.md](../../finished/completed-2026-10-04/connection-onboarding-components/JOIN-503-device-enrollment-and-tokenless-reconnect.md)
> Reviewer's report: [REVIEW_REPORT.md](./REVIEW_REPORT.md) (Mech, opposite physical host)
> Reviewed head: `ede6fa22e0165156aadcf3cbd6ba748b6f2b39d7`
> **Repair head: `77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f`**, branch `join/JOIN-503-device-enrollment-and-tokenless-reconnect`
> Hosted CI on the repair head: run `37120646153` **COMPLETED SUCCESS** on exactly that sha (jobs `gateway-web` + `android`)
> Author: **Alien**. Status: **repair delivered, reviewer re-check PENDING** — `review_complete` stays `false` and `DEVICE_ENROLLMENT_RECONNECT_ACCEPTED` is **not** recorded.

## 1. The finding, accepted without argument

Mech's D-1 is a defect in my change, not a design disagreement:

`POST /api/v0/device/installations/:id/revoke` required only `auth()`, and `auth()` accepts a `sess:` credential.
So **any enrolled installation could revoke ANY OTHER installation** — including the client the owner was using —
holding nothing but the short-lived session credential a browser keeps in `sessionStorage`. `GET
/api/v0/device/installations` answered that same session with the City's **entire** enrollment roster (D-2, same
root cause on the read route).

What makes it indefensible rather than debatable: **I had already written the boundary on the two sibling routes**
(`SESSION_CANNOT_ENROLL` on enroll, `SESSION_CANNOT_REBIND` on rebind) and stated the intent in a comment on the
enroll route in as many words. Enforcing a boundary on two of three routes is not a boundary; it is a gap, and the
gap is exactly where an attacker looks. I did not contest the severity.

## 2. The repair, and the one place it goes past the review's stated minimum

Re-applied in my own words on the development branch (the review invited re-application rather than a
cherry-pick). The rule is now stated once, in the file, so the next route cannot miss it:

> **a session credential may act on ITS OWN installation and on nothing else.**

| Route | Before | After |
|---|---|---|
| `POST /device/installations/:id/revoke` | any `auth()` | a session may revoke **itself** (`scope: OWN_INSTALLATION`); a cross-installation revoke is refused with the typed code `SESSION_CANNOT_REVOKE_OTHER`; the control token is unchanged and still acts on every installation (`scope: CITY`) |
| `GET /device/installations` | full roster to any `auth()` | a session sees **its own** record and `scope: OWN_INSTALLATION`; the control token still sees the whole City (`scope: CITY`) |
| `GET /device/installations` — `cloneFindings` | full City-wide scan | **a session receives `[]`** |

**Why `cloneFindings` is in scope and not gold-plating.** The review's minimum scoped the `installations` array.
But `cloneFindings` is produced by `detectCredentialClones` over the WHOLE installation population, and each finding
names an `installationId` **and a `credentialFingerprint`**. Scoping only the array would still have handed a
session a map of every installation in the City whose credential is duplicated — the same class of disclosure D-2
is about, on the same response. An empty array is the honest answer to "which installations of this City are
duplicated?" for a caller allowed to know only about itself. This is recorded because it is a deliberate
widening of the repair, not because the review asked for it.

Not repaired, and left exactly as the review recorded it: **D-3** (`auth()` routes on the literal `sess:` prefix, so
a control token shaped that way would be refused — fail-closed, and out of the bounded-repair scope). **D-4** (the
two-physical-host acceptance of section 9 remains DEFERRED to the phase integration; `deferred != passed`).

## 3. The guard is a guard, proven both ways

The review wrote `tests/join503-review-privilege.test.mjs`; re-applying the repair in my own words would have left
that guard behind on a review branch, so **it is carried onto this branch** and gets its own exact-head CI. A second
guard, `tests/join503-session-scope.test.mjs`, asserts the rule over the whole route family rather than over the
two routes that were found.

Measured, not asserted:

| Instrument | On the unrepaired head `ede6fa2` | On the repair head `77f7f2a` |
|---|---|---|
| `tests/join503-session-scope.test.mjs` | **3 of 4 cases FAIL** | **4 of 4 PASS** |
| `tests/join503-review-privilege.test.mjs` (Mech's) | FAILS | PASSES |
| `tests/join503-enrollment.test.mjs` (author's original 9) | PASS | **9/9 PASS — no regression** |

The shape of the unrepaired failures is itself evidence: the owner-authority case does not merely fail its own
assertion, it falls over because **the unrepaired cross-installation revoke really killed the victim** — the
exploit was live, not theoretical.

## 4. The same rule verified on a RUNNING City, not only in tests

A live acceptance run against a real gateway (`cityId c5cff65e-ea1c-4bc7-9964-3054f2e5f563`, node credential
`1Q2W3E4R-node` supplied by the Owner) exercised **38 checks, 38 PASS**, of which the D-1/D-2 relevant ones are:

- a session reading the roster gets `scope: OWN_INSTALLATION`, exactly one installation, and `cloneFindings: []`;
- the control token reading the same route gets `scope: CITY` and the whole roster;
- a session attempting to revoke a **second** installation gets `403 SESSION_CANNOT_REVOKE_OTHER`, and the victim
  installation is still available and still `BOUND` — the refusal is a refusal, not a report of failure;
- the control token revoking that second installation succeeds, and the revocation bites **on the very next
  request** (`401`), while its own reconnect is refused as `INSTALLATION_RETIRED` with `retryable: false`.

Receipt: `.runtime/evidence/join-final-test/receipt.json` (git-ignored, local); instrument:
`.runtime/evidence/join-final-test/final-acceptance.mjs`.

## 5. What is still open

1. **Reviewer re-check of this repair head.** A PASS names an artifact, so the verdict belongs to Mech, on
   `77f7f2a`, with its own exact-head CI (which is green). This host will not record `review_complete: true` or
   the terminal marker for its own repair.
2. **The two-PHYSICAL-host acceptance (section 9)** remains deferred, exactly as the review recorded before it
   ran. The Owner-supplied node credential was exercised on this host against a City on this host; Mech's host was
   **not reachable** during this run (its City did not answer on any probed endpoint and the host did not respond
   to ping), which is recorded as a fact about the run rather than worked around.
3. Merge/integration remains out of scope here: `mission-book/connection-onboarding/README.md` section 5 forbids
   the phase integration workbook until all three JOIN tasks carry opposite-host reviews, and JOIN-502 is still
   waiting for a review this host cannot give.

语言配对 / Language pair: [原文 / Source](./REPAIR_D1_D2.md) · [译本 / Translation](./zh-CN/REPAIR_D1_D2.md)
