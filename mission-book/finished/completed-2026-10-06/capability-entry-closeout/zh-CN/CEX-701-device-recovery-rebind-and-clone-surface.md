> **中文可读阅读副本 / Reading translation；非权威。** [当前canonical源与实时metadata](../CEX-701-device-recovery-rebind-and-clone-surface.md) · [English reading translation](../en/CEX-701-device-recovery-rebind-and-clone-surface.md)。
>
> **编码与来源说明：** 当前canonical正文已经发生历史性mojibake；以下规范正文严格来自可读Git版本 `ee13fef9be19388ed6562c636aefaefcb219c579` (`ee13fef`)，复核说明仅翻译当前canonical frontmatter中完整英文 `review_ci`。未猜测损坏文字。当前源frontmatter与对应report继续是claim、state、SHA、CI、gate的authority；本页及历史版本不获得任务authority。原损坏正文保留作为历史证据。

# CEX-701 — Device Recovery / Rebind / Clone Finding 前端闭环

> 常驻规则：[../CONSTRUCTION_RULES.md](../../../../CONSTRUCTION_RULES.md)
> 异步协议：[../ASYNC_RELIEF_CONSTRUCTION.md](../../../../ASYNC_RELIEF_CONSTRUCTION.md)
> 论文素材：[PAPER_EVIDENCE_PROTOCOL.md](../PAPER_EVIDENCE_PROTOCOL.md)

## 目标

把已经存在的 device identity lifecycle 从“后端知道发生了什么”变成普通用户可完成的恢复流程。

当前已存在：

- `GET /api/v0/device/installations`；
- `cloneFindings`；
- `POST /api/v0/device/installations/:id/rebind`；
- `POST .../revoke`；
- UNBOUND / reinstall semantics。

当前缺口：

- Web Settings 丢弃 `cloneFindings`；
- rebind 无正常 UI；
- Android 无恢复 surface。

## 必须实现

### Web

- Settings 显示 typed clone/conflict warning；
- 展示足够识别、但不泄漏 secret 的 installation/device 信息；
- UNBOUND installation 显示明确 recovery state；
- rebind 必须使用现有 server proof contract；
- allow safe revoke/remove path；
- 不自动替用户选择 logical device。

### Android

至少能：

- 看见本安装是否需要 recovery；
- 看见 clone/security warning；
- 在权限允许时完成自有安装 recovery，或明确引导到 Owner Web surface；
- 不用 raw token / secret 作为正常用户输入。

## 禁止

- 新造第二 device registry；
- 绕过 rebind proof；
- clone finding 自动删除设备；
- 在前端持久化 durable credential；
- 把 session credential 提升成 owner authority。

## Formal Review

另一实体主机必须独立构造：

1. UNBOUND reinstall；
2. legitimate rebind；
3. wrong proof；
4. clone finding；
5. session trying to rebind another installation；
6. self revoke；
7. owner revoke another installation。

至少一次真实浏览器流程；Android 若当前平台限制无法完整 recovery，必须证明用户得到明确可行动引导，不能死在状态页。

## 论文素材强制点

特别记录：

- API 已有字段但 UI 丢弃的原始证据；
- 修复前用户路径步数；
- 修复后路径步数；
- clone false/true cases；
- rebind refusal codes；
- reviewer 发现的 privilege / presentation mismatch；
- 所有 test fail / runtime fail。

## 完成门槛

- Web recovery 完整；
- Android 有真实可行动入口；
- clone finding 不再被 silently dropped；
- rebind / revoke authority 不回归；
- Development / opposite-host Review PASS；
- exact-head CI green；
- PAPER_MATERIAL_INDEX 完整；
- terminal marker `DEVICE_RECOVERY_ENTRY_ACCEPTED`。

## 复核记录中文对译（当前完整英文review_ci，非损坏正文推测）

**领取时实测：** Mech主机，COMPUTERNAME MEGA-REP，2026-10-05。review目标就是development head `a24c04401308b11548626239e8ca1f9b4276bbdf`，从 `refs/heads/cex/CEX-701-Alien-codex-device-recovery` 解析，远端tip相同。独立性有证据：development_host=Alien-codex，与Mech不同实体主机，满足§3。依赖经验证：工作书声明JOIN-503 device enrollment semantics present，required ancestor `77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f`；JOIN-503 COMPLETE，review_host Mech、review_complete true，该祖先可从review head到达（git merge-base --is-ancestor退出0）。

领取时、判定前独立重新测量精确head CI：V0.2 push37206760171 completed/success，android与gateway-web job成功；PR37207112712在同一head成功；City linkage37207112720 completed/success，reciprocal-contract。按工作书要求独立构造UNBOUND重装、合法rebind、错误proof、clone finding、会话尝试rebind他安装、自身吊销、Owner吊销其他安装，并至少一条真实浏览器流程。

**结论PASS，精确被审head如上。** Reviewer再次逐run测量同三组CI，均完成成功。独立仪器：`utopia tests/cex701-mech-review-probes.test.mjs`，分支 `review/CEX-701-mech-review` head e83edd8，12/12通过，涵盖全部指定场景，其中两项真实浏览器对真实gateway；作者套件未经改动10/10。Android执行 `:app:testDebugUnitTest`，15套件84/84，DeviceRecoveryTest4/4。没有放宽已有断言；host-preflight.test.mjs仅增6行、删0行。

四项攻击假设被证伪并留证：API用already_bound拒绝移动已绑定安装，UI不是唯一屏障；City host不是可吊销安装，因此批量吊销不能令City失效；没有其他BOUND安装时仍提供host logical device，恢复表单不是无法提交的死路；credential fingerprint是sha256句柄，不是可逆秘密。

两项control-plane finding均不阻塞：**F1 LOW**缺14项模板字段，包括全部暴露字段user_exposure_class、user_exposure_surface、user_exposure_nesting、backend_wiring、ui_exemption_reason，PAPER_MATERIAL_INDEX已引用却缺失的四项research-grade字段，以及state-identity、monitor、decision evidence字段；此次按作者自身CAP-IDENTITY-001记录和当前watchlist回填。**F2 LOW**任务书强制的修复前后路径步数在报告、receipt、event chain均未记录；未修复，因为补值将伪造测量。

两项informational：**F3** Registry称fingerprint intentionally hidden，但每个installation行都包含它；它是sha256句柄，只在presentation层隐藏。**F4** rebind指定已经绑定安装自身device仍被接受并重新记录proof。相关gateway/host/device/enrollment回归196项，193通过3失败；三项都是拒绝干扰常驻City的已知环境性host-city-launcher案例。已连接/native Android recovery及intent validation分别仍NOT_RUN、NOT_TESTED，不声明用户路径或性能结果。此次复核释放DEVICE_RECOVERY_ENTRY_ACCEPTED；详见reports/CEX-701/REVIEW_REPORT.md。

**同次复核Android finding，均不阻塞：**

- **F5 MEDIUM：** DeviceRecovery.kt以整个scope的any计算needsRecovery，却渲染为“本安装需要恢复”。实际Android路径scope CITY（配对提供control token），因此不相关UNBOUND安装也让手机宣称自身需恢复；工作书第1项实际回答的是City而非本设备。
- **F6 LOW：** installationId、state、errorCode、error、cloneFindings reason缺少displayName/deviceId已有的null守卫；设备runtime上的JSON null会变成字面“null”。现为潜在问题，已发布gateway未发送这些字段null。
- **F7 LOW：** CityClient丢弃此路由的server errorCode，权限拒绝变成不带status的INVOCATION_UNAVAILABLE，显示为连接故障。
- **F8 LOW：** 新Android单测中contains owner在四个message分支都为真，永远无法失败；payload无JSON null，使用reference org.json而非android.jar语义，真实server触及的两守卫未覆盖。
- **F9 INFORMATIONAL：** 无Settings标题分支；解析的owner flag从未读取，Owner和member指导相同。
