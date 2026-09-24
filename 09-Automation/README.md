# Automation — 自动化执行建筑

## Direct repository links

- **[Auto-Game-Bot](https://github.com/zhiheng-zhang-Mera/Auto-Game-Bot)** — 感知—动作自动化与完成度验证实验

## Building role

Automation 容纳面向外部环境的任务执行系统。它适合作为 perception → decision → action → verification 类型能力的实验建筑，并可为未来 Computer Use / embodied automation 提供可复用经验。

## Buildings and rooms

### [Auto-Game-Bot](https://github.com/zhiheng-zhang-Mera/Auto-Game-Bot)

- Perception-action loop.
- Map/config separation.
- Task execution.
- Completion verification.
- Screenshot/cache lifecycle.
- Repetitive-action automation.

## Roads

- **Capability Road** ↔ Boss orchestration.
- **Engineering Road** ↔ Hns for deployment/repair.
- **Learning Road** → reusable automation experience where appropriate.
- **Device/Computer-Use Road** ↔ host interaction layers.

## Boundary

Application-specific automation logic stays here or in its own dedicated building. Boss should expose generic orchestration/runtime primitives rather than accumulating per-application scripts.
