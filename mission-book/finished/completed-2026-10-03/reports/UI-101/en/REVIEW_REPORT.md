# UI-101 — REVIEW REPORT (Host `Mech`)

[Authoritative source / 权威原稿](../REVIEW_REPORT.md)

Complete historical reading translation; no new authoritative fields or acceptance verdict. / 完整历史阅读译文，不产生新权威字段或验收结论。

> Standing rules: [CONSTRUCTION_RULES.md](../../../../../CONSTRUCTION_RULES.md)
> Reviewed Web shell: Development head `56c819000548d9496ecb9fd2459f19d1ad9fcec1`, CI `36870347917`.
> Review output head: `2c6e787c3a08166378c0f645a1ee200ce6885414`, CI `36871760594`.
> Development Alien, Review Mech: §3 two-host independence satisfied.

## 0. Verdict

```text
REVIEW_RESULT = PASS_WITH_REPAIRS
```

This host directly repaired two real defects. The proactively handed-off unverified regions were **actually triggered and verified**, not accepted on trust.

## 1. §7 reconciliation before claim

```text
recorded branch == CI head_branch        ui/UI-101-web-product-shell                 OK
recorded head   == CI head_sha           56c819000548d9496ecb9fd2459f19d1ad9fcec1    OK
required terminal state == conclusion    run 36870347917 == success (android+gateway-web)  OK
```

## 2. Independence statement

This host separately wrote scripts/ui-101/review-mech-probes.mjs and does not reuse Development's shell-shots.mjs or ask-and-detail-shots.mjs. §3 forbids merely signing or restating author tests.

It measures items handed off by the author and items neither host had measured: **end-to-end triggering of five Ask states**, **production Web-shell color contrast**, and **raw internal vocabulary leakage in both languages plus 390px overflow**.

## 3. Real defects repaired

### R-1 — Invisible interactive text: real and user-visible

rawLink() emits `<a class="primary link-button">`. Both CSS rules have single-class selectors and equal specificity. Later .link-button overrides .primary's color var(--void) with var(--lime), while the lime primary background still applies:

```text
浏览器实测   color rgb(198,242,78) on background rgb(198,242,78)   contrast 1:1
影响范围     Rooms 页全部 10 个「在新标签页打开」链接
```

The raw measurement gives identical rgb(198,242,78) foreground/background, 1:1 contrast, affecting all ten Rooms “open in new tab” links.

This is **entirely invisible**, not merely low contrast. Those ten links are the only room entry besides iframe embedding. Fix: higher-specificity `.link-button.primary { color: var(--void); }`.

Neither host caught it because neither measured production-shell contrast. Author acceptance checked engineering words, banned glyphs, raw vocabulary, overflow and page errors, not contrast. After repair this host measured **zero elements below AA**.

### R-2 — An acceptance instrument unable to fail: false clean

ask-and-detail-shots.mjs fed needs-choice and ambiguous the strings 'clean up my downloads folder' and 'open my notes'. intents.mjs is a literal rule table; neither matches any rule, so both reach UNMATCHED:

```text
修复前  route-confirmed "已就绪"   needs-choice "没有匹配"   ambiguous "没有匹配"   unmatched "没有匹配"
```

The probe ran UNMATCHED three times but printed CLEAN: no findings, never reaching two states it claimed by case names. distinct.size < 2 is too weak: one different state plus three identical ones satisfies it.

**This reproduces on a complete host with gateway, reference node and Room hub online.** The workbook development_unverified attributed the gap to lacking hub/node; this host disproves that attribution. Even with the full environment the probe cannot reach those states: the cause is inputs, not environment.

Fix inputs to routing's own literal triggers: side-effect confirmation `run a safe task of type CHECKPOINT_DEMO`, dual-owner ambiguity `search for utopia`. Require every named case to reach its own presentation. After repair:

```text
route-confirmed "已就绪"   needs-choice "需要你确认"   ambiguous "请选择目标"   unmatched "没有匹配"
```

All four states differ; only then does CLEAN mean something.

## 4. Author's unverified regions: actually verified here

```text
五个 gateway 状态，经真实 shell UI，双语各跑一遍        10/10 到达
  route-confirmed · failed · needs-confirmation · ambiguous · unmatched
默认路径上的原始内部词汇泄漏                            0
双语言下的工程界面语汇（CONTROL SURFACE / WORKSPACE 等）  0
390px 横向溢出                                          0
page error                                              0
```

The raw results record 10/10 arrivals across five gateway states via real shell UI in both languages, and zero raw vocabulary leakage, engineering terms, 390px overflow and page errors. The workbook listed four-state Ask/Do coverage as pending and said untriggered is not verified. It has now been triggered.

## 5. No regression

```text
repo suite                                       854/854
作者自己的 shell 验收 pass                        CLEAN（无发现）
作者的 ask/detail 探针（输入修复后）              四个状态各不相同，CLEAN
```

The repo suite is 854/854; author's shell acceptance is CLEAN, and the repaired ask/detail probe reaches four distinct states with CLEAN.

## 6. Boundaries: not verified here

- **No aesthetic judgement.** Owner settled the direction in UI-000; this host measures measurable properties and hard rules.
- **No complete physical-device/touch and keyboard Tab-order walkthrough.** The checklist includes keyboard/focus, but only contrast, state reachability, overflow and leakage were covered. Focus order and keyboard reachability remain unverified, without an implied pass.
- **No iframe embedding verification.** UI-103's embedded=1 needs Web wiring; this host already recorded the seam in its UI-103 report, and UI-101 code is not yet wired. It remains open.
- **Contrast measurement is approximate.** Effective background is obtained by walking nontransparent background-color ancestors and alpha composition, without pixel-sampling background-image. This does not affect R-1: 1:1 is far below 4.5.

## 7. This host's own errors

1. Forgot CITY_TOKEN when running author's probe; CITY_TOKEN is required to pair was my environment-variable error, not a probe defect. Rerun passed.
2. First contrast count included gradient-background brand marks as failures. Background derivation sees background-color, not background-image; this had produced a false 1:1 on Android. No such element was hit on Web this round, but the known blind spot is recorded to avoid mistaking detector limits for product defects.
3. The draft self-error section contained a probe error that never happened: it claimed the first version asserted a Chinese marker in English. Self-check found this inconsistent with the written probe and removed it. The correction itself is recorded honestly: do not invent plausible self-criticism from memory when writing a report.

## 8. Handoff state

```text
REVIEW_RESULT          = PASS_WITH_REPAIRS
review_covers_head     = 2c6e787c3a08166378c0f645a1ee200ce6885414 (CI 36871760594 success)
修改范围                apps/web/style.css（presentation）+ scripts/ui-101/（证据工具）
业务语义/API/框架        未改动
```

Under §3 direct in-scope reviewer repairs are permitted and required; the repaired head is therefore 2c6e787. This host does not claim its own repairs independently confirmed. Any third-host confirmation should follow that host's own judgement.
