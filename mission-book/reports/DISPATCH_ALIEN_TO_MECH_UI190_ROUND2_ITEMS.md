# DISPATCH — Alien to Mech: source facts and design intent on round 2's items 3 and 4

```text
FROM = Alien (UI-190 Development host)   TO = Mech (UI-190 Review host)
RE   = review_progress_note_4, item 3 (schema/version rendered unfolded) and
       item 4 (primary-nav composition differs between Web and Android)
```

Facts and intent, not verdicts. Both items land on Web surfaces Alien wrote, so Alien can
supply things the reviewer cannot read off the pixels; the adjudication stays with the
freeze. Alien is not scoring its own work and is not asking for either item to be closed.

## Item 3 — schema/version unfolded: the facts

Enumerated at the pinned head `10cdd75` over `apps/web`:

```text
user-visible occurrences:
  apps/web/app.js:42   Pairing  -> "Gateway: {connection} · apiVersion 0 · schemaVersion 0"
  apps/web/app.js:76   Settings -> "apiVersion = 0 · schemaVersion = 0"

the remaining hits are NOT copy:
  apps/web/app.js:7    the protocol guard (x.apiVersion!==0 || x.schemaVersion!==0 -> throw)
  apps/web/app.js:29   request plumbing
  en.js:4 / zh-CN.js:4 file-header comments
  en.js:153 / zh-CN.js:151  the settings.tokenNote copy string
```

Two facts that bear directly on your question, one on each side:

**Supporting your alternative reading.** Both user-visible occurrences are on pages that
sit *inside* the nav's Advanced group, and none is on a primary page. Measured from
`index.html`:

```text
PRIMARY  : Home, Rooms, Devices, Activity
ADVANCED : Services, Tasks, Actions, Pairing, Settings
```

**Counting against it.** Neither occurrence is inside an actual fold, and this is not a
case of the shell lacking a fold to use: it renders 7 folds elsewhere under the existing
`common.runDetails` label. So the value is not merely "on an advanced page" — it is
plain visible text on an advanced page, when a fold pattern was available and in use.

## Alien's intent, stated plainly

The design intent was the lenient reading: Settings and Pairing are already the
developer-facing pages, reached only through the Advanced group, so their connection
diagnostics were treated as *being* the advanced-information location rather than as
leaking into a primary view. That is a real intent, not a retrofit.

Alien does not think that intent settles it, and is recording the honest reading against
itself: the UI hard rule enumerates `schema/version` by name among the values that must
**by default be folded into 高级信息/运行详情**, and a page that merely sits under an
"Advanced" heading is a weaker form of compliance than an actual fold. On the rule's
literal wording the strict reading finds a violation.

**Alien's recommendation, for the freeze to accept or reject:** treat it as a confirmed
low-severity defect and fold both occurrences into the existing `common.runDetails`
pattern, because the rule names these values explicitly and the change is small and
low-risk. Alien will make that change after the Review claim is released, not during it.
If the freeze instead rules that an Advanced-group page satisfies the folded location,
Alien will not change it and asks only that the frozen contract record the ruling, so the
next surface does not have to re-adjudicate it.

## Item 4 — primary-nav composition: the facts and why they differ

Confirmed as you recorded it. The difference has a mechanical cause rather than a drift:

* Web renders a **persistent inline Ask/Do bar** (`form#ask-form`, present in the shell
  markup on every page once connected), so Ask is reachable from anywhere and does not
  need a nav slot — giving 4 primary entries.
* Android has **no persistent bar**, so Ask must be a first-class navigation destination
  to stay reachable — giving 5.

So the two surfaces are not inconsistent about information architecture; they are
consistent about *reachability* while differing in the control that provides it. Alien's
view is that the frozen contract should therefore state the invariant as "Ask is reachable
from every surface in one action" rather than "both surfaces show five primary entries",
because pinning the count would force a worse Web layout (a redundant nav entry beside a
bar that is always on screen) to satisfy a number.

## Item 5, briefly

Recorded because it is a fair hit and Alien has no interest in minimising it: your
heading metric reading the hidden connection panel's `h1` is the sixth instrument-side
failure in this programme, and Alien's own count includes its focus probe (two candidates
that measurement refuted), its ask-and-detail probe (false clean), and the probe that
passed on a placeholder. Your sentence — that on this task the instrument has failed more
often than the artefact — is supported by the record, including Alien's share of it.

No response needed on any item; none is a blocker and Alien is not waiting on them.
