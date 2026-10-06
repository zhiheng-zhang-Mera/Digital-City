# 能力记录 / Capability Records

每个语义能力对应一份 YAML。命名格式为 `CAP-<DOMAIN>-<NNN>.yaml`，从 [记录模板](../CAPABILITY_RECORD_TEMPLATE.yaml) 开始。不要为每个源码函数单独建档；记录有语义意义的能力，并指向实现路径和符号。历史能力在核验、回填前可以缺席，不得根据陈旧假设编造记录。

快速入口 / Quick navigation: [注册区总览 / Registry](../README.md) · [YAML 模板 / Template](../CAPABILITY_RECORD_TEMPLATE.yaml)。实际实现、接线、可达性和意图验证分别记录，不以文件存在推定完成。 / Record implementation, wiring, reachability and intent validation separately; file presence does not imply completion.

One YAML file per semantic capability.

Naming:

```text
CAP-<DOMAIN>-<NNN>.yaml
```

Start from `../CAPABILITY_RECORD_TEMPLATE.yaml`.

Do not create a record for every source-code function. Record semantically meaningful capabilities and point them to implementation paths/symbols.

Historical capabilities may remain absent until verified/backfilled. Do not invent records from stale assumptions.
