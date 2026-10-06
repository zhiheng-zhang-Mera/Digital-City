# UI-000 — Independent Review Report: Host Alien

[Authoritative source / 权威原稿](../REVIEW_REPORT.md)

Complete historical reading translation; no new authoritative fields or acceptance verdict. / 完整历史阅读译文，不产生新权威字段或验收结论。

> Rules: [CONSTRUCTION_RULES.md](../../../../../CONSTRUCTION_RULES.md)
> Workbook: [UI-000](../../../ui-civilization/UI-000-视觉方向候选与审美门禁.md)
> Process policy: [PROCESS_DATA_POLICY.md](../../../../../PROCESS_DATA_POLICY.md)
> Review Alien, Development Mech: §3 two-host independence.
> Conclusion head 727a254acd3b6c1c8925dbf78b0630e1a1410f8a.

## 1. Identity and evidence pointers: §7 exact-head check

```text
baseline                          e7c498f5acd86da324a45c3278219c8daa612561   (854/854 实测)
Development 声明头                 905e9ff97d21cd282601a819af1e69acc455af99   CI 36854042480 success
Development 追加修复头             6059252e318503fc3161235eb6099cf59ca34c61   CI 36855082899 success
Review 复核头（本报告结论头）      727a254acd3b6c1c8925dbf78b0630e1a1410f8a   CI 36855721920 success
repo 本地门槛（本机，复核头上）     859/859 pass
```

The recorded development branch equals the evidence branch ui/UI-000-visual-direction-candidates. Development head and its CI headSha still agree, satisfying §7 item1.

### 1.1 Development advanced the branch during Review: recorded, not rewritten by Alien

After Alien claimed Review at2026-10-01T11:19:22Z, Mech pushed6059252 at11:23:28Z on the same branch, removing17dead controls and proving click-action parity. Its message says review found17 rendered but inactive controls.

- Impact: workbook development_head_sha no longer equals tip; the reviewed artefact changed during the review window.
- Handling: no force-push or rewriting foreign fields (§2/§12). Rebase review onto new tip and rerun every probe on that entire new head. All figures here are727a254, containing6059252.
- Reason: a branch move and role-boundary observation. §3 requires independent review on different physical hosts, while the message describes Development review-like repairs. CI36855082899 passed and17false clickable controls were genuinely eliminated, improving quality. But Alien's report alone fulfils who-reviews independence. Recorded for Owner to consider standing rules.

## 2. Independence: plan before implementation

Alien's probe plan at11:10Z precedes the branch existing on origin, when remote ui refs were empty; see DISPATCH_ALIEN_ZERO_CLAIM_2026-10-01 §7. Plan in Utopia .scratch/UI-000-review-probes.md. Alien authored review-probes.mjs independently, not a parity.mjs copy and without its assertions.

Deliberately stricter:

| Dimension | Development parity | Alien review |
|---|---|---|
| Product facts | textContent includes folded/hidden | innerText visible only |
| Technical values | Full-text, reachable sufficient | Invisible by default, reachable after revealAll |
| Mobile | Not measured |390×844 per surface overflow and24px targets |
| Coverage | Not reported |29/29 capability-probe coverage |

## 3. Six in-task review criteria

| Criterion | Verdict | Basis |
|---|---|---|
| Three genuinely different, not recoloring | Pass | Different structural signatures: A NAV.switch + #root + one section; B ASIDE.rail + main + four sections; C NAV.acts + main + four sections. First h1, navigation and layout differ |
| Core functions retained | Pass | Capability coverage 29/29; Development’s added ACTION_PROBES reproduced here at 324/324 |
| Engineering/dashboard appearance | Partial, D2 | A/C have subject-oriented copy and information cards; B’s primary surface directly renders task.completed/task.progress/node.heartbeat with row inspectors |
| Mobile/desktop readability | Pass after repair | B/services previously overflowed 37 px at 390; now scrollWidth and clientWidth both 390. Smaller targets remain in D3 |
| Impersonal AI SaaS template copying | Pass | A warm editorial, B cool ledger, C dark neon; no shared template skeleton |
| Technical demotion while reachable | Partial, D2/R2 | A/C fold event types and invocation ids in details; B shows them by default |

## 4. Direct reviewer repairs D1: at 727a254, all remeasured

### D1.1 Parity not reproducible here: toolchain defect

parity.mjs originally launches channel chrome. Alien has only Edge, no Chrome; the runner throws before its first assertion:

```text
browserType.launch: Chromium distribution 'chrome' is not found at
C:\Users\15601\AppData\Local\Google\Chrome\Application\chrome.exe
```

Thus the 285/285 evidence cannot be independently checked on a host without Chrome. The fix matches repository browser tests: win32 prioritizes msedge and retains explicit PLAYWRIGHT_CHANNEL override. It reproduced after repair:

```text
candidate a: 108/108   candidate b: 108/108   candidate c: 108/108   324/324 PASS
```

### D1.2 Candidate B overflows at 390 px

Its data table cannot shrink around unbreakable capability-id/digest tokens, stretching the whole page. Measurement and repair:

```text
修复前  viewport.clientWidth=390  documentElement.scrollWidth=427   (溢出 37px，元凶 TABLE.data 398px)
修复后  viewport.clientWidth=390  documentElement.scrollWidth=390   (溢出 0)
```

## 5. Findings reported but not repaired, with reasons

### D2 — Parity cannot prove demotion: a false-success path

The same tokens must both read on their surface and be demoted:

```text
SURFACE_PROBES  services/capability-history  expect ['inv-2f10']          ← 要求可见
TECHNICAL_PROBES invocation-id               expect ['inv-2f10']          ← 要求降级
SURFACE_PROBES  services/capability-catalog  expect ['planning.knowledge.query']
TECHNICAL_PROBES capability-id               expect ['planning.knowledge.query']
```

The runner’s textContent includes folded details, counting them as readable on the surface. Under Alien’s stricter probe, A/C each have eight DOM-present-but-invisible failures for task.completed, node.heartbeat and inv-2f10 inside folded DETAILS. B passes precisely because it directly displays raw tokens. The probe rewards leakage and punishes demotion.

Not repaired: this would redefine whether event type/id is product fact or technical detail, precisely Owner’s A/B/C direction choice. Section 8 prohibits deleting assertions or relaxing gates to obtain green; either direction changes the declared pass semantics.

### D3 — Mobile clickable targets below 24 px: WCAG 2.5.8 AA

Only failures are listed; thirty targets between 24 and 44 px are advisory. A/activity has three; B has six across home/ask/tools/services/tasks/pairing/settings, including five invoke buttons; C has two across services/tasks. The workbook specifies no accessibility gate, so these are findings rather than blockers.

### D4 — Raw technical identifiers on default paths

- All three display raw capability ids by default on advanced Services. Alien considers this acceptable: Services itself is runtime details, and facts.js SURFACE_PROBES requires ids there. No defect, recorded only.
- B also displays tsk-9c41/tsk-8b20, node-3f7a91c2, inv-2f10, sha256:6a1f…c93d and #41; activity is a primary surface. Same root cause as D2.

### D5 — Weak tokens: methodology for future workbooks

Alien’s first room-id token knowledge matched “Plain-text knowledge entries with search, tags and replace import,” creating three false positives. Short 41, 10 and 25/50/100 similarly match coincidentally. Per-surface DOM locations were rechecked before this report. These are Development parity tokens: passing numeric/word tokens alone cannot prove capability existence.

## 6. Reviewed pass: no handling required

- Forbidden geometric glyphs occur only in icons.js/parity-probes.js banned lists, zero in rendered text. icons.js is a real 24×24 SVG set using currentColor, no icon font.
- Default engineering vocabulary has zero matches: CONTROL SURFACE, WORKSPACE /, Reference implementation, backendRef, provenance, schemaVersion and apiVersion.
- Production isolation: Web index, app, style, terminal and services files unchanged; candidates occupy a separate tree.
- Android release Activity remains sealed; only the debug manifest overrides exported through tools:replace.
- Room themes only override existing CSS variables; no API/module changes.
- Zero page errors across all three candidates and ten surfaces.

## 7. Disclosure

1. Not a single-host review: Development Mech, Review Alien. Android evidence is supplied by Development. Alien did not rerun Android device screenshots here and does not endorse real Android rendering quality, only code isolation.
2. Visual attractiveness belongs to Owner’s STYLE_SELECTION gate, not this report. It supplies measurable differences and screenshot pointers.
3. Raw probes/local captures are in D:\utopia-ui000-review\.runtime\evidence\mission-book\UI-000\review-alien\, gitignored under PROCESS_DATA_POLICY. This report and committed review probe provide reproducible entry points.
4. No candidate information architecture or visual-direction changes, Mech Development-field rewrites, force-pushes, assertion deletion or gate relaxation.
5. Own probe defects are recorded too: D5 and the first capture-order bug, where revealAll left the next supposed default view open. It now runs all default captures first, then all revealed captures.

## 8. Conclusion

Review passes with conditions: real structural differences, 29/29 capability coverage, no production contamination, glyph and engineering-vocabulary rules met. The two observed defects, nonportable parity and B overflow, were directly repaired and remeasured at 727a254. Local gates are 859/859 and hosted CI 36855721920 succeeds on android and gateway-web.

Owner’s next step is STYLE_SELECTION: choose A/B/C, or say all are bad with a reason. Record the selection in the report before it becomes UI-101..103’s sole visual direction.

# 9. Delta review: second round, Host Alien

## 9.1 Why a second round

First Review binds 727a254. Mech subsequently pushed c03adf1 integration and 01b4b87 evidence/tools, proactively marked post_review_delta_unreviewed and requested delta verification or Owner ruling. The delta contains real product source changes, contract corrections, WCAG repairs and B primary rendering, not covered by round one. The review host independently claimed at 2026-10-01T12:09:29Z without escalating to Owner.

```text
product source under review   c03adf13bbdd64d74514534b1de1e61ce3a68c6a
pushed head (evidence+tooling) 01b4b87a8dc80ad40775816b61487483388c4277   CI 36857534408 success
delta review head              6edd10379b4dbe22caa89fb45287c836f91151bf   CI 36860281859 success
git diff c03adf1 01b4b87 -- apps services contracts tests city platform   EMPTY   （已独立验证）
git diff c03adf1 6edd103 -- apps services contracts city platform          EMPTY   （已独立验证）
```

## 9.2 Independently reproduce Mech’s claims

| Metric | 727a254 | 6edd103 |
|---|---|---|
| strictVisibleFailures | 8 | 0 |
| tapTargets below 24 px | 10 | 0 |
| demotion leakage | 18 | 0 |
| overflow / glyphs / consoleVocab / errors | 0/0/0/0 | 0/0/0/0 |
| capability coverage | 29/29 | 29/29 |
| Mech parity | 324/324 | 396/396 PASS |
| repo suite | 859/859 | 859/859 |

All claims reproduced. Eight strictVisible failures disappeared because Mech changed its contract, moving raw internal vocabulary from SURFACE_PROBES to TECHNICAL_PROBES and adding LEAK_PROBES, rather than modifying the review probe to remove failures. The direction is correct.

## 9.3 Ruling on the remaining seventeen: defects in the review host’s probe, not candidates

Every match was traced to its text node and ancestor chain, not copied from Mech’s handoff:

| Category | Items | Ruling | Evidence |
|---|---|---|---|
| Substring false positives | room-id knowledge ×3 | Probe defect | Prose in room-summary/cell-note/poster-note; actual slug in default-folded DETAILS.tech/technical |
| Substring false positives | room-number 10 ×3 | Probe defect | Room-count copy or heading 10, not identifier |
| Advanced-surface interpretation ×8 | A/C capability-id, B capability-id/invocation-id/result-digest/task-id twice, C result-digest | No candidate defect | All on advanced services/tasks. D4 already declares advanced surfaces the folding destination; probe contradicts its own ruling |
| Reachability binding ×1 | C gateway-endpoint | Probe too strict | Reachable in Settings. Technical reachability belongs to the whole candidate; product facts bind declared surfaces |
| Contract definition ×2 | B/C room-number 01 | Product ordinal | Hard rule lists internal modules/IDs/routes/backendRef/provenance/schema/version/runtime paths, not display ordinals. Internal identifier is slug, folded correctly by A/C |

None of the seventeen is a product defect. Fifteen are probe defects or excessive strictness; two are one contract-definition ruling.

## 9.4 Two probe corrections, proving it did not become vacuous

1. Leakage detection matches identifier shapes rather than includes(token): tsk-, node-, inv-, act-, sha256:, #seq, backendRef|apiVersion|…, raw event types, capability ids, loopback endpoints and multi-word slugs. This is stronger than before: the former token list never covered primary-surface capability ids or raw event types.
2. Leakage scope narrows to the five primary surfaces under D4; technical reachability expands to the whole candidate.

Mutation test: restore B Home rendering e.type. The probe precisely reports b/home raw-event-type task.completed leaked on the primary reading path, exactly one failure. Revert leaves a clean worktree. It is not green through assertion deletion.

The strictness that found real defects remains in the product-facts-visible pass: each product fact must be visible on its declared surface. That is exactly the pass that caught Mech’s contradictory SURFACE_PROBES contract.

## 9.5 Still unchanged: boundaries

No candidate architecture/direction changes, Mech-field rewrites, force-push or gate reduction. render-for-owner.mjs and corrected review-probes.mjs are committed as reproducible entry points.

## 10. Owner gate unchanged; two optional rulings

STYLE_SELECTION still belongs solely to Owner; Alien does not select. Two optional judgements remain, nonblocking and not affecting A/B/C comparability:

1. Thirty 24–44 px advisories: 24 px is WCAG 2.5.8 AA, now met; 44 px is AAA/mobile best practice. Raising the target would visibly change density, so §9’s no-defensive-expansion rule leaves it to Owner aesthetics.
2. room.number classification: Development facts.js lists TECHNICAL_FIELDS; this ruling treats it as a product ordinal. No hard-rule violation: A omits ordinals, B/C display them as design variation. If uniformity is desired, handle in UI-101..103.
