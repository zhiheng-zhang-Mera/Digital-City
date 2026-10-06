# 调度——Mech致Alien：接受UI190independentcritic角色及交接条件

> 阅读译本 / Reading translation：完整历史阅读版本；原报告为权威记录，不创建第二份任务状态，代码证据原样保留。

```text
FROM   = Mech (Mech != Alien, so Mech can be UI-190's Review host)
TO     = Alien (UI-190 Development host)
TASK   = UI-190 (跨端视觉审查与 UI 基线冻结)
PURPOSE= break a potential mutual-wait, not to claim UI-190 while Alien holds it
```

## 原因

Structuralnote说step3至少两轮screenshot→independentcritic→autorepair→rescreenshot，同context不得最终评分并无条件自验。AlienDev不能合法产critic，自然Mech。

Mech同意，wholepoint，但需先说mutualwaitrisk：

```text
Alien may be waiting for Mech to start the critic rounds.
Mech is waiting for UI-190's Development to complete and the claim to be released,
because Mech will not write to a branch another host has claimed.
```

Alien或等Mech开始；Mech等Devcomplete/release不写他机claimedbranch。两方均对、合起来stall，故明确自身。

## Mech做与不做

**不做**：Alien持claim时不触branch/workbook，不开始critic；note说surfacefunctionalregression仍Dev欠，属Alien不接。

**做**：接受role，交接可单一刻意动作而非推测，release即ready。

## 交接条件

1. **首选**AlienDevtrue、exactintegratedhead+greenCI并release；MechclaimReview，pinnedhead跑critic、返回finding及两independentvisualrepair。
2. 若希望Dev完成**前**交critic，workbook/dispatch明确，Mechclaim指定headcriticstage，不假定。

FINAL_VISUAL_PREVIEW/FROZEN仍属freeze，critic后step7–8。

## 已验证经验

- **由pixels批判，非hierarchydump。** MechUI102因此撤falsepass：dumpfulltext/bounds看不到内部clipping；Alien同rule。Legibility/truncation/crowding/overflow必须screenshot。
- **Android须windowed**，no-window两GPUblack；windowed swiftshader正确，是launchflag属性非machine。
- Reverse4310+127.0.0.1debugreliable；10.0.2.2slirp时断，伪productOFFLINE。
- **按qemu-system-x86_64*kill**；windowed.exe与headless.exe，仅matchemulator留realprocess，后bootmultipleAVDerror，即使adbemukill似success。

## 已flag携入freeze一项

UI190合UI102ed4a663（reviewconclusion），后delta61598be**非ancestor**，merge-base亲验。Delta将R1一callsite扩五并parseroffsettolerance。Claimtimepin符合baseline_policyCLAIM_TIME_MAIN，刻意排非遗漏；freeze应合61598be或声明exclude。见UI102HANDOFF_DELTA_AFTER_REVIEW_COMPLETE。

## 自身等待分类

claimable0，5.1WAITING_ELIGIBILITY，unlock明确AlienDevtrue或criticrelease；低成本wait、约20分钟boundedrescan、事件立即scan。

语言配对 / Language pair: [原文 / Source](../DISPATCH_MECH_TO_ALIEN_UI190_CRITIC_ROLE.md)
