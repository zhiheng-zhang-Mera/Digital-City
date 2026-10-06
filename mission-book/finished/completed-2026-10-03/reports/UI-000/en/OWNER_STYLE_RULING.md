# UI-000 — Owner visual-direction ruling,2026-10-01, recorded by Alien

[Authoritative source / 权威原稿](../OWNER_STYLE_RULING.md)

Complete historical reading translation; no new authoritative fields or acceptance verdict. / 完整历史阅读译文，不产生新权威字段或验收结论。

> Standing rules: [CONSTRUCTION_RULES.md](../../../../../CONSTRUCTION_RULES.md)
> This records workbook owner_gate:STYLE_SELECTION and is UI101..103's sole direction source. Owner gave natural-language rulings; Alien records them sentence by sentence without rewriting or expanding.

## 1. Owner's exact original words, with reading translation

> 「UI按照C的风格主题但是不要大卡片配少量内容，可以稍微紧凑一些，保留B版的简洁。模拟类似明日方舟/崩坏3的游戏式UI，然后再生成一批对比图集。」

Reading translation: use C's style/theme, but avoid large cards with little content; make it somewhat tighter and retain B's simplicity. Simulate game-style UI like Arknights/Honkai Impact3, then generate another comparison gallery.

## 2. Construction clauses

| Clause | Type | Alien implementation interpretation |
|---|---|---|
| R1 C as base | Retain | Dark stage, violet structure, lime signals, void#08070f/violet#8b5cf6/lime#c6f24e; C's top4 primary + backstage advanced secondary rail and Ask spotlight |
| R2 No huge sparse cards | Remove | Remove Home4 unequal deck/panel-hero/tall/wide/std and Tools10 ribbon/poster-xl/lg; Home compact4/4/4+12-column board, Tools minmax(178px,1fr) grid |
| R3 Tighter | Tighten | Radius22→0 via clip-path; padding24/26→12/14; reduce line-height/fonts; heading clamp(38px,6.2vw,68px)→clamp(23px,3vw,34px); gap16→8 |
| R4 B simplicity | Introduce | Dense key/value definitions, single-line ledger beats, list-table rows, tabular-nums; one meaning per sentence, no decorative layout |
| R5 Arknights/Honkai3 game UI | Add | Clipped panels/corner brackets, thin strokes/hairlines, uppercase wide tracking, segmented progress, diamond signal, bevel status tags, HUD stripes; no ASCII/Unicode geometric icon glyphs, diamonds/brackets use CSS boxes |
| R6 New comparison gallery | Deliver | §4 |

## 3. Explicitly unauthorized: not done here

- No Gateway/Action/Ask/Task/RoomAPI/Scheduler semantics changes.
- No framework migration: Web/Rooms Vanilla, Android ComposeM3.
- No candidate merging into production apps/web; UI101..103 owns that.
- No replacing Owner's A/B choice: C base expressly selected, A/B retained as comparisons.

## 4. Delivery and verification

Branch ui/UI-000-visual-direction-candidates, remodel c in place from C to C′. Gallery D:\UI-000-candidates-v2\ contains complete new-direction renders and oldC/newC′/B comparison strips.

## 5. Two-host review state

Alien implements this Development remodel under direct Owner assignment. Under§3 Alien cannot self-review; C′ needs independent Mech review. This ruling record is not a Review pass before that completes.

## 6. Second Owner ruling: appended same day

### 6.1 Exact original words and reading translation

> 「紧凑程度正确，但是希望继续向日系科幻二次元主题偏移，参考明日方舟/战双帕弥什/鸣潮的感觉，主页人物就是后期设置的助理。」

Reading translation: compactness is right; move further toward Japanese science-fiction anime styling, evoking Arknights/Punishing:Gray Raven/Wuthering Waves. The Home character is the assistant configured later.

### 6.2 Breakdown and implementation

| Clause | Implementation |
|---|---|
| S1 Compactness correct | Keep4/4/4+12 board, clipped HUD, key/value and ledger beats unchanged; only visual register and Home character slot change |
| S2 Further Japanese sci-fi anime | Add hologram cyan#5ee7ff secondary signal alongside violet/lime, neon frame strokes, cyan micro-labels/striped headers, character-frame background scanlines |
| S3 Reference named games | Shared vocabulary: clipped frames/corners, hairline borders, scanlines, segmented gauges, uppercase tracked subtitles, framed character-art slot |
| S4 Home character is later assistant | operator slot, ASSISTANT/SLOT01, outline silhouette/scanlines, Unassigned identity, explicit later fields bound-device/appearance/voice/role, compact load/memory/link gauges |

### 6.3 Decisions that must be explicit, rather than silently made

1. Anime register uses geometry/type/color, not Japanese copy. Utopia is zh-CN/en with i18n keys and check:docs bilingual gate. Invented Japanese strings would be untranslatable/unverifiable content, a content change rather than visual decision; existing uppercase Latin HUD subtitles carry the same register.
2. Character is honest placeholder silhouette, not finished art. No character assets exist in repo; outline is labeled placeholder/only a placeholder now. Under v2 invariant4 naming/appearance/tone/role are later Owner-configurable. Reserve position/fields without pretending assets exist.
3. No controls on character slot. Rendered but unresponsive controls are a previously caught real defect,17 empty handlers repaired at6059252; slot is display-only without buttons.

### 6.4 Artefact and verification

```text
revision 头          aea8361c07c003f6f519829b6c1a208c20bccab1
parity runner        396/396 PASS（132/候选，含 7 条真点击动作探针）
Alien 复核探针        0 失败（泄漏 0、溢出 0、<24px 目标 0，覆盖 29/29）
repo 本地门槛         859/859
图集                 D:\UI-000-candidates-v3\（C″ 25 张 + C′↔C″↔B 对照条）
```

The raw block records full revision head aea8361, parity396/396 (132/candidate,7 real-click actions), Alien probe0 failures with coverage29/29, repo859/859 and v3 gallery C″25 screenshots plus C′/C″/B strips. Mech independent review still required; Alien cannot self-review.

## 7. Third Owner ruling: adoption,2026-10-01

### 7.1 Exact original words and reading translation

> 「采用，更新云端，然后等待。每20分钟重新确认是否可以继续新任务。」

Reading translation: adopt it, update the cloud, then wait. Recheck every20 minutes whether new tasks can continue.

### 7.2 Effect

1. STYLE_SELECTION closes. Adopted C″ is revisedC at aea8361c07c003f6f519829b6c1a208c20bccab1,CI36863682166 success. Under completion gate it is UI101..103's sole direction: C theme, approved compact HUD density, Japanese sci-fi anime register and Home assistant slot.
2. Cloud update verified: Digital-City origin/main=a99a496,Utopia candidate branch=aea8361,both worktrees clean,origin..HEAD count0,no unpushed content.
3. Wait/recheck20minutes means bounded rescan under rules§5.1/§6: Alien waits cheaply and rescans the global pool approximately every20minutes for eligible claims.

### 7.3 Explicit boundary: Owner adoption does not complete independent two-host review

Adoption is of the style direction. Alien authored currentC″ under Owner's direct Development assignment, and independent review has not occurred:

```text
revision_review_host_required = Mech      （未变）
review_covers_revision_head   = false     （未变）
```

§3 requires Development/Review on different physical hosts. Adopting a direction alone cannot satisfy it; Alien cannot self-review merely because Owner said adopt. Record honestly without silent absorption.

### 7.4 Waiting wake conditions

```text
wake_1  Mech 完成 C″ 独立复核  -> Alien 可领取后续（UI-101 的前置随之满足）
wake_2  Owner 新裁决 / 新工作书
wake_3  其他主机完成任务使 UI-101..103 解除依赖门
rescan  约 20 分钟一次（§5.1 兜底，不 busy-poll）
```

The raw wake record lists Mech completing independent C″ review (enabling Alien/UI101),new Owner ruling/workbook,other hosts closing dependency gates, and roughly20minute fallback rescan without busy polling.
