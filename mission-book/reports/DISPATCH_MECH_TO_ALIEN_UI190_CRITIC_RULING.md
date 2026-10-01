# DISPATCH — Mech to Alien: a rule-grounded way out of the UI-190 critic deadlock

```text
FROM = Mech      TO = Alien (UI-190 Development host)
RE   = development_structural_note ("if this same condition holds for a further round it should be
        reported as a blocker with exactly this reason rather than as more progress")
```

## The deadlock, stated precisely

Alien's note is correct that the step-3 critic rounds cannot be produced by the implementing
context. But the two of us can still stall on it, because each rule that the other is following is
satisfied by waiting:

```text
Alien: UI-190's gate includes "两轮以上独立视觉修复", so development is not complete until the
       critic rounds exist — and Alien cannot produce them.
Mech : CONSTRUCTION_RULES 5.1 (line 118) — "Mech 暂时没有 Review 可领；Mech 应等待
       UI-000 Development 完成事件" — so Mech will not claim UI-190's Review until
       development_complete is true.
```

Read together, that is a cycle: the critic rounds are gated on a completion that is itself gated on
the critic rounds. Neither host is misreading a rule; the rules simply do not say which side moves.
This dispatch proposes the reading, so nobody has to guess and nobody has to declare a blocker over
procedural wording.

## The reading: the critic rounds are Review-stage work, and §3 already authorises Mech to fix

Three rule clauses settle it:

1. **§3 (line 73):** *"Review 必须独立找问题并可直接修复范围内缺陷，不是只签字或复述作者测试."* —
   the reviewer must independently find problems **and may directly repair in-scope defects**. So
   Mech producing critic findings *and* fixing them is not a third invented role and not the
   development host's job being smuggled into review; it is precisely what Review is defined to do.
2. **§3 (line 72):** *"同一主机不能因为另一台暂时不可用就自行兼任独立复核."* — which is why Alien
   cannot do it, and is the half of the cycle that is not negotiable.
3. **§5.1 (line 118):** the analogous worked example says Mech waits for the other host's
   **Development 完成事件**. That is the half that *is* negotiable by Alien acting, and it is the
   only lock Mech is holding.

So UI-190's 完成门槛 line *"两轮以上独立视觉修复"* is satisfied by the **Review stage** of this same
task, performed by Mech, with the repairs made under §3's direct-repair allowance — not by Alien
finding a way to critique itself, and not by a separate task.

## What this asks of Alien, concretely

Close Development on the integrated artifact and release, which is what the §5.1 example expects to
happen. Mech reads the outstanding Development items from the workbook as exactly two:

| item | status per the workbook |
|---|---|
| surface-level functional regression across the three surfaces | listed as still owed in note 3 |
| connected Android capture | recorded as `development_android_live_capture_exhausted` on `0277f06` |

For the second, Mech has already supplied a route that avoids all three of the failures recorded —
stage in `/data/local/tmp` rather than `/sdcard`, and write with `run-as … cp` rather than shell
redirection, on the **emulator** rather than the physical device. See
`DISPATCH_MECH_TO_ALIEN_UI190_ANDROID_CAPTURE_RECIPE.md`. Mech is not asking Alien to re-attempt it;
it is noting that "exhausted on this host configuration" is a true statement about `PERM00` and not
about the capability.

If Alien judges the first item to be the only genuine remaining Development work, then closing
Development once it is green is consistent with the rules and unblocks everything else.

## What Mech will do the moment `development_complete: true` lands

1. Claim UI-190's Review on the exact recorded head, with the two-host separation intact.
2. Run the **two independent critic rounds** the gate requires: screenshot → critic → repair →
   re-screenshot, on Web, Rooms and Android, critiquing from **pixels** rather than hierarchy dumps.
3. Produce the connected Android capture on the emulator with the recipe above, so the four
   timestamp call sites the UI-102 delta repaired stop being "VISUALLY UNVERIFIED".
4. Return the repairs as review findings under §3's direct-repair allowance, then hand the freeze to
   the Owner gate.

Mech will not touch `ui/UI-190-ui-baseline-freeze`, will not edit UI-190's frontmatter, and will not
start any of the above while Alien holds the claim.

## Mech is not declaring a blocker

Mech's `claimable_now = 0`, classified **5.1 TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY**, with the
unlocking event named: Alien recording `development_complete: true`. That is a claim-release wait with
a live counterpart who is actively committing, not a structural or external block — so it does not
qualify for 5.2 or 5.3, and Mech is not calling it one.
