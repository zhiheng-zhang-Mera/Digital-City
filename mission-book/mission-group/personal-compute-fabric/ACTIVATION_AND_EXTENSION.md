# 激活、复杂化与追加子任务规则

[English](en/ACTIVATION_AND_EXTENSION.md)

## 1. 本次权限

Owner 授权的是规划增强 PCF，可追加任务、增加任务内部复杂度；**未授权现在启动 runtime 开发、改变运行 profile、安装系统服务、采购/付费或开启远端执行**。所有任务保持 parked；所有执行 anchor 保持 null/空数组。

## 2. 首次激活事务（不是当前任务）

1. Owner 明确选 CORE_V1 或命名的一组任务/可选扩展，记录 scope revision、预算、设备资格和不可越过的授权边界。
2. 重新核对最新 Utopia main、WBC accepted heads、在途 claims、MON/REX 正式状态。默认先让 MON-990 收口；若提前做独立 PCF primitives，必须确认无共享文件冲突。MON freeze 只作为实际 UI 集成/验收的硬依赖，不拖住无关纯合同测试。
3. **先做控制面兼容检查**：本规划读取的 `tools/sync_dependency_state.py` 的 ID_RE 不包含 PCF，且其未领取依赖解析不以 execution_enabled 为前置过滤。激活时应读取最新版并测试：PCF ID 可唯一解析；parked 任务不被自动补 execution anchors/解锁；explicit dependency_source_workbooks 可解析；中文 canon 与英文镜像不重复计数；有声明的 group-only 文件不计工作分母。
4. 必要的控制面修补必须在独立、明确的激活事务中完成并回归现有全部 programme；不能因为本计划存在现在就扩大修改全局工具。PCF 识别缺失未修正前，不启用需要自动依赖传播的 PCF 工作。
5. 在 `PROGRESS_MANIFEST.json` 加入**本次获准的明确文件集**，不要用会吸入所有 future tasks 的宽泛 glob；依赖只开选中 scope 的传递闭包。PROGRAMME_MANIFEST 是计划清单，不是第二个领取数据库。
6. 从正式 accepted workbook 读取 full review SHA，验证其证据和 ancestry。将候选 refs、dependency source、需要的 capability lower bound 一起原子记录。不能引用 README 的短 SHA 作为证据；还没验收的依赖保持 WAITING_DEPENDENCIES。
7. 仅启用满足资格的工作书；运行 `python mission-book/tools/sync_dependency_state.py`，再运行 `python mission-book/tools/sync_mission_progress.py` 及二者 `--check`。校验没有误改在途 claim、历史完成项或其它停放系列。
8. 发布 bounded activation receipt（中英）并重新扫描任务池。任一步失败即不授予执行权，不能半激活。

## 3. 已有任务允许变复杂

在未领取前可把原任务扩为更多阶段，但必须增加 spec_revision、设计理由、共享接口变更、反例测试、资源/权限预算和依赖影响。复杂任务仍须有可独立验证的里程碑，不允许一句“全做完”隐藏不可控范围。

已领取任务不能为了方便改验收门槛或改掉旧失败记录。保持当前 scope/anchor；新增要求作为变更 proposal。只有明确批准后才 supersede，记录旧/新 spec、head 与责任边界；通常优先新建 child，避免打断施工。

## 4. 追加子任务

首选从未使用的 **PCF-725～789** 分配新 workbook ID，并写 `parent_workbook_id`、originating finding、scope delta、依赖和 release_train。不要使用当前解析器不认识的 `PCF-701-A` 作为正式动态 ID。

父子只能采用一种模式：

- **父仍有独立工作**：父保持可验收交付（例如组件集成），子交付新增能力；二者验收对象不同，可各计一个工作书。
- **父改为目录/聚合**：父显式转 GROUP_ONLY，移出 active membership；只计算可执行子工作书。先验证生成器支持该语义，不能靠加一个未实现字段假设它会自动排除。

新 child 默认 execution_enabled=false，不自动继承父的执行权、预算、凭据或 merge 权限。已批准 scope 内纯拆分可以按明确 delegation policy 激活；增加新领域/外部副作用/数据域/采购/费用/权限，必须新 Owner approval。

允许局部新增文件，但每次必须检查：DAG 无环、无双重事实源、无 sibling ownership 冲突、无缺失验收 owner、无无界队列/日志、无同机替代 Formal Review。更新中英镜像、计划清单及适用的 active manifest；未启用项不进入当前分母。

## 5. 防止永远做不完

CORE_V1 的 scope 在正式激活 receipt 中冻结。新增 child 默认 NEXT_RELEASE；不得自动成为已经运行的 PCF-790 的新门槛。必要安全修复可以进入该版本，但必须明示原因、重新验收受影响部分。

可选 GPU/Linux/Android-edge/HA/adaptive 模块分别激活、分别验收；硬件缺失不算已完成，也不阻止核心收口。PARKED、NOT_RUN、UNSUPPORTED、BLOCKED 与 PASS 必须区分。

PCF-790 / PCF-990 当前仅为保留编号和 release 设计。只有对应冻结范围的组件都 accepted、证据可解析、真实 seam 已明确后，才创建 final integration workbook；从当时最新 main 施工，遵守现有 merge lock。
