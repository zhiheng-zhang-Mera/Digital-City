# UPT-PRE-ASSISTANT 验证报告

[English authoritative source / 英文权威原稿](../VERIFICATION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

> 工作簿：ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md 第8节（T4）
> 约束裁决：response-9-30.md#R12（阶段）与#R13（单主机豁免）
> 验证者：没有编写任何实现的独立agent会话
> 实现主机：Alien（MERA-ALIANWARE）

## 0. 明确说明独立主机限制

工作簿偏好两真实主机，仅一台可用时分支应不合并并诚实报告限制，除非Owner豁免。仅本机可用，Owner在response-9-30.md#R13明确豁免。

**这是单主机验收。** 验证者与实现同物理主机、同provenance.host、同gateway process。只有LAN上的Android是真正独立硬件，因此设备部分是真多机器，主机部分不是。两个独立agent会话运行于此：agent独立、host不独立。下方任何内容不作双主机验证。

豁免未放宽：验证者读任何实现artifact之前自写自跑probe；可且确实作REJECT；REJECT须全面修复、新SHA重验证；分支和merged-main CI须绿。

## 1. 第一轮 adce593：合并判定REJECT

独立findings文件.runtime/evidence/mission-book/UPT-PRE-ASSISTANT/T4-FINDINGS.md，probe／transcript在.../UPT-PRE-ASSISTANT/verifier/。

### 真实执行通过项

- **启动。** 一次支持启动带起Gateway／Agent／Room Hub；二次是restart非copy，各恰一，靠raw process inspection而非launcher自报。Gateway 172.31.3.110:4310，hub仅127.0.0.1:4320。
- **Rooms。** Web Home列十Rooms，打开真实使用Room，Knowledge API在embedded frame内回200。杀hub后Web／Android均真实原因UNAVAILABLE。hub DTO字段不在Android model、不在安装APK dex，设备无请求hub port。
- **Action facade。** ROOM动作得真实record id；CAPABILITY得真实bridge invocationId／digest且历史存在；CITY_TASK以真实task／result核对QUEUED→RUNNING→SUCCEEDED；拒绝仍REFUSED；route BOSS→400。
- **Ask／Do。** API与真实浏览器验八行为：文档摄取、知识查询（有意歧义→两候选→选择）、checklist、bookmark、hash、证据审查、副作用确认、未匹配→16目标manual picker。Router来源始终DETERMINISTIC_RULES／deterministic:true／llm:false。
- **范围审计。** 恰十Rooms，无persona、routing无model call、无BOSS／HNS可达路由、无新Room、arbitrary shell、domain integration；全分支唯一新增依赖为test-scope org.json。

### 阻断发现

**F.1：正确gateway响应下Android Action列表永久不可读。** 通过logging relay捕获app自身traffic，GET /api/v0/actions?limit=50回HTTP200及有效{apiVersion,schemaVersion,actions:[…]}。设备显示“The gateway returned an unreadable Action list”，包括pm clear后共复现三次。Bytecode显示client用object reader拆envelope后又读不可能存在的第二层actions；manual target picker同错。Android unit tests因直接调用parseActions(rows)、未走envelope而通过。

后果：WEB_ANDROID_ACTION_PARITY不能标绿，T4不能接受T2。

### 其他发现

| # | 发现 | 处置 |
|---|---|---|
| F.2 | /api/v0/health恒healthy，supervisor看不见dead hub | 修复 |
| F.3 | 两已交付client均无idempotency key，重试执行两次 | 修复 |
| F.4 | 同key不同request静默回原Action | 修复 |
| F.5 | task完成后provenance.cityTaskState仍QUEUED | 修复 |
| F.6 | Web收到loopback hubUrl，Android证明没有；hub UI无auth | 记设计边界，未修 |

本机无法闭合：City task无eligible node的UNAVAILABLE路径（总有合格node）、Android manual picker／Action detail（F.1阻断）、当时分支托管CI。

## 2. 第二轮85ecde4：合并判定ACCEPT

同独立验证者在重建重装APK上对抗重跑全部修复，而非仅确认。第二轮在T4-FINDINGS.md，首轮逐字并列保留。

### F.1已修，设备为权威

此SHA gradlew :app:assembleDebug、adb install -r后，force-stop→launch→Action渲染真实记录ACTIONS(35)、status／intent／route／progress／summary／actionId，无unreadable。用**新内容**重证parity：仅API创建A-dcfc48fd-f7e6-49e1-b322-53d3e47b7487、ROOM/hash、SUCCEEDED，刷新设备出现且digest同。manual picker也修：NO RULE MATCHED→Show all targets→真实MANUAL TARGETS。源检查panel／DTO中的payload(...).optJSONArray(...)为零。

### F.2已修

只杀hub：HTTP200 status degraded，rooms state UNAVAILABLE、reason为room hub is not reachable on loopback (ECONNREFUSED)、hubUrl:null；重启healthy。验证者还否定自己合理怀疑的副作用：十次连续未认证poll各1–3ms，health未成probe amplifier。

### F.3／F.4已修

精确序列：首次ask执行；同retry同actionId、action-count delta零；同key不同ask拒IDEMPOTENCY_KEY_REUSED且无执行；同text新key是真新action。同input重排JSON keys仍replay，fingerprint为canonical非textual。Web以**丢响应**端到端证：浏览器中止首POST /api/v0/ask，retry同key，count只加一非二。Android key通过relay在线捕获。

### F.5已修

cityTaskState随真实task QUEUED→RUNNING→COMPLETED，同步且重读正确。

### 重审范围：干净

十文件变动，无apps/rooms／city，无依赖变化；新增行persona／assistant／model／SDK／shell／BOSS／HNS零命中。live十Rooms，路由恰ROOM／CAPABILITY／CITY_TASK，BOSS／HNS／SHELL／LLM均400 INVALID_ROUTE。

### 85ecde4门槛

| 门槛 | 结果 |
|---|---|
| node --test tests/*.test.mjs | 101/101 |
| node city/test-all.mjs | 1807过／1跳／0败 |
| node scripts/verify-promotion-history.mjs | 10/10 OK |
| node scripts/check-bilingual.mjs | 全SYNCHRONIZED |
| gradlew :app:testDebugUnitTest --rerun-tasks | BUILD SUCCESSFUL，50测／0败 |
| 分支托管CI36691043142 | android／gateway-web均success |

## 3. 结转非阻断项

带以下记录接受分支，**不声称已修**：

1. **R2.1a Android Action详情打不开。** row clickable=true，但中心tap、input motionevent DOWN/UP、swipe后tap均不变，ActionRecord() detail设备不可达。数据／parity正确，打开不正确。复现此SHA安装、pair、Action、tap row。
2. **R2.2a start-city.ps1 -NoRooms理由误导。** launcher报rooms:DISABLED，health却UNAVAILABLE／not reachable on loopback，非disabled理由。显式CITY_ROOMS_DISABLED=1正确ROOMS_DISABLED，属于launcher→gateway接线，非产品表面真实性失败。
3. **状态码偏离。** key重用HTTP400非repair note的409；IDEMPOTENCY_KEY_REUSED及无执行正确。已改实现报告，不留错误声明。
4. **F.6未变。** /api/v0/rooms和health仍给授权client loopback hubUrl，Android仍不接收／使用。另一LAN机器浏览器得到自身loopback。设计边界；认证hub proxy另工作。

尚一gap：Android timeout-retry key重用仅code inspection，因为无instrumentation不能向设备注入丢响应。记gap，不声称测试。

## 4. 合并与CI

```text
branch                              : product/upt-pre-assistant-closeout
branch HEAD (accepted)              : 85ecde437ec930f1b4aa41d8913540e012da5ee7
branch CI                           : 36691043142 - android success, gateway-web success
merge commit                        : 8104f8289a76d15ff0197c953730edcef42cab5e
                                      (parents d0dea7b [main before], 85ecde4 [branch])
merged-main CI                      : 36692675561 - android success, gateway-web success
branch audit after the merge        : 35 origin refs, unmerged = 0
```

原始块逐字保留accepted branch完整SHA、branch CI、merge完整SHA与parents、merged-main CI、35 origin refs／0未合并。首轮托管CI gap在此关闭：接受SHA分支CI与merge commit的main CI均记录，每次两job都绿。

STATUS: VERIFICATION_REPORT
