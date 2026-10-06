# MON-901 开发日志

> 阅读译本 / Reading translation：只供阅读，不是第二份权威工作书／状态；保留历史和未知边界，不新增验收。

2026-10-05，Alien-codex。固定基线d3262ce2dd81e51a53e39e6f9add8dee650a7682。

选择：基于已持久Gateway事件/task/node的pull非权威观察，SQLite有界一致read transaction，无执行callback或第二调度真值。Node/Edge/Event/Evidence投影、空Decision seam；graph UI仅延至指定902。未知task owner及缺规范review/CI/model-switch/escalation源明确NOT_OBSERVABLE。

技术评审发现两真实P2，修前复现：删除event prefix/tail看似完整；request-local observer不能共享read或保stale。增加规范SQLite event watermark；Gateway范围observer single-flight、stale/error、shutdown disconnect。独立critic8／8 PASS，非对侧Formal Review。

验证最终23／23含8观察、4Gateway与document路径。真实control/node API创建→claim→RUNNING→COMPLETED投规范assigned node/event IDs。受控挂起HTTP monitor不阻另task创建，坏reader不阻cancel。窗口overflow/删历史明确PARTIAL，safeSummaryAvailable=false。

保留失败：缺module初red；错误/commands404改既有/tasks；fixture错误TASK_RUNNING/DONE改规范TASK_STARTED/COMPLETED；首shared-read red因仅release一promise挂，终止自身session45886、修witness/releases；最终reviewer red2真复现P2。root修前1253/1251PASS/2FAIL CORRUPT_INPUT因隔离checkout缺独立city/node_modules junction，未改pointfix基线也复现；既有YAML parser seam不可用。不改产品恢复city junction，受影响document＋23通过。最终全量待重跑，不把初失败称产品修复。

受控canary为protocol-report integration，不是真physical executor/benchmark；第二canary复用同SQLite，14events含两次。投影latency仅sample→projection。无跨设备/Android UI/speedup/主要代理迁移主张。未触安装live Gateway。精确CI、Registry candidate、对侧Formal Review待定。

候选7eb38f1b930dfe6cc13dab0e17dedee467b1254b推送PR24。最终root1255／1255、Rooms69／69、promotion10、双语PASS。CI37242446183、PR37242505126运行，reciprocal37242505131 PASS。初失败保留。WindowsApps python alias返1未调用sync；从官方Python release archive下载任务专用便携D:/Tools/MonitorPython-3.13.0并验archive checksum。实际sync_mission_progress.py及--check现0同步，无全局Python改动。

语言配对 / Language pair: [English](../DEVELOPMENT_LOG.md) · [中文](./DEVELOPMENT_LOG.md)
