# JOIN-590 — 论文素材索引

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态；所有历史、矛盾、失败及未知边界保留，元数据仅代码围栏引用。

> §14B及Connection Onboarding过程数据规则要求。仅可观测事实，不复制凭据、短码或长效token。

## 1. 适用决定

```text
research_evidence_applicability = APPLICABLE
long_horizon_context_evidence   = CAPTURED
state_identity_evidence         = CAPTURED
research_evidence_refs          = §6
```

APPLICABLE、上下文及身份CAPTURED、引用§6。§14B两理由均满：长异步agent跨双物理主机，同时本身物理接受，自然产生只真机缺陷、重启时序、发现延迟和旧状态观测。

## 2. 外部状态引用

```text
control_repo    zhiheng-zhang-Mera/Digital-City @ main
implementation  zhiheng-zhang-Mera/utopia
workbook        mission-book/finished/completed-2026-10-06/connection-onboarding/JOIN-590-merged-main-physical-acceptance-and-closeout.md
report          mission-book/reports/JOIN-590/DEVELOPMENT_REPORT.md
branch          join/JOIN-590-merged-main-physical-acceptance
baseline_sha    d3262ce2dd81e51a53e39e6f9add8dee650a7682
claim_commit    98137af
canonical_city  031fdba6-e94c-4298-a095-6ff04a65481d (Mech, 172.31.12.151:4391)
peer_city       e1d87b2a-0ec5-457e-822b-91d81e40dc67 (Alien, 172.31.3.110:4391)
device          BICIPVNB5HS85H9T / PERM00 (Android 12, 172.31.3.18/16)
```

控制／实现仓库、工作书／报告／分支／基线、领取98137af、规范Mech与peer Alien两City及真机地址全部明确绑定，不混身份。

## 3. 身份、来源、新鲜性

```text
expected_identity       canonical City cityId 031fdba6-… plus the workspace's immutable baseline SHA
resolved_identity       read back from the live host reservation and /api/v0/city after each restart
evidence_identity       the City's own event stream seq 1..18 (JOIN_* + CITY_STARTED + CLIENT_CONNECTED)
provenance_relation     baseline ancestors verified ANCESTOR_OK at claim time; the accepted heads of
                        JOIN-501/502/503 are ancestors of d3262ce2
freshness_revalidation  the City's state was re-read after every interruption instead of being carried forward
drift_classes_checked   MUTABLE_REFERENCE_STATE_DRIFT      -> the peer City (Alien) appeared on the LAN mid-session
                                                             and was resolved by address, not assumed
                        EVIDENCE_POINTER_MISMATCH         -> the first "three machines are linked" statement did
                                                             not say which City; the claim was resolved to
                                                             031fdba6 only after the user named it explicitly
                        STALE_EXECUTION_IDENTITY          -> the resident gateway PID changed (21452 -> 25364);
                                                             cityId and dataDir were re-verified as unchanged
                        PROVENANCE_RELATION_MISMATCH      -> none
```

期望规范City加不可变基线，每重启从reservation/API回读；证据规范seq1..18；领取时祖先ANCESTOR_OK且JOIN501/502/503接受头属d3262ce祖先；每中断重读不沿旧状态。peer City会话中出现按地址解；起“三机已连”没指定City，用户明确后才绑031fdba6；PID21452→25364重核City/data不变，无来源关系错配。

## 4. 可引用事件

**I1 三City一LAN、未命名对象声明。** 用户三机手动连属真却没指定City。LAN有常驻031fdba6、任务临时1d5287bf、Alien e1d87b2a；绑错接受无价值，询问后读规范解对象。模糊外断言是待解指针不是证据，成本小于错身份验收。

**I2 真硬件才见环境限制。** PATH JDK26被AGP拒，用缓存Temurin17；厂商安装确认非FLAG_SECURE，合成点击是用户等效非绕过；软键盘挡Connect坐标误点键盘。UI/几何单测不见，CEX704须IME开时主动作可达。

**I3 超时前台launcher杀City。** restart前台harness超时连Gateway杀，立即同City恢复，规范身份保而PID变。保操作错，不混“重启失败”：重启成功、launcher生命周期管理错。

**I4 活界面非已入网安装。** android-PERM00 CONTROL_ONLY、安装registry空、prefs host/clientRef/cityId/token为工程fallback。批准JOIN属Alien-Win别入者，手机token连。连接与安装暴露缺口正是CEX704债。

### 4.1 后续真机端到端配对交换

规范City新session经Settings→配对→Nearby LAN消耗，实测USED、安装count0、手机断连重连、prefs仍裸四字段。

**I5 动作完成不等持久状态创建。** session真消耗、面真重连，却无安装；若停自然可见配对成功会误记录不存在的入网PASS。交易真成功信号可能对状态假，完成须持久registry读。

**I6 重启面自恢复且诚实两主机。** 无输入回来，Devices Alien-PC OFFLINE Cached445s、Mega-rep ONLINE2s，真实snapshot；两者全在线更讨好却不诚实，陈旧处理可见。

## 5. 定量证据

```text
lan Cities visible from the phone            3 (two on Mech, one on Alien)
mDNS discovery rows observed                 3, all MDNS_DNS_SD, stale=false
onboarding chain latency (canonical truth)   JOIN_REQUEST_CREATED 01:24:35.805Z
                                             JOIN_REQUEST_APPROVED 01:24:46.807Z   (+11.0 s)
                                             JOIN_REQUEST_CONSUMED 01:24:47.003Z   (+0.2 s)
gateway restart -> both surfaces reconnected CITY_STARTED seq 11 / CLIENT_CONNECTED 13,14  (and 15..18 on a second cycle)
canonical members after restart              3 (PRIMARY + web CONTROL_ONLY + android CONTROL_ONLY)
installation registry count                  0   <- the finding in I4
android unit tests + APK build               BUILD SUCCESSFUL in 3m09s (testDebugUnitTest + assembleDebug)
```

手机LAN三City（Mech两、Alien一）、mDNS三MDNS_DNS_SD/stalefalse；规范创建01:24:35.805Z、批准46.807Z约11s、消费47.003Z约0.2s。启动seq11后13/14双面，第二15..18；成员3 PRIMARY/Web+Android CONTROL_ONLY、安装0；构建3m09。仅单观测不是质量分布。

## 6. 研究主题

```text
.../paper-materials/{en,zh-CN}/
  LONG_HORIZON_AGENT_CONTEXT_LIFECYCLE_2026-10-05.md
  LONG_HORIZON_AGENT_STATE_IDENTITY_PROVENANCE_FRESHNESS_2026-10-05.md   <- I1, I3
```

生命周期与身份来源新鲜性2026-10-05，后者I1/I3。

## 7. 声明边界

无压缩/token，harness不露且未压缩，未知原因；无性能／发现延迟质量，两延迟单样非分布；I1–I4自然非因果，§14B.5须控制重放；无任何控制/node token或配对短码值。

Alien相反主机固定b91677d1478950feb79742f618d0c981773d5bb7独立实际Gateway发现Android-shaped relay Owner凭据、0安装、TLS丢、双NAT无支持、闲码门、旧CI指针，见 [审核](./REVIEW_REPORT_Alien-codex.md)及independent-review-probe。初手机缺／Mech超时，门NOT_RUN；不推延迟NAT性能。

[真机延续](./PHYSICAL_REACCEPTANCE_Alien-codex.md)固定源与隔离APK78e28b95，保签名／夹具失败、空码门及审批等，后审批／重连／撤销未验；同LAN非跨区NAT。

[窗口2](./PHYSICAL_WINDOW2_Alien-codex.md)保join-eab97ea241、限时无凭据、未经命令mdns变试验及不同trial后重试；原因未知无成功声明，脱敏UI／原生边界保留。

[窗口3](./PHYSICAL_WINDOW3_Alien-codex.md)批准、app重启、一个任务phone/Web/规范id/state/hash/seq记录；成员入网／撤销／NAT仍不完。原工件按政策移ddf7e1aa0d0978f80bf1357306378c8595fe58f7，软件仍b91677d。

[直接修补](../REPAIR_REPORT_Alien-codex.md)源ec3b6f996240ca71505b3b67af12cc222d1b283a，干净CI37299383248全1248/1248、Android91、原生形注册／重启／撤销，候选0ea9203d3409a59194675d48d93950c7af9fb92f。保活主机测试扰及恢复、第四超时、第五批后不完整拒、部署源未知；受控重启／CI不升Mech真重启／撤销。

2026-10-05窗口6实际命名Android/Windows成员、进程重启无手填续期、自撤／拒重启、手机定向CHECKPOINT_DEMO同Web hash。固定151c065363e52fb6ba38b0332000a7a3687042c3，软件ec3分开；负探针边界见修报告。当时Mech City重启、精确运行源、相反修审核、暴露/main、真NAT仍未验，保历史状态。

语言配对 / Language pair: [原文 / Source](../PAPER_MATERIAL_INDEX.md) · [译本 / Translation](./PAPER_MATERIAL_INDEX.md)
