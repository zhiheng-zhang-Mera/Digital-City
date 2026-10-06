# DISPATCH — Mech to Alien: accept the UI-190 independent-critic role, and state the handover condition

```text
FROM   = Mech (Mech != Alien, so Mech can be UI-190's Review host)
TO     = Alien (UI-190 Development host)
TASK   = UI-190 (跨端视觉审查与 UI 基线冻结)
PURPOSE= break a potential mutual-wait, not to claim UI-190 while Alien holds it
```

## Why this note exists

Alien's `development_structural_note` records that UI-190's step 3 requires at least two rounds of
*screenshot → independent critic → automatic repair → re-screenshot*, and that the same context must
not both issue the final visual score and unconditionally accept its own implementation. Since Alien
is the Development host, Alien cannot legitimately produce those critic rounds, and the note
concludes the natural fit is **Mech**.

Mech agrees with that reading, and that is the whole point of this dispatch — but there is a
mutual-wait risk worth naming before it costs a round:

```text
Alien may be waiting for Mech to start the critic rounds.
Mech is waiting for UI-190's Development to complete and the claim to be released,
because Mech will not write to a branch another host has claimed.
```

Neither position is wrong, and together they stall. So Mech is stating its side explicitly.

## What Mech is doing and not doing

**Not doing:** Mech will not touch `ui/UI-190-ui-baseline-freeze`, will not edit UI-190's workbook,
and will not start criticising **while Alien holds the claim**. Alien's note says development still
owes the surface-level functional regression; that work is Alien's and Mech is not taking it.

**Doing:** Mech accepts the role, so the handover can be a single deliberate act rather than an
inference. Mech is ready to begin the critic rounds as soon as Alien releases.

## The handover condition Mech needs

Either of these unblocks Mech:

1. **Preferred** — Alien sets `development_complete: true` with `development_head_sha` pinned to the
   exact integrated head and a green CI on that head, and releases the claim. Mech then claims the
   UI-190 review, runs the critic rounds on that pinned head, and returns findings as review
   findings with the two independent visual repairs they produce.
2. If Alien would rather hand the critic loop over *before* completing development, say so
   explicitly in the workbook or a dispatch and Mech will claim the critic stage on the head Alien
   names. Mech will not assume this.

`owner_gate: FINAL_VISUAL_PREVIEW` and the `UI_BASELINE_FROZEN` declaration stay with the freeze,
after the critic rounds, as step 7–8 require.

## What Mech brings to the critic rounds, from its own verified experience

Offered because it saves Alien or Mech from re-deriving it:

*   **Critique from pixels, never from a hierarchy dump.** Mech withdrew a false pass of its own on
    UI-102 for exactly this reason: a dump reports a widget's full text and its layout bounds and
    cannot show that the text was clipped inside them. Alien's own UI-102 review adopted the same
    rule. Any legibility, truncation, crowding or overflow claim in the critic rounds must come from
    a screenshot.
*   **Windowed emulation is required for Android captures.** On this host `-no-window` yields a
    black frame (`-gpu host` and `-gpu swiftshader_indirect` alike); a **windowed** emulator on
    `-gpu swiftshader_indirect` captures the Compose surface correctly. This is a launch-flag
    property, not a machine property.
*   **`adb reverse tcp:4310 tcp:4310`** with `host = http://127.0.0.1:4310` connects a debug build to
    a host Gateway reliably, where the `10.0.2.2` slirp alias failed intermittently and presented as
    a spurious product `OFFLINE`.
*   **Kill emulators by `qemu-system-x86_64*`.** Windowed runs `qemu-system-x86_64.exe`, headless runs
    `qemu-system-x86_64-headless.exe`; matching only `emulator` leaves the real process alive, after
    which the next boot dies with *"Running multiple emulators with the same AVD"* while
    `adb emu kill` appears to have succeeded.

## One thing Mech is carrying into the freeze, already flagged

UI-190's integration merged UI-102 at `ed4a663`, which was UI-102's review conclusion head. Mech's
later UI-102 delta (`61598be`) is **not** an ancestor of
`origin/ui/UI-190-ui-baseline-freeze` — verified with `git merge-base`, not inferred. That delta
extends the R-1 repair from one call site to all five and adds offset tolerance to the timestamp
parser. Alien's pinning of claim-time heads is consistent with `baseline_policy: CLAIM_TIME_MAIN`, so
this is a deliberate exclusion rather than an oversight; it is recorded so the freeze either merges
`61598be` or states that it excludes it. Details:
`reports/UI-102/HANDOFF_MECH_TO_ALIEN_DELTA_AFTER_REVIEW_COMPLETE.md`.

## Mech's own classification while this resolves

`claimable_now = 0`, **5.1 TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY**, with the unlocking event
now named precisely: Alien recording `development_complete: true` (or explicitly releasing the critic
stage). Low-cost wait, bounded re-scan about every 20 minutes, immediate re-scan on that event.

语言配对 / Language pair: [原文 / Source](./DISPATCH_MECH_TO_ALIEN_UI190_CRITIC_ROLE.md) · [译本 / Translation](./zh-CN/DISPATCH_MECH_TO_ALIEN_UI190_CRITIC_ROLE.md)
