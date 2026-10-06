# Future Hardware / Network Topology Reference

STATUS = FUTURE_REFERENCE_ONLY  
BINDING = false

## 目标形态 / Reference Shape

未来可以考虑：

```text
                       Digital City
                            │
           ┌────────────────┼────────────────┐
           │                │                │
      Windows Workers   macOS Workers    Mobile Devices
      Alien / Mech / +      Mac / +      Android / iPhone /
           │                │            HarmonyOS / +
           └────────────────┼────────────────┘
                            │
                  ┌─────────┴─────────┐
                  │                   │
              Linux-A             Linux-B
           server + verifier    server + verifier
                  │                   │
                  └─────────┬─────────┘
                            │
                  local shared services
                  + clean-room evidence
```

这是**期望参考形态**，不是当前拓扑。

## 参考角色

### Windows / macOS worker

Windows 与 Mac 都可以作为普通施工 worker。

参考平台分工：

- Windows：Windows 原生适配、Windows 真机验收、Android 工具链与 Android 真机桥接；
- macOS：macOS 原生适配、iOS 工具链、iPhone/iOS 验收；
- 两者都可以承担普通跨平台施工，而不是被限制为“只验收”。

### Mobile devices

Android / iPhone / HarmonyOS 设备主要提供：

- 真机 UI / lifecycle / permission 验收；
- 网络、通知、蓝牙、传感器、后台行为等真实平台证据；
- Remote Fabric / assistant embodiment / control surface 等端侧验证。

模拟器和 VM 可以补充，但不自动替代真机结果。

### Dual Linux servers

未来可考虑两台 Linux 作为本地基础设施和主要 clean-room 验收节点。

参考职责包括：

- City 后端公共服务；
- 任务/状态/事件协调；
- 本地 artifact / evidence / cache；
- CI coordinator；
- disposable VM / container verifier；
- 数据复制、快照与恢复；
- 本地网络中的长期 server host。

建议把**长期服务器宿主环境**与**一次性验收环境**分离：

```text
Linux host
├── persistent city services
└── ephemeral verification environments
    ├── clean Linux VM/container
    ├── optional Windows VM
    └── other disposable test environments
```

这样服务器可以长期运行，同时验收环境仍尽可能可重复、可销毁。

## 冗余参考

双 Linux 的目的主要是降低单机故障风险，但“双机存在”本身不等于高可用。

未来若确实实现状态复制，可考虑：

- stateful service 主备或有明确 quorum 的复制；
- verification workload 双机并行；
- 避免两台节点同时自认为唯一主节点；
- 必要时使用轻量 witness / arbiter；
- replica 不替代 versioned / immutable backup。

这些都是**设计注意事项**，而不是现在必须实现的机制。

## 网络参考

上层应尽量面向：

- logical device identity；
- capability；
- service discovery；
- current endpoint。

而不是把业务逻辑绑定到：

- 固定 IP；
- 固定 MAC；
- 固定 hostname；
- 固定网卡或路由器。

未来 Remote Fabric 可以根据实际环境选择 LAN、Wi-Fi、Bluetooth、VPN/overlay、Internet relay 或其他 transport。

## 降级运行参考

未来中央 Linux 服务失联时，更理想的行为是：

```text
central infra unavailable
        ≠
all workers must stop
```

worker 可以在条件允许时继续：

- 已领取任务；
- 本地测试；
- 平台原生验收；
- 本地 journal / pending evidence。

中央服务恢复后再同步、reconcile 或 replay。

是否允许领取“全新任务”应由当时实际 task ownership / consistency 模型决定，而不是由本参考文档预先强制。

## English explanation / 英文说明

Status remains `FUTURE_REFERENCE_ONLY`, with `BINDING = false`. The diagram above is a desired reference shape rather than the current topology: Windows workers (Alien/Mech/others), macOS workers and Android/iPhone/HarmonyOS devices connect to possible Linux-A/B server/verifier hosts and shared local services/clean-room evidence.

### Reference roles

Windows and macOS can both perform ordinary engineering work. Windows specialises in native Windows adaptation/physical acceptance and Android tooling/physical-device bridging; macOS specialises in native macOS adaptation, iOS tooling and iPhone/iOS acceptance. Neither is restricted to verification alone.

Physical mobile devices provide UI, lifecycle and permission acceptance; network, notifications, Bluetooth, sensors and background-behaviour evidence; and Remote Fabric, assistant embodiment or control-surface verification. Emulators and VMs supplement rather than automatically replace physical results.

Two Linux hosts may eventually supply common City backends, task/state/event coordination, artifacts/evidence/cache, CI coordination, disposable VM/container verifiers, replication/snapshots/recovery and persistent LAN servers. Separate persistent City services from ephemeral clean Linux VM/container, optional Windows VM and other disposable acceptance environments, so server continuity and reproducible/destroyable tests can coexist.

### Redundancy

Two machines reduce single-machine risk but do not by themselves establish high availability. If state replication is actually built, consider primary/standby or explicit quorum, parallel verification, prevention of two self-declared sole primaries, an optional lightweight witness/arbiter, and versioned/immutable backups that replicas cannot replace. These remain design precautions rather than present obligations.

### Network and degraded operation

Prefer logical identity, capabilities, service discovery and current endpoints over business logic fixed to IP/MAC/hostname/network card/router. Future Remote Fabric can select LAN, Wi-Fi, Bluetooth, VPN/overlay, Internet relay or another transport according to the environment.

Central Linux unavailability need not stop every worker. Where conditions permit, workers can continue already-claimed tasks, local tests, native acceptance and local journals/pending evidence, then synchronise/reconcile/replay after recovery. Whether a worker may claim a brand-new task depends on the actual task ownership and consistency model at that time; this reference does not predefine that rule.
