# Research Evidence Protocol / 研究素材强制留存

> **状态：ACTIVE / NORMATIVE FOR REX PROGRAMME**
>
> 目标：把 Research Fabric 的开发过程和它产生的实验数据都变成未来论文、artifact、PhD research statement 可复查的证据。

## 1. 两类素材必须同时保存

### A. 工程过程素材

包括：

- command/runtime error；
- test / CI failure；
- browser / Android / Windows failure；
- race / timeout / stale state；
- wrong assumption；
- design conflict；
- Development / Review disagreement；
- rejected design；
- measurement-tool defect；
- repair before/after；
- exact SHA / configuration。

### B. 研究实验素材

包括：

- experiment manifest；
- topology；
- independent/dependent variables；
- run seed；
- repetition index；
- software/config SHA；
- device/provider/model identity；
- start/end timestamps；
- task/action/event refs；
- latency；
- retry；
- handoff；
- failure/recovery；
- Owner intervention；
- resource observations；
- outcome；
- exclusion reason；
- normalized row；
- artifact digest。

## 2. 存储层次

### Raw runtime

```text
Utopia/.runtime/evidence/mission-book/<REX-ID>/<run-id>/
```

保存完整但本机 git-ignored 的原始证据。

### Selected shared evidence

```text
Utopia/evidence/raw/mission-book/<REX-ID>/
```

只提交有界、非敏感、可复查的：

- failing/passing pair；
- structured receipts；
- experiment samples；
- fault campaign results；
- timing tables；
- review falsification；
- replay diff；
- screenshots。

### Evolution events

继续使用现有 event contract，不私造 eventType。

### City research index

每个任务必须：

```text
Digital-City/mission-book/reports/<REX-ID>/PAPER_MATERIAL_INDEX.md
```

programme 最终必须：

```text
Digital-City/mission-book/reports/REX-PROGRAMME/RESEARCH_MATERIAL_SYNTHESIS.md
```

## 3. 不允许只保留成功实验

每个 campaign 必须保留：

- successful runs；
- failed runs；
- excluded runs；
- infrastructure failures；
- measurement failures。

数据排除必须有机器可读 reason，不能因为“不好看”删除。

## 4. Measurement defect 独立分类

若错误来自：

- test harness；
- clock；
- trace collector；
- parser；
- stale log；
- replay driver；

必须标：

`MEASUREMENT_DEFECT`

不得算成 product defect，也不得静默修掉。

## 5. Quantitative minimum

能量化时必须记录数值，不接受只写：

> improved / faster / stable

应记录例如：

- completion_time_ms；
- recovery_time_ms；
- handoff_time_ms；
- owner_intervention_count；
- retry_count；
- failure_rate；
- duplicate_execution_count；
- lost_event_count；
- convergence_time_ms；
- successful_runs / total_runs。

指标不存在或无法测量时也要写 `NOT_MEASURED + reason`，不得填 0 冒充。

## 6. Defect chain

所有有价值 defect 尽量保存完整链：

```text
OBSERVATION
→ REPRODUCTION
→ ROOT CAUSE
→ REPAIR
→ REGRESSION GUARD
→ OPPOSITE-HOST VERIFICATION
```

## 7. Completion gate

任一 REX task 缺以下任一项不得 complete：

- DEVELOPMENT_REPORT；
- REVIEW_REPORT；
- PAPER_MATERIAL_INDEX；
- required evolution events；
- exact-head CI；
- exposure-decision evidence；
- required experiment/raw pointers。

REX-890 必须生成 programme synthesis，归纳可直接用于论文的方法学、失败分类和 quantitative findings。
