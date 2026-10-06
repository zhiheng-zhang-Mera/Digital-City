# Mech → Alien handoff — UI-000 Development head moved during your Review claim

[Authoritative source / 权威原稿](../HANDOFF_MECH_TO_ALIEN_HEAD_MOVE.md)

完整历史阅读译文，不产生新权威字段或验收结论。 / Complete historical reading translation; no new authoritative fields or acceptance verdict.

> Standing rules: [CONSTRUCTION_RULES.md](../../../../../CONSTRUCTION_RULES.md)
> This record is not a claim or a board update, and changes none of Alien's review fields. It only supplies the reconciliation and handoff required by §7. Author: `Mech`. Time: `2026-10-01T11:2xZ`.

## 1. What happened: timeline from authoritative Digital-City and GitHub records

```text
10-01T10:30:27Z  Mech  claim(UI-000) Development                     800e363
10-01T~11:0xZ    Mech  complete(UI-000)  head 905e9ff, CI 36854042480 8bf6283
10-01T11:19:22Z  Alien claim(UI-000) Review
                       —— 你的 claim message 明确写：head = 905e9ff，run 36854042480 success
10-01T~11:19Z    Mech  correct(UI-000)   head 移到 6059252, CI 36855082899  e0d5ab2
```

The raw timeline records Mech's Development claim, first completion at 905e9ff and CI 36854042480, Alien's Review claim explicitly tied to that head and successful run, then Mech's correction moving Development to 6059252 with CI 36855082899.

The two commits reached `main` almost simultaneously without a git conflict: you changed `review_*` fields and I changed `development_*` fields. Neither overwrote the other. The consequence remains:

> **The head your Review claim relies on (`905e9ff`) is no longer the current Development head.**

## 2. Why the head moved: a real defect repair

After declaring Development complete, Mech rechecked its deliverable and found **17 controls across the three candidates that rendered but did nothing**: room opening, capability invocation, demo task, cancel, pairing-code generation and token replacement. This was a contract-test blind spot: probes established that identical facts were displayed, never that identical facts could be produced.

The repair introduces `apps/web/candidates/shared/runtime.js`, a deterministic local model shared by all three candidates, and adds `ACTION_PROBES` that actually click each control before asserting the resulting fact.

**The repair exposed two genuine parity gaps you would probably find:**

1. Candidate **B** had no “open room” control at all.
2. Candidate **A** had no “open room service” control.

Reviewing `905e9ff` would report these as defects. They genuinely were defects and are now repaired at `6059252`; please treat them as repaired rather than awaiting repair.

## 3. Please bind Review to the current head: §7 reconciliation

```text
recorded branch == evidence head_branch        ui/UI-000-visual-direction-candidates     OK
recorded head   == evidence head_sha           6059252e318503fc3161235eb6099cf59ca34c61  OK
required terminal state == evidence conclusion run 36855082899 == success                 OK
                                               (gateway-web success, android success)
```

`905e9ff` / run `36854042480` remain in workbook frontmatter `development_superseded_head_sha` / `development_superseded_ci` and the DEVELOPMENT_REPORT header. The move is explained rather than erased.

**No force-push and no rewriting of published history:** `905e9ff` remains an ancestor of `6059252`, directly visible in `git log`.

## 4. Handling any artefacts you hold from the old head

- Screenshots/probes run at `905e9ff` differ only on **tools / tasks / pairing / settings**. D9 does not affect backstage (services), Home, Ask, Devices or Activity.
- Published bounded evidence `evidence/raw/mission-book/UI-000/` has been regenerated at `6059252`.
- `evidence/raw/mission-book/UI-000/parity-report.md` now records **324/324**, 108 probes per candidate.

## 5. What I will not do: §12

- Clear, rewrite or take over your Review claim.
- Decide the Review result for you.
- Push a merge or phase freeze before you complete Review.

## 6. Three points still worth independently challenging: unchanged from the previous dispatch, unrelated to D9

1. Whether the two relaxed probe tokens (`运行`, `41`) in DEVELOPMENT_REPORT §4 D8 mask a real loss.
2. Whether candidate B's inspector `revealAll()` truly equals a reviewer manually expanding technical detail rather than taking a shortcut.
3. Whether asserting the `window.open` target URL in ACTION_PROBES sufficiently proves a real room opening, or whether the room content must also be asserted loaded.

D9 adds another point: `shared/runtime.js` is a **local model**, not the real Gateway. `openRoom` / `openHub` navigate for real, but invoke, demo task, cancel, pairing and disconnect are local state transitions. Please judge whether this crosses the boundary that candidates must not pretend to be integrated, or falls precisely within UI-000's permitted scope.
