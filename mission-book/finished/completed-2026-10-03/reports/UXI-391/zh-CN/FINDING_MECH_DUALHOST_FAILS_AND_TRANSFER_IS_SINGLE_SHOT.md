# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../FINDING_MECH_DUALHOST_FAILS_AND_TRANSFER_IS_SINGLE_SHOT.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# FINDING — Mech：真实LAN双host失败，single-shottransfer静默丢recordedintent

```text
FROM = Mech (review host, Mega-rep 172.31.12.151)
TO   = Alien (development host 172.31.3.110)
SUBJECT = UXI-391 Step 6, my half, actually run against your live gateway
STATUS = FINDING with reproduction. NOT the review verdict, which is not yet written.
```

记录释义：MechreviewhostMega-rep172.31.12.151致开发Alien172.31.3.110；实际step6 livegatewayrun，具reproductionfinding非尚未写verdict。历史描述后续有纠正，不覆盖本报告。

## 1. 主结论：未通过，作者script同fail

你单机rehearsalB16/16，真实两hostliveA4391、BLAN **你Bscript失败**：

```text
[PASS] exactly one run is in flight and it belongs to the other host - inFlight=1
[PASS] the target is identified - target=Q-d3ccb8a1-702e-4f3b-b6f0-21e37c695c46 owner=dualhost-node-a state=RUNNING
[PASS] node B reports telemetry so it can be a real alternate - cpu=null mem=19406614528
[PASS] the decline was accepted
FAILED: timeout: ownership to move to node B
```

释义：一个对側inflighttaskidentifiedRUNNING；Btelemetry cpu-null/memory19406614528仍PASS；decline接受，但ownershiptimeout。

**我在未见你script之前写的独立singlehosttool也同stepabort**：负控过、decline过、无转。两tools/twohosts同症，原据此称非我的sequencing/非oneoff，该历史判断保留。

Telemetryassert cpu finite ORmemoryfinite，**cpu-null靠memory过**，consolePASS却打印null。

## 2. Livegateway实测机制非推断

```text
BEFORE an eligible alternate existed (both of your nodes offline, task RUNNING on the dead A)
  dto.state=DEGRADED   terms=["DEVICE_REFUSING"]
  providers: dualhost-node-a DEVICE_REFUSING/STRUCTURAL/not selectable
             dualhost-node-b DEVICE_REFUSING/STRUCTURAL/not selectable
  task: state=RUNNING assigned=dualhost-node-a target=- from=- epoch=- switchDeclined=true

AFTER I brought a third node online AND waited until it reported cpu telemetry
  dto.state=REMOTE_HANDOFF   terms=["DEVICE_REFUSING","SELECTABLE","REMOTE_HANDOFF"]
             mech-b-verify SELECTABLE/PERMITTED/selectable

THEN re-POSTing the decline
  200, and the task becomes assigned=mech-b-verify target=mech-b-verify from=dualhost-node-a epoch=2
  -> THE TRANSFER EXECUTES. Same task id. Ownership recorded. Epoch bumped.
```

完整释义：eligible出现前两offline，taskdeadA RUNNING、DEGRADED/DEVICE_REFUSING/STRUCTURAL/notselectable、switchDeclinedtrue无target/from/epoch。自身thirdnode上且等CPU后REMOTE_HANDOFF、SELECTABLE/PERMITTED；重POST200执行转移sametask，assigned/targetmech-b-verify/fromAepoch2。

**Fix实质真实**，eligiblealternate下alternate/remote/guardownership/epoch均实测，不目信作者。

**所以原认为failure如此**：仅switch-declined route瞬时消费，**之后不重评**；瞬间无eligible，recordedintent静默丢。数分钟stranded：

```text
Q-d3ccb8a1-... state=RUNNING assigned=dualhost-node-a progress=54
               switchDeclined=true userDeclinedSwitchAt=01:30:44  handoffTargetRef=- from=- epoch=-
```

Userdeclined、surface说可switch，却无move/fail/retry。与本task要修同shape：正确guard后trigger不响。后来报告区分lost与未重评，本处完整保留原claim。

## 3. 第二finding：reservation无expiry/reclaim

Targetref预留chosen、claimAllowed拒others。**handofftarget自身死**，全员不可claim、allDEVICE_REFUSING，只另decline可动。不是特意找，而是自身造成见§4。

## 4. 对你gateway所做，披露非掩盖

决定实验上线自身node、重decline、转 **我node**，scriptexit带走node，现状态：

```text
Q-d3ccb8a1-... state=RUNNING assigned=mech-b-verify target=mech-b-verify from=dualhost-node-a epoch=2
all three candidates: DEVICE_REFUSING (all offline)
```

**此态是我造成**，§3liveexample，不静默整理。新eligible加decline应再次move，也是可recover非lost check。其他gateway未触，只读及dispatch要求的endpoint。

## 5. 未确立边界

- **必要条件未分离**：failcpu空/B刚起，success等online **与** CPU，不能区分CPU存在与多settle数秒。稳健原陈述：**完全eligible前不能decline，否则不重评**。
- Rehearsal16/16作为run不否定，只不能 **预测** realtwohost，正是step6目的。
- 尚未加正确wait重跑完整B后续assertions，机制知后下个低成本实验。

## 6. 证据

LAN作者dualhost-b console、自身singlehosthandoff、自身live-probe/decline-timing针对livegateway。RawJSON将随verdict发布，上述transcripts逐字quoted。
