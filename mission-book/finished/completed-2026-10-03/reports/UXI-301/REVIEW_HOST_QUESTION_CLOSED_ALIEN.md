# UXI-301 — THE REVIEW-HOST QUESTION IS CLOSED BY ALIEN: NO BLOCKER, NO RULING NEEDED FOR ELIGIBILITY

```text
RAISED BY = Mech, workbook field development_open_question_review_host
STATUS    = RESOLVED. Alien IS eligible to review UXI-301. There is no STRUCTURALLY_INELIGIBLE.
FIXED IN  = mission-book/reports/UXI-301/CLAIM_RACE_ALIEN_WITHDRAWN.md, commit 119e766
```

## Why this note exists

Mech's field asks the Owner to rule on review eligibility, quoting Alien's own earlier statement that
*"Alien must not review Mech's development either"*, and correctly observing that under §3's letter that
reading looks too strong. **Mech is right, and the quoted sentence is mine and it was wrong.** Alien
already withdrew it — but the withdrawal lives in a different file from the question, so the question is
still standing in the workbook and an Owner ruling is about to be spent on an issue that no longer exists.

This note closes it, so the Owner only has to decide the thing that genuinely remains open.

## The answer

**Alien is eligible to review UXI-301, and is the intended Review host.** §3 requires Development and
Review on **different physical hosts**. Mech developed UXI-301. Alien attempted to claim it, **lost the
race by 24 seconds, and withdrew** — the commit was discarded and the push was rejected, so origin never
carried Alien's claim and Alien never developed this task. Ineligibility follows from **what a host
actually did**, and Alien did not do this development.

The incorrect sentence in Alien's original record read:

> *"UXI-301's Review must not be Alien's if Alien were ever to develop it; and symmetrically, Alien must
> not review Mech's development of it either."*

The second clause is withdrawn. It left **no eligible reviewer for UXI-301**, which is §5.2
`STRUCTURALLY_INELIGIBLE`, which would have blocked UXI-301, then UXI-390, then the objective — a phantom
blocker created inside the very record whose purpose was to remove a competing claim.

**How Alien made that error**, recorded because it is the programme's recurring failure wearing different
clothes: Alien had correctly internalised "Alien must not review its own output" and then applied it **by
association** rather than by reading the rule — Alien had *tried* to claim the task, therefore Alien was
"involved", therefore Alien was excluded. That is the same shape as inferring a cause from the *look* of a
situation instead of from the mechanism actually executed, applied here to a role rule instead of to a bug.
The programme has catalogued that failure six times; this is its seventh appearance and it is Alien's.

## What actually remains open, and it is not eligibility

The deferred **remote-handoff seam** genuinely needs a decision, and Mech has described it precisely: the
City can create only one task type and it completes in well under a second, so *"the current device is busy
while the work is still in flight"* cannot be sustained, and four attempts could not produce
`REMOTE_HANDOFF` end to end even though the planner **does** reach `ALTERNATE_DEVICE` whenever it is given
that condition. That is a question about **what completing UXI-301 means** — whether its gate can be
discharged with the seam measured and attributed to the City rather than to the presentation layer — and it
is Mech's to put to the Owner, as Mech has said it will.

So the two questions should be separated at the point of ruling: eligibility needs **no** ruling, and the
handoff seam needs one.

## What Alien is doing and not doing

- **Not claiming the Review yet.** Mech's `development_complete` is `false` and `review_host` is null, and
  Mech is still landing increments. Claiming a task still being developed would be premature and would
  break the develop-then-review order every other task in this phase has followed.
- **Ready to claim it the moment Mech declares development complete**, at which point Alien will do the §7
  exact-head reconciliation against the recorded `development_head_sha` before claiming, as it did for
  RS-290.
- **Not self-reviewing anything.** Alien's exclusion continues to apply to RS-290 and to UI-190-adjacent
  work, which Alien developed. It does not apply here.


[阅读译本 / Reading translation](./zh-CN/REVIEW_HOST_QUESTION_CLOSED_ALIEN.md)
