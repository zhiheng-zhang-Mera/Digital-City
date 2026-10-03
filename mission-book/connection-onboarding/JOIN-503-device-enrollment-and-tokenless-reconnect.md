---
workbook_id: JOIN-503
phase: CONNECTION_ONBOARDING
sequence: 503
execution_enabled: true
status: READY
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
dependencies: ["REMOTE_FABRIC_MERGED_MAIN_CI_GREEN"]
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/JOIN-503
terminal_marker: DEVICE_ENROLLMENT_RECONNECT_ACCEPTED
---

# JOIN-503 — Device Enrollment + Tokenless Routine Reconnect

> **Programme：** [README.md](./README.md)  
> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **异步减压施工：** [../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)

## 1. 目标

第一次 join 成功后，把新 PC 从“拿着某个 token 的浏览器/进程”升级为 canonical City 已登记 installation。

正常用户只配对一次：

```text
first join
→ trust approval
→ existing RF device identity / installation lifecycle enrollment
→ durable local device identity
→ future boot authenticates automatically
```

之后日常启动不得再次要求用户复制/粘贴 bare token。

## 2. 身份边界

必须复用 RF-001 已有语义：

- `device_id` = stable logical device identity；
- `installation_id` = concrete installation；
- key/fingerprint = cryptographic anchor；
- display name / OS / IP / MAC = metadata。

禁止创建：
- 第二套 user-visible permanent token；
- 第二套 device registry；
- 以 MAC/IP 作为 trust identity。

## 3. 用户可见行为

成功加入后：
- Devices 中能看到新 installation/node；
- enrollment 状态明确；
- app/agent restart 后自动重连；
- 自动重连可以内部签发短期 session credential，但用户不接触它；
- Settings 可以看到设备身份摘要与 revoke/remove action；
- manual token entry 仅保留 Advanced / Engineering fallback。

## 4. 凭据生命周期

要求：

- durable private material 不写进 repo；
- 不写进 URL；
- 不写进 ordinary UI；
- 不写进 demo/log；
- 不把 one-time pairing secret 当 durable credential；
- restart 时使用已有 device identity 证明身份并获取/恢复 session；
- credential rotation 不能要求用户重新复制 token；
- revoke 后旧 installation 自动重连失败；
- reinstall/rebind 服从 existing RF lifecycle。

具体 secure storage 按当前平台能力选择最小合适实现；若平台暂缺系统级 keystore adapter，可用明确标记的 local secure-store abstraction，但不得把 plaintext permanent token 退回 UI。

## 5. 与 Web UI 的关系

当前 Web 仍有 `sessionStorage['city-token']` 和 bare-token connect fallback。

本任务不是要求立刻删除工程 fallback，而是：

- normal onboarded PC path 不再经过手工 token 输入；
- launcher / local agent 可以把 authenticated session 交给 web surface；
- web surface 继续只持有 session-scoped credential；
- durable device key 由 device/runtime layer 持有，不塞进 browser DOM。

## 6. 允许修改

- device enrollment glue；
- platform/runtime credential store adapter；
- launcher/bootstrap path；
- session issuance/reconnect integration；
- settings revoke/remove surface；
- tests/docs/evidence。

## 7. 禁止修改

- 不改变 RF identity ownership；
- 不复制 trust registry；
- 不让 Web localStorage 保存永久 bearer token；
- 不把 token 直接写进 deep link；
- 不因 reconnect 扩大成账号/云同步系统；
- 不改 task scheduling。

## 8. 必须测试

自动至少：
1. first approved join creates/reuses canonical installation identity；
2. restart → reconnect without user-entered token；
3. expired session → refresh/re-auth internal, no UI token prompt；
4. revoke → reconnect denied；
5. revoked installation cannot silently mint new membership；
6. reinstall/rebind follows explicit lifecycle；
7. no permanent secret in DOM/log/url/repo；
8. engineering manual fallback remains isolated from default path。

## 9. 实机验收

至少 Alien + Mech：

- clean/unregistered installation 完成一次 join；
- shutdown app/agent；
- restart；
- 不输入 URL/token；
- device 自动 ONLINE；
- 从 trusted endpoint revoke；
- 再 restart；
- 自动连接失败并要求重新进入 approved pairing，而不是偷偷生成新信任。

Formal Review 必须由另一实体主机完成。

## 10. 完成门槛

`DEVICE_ENROLLMENT_RECONNECT_ACCEPTED` 只有在：
- initial enrollment；
- restart automatic reconnect；
- revoke negative path；
- secret exposure sweep；
- Development + opposite-host Review + exact-head CI；

全部通过后才可设置。
