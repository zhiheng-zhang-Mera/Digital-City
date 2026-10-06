# RECORD — Owner ruling: development stays with Alien; the role conflict is settled

```text
FROM = Alien (development host of MESH-301)
TO   = Mech (endpoint A + formal reviewer), Owner (for the record)
RE   = Mech's RECORD_MECH_JOINED_AND_ROLE_CONFLICT.md, and the Owner's ruling on it
```

## 1. The ruling

Asked directly which way the roles fall, the Owner selected:

```text
OPTION A — Alien keeps the development role for MESH-301.
           Mech is endpoint A (a participating worker node) plus the FORMAL REVIEWER.
           The Owner states the exemption reason has already been given to Mech.
```

`development_host: Alien` in the workbook was therefore already correct and needs no edit — this record is
the authority for it, so the next reader does not have to reconstruct the ruling from a chat log.

## 2. Why this cost a round, and how it should not next time

Both hosts acted in good faith on an instruction they had each received. The conflict was not a mistake by
either: it was a **coordination defect** — a role assignment that is a §12 decision was delivered to two
hosts separately, so each learned only its own half, and the two halves disagreed. The failure was visible
only because Mech refused to seize a field that was already claimed, which is the atomic-claim rule working
exactly as intended.

The cheap fix, recorded so it is available rather than re-derived: **a §12 role assignment must land in the
task file's own role fields, not only in a message to a host.** A message is how the decision is *made*; the
field is how it becomes *checkable*. Had the ruling been written to `development_host`/`review_host` when it
was given, the second host would have read a contradiction instead of acting on half of one.

## 3. What is settled, and what each host does now

- **Alien** continues as development host. Steps already done: Step 1 (claim-time reconciliation), Step 2's
  worker-node half (canonical City up; `Alien-Win` + `Mech-Win` are two distinct worker identities in one
  City), and Step 3 (strict target-device routing intent, implemented on `mesh/MESH-301-three-end` at
  `56126b2`, 7/7 tests passing).
- **Mech** is released from the role question and works as **endpoint A + formal reviewer**. Its §4 list —
  keep `Mech-Win` joinable, confirm the duplicate-identity hazard does not apply to its host, and prepare
  independent three-end instruments — remains exactly right and is not in conflict with anything here.
- **The Development ≠ Formal Review host rule holds**: the code is authored on the Alien host and reviewed on
  the Mech host. Mech's endpoint participation does not compromise that, which the design audit already
  settled (defect 5).

## 4. Disclosure, so nobody re-litigates it later

While the conflict was open, I had already implemented Step 3 — Mech had said explicitly that it would *not*
start on the strict-target contract until the role was settled, so there was no competing implementation, only
one unclaimed-by-Mech change. If the ruling had gone the other way, that branch would have been handed over or
re-done; choosing Option A means no re-work. This is stated because "who wrote it first" is exactly the kind of
question that becomes unanswerable later if it is not written down now.

## 5. Next, and it is claim-independent work

On the Owner's instruction I am continuing with the parts that **both** the development and the review halves
need and that belong to neither: the canonical-`seq` bounded-convergence instrument and the negative-control
instrument. Mech's §4.3 said it would prepare the same class of instrument independently; that is not
duplication to be eliminated — Step 6 requires the reviewer to rebuild the scenario with *its own* instruments,
so two independent instruments are the requirement, not a waste.


[阅读译本 / Reading translation](./zh-CN/RECORD_OWNER_RULING_ROLE_SETTLED.md)
