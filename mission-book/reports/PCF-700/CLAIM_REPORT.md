# PCF-700 领取记录 / Claim report

```text
任务 / task        PCF-700 所有权、调用链与兼容现实审计 / Ownership, call-chain and compatibility reality audit
领取者 / claimant  Mech-DS（COMPUTERNAME MEGA-REP，role Mech-DS，development side）
时间 / at          2026-10-07
实现仓库 / repo    zhiheng-zhang-Mera/utopia
系列分支 / series  pcf/series-mech（本系列累计分支，自 main 312b627 起）
任务分支 / branch  pcf/PCF-700-mech-ownership-and-reality-audit
工作书 / workbook  mission-book/mission-group/personal-compute-fabric/PCF-700-ownership-and-reality-audit.md
```

## 为什么现在可以领 / Why this task could be claimed at all

PCF 系列此前是 **parked**（`execution_enabled: false`、`activation_state: PARKED_OWNER_NOT_ACTIVATED`、`owner_gate: OWNER_ACTIVATION_REQUIRED`），且 PCF 的激活规则明确要求先把控制面修好。本轮 Owner 指令是「打开 PCF 系列、连续承接其任务、单独开一个分支系列」，因此先做了激活事务，再领取本书。

**先决条件（激活规则 §2.3）逐条实测：**

```text
1  PCF 的 ID 能不能被依赖工具解析？
   修前：sync_dependency_state.py 的 ID_RE 里没有 PCF —— 'PCF-700:…' 实测 **不匹配**（对 WBC/REX 等都能匹配）
   修后：ID_RE 加入 PCF；干跑（--check）显示**只有 PCF-700 一本**会变化，随后实际 reconcile 也只改了它
2  parked 任务会不会被自动解锁或补 anchor？
   实测：PCF-701..728 **一个都没动**（git status 只有 PCF-700），状态/execution_enabled/anchor 全部保持原样
3  explicit dependency_source_workbooks 能否解析？
   实测：解析为 WBC-601..604 的四个 accepted 头（f66db609…、d99101fd…、f3510862…、213f9f9f…）
4  中文 canon 与英文镜像会不会重复计数？
   实测：英文镜像**没有 frontmatter workbook_id**，不参与 id 记录，因此不重复计数
5  GROUP_ONLY 文件不计工作分母？
   本系列目前没有 GROUP_ONLY 声明文件；PROGRESS_MANIFEST 用的是**显式文件集**（本轮只含 PCF-700），
   生成器实测分母 pcf total=1，而不是把 701..728 一起吸入
6  其它 programme 有没有被误改？
   实测：一次依赖 reconcile 只改了 PCF-700 一本书；sync_mission_progress/dependency_state 的 --check 全绿，
   一致性检查 0 error（34 warning 与基线相同）
```

## 基线解析（claim-time，实测而非假设）/ Baseline resolution

`baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM`，声明的依赖是四个已验收 WBC 头：

```text
f66db6099834  WBC-601  EXECUTION_BACKEND_STANDARD_COMPAT_ACCEPTED   in_main=True
d99101fdac51  WBC-602  NODE_CAPABILITY_RESOURCE_COMPAT_ACCEPTED     in_main=True
f3510862cc34  WBC-603  WORKER_POOL_AGENT_SEAM_ACCEPTED              in_main=True
213f9f9f7087  WBC-604  EXECUTION_PROFILE_SWITCH_COMPAT_ACCEPTED     in_main=True（本书有 Owner 复核豁免，accepted=dev 头）
=> 四个头**全部已是 origin/main 的祖先**（WBC 系列已合并），因此 claim-time union 就是 main 本身，
   **不需要任何 union 合并**；development_baseline_sha = 312b627b54af5bbf274fa25eca8f8383869c1c34
```

## 边界（本轮未越过的，写明而不是默认）/ Boundaries

```text
· 不采购、不付费、不使用付费服务
· 不安装系统服务、不改运行 profile、不改变常驻 City 的部署
· 不做远端执行启用（超出本书验收所需即成为一条显式问题，而不是顺手打开）
· merge_authority 保持 false：PCF 的分支系列只**累计**已验证工作，合并权等 Owner 另行裁决
· 双机规则不变：开发在本机，正式复检必须由另一实体主机完成（§3 禁止自审）
```

## 本轮的下一步 / Next

按工作书 §子步骤施工：`docs/{zh-CN,en}/pcf/ownership-map.md`、接口映射表、`tests/pcf700-compatibility.test.mjs`，以及 revision 2 追加的 EM/RF/GAI/WBC 与原端接线核对（DECLARED / COMPONENT_TESTED / LIVE_WIRED / TWO_HOST_VERIFIED / ORIGIN_AGENT_CONSUMED 五档）。
