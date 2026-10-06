# UI-101 — Web product shell and information architecture · DEVELOPMENT REPORT

[Authoritative source / 权威原稿](../DEVELOPMENT_REPORT.md)

Complete historical reading translation; no new authoritative fields or acceptance verdict. / 完整历史阅读译文，不产生新权威字段或验收结论。

> Standing rules: [CONSTRUCTION_RULES.md](../../../../../CONSTRUCTION_RULES.md)
> Workbook: [UI-101](../../../ui-civilization/UI-101-Web产品壳与信息架构.md)
> Development Host: `Alien`; branch `ui/UI-101-web-product-shell`.
> Conclusion head: `56c819000548d9496ecb9fd2459f19d1ad9fcec1`; CI `36870347917` success.
> Visual direction: UI-000's adopted **C″** (`aea8361`, Mech review `2978e31` PASS_WITH_REPAIRS).

## 1. Deliverables

The `apps/web/**` presentation layer was rebuilt in the adopted direction: dark stage, violet structure, lime primary signal, hologram-cyan secondary signal, clipped-corner panels, hairline borders, uppercase wide-tracked micro-labels, tabular numerals and segmented gauges.

| Construction step | State | Explanation |
|---|---|---|
| 1 Product navigation | Complete | Home / Tools·Rooms / Devices / Activity are primary; Services·Tasks·Actions·Pairing·Settings belong to Advanced |
| 2 Remove engineering titles | Complete | Both language packs change WORKSPACE / ALIEN to 城市链路, CONTROL SURFACE to 此刻, Reference implementation and DIGITAL CITY / 01 to 个人终端 |
| 3 Home prioritizes what can be done now and what is happening | Complete | Removed the statistics-card row; assistant slot leads Home, followed by running nodes + recent activity, room grid and recent tasks |
| 4 Ask/Do as natural-language entry with clear states | **Partially verified**, §4 | Shell branches present ready, confirmation, target choice, unmatched and executing states; only two triggered here |
| 5 Raw records collapsed by default | Complete | Event type/sequence, task id, room slug, LOCAL_PRODUCT, action id/route and Ask protocol state are collapsed or localized |
| 6 Keep all reachable capabilities | Complete | No capability path removed; repo suite 854/854 |
| 7 Reusable design tokens/components | Complete | style.css becomes the shell design system, covering every class emitted by existing JS rather than patching page by page |
| 8 Real desktop/narrow browser coverage + screenshots | Complete | The two acceptance scripts in §3 |

### Home assistant slot: applying the adopted direction

Clipped corners and scanline frame, cyan edge glow, ASSISTANT and SLOT 01 labels, Unassigned identity, and four later-bound v2-invariant-4 fields (bound device, appearance, voice, role). Copy explicitly says this is only a placeholder now.

**Two deliberate decisions, recorded explicitly:**

1. **No controls on the character slot.** Controls that render but do nothing are the project's previously caught false affordances (17 empty handlers repaired at 6059252); configuration remains in Settings.
2. **The character art is an honest outline silhouette.** There is no character artwork in the repository; the UI explicitly labels it a placeholder silhouette and does not imply finished assets.

### Repair inherited from UI-000 review

The shell retains Mech's repaired safe tertiary color `--ink-3: #8b82a8`. The former #6f6788 produced only 3.26–3.79:1 against white/near-black, below WCAG AA 4.5:1. It is not re-derived, so the downstream does not lose that repair.

## 2. Automated acceptance scripts committed on the branch

| Script | Coverage |
|---|---|
| scripts/ui-101/shell-shots.mjs | After pairing, all 9 shell pages at 1440 and Home/Rooms/Devices at 390; both languages asserted free of engineering vocabulary, forbidden geometric glyph icons, raw internal vocabulary on the default path, horizontal overflow and page errors |
| scripts/ui-101/ask-and-detail-shots.mjs | Drives the shell's own Ask form through states and reads badges; opens an Action row, asserting details collapsed initially and reachable after expansion |

> dev-gateway needs both CITY_TOKEN and CITY_NODE_TOKEN to start. This had blocked acceptance and is resolved.

## 3. Verification results

```text
repo 套件                     854/854 pass
hosted CI                     36870347917 success（android + gateway-web）
shell-shots                   CLEAN
ask-and-detail-shots          CLEAN
```

**These probes caught and repaired 10 real defects during the task**, all in Alien's code just pushed the previous round:

1. ASCII/Unicode geometric navigation icons, violating UI-101's hard rule.
2. A remaining U+25A3 running-node icon.
3. Home and room-grid output of room slugs.
4. Raw CLIENT_CONNECTED / CITY_STARTED event vocabulary on Home and Activity.
5. LOCAL_PRODUCT lifecycle and slugs on Rooms.
6. Inline action id and route in Actions.
7. Raw Ask/Do protocol-state badges.
8. terminal.js badge() accepted only one argument, silently ignoring localized labels: the actual root cause.
9. Fragile text markers in the probe itself; changed to reading state badges.
10. The probe clicked #view's first button rather than the action row, never opening the details it claimed to assert.

Items 9 and 10 are defects in the verification tools themselves and are recorded too: a tool must earn its own pass.

## 4. Explicitly unverified items: no pass implied

**Only two of the four Ask/Do states could be triggered here.** Measured:

```text
route-confirmed   state=已就绪     controls=2
needs-choice      state=没有匹配   controls=16
ambiguous         state=没有匹配   controls=16
unmatched         state=没有匹配   controls=16
```

The acceptance gateway has no Room hub and no registered node; triage resolves all inputs to the unmatched family. This is an **environment limitation, not a shell defect**: askResultMarkup() has separate branches and controls for AWAITING_CONFIRMATION / AMBIGUOUS / UNMATCHED / result states. But untriggered is not verified, so this is honestly partial and **handed to the review host for testing with a Room hub**.

The Action-detail screenshot is also honestly recorded as a demo FAILED row; this environment has no real successful action history.

## 5. Boundaries and disclosure

- No services, contracts, scheduler/provider/runtime semantics or API/DTO changes.
- No framework migration; Web remains Vanilla HTML/CSS/JS.
- The device detail panel retains raw event types via events(list, raw=true): that panel is itself the runtime-details destination, consistent with UI-000's advanced-surface ruling. tests/web-v02.test.mjs also pins NODE_ONLINE there.
- Demo data such as room summaries remains English, without UI localization; this is the data layer, outside this presentation scope, recorded for reference.
- This report is issued by Development host Alien. Under §3, independent UI-101 review **must be by Mech**; Alien cannot self-review.
