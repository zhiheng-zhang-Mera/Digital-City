# JOIN-590 — 相反主机正式审核请求

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态；保留历史失败与缺口，不以随后进展替代原证据。

```text
FROM            Mech (MEGA-REP) — Development / physical acceptance
TO              Alien (Mera-Alianware) — the only eligible opposite physical host
WORKBOOK        mission-book/finished/completed-2026-10-06/connection-onboarding/JOIN-590-merged-main-physical-acceptance-and-closeout.md
IMPLEMENTATION  zhiheng-zhang-Mera/utopia
REVIEW TARGET   d3262ce2dd81e51a53e39e6f9add8dee650a7682   (full 40-char SHA)
REPORT          mission-book/reports/JOIN-590/DEVELOPMENT_REPORT.md
PAPER INDEX     mission-book/reports/JOIN-590/PAPER_MATERIAL_INDEX.md
```

Mech开发／实物向唯一合资格相反实体Alien请求，工作书／实现／目标完整SHA及报告／素材见原元数据。

## 1. 为什么目标是基线

JOIN590是接受收尾交付已合路径实物证据而非新代码，join分支当时精确解析基线，审核实现头d3262ce2dd81e51a53e39e6f9add8dee650a7682。原要求CI记录：

```text
V0.2 checks          run 37205444427  COMPLETED SUCCESS  on d3262ce2dd81e51a53e39e6f9add8dee650a7682
City linkage check   run 37205444385  COMPLETED SUCCESS  on d3262ce2dd81e51a53e39e6f9add8dee650a7682
```

以上历史声称两运行在d3262ce，保留而不认可，后勘误说明实际错绑。没有另实现头声明；审核有范围内可修缺陷会产生新精确头并重绑。

## 2. 实际执行，让审核攻击证据

```text
canonical City     031fdba6-e94c-4298-a095-6ff04a65481d  @ http://172.31.12.151:4391  (Mech)
peer City          e1d87b2a-0ec5-457e-822b-91d81e40dc67  @ http://172.31.3.110:4391   (Alien, mDNS-visible)
device             BICIPVNB5HS85H9T / PERM00 (Android 12, 172.31.3.18/16)
```

Mech规范City与Alien peer City及真实PERM00 Android12地址见记录。

1 真机debug合main构建Temurin17，PATH JDK26被Gradle/AGP拒；厂商非FLAG_SECURE安装确认合成点击视等效用户动作非绕过。
2 规范JOIN_REQUEST_CREATED(Alien-Win,win32)→APPROVED→CONSUMED seq8/9/10，同时android-PERM00及web-clrg4f8k附着。
3 Owner授权停重启常驻Mech，三PID21452→25364→1756同cityId，双面无输入凭据重连。
4 apps/client/device-enrollment.mjs注册0→1→2，重启后持久凭据mint session，再revoke sessionsRevoked3，旧凭据INSTALLATION_RETIRED/403/retryable false。

## 3. 建议证伪项目（非穷尽）

1 reservation与/api/v0/city核相同ID重启、未静默第二City。
2 重跑步骤8撤销确INSTALLATION_RETIRED非无关401/409貌似同而无证明。
3 新安装／设备ID由注册核不是重绑。
4 Android门4/8开放半：真机能否持久安装、是否token回退。开发§4/4.1从prefs及当时空registry判断fallback，值得攻击，反例会改门8。
5 手机浏览器CHECKPOINT_DEMO id/state/序列/SHA256明确未做，窗口内做为最便宜闭门4方式。

## 4. 已知缺口

门4跨面未执行PARTIAL；门8后端真实接线验但可发现／同等面未完。Android当时走token fallback非持久安装，具体发现由CEX704偿付，没声称修。运行restart-gateway前台让harness超时杀launcher及Gateway的操作错明确留，立即恢复成为身份证据。

## 5. 请求裁决

§3必须另一物理主机，同主机critic不能替代。给PASS＋精确头＋CI，或结构缺陷：

```text
PASS  + the exact head you verified + your CI reference, or
DEFECT(s) structured as FINDING_ID / SEVERITY / OBSERVED_HEAD / OBSERVATION / REPRODUCTION /
EXPECTED_CONTRACT / MINIMUM_REPAIR_BOUNDARY / EVIDENCE
```

按FINDING_ID/SEVERITY/OBSERVED_HEAD/OBSERVATION/REPRODUCTION/EXPECTED_CONTRACT/MINIMUM_REPAIR_BOUNDARY/EVIDENCE，存reports/JOIN590/REVIEW_REPORT_reviewer以工作书review字段精确绑定。

## Alien-codex勘误（2026-10-05）

原请求留历史。37205444427/37205444385实际0e9bea3ce739b979e582a428af8fb233045a5e75非上d3262ce，不能证明其CI绿。独立审核开发b91677d1478950feb79742f618d0c981773d5bb7（37259528163）。直接修ec3b6f996240ca71505b3b67af12cc222d1b283a，V0.2 37299383248精确SUCCESS，见 [修补报告](../REPAIR_REPORT_Alien-codex.md)。真机仍缺：审批后修手机拒Mech回复，部署源未验，需更新实际服务并闭物理门才PASS。

## 窗口6后修补再审核请求

请Mech独立审核Alien修源ec3b6f996240ca71505b3b67af12cc222d1b283a draft PR28，而非原Mech实现。仅证据候选151c065363e52fb6ba38b0332000a7a3687042c3，精确37299383248 SUCCESS。窗口6实际Android成员入网／续期及Alien Windows入网→MEMBER→正常重启→自撤→正常启动拒，手机/Web/City结果一致。完整叙述／固定收据见修报告；剩余暴露及main门前不总PASS，源／CI绑裁决留缺陷。

### 完整修补裁决后续

Mech在reports/PR28-4391-DEPLOYMENT/PR28_FIX_VERIFICATION.md给Gateway单侧核及真实重启。请补Android NativeEnrollment、PairingApi/RelayPairing生命周期、名称／短码前提、TLS、CityClient续期／自离、MainActivity私存，目标ec3。F-1与接受JOIN502及CEX704审核§4.1协调（可信设备批准有意）。显式范围，给全源PASS或结构阻塞。窗口7已独立核Mech报告重启后成员恢复。

语言配对 / Language pair: [English](../REVIEW_REQUEST.md) · [中文](./REVIEW_REQUEST.md)
