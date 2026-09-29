# Autonomous Environment Explorer — 自主环境探索器 / 视觉世界模型自动化

```text
STATUS = PRE_ALPHA_STARTER
REPOSITORY = https://github.com/zhiheng-zhang-Mera/Auto-Game-Bot
SOURCE_SNAPSHOT = 9b9a0cd9a3be944d79992b9a7870d0f631390152
```

## Role

Maintain a structured model of an external visual environment, explore unknown/stale areas, compile stable knowledge into deterministic routines, and verify completion rather than merely replaying actions.

## Target capability clusters

- DISCOVER / LEARN / COMPILE / RUN lifecycle;
- static map config vs runtime belief/state;
- hybrid navigation and semantic recovery;
- semantic skill library + game/environment adapters;
- observation → verified world-state commit;
- causal interaction/state model;
- coverage graph, frontier exploration and miss-risk;
- multi-view verification and adaptive rescan;
- completion-confidence gate;
- hot/evidence/debug visual-data lifecycle;
- session compaction and retention;
- config compilation and localized relearning.

## Honest current implementation

Current repo provides:

- installable Python starter;
- guarded phase/state-transition contract;
- CLI surface;
- state-transition tests.

It does **not** yet provide real screen perception, game adapters, physical input control, autonomous control discovery/learning or validated performance.

## Relationship to Computer Use

This building is a higher-level planner/world-model/verification layer. 10/01 Computer Use is the bounded low-level action runtime. They are complementary rather than duplicate.
