# Exposure gate packet — the two cross-machine capabilities

```text
给        Owner（由 Owner 亲自审阅后给结论）
性质      审阅材料，**不是**结论、**不是**自审。§3 禁止自审，本机不填写 review_refs、不写 PASS。
对象      CAP-CITY-REMOTE-OPERATION-001（主城 Owner 直接操作子城**节点**）
          CAP-CITY-AGENT-JOB-001      （主城 Owner 对子城**对侧 agent** 的作业下发与回收）
本机结论   两份登记都写着 "No independent review of this capability has been performed."
裁决记在哪 每份登记的 `evidence.review_refs`（现在是 `[]`）：把 Owner 的裁决/评审记录填进去，
          并把 §14A.5 的五个字段与结论对齐。
```

## 1. §14A.5 五字段（读自登记，不是复述）

| 字段 | CAP-CITY-REMOTE-OPERATION-001 | CAP-CITY-AGENT-JOB-001 |
|---|---|---|
| `user_exposure_class` | `DIRECT_CONTROL` | `DIRECT_CONTROL` |
| `user_exposure_surface` | WEB `Advanced > Remote operation` | WEB `Advanced > Agent jobs` + CLI `scripts/agent-job.mjs` |
| `user_exposure_nesting` | `L4_TECHNICAL` | `L4_TECHNICAL` |
| `backend_wiring` | `VERIFIED` | `VERIFIED` |
| `ui_exemption_reason` | `null`（**不**豁免：有真实 UI 入口） | `null`（**不**豁免：有真实 UI + CLI 入口） |

```text
两条共同点：
  · 默认**关闭**：a 需 CITY_REMOTE_OPERATION=1 + 显式可执行 allowlist + 工作区根；缺任一项按具名拒绝。
                b 需 CITY_AGENT_JOB=1；关闭时按 AGENT_JOB_DISABLED 具名拒绝。
  · owner-only：member 会话既不能派发也不能读日志；**凭据本身**（city control token / node token）在
    intentionally_hidden_information 里，且 b 的合同规定"凭据形状的输入按名拒绝"，作业记录里不含 token。
  · 主机无关性是**受检属性**，不是声明：machine_scope = SYSTEM_LEVEL_NO_HOST_BINDING，
    守卫为 tests/capability-host-independence.test.mjs（含任意命名节点的行为测试 + 反例控制）。
```

## 2. §14A.5 要求独立检查的六项 / 逐项指向证据（不是我给的结论）

```text
① 普通用户能否发现需要发现的能力
   a: surfaces[0] location "Advanced > Remote operation"，discoverable true，enabled_when "ONLINE + City owner"
   b: surfaces[0] WEB / surfaces[1] CLI，discoverable true
   证据引用（登记里的 evidence_ref / reachability_refs）：city-remote-operation-web.test.mjs、
   city-agent-jobs-web.test.mjs、web-surface-rebuild-persistence.test.mjs
② control 是否真实接到 backend
   a: tests/city-remote-operation.test.mjs + city-remote-operation-gateway.test.mjs + host-independence
   b: tests/city-agent-job.test.mjs + host-independence
③ unavailable / permission / refusal 是否诚实显示
   a: 具名拒绝；输出被截断时明确说明；"城市是否复核节点回执"另行标注
   b: 具名拒绝 REPORT_JOB_MISMATCH / REPORT_TASK_STATE_MISMATCH / REPORT_STATE_NOT_AGENT_DECIDABLE /
      CONSUMPTION_REQUIRES_A_REPORT / CONSUMPTION_ALREADY_RECORDED；投递状态三分（不是布尔）
④ 是否重复、视觉过载或不合理顶级导航
   两条都嵌在 L4_TECHNICAL（Advanced），且**实测修掉过一个真缺陷**：固定侧栏没有可滚动区域，
   多一个导航项就让末尾项点不到（登记 known_gaps 有记）
⑤ 是否把本应知情的后台能力错误归为 INTERNAL_ONLY
   两条都**没有**归 INTERNAL_ONLY；UI 可达（a 为 WEB only ⇒ user_reachability_status = PARTIAL，如实标注）
⑥ Android/Web 一等 surface 是否需要 parity
   两条都声明 Android 无 surface；a 因此是 PARTIAL；b 为 WEB + CLI
```

## 3. 仍未建立的事项（请一并考量）

```text
· 两条都**没有**独立评审 —— 这正是本 gate 要解决的事。
· a: **未在两台真实物理主机之间跑过**（测试在本机跑真 gateway + 真 node agent）⇒ known_gaps 写明 NOT RUN。
  b: 对侧机器上的 agent 作业**仍未发生**（对侧须先自己跑 `scripts/agent-job.mjs register`，
     这是城市侧无法代做的 bootstrap）；城市里已排好待领取作业 Q-a0aa3ec5-…（QUEUED，见该登记 known_gaps）。
· 两条的 intent_validation_status 都是 NOT_TESTED，且**这是刻意的**：确定性路由不把这两者作为
  ask 目标，因为请求无法由一句话良构（a 需要可执行/argv/工作目录/用途；b 需要标题/指令/用途）。
  如 Owner 认为需要自然语言入口，那是一件新工作，本轮未做也未声称。
· 凭据模型：本轮**未**新建"受限复现凭据"，Owner 裁决是带外交付主 token、跑完即轮换（范围已在交接书如实写明）。
```

## 4. 与本 gate 的关系 / 为什么它挡着 REX-890

```text
REX-890 final gate 有三项：① 对侧独立 reproduction 成功 ② exact-head CI green ③ **用户 exposure gate PASS**。
②：utopia 3143260 CI run 37720240214 = success（dc 侧 CI 亦绿）。
①：未发生（对侧尚未入场；本机所有复现都是彩排，且明说是彩排）。
③：**本文件就是为这一项准备的**。Owner 给结论后：
   · 把结论写进两份登记的 `evidence.review_refs`（并同步 §14A.5 五字段）；
   · 然后才记录终标 `RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE` 并收口 REX-890。
```
