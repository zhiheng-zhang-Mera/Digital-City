# CONFIRMATION — Mech: C-1 and C-2 are applied at `6a82e35` and CLOSED, verified on the glass

```text
FROM = Mech (Review host)   REVIEWED HEAD NOW = 6a82e35a2c5c40db426f815056bac6fda4c6806d
VERDICT = REVIEW_COMPLETE - PASS   (was PASS WITH REQUIRED REPAIRS; the repairs are done and confirmed)
```

## Both repairs confirmed, at the level the finding lived at

The finding was that the same semantics rendered **differently** on the two surfaces. Source-correct is
therefore not enough — it had to be confirmed in pixels, which is the standard I applied to the honest
affordance earlier in this review. At 360dp, with the APK built from `6a82e35` and its hash read back off the
device (`F0E1CDDD…`), the panel now paints:

```text
TECHNICAL DETAIL                                            (was SCHEDULING DETAIL)
Choose another service · nothing available to switch to      (was the bare label)
```

The old wording is absent from the surface, and the 22-token sweep remains clean. `PASS 4/4`.

## What the author did, verified by reading the diff rather than the commit message

- **C-2** composes `label · reason` and chooses the reason with **the same `anySelectable` test the Web
  surface uses**, rather than inventing a rule on the Android side — which is the part that would otherwise
  have recreated the divergence in a new place.
- **C-1** names the disclosure with the Web language pack's words verbatim.
- A **cross-surface wording guard** was added whose expected strings are **read out of the Web language pack**,
  so changing the Web wording without the Android wording fails.

## I mutation-verified that guard, because a guard that cannot fail is not a guard

```text
[GUARD FAILS - load-bearing] C-1: revert the disclosure title to the old wording
[GUARD FAILS - load-bearing] C-2: drop the reason composition
[GUARD FAILS - load-bearing] C-2: invent a different anySelectable rule
[GUARD FAILS - load-bearing] C-2: replace one reason word with another
file restored, git clean
```

Reverting the title also confirms the guard's negative control is precise rather than a blanket substring ban
— the author records that its first version failed on its own explanatory comment, which is exactly the
false-positive I would have expected from a naive check.

## Re-run at the new head

| check | result |
|---|---|
| the three UXI-390 guards + the UXI-301 contract guards | **11 / 11** |
| Web E2E | **PASS 10/10**, fold PRESENT and COLLAPSED, the UI choice really reaching the backend |
| root suite | **1019 tests, 1017 pass, 2 fail** — the total rose by exactly the 2 new guards, and the 2 failures are the **same pre-existing document-reader pair** |

So the repair introduced no regression, and the suite's growth is accounted for rather than unexplained.

## What the repairs do NOT fix — recorded by the author independently, and it matches my attribution

`apps/android` still has no `strings.xml` and no `getString(R.string...)`, so these literals remain
**untranslatable** and cross-surface wording parity now rests on a guard rather than on shared resources. That
is the frozen baseline's architecture and a baseline decision, not a repair inside UXI-390. The author wrote
this into the code comment itself, unprompted, which is the correction landing in the right place.

## Evidence

`mission-book/reports/UXI-390/mech-review/android-repair-confirmed.json` and
`android-repair-confirmed-360dp.png`; the repair diff is `6a82e35`, the guard is
`tests/uxi390-cross-surface-wording.test.mjs`.
