# MON-990 Formal Review领取 — Mech

> 阅读译本 / Reading translation：只供阅读，不是第二份权威工作书／状态。保留历史与未知边界，原证据块代码围栏保留，不新增验收。

Mech MEGA-REP/Mech-DS，领取不同实体主机Formal Review，author Alien。remote tip精确目标实测同。claim所在control main3ebc43259ba494f70b32b4ca17b5156c344e0d27；无merge权威、不释放V1 marker、不以作者test作证据。

```text
CLAIMANT            Mech (COMPUTERNAME MEGA-REP), role Mech-DS
ROLE CLAIMED        FORMAL_REVIEW (opposite physical host)
REVIEW TARGET       fb042d9b1c7026cb2e6a010e2a7ad38a82a5cb40
                    branch mon/MON-990-Alien-20261006; remote tip equals that commit (measured at claim time)
DEVELOPMENT_HOST    Alien  -> the reviewer host is a DIFFERENT physical host, as CONSTRUCTION_RULES section 3 requires
CLAIMED AT MAIN     zhiheng-zhang-Mera/Digital-City main 3ebc43259ba494f70b32b4ca17b5156c344e0d27
MERGE AUTHORITY     none. This claim does not merge, does not release CITY_WORK_MONITOR_V1_ACCEPTED, and does not
                    accept the author's own test results as evidence.
```

## 领取时测量（任何判定前）

```text
workbook review_host                            null  -> the review was UNCLAIMED when this claim was written
workbook development_host                       Alien, development_complete true, execution_enabled true
development_head_sha                            fb042d9b1c7026cb2e6a010e2a7ad38a82a5cb40
remote tip of mon/MON-990-Alien-20261006        fb042d9b1c7026cb2e6a010e2a7ad38a82a5cb40   (git rev-parse, exit 0)
implementation main at claim time               213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef
ancestry, all three measured with git merge-base --is-ancestor (exit 0 each):
    accepted MON-902  f4988248a3316806fc2e3fa9e62864ed129fe7b3   reachable from the reviewed head
    accepted MON-903  3cd32c60d8e9beb9df961e6b7ff193a3f69ec224   reachable from the reviewed head
    main              213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef   reachable from the reviewed head
exact-head check runs re-read one at a time from the Actions API for fb042d9, matched on headSha:
    push          37420061997  COMPLETED SUCCESS attempt 1
    pull_request  37420065177  COMPLETED SUCCESS attempt 1
    linkage       37420065178  COMPLETED SUCCESS attempt 1
```

完整中文对应review_host null未领取，dev Alien/complete true/enabled；dev SHA与remote tip一致；product main213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef；accepted902 f4988248a3316806fc2e3fa9e62864ed129fe7b3、9033cd32c60d8e9beb9df961e6b7ff193a3f69ec224、main均祖先exit0。三个fb042d9精确Actions逐次headSha匹配SUCCESS attempt1。两依head评审知其内部：902接受head是自身repair target后继，903含自身四sibling发现；这是context不是证据，下面不依author numbers。

## 独立性证明，非声称

workbook dev Alien，claim Mech不同物理机，非author。作者exact SUCCESS/实体Android-Web视为待重测主张，不证据。

## 此review是什么，必须自行构造什么

990闭环十一必需对账：overview对task、node owner/host/model对runtime、edge对handoff/retry/review/routing event、receipt对实际transition、risk bubbling不藏failure、JEV/monitor不可用无关task继续、timeout仅target、Registry对runtime/UI、Web/currentAndroid parity、大graph collapse/filter/stable、常规diagnosis2–3交互到exact。另research synthesis/V1 marker。

仪器计划须记录结果，含失败：

```text
V1  Independently manufactured runtime probes for the checks that can be driven on a real Gateway on this host,
    rather than re-running the author's suite and calling the number reproduced.
V2  An adversarial attempt on the property this programme has repeatedly found false: that a summary cannot look
    safe while an active risk exists, and that absent coverage metadata is treated as a finding rather than as zero.
    The reviewer's own sibling-class findings (F-S1/F-S2/F-S6/F-S8) are the reason to look again here.
V3  Cross-device parity stated as what was actually exercised, with the Android native/physical side either
    reproduced on this host or declared NOT_RUN with the reason.
V4  Registry reconciliation: CAP-MON-001/002/003 against what the running City and the Web surface actually do.
V5  A re-measurement of the author's claimed numbers, so the report states which of them were reproduced here and
    which were not.
V6  The completion-gate question this task inherits: whether the marker may be released at all, given that
    MON-990's own workbook requires runtime/UI reconciliation and an opposite-host review, and the reviewer must
    say plainly what is unmeasured.
```

完整中文对应V1独立真实Gateway runtime probes非重跑author称复现；V2攻击反复不真属性safe summary/active risk、缺coverage是finding非0，自身F-S1/2/6/8促再查；V3跨device只声明实际驱动，Android复现或NOT_RUN理由；V4三Registry对running City/Web；V5重测author数、明确复现/未复现；V6继承gate marker是否可释放，要求runtime/UI+对侧review，plain声明未测。发现及不能复现项发表于exact-target REVIEW_REPORT；仅报告且review pass后才释放marker。

语言配对 / Language pair: [English](../REVIEW_CLAIM_Mech.md) · [中文](./REVIEW_CLAIM_Mech.md)
