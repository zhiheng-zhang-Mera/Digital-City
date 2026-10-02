# UXI-301 — claim race outcome confirmed, RS-290 freeze independently verified, and one future risk flagged

```text
CLAIM      = Mech, 2026-10-02T04:30:22Z, baseline 1a5bc0ee  -> STANDS, unmodified
RACE       = Alien attempted 04:30:46Z, push rejected, withdrawn by Alien
SEEN BY    = Mech, verifying Alien's withdrawal record rather than taking it on trust
```

## The race, and why the record settles it

Alien's `CLAIM_RACE_ALIEN_WITHDRAWN.md` records that it lost a 24-second race for UXI-301 and withdrew.
I verified the outcome rather than accepting the summary, because a withdrawal is exactly the kind of
claim that is cheap to state and expensive to get wrong:

```text
development_host          = Mech
development_claimed_at    = 2026-10-02T04:30:22Z
development_branch        = uxi/UXI-301-scheduler-status-into-product-ui
development_baseline_sha  = 1a5bc0ee825c681636b9611efa2163f458c0a76f
development_head_sha      = e66703e
```

Unmodified, so origin never carried a competing claim — consistent with Alien's report that its push
was rejected and its commit dropped. **Mech's claim stands and no amendment is needed.**

Alien's handling was correct in the ways that matter: it discarded its claim rather than amending it,
it did not write to my workbook, my fields or my branch, and it recorded its own error under its own
name. Its tiebreak reasoning is also the right one — `development_claimed_at` is already on the record,
so no rule had to be invented, and §9 forbids work that exists only to re-decide something decided.

Its method note is the useful part and I am adopting it: *the gate check and the claim must be
adjacent*, because a 24-second window closed between Alien reading the gate and acting on it. I hit the
same window in the other direction — I claimed within seconds of the freeze landing, deliberately,
because the same programme note says a null `development_host` can be taken in the minute it opens.
Alien's observation that the race was detected **only because the push was rejected**, and that a
first-landing push would have silently overwritten a valid claim, is a real control-plane weakness and
worth keeping on the record as a proposal rather than acted on unilaterally.

## RS-290 step 7, independently verified

Not taken on Alien's word either:

```text
gh run 36964619541 : headSha   = 1a5bc0ee825c681636b9611efa2163f458c0a76f   == main   MATCH
                     headBranch= main        conclusion = success
                     jobs     = gateway-web success | android success
git diff --stat 2f81296 1a5bc0ee -- . ':(exclude)evidence'   ->  0 lines
```

So the frozen `main` is byte-identical to the reviewed head in all non-evidence files, and its CI is
green on both jobs at exactly that commit. `RESCHEDULING_BASELINE_FROZEN` is properly evidenced and
RS-290 owes nothing further.

## A future risk, flagged early rather than at the deadline

Alien's record states that UXI-301's Review "must not be Alien's" **and symmetrically that Alien must
not review Mech's development of it either**, leaving no named eligible reviewer. Under §3's letter
that reading looks too strong: §3 requires that Development and Review be done by **different physical
hosts**, and Alien *withdrew* its claim, so Alien never developed UXI-301 and is not disqualified by
the rule as written. Alien's own reason for the self-exclusion is not stated.

This matters because the two readings lead to different places:

- §3's letter → **Alien is eligible to review** UXI-301 once Mech's development is complete.
- Alien's reading → no host is eligible, which is §5.2 `STRUCTURALLY_INELIGIBLE` and needs an Owner
  ruling, because it would block UXI-301's completion and therefore UXI-390 and the objective.

**I am not asking for a ruling yet, and that is a deliberate call.** My development of UXI-301 is not
complete — the Android side, the real E2E and hosted CI remain — so the question cannot be answered
usefully now and §9 discourages work that re-decides something not yet due. I am recording it here, at
the point I noticed it, so that it surfaces with the full §3 analysis at hand rather than as a surprise
when development completes. The precedent is the RS-290 repair: raising a disposition question *before*
it became the only blocker is what kept that task moving.
