# Development Notes — Hardware Independence

STATUS = ADVISORY_ONLY

这些条目是后续开发的**防大修注意事项**，不是自动生效的代码规范。

## 1. 任务尽量绑定 capability，而不是固定机器

优先表达：

```text
requires:
- android_build
- windows_native_test
```

而不是：

```text
must_run_on = Alien
```

设备名可以用于调度偏好、证据和当前 ownership，但不应无必要地成为业务语义。

## 2. 平台差异尽量留在 adapter / provider 边界

理想传播范围：

- RAM / SSD / GPU 等零件更新 → capability/telemetry 更新；
- 同平台整机替换 → 重新注册、权限/证书/配对更新；
- OS 大版本变化 → 主要影响平台 adapter；
- 新操作系统 → 新 provider / adapter；
- 新设备范式 → 必要时扩展 capability schema。

不应因为普通硬件升级而重写 City Core。

## 3. 不把未来设备写成当前 prerequisite

尤其禁止默认假设：

- “必须有 Mac 才能继续当前 Utopia 施工”；
- “必须等 Linux-A/B 建好才能继续任务”；
- “必须有 iPhone/HarmonyOS 才能合并与其无关的 Windows/Android 工作”。

只有当某项任务本身明确要求对应平台真实性时，才允许成为该任务的 bounded prerequisite。

## 4. Current device truth 与 future reference 分离

当前事实应来自实时或近期证据：

- device registry / heartbeat；
- mission claim；
- capability advertisement；
- task report；
- platform acceptance report。

本目录只描述未来参考设计。

## 5. Clean-room 与 native verification 不混淆

未来可区分：

- LOCAL_PASS；
- CROSS_HOST_PASS；
- CLEANROOM_PASS；
- NATIVE_PLATFORM_PASS；
- EXTERNAL_CI_PASS。

不同证据回答不同问题。

例如 Linux VM 的 Windows test 并不能自动替代 Windows 真机；iOS simulator 也不能自动替代真实 iPhone 行为。

## 6. 外部 CI 不应天然成为全城单点停工条件

GitHub hosted CI 可以提供独立环境和外部 evidence，但基础设施故障应与软件测试失败分开记录，例如：

```text
CI_INFRA_BLOCKED
```

而不是把未启动的 CI job 等同于：

```text
TEST_FAILED
```

不依赖该 gate 的施工应继续。

## 7. 允许未来实现偏离本参考

如果未来实验表明：

- 单 Linux 已足够；
- 使用 NAS / mini-PC / 云服务更合理；
- 不需要 VM；
- 某个平台不再需要；
- 新平台替代旧平台；
- 网络架构采用不同 discovery / transport；

都可以重新设计。

真正的硬约束应从**真实需求和已验证实现**产生，而不是从这份未来硬件图产生。
