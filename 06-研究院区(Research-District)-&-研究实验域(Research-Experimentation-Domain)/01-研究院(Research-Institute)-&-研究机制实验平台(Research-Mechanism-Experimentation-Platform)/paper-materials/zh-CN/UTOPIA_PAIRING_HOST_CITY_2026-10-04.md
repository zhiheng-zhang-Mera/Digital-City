# 论文素材：Utopia 配对交互、单主机城市与远程登录

FACT: MATERIAL_ID=UTOPIA-PAIRING-HOST-CITY-2026-10-04
FACT: OBSERVATION_DATE=2026-10-04
FACT: EVIDENCE_LEVEL=LOCAL_ENGINEERING_REGRESSION
FACT: PAIRING_SHA=5af0640a5b979c2830c487950f29f3da7360e1c4
FACT: HOST_CITY_SHA=bd8925082aefda059eb9932f8065904ed3250008
FACT: PAIRING_ROOT_PASS=1184/1184
FACT: HOST_ROOT_PASS=1189/1189
FACT: FINAL_FOCUSED_PASS=15/15
FACT: PHYSICAL_TWO_DEVICE_WIFI=NOT_RUN
FACT: PHYSICAL_TWO_DEVICE_BLE=NOT_RUN
FACT: CROSS_REGION_INTERNET=NOT_RUN
FACT: CI_RUN=37191764473
FACT: CI_CONCLUSION=failure
FACT: CI_GATEWAY_WEB_PASS=1189/1190
FACT: CI_ANDROID=success
FACT: PRODUCT_MAIN_MERGED=false
FACT: PAPER_STATUS=CANDIDATE_MATERIAL_NOT_PAPER_VALIDATED

## 材料定位与来源

本材料归档两轮 Utopia 修复中的已有测试结果，不新增实验，不改动 Digital-City 运行机制，也不更新 active workbook 的接受状态。它是可用于未来论文案例与实验设计的工程候选证据，不是论文实验已完成或产品已合入 main 的证明。

- 配对修复：[不可变提交 5af0640](https://github.com/zhiheng-zhang-Mera/utopia/commit/5af0640a5b979c2830c487950f29f3da7360e1c4)。
- 单主机与远程登录修复：[不可变提交 bd89250](https://github.com/zhiheng-zhang-Mera/utopia/commit/bd8925082aefda059eb9932f8065904ed3250008)。
- [结构化清单](../evidence/UTOPIA_PAIRING_HOST_CITY_2026-10-04.json)记录原始证据路径、Git blob SHA-256、源码校验值、运行范围与未测项目。
- 原始日志和截图留在 Utopia；本目录仅保存摘要、证据索引和校验值，遵循 [Process Data Policy](../../../../mission-book/PROCESS_DATA_POLICY.md)。

## 问题、修复与观测

用户报告的输入超过约 2–3 秒后清空，以及正确短码无法连接，是现场症状记录，不是预修复受控性能测量。

| 问题 | 最终行为 | 支持证据与边界 |
|---|---|---|
| 后台刷新打断慢速短码输入 | 保留原输入节点、焦点、内容与失败提示；页面往返恢复内存草稿 | 脚本化 Web 回归覆盖慢速输入、刷新、导航与失败重试；未做用户对照实验 |
| Web 无法主动发起附近城市搜索 | Gateway 发起 mDNS/Windows BLE 扫描；选择条目后到目标源执行短码交换 | Web 测试覆盖条目选择、目标身份校验和失败重试；截图条目为脚本提供 |
| 多网卡广播地址选择导致漏掉可达城市 | 有界尝试多个广播地址并核对城市身份 | 单物理 Windows 主机非回环以太网实测发现并可访问 3 个城市端点；不等于 3 台物理设备 |
| 多安装目录、不同端口各自开启城市 | 固定本机协调端口保留一座城市，其他启动器复用；Gateway、Agent、Rooms 同进程持有 | 两个临时安装目录并发启动及不同端口重复启动得到相同 PID、cityId、数据目录 |
| 崩溃、重启或数据库替换改变城市身份 | 沿用公共目录指针；数据库身份不符时拒绝启动 | 强制结束后恢复相同 cityId；Windows 主机脚本重启保留选项；身份 pin 不符拒绝发布 |
| 远程邀请丢失 host、重连误用本机地址 | 保留 native/Web 邀请目标；使用注册记录中的目标重连 | 本机真实 HTTP Gateway 交换六位码并注册设备，后续访问原目标；目标不可达时不创建本机城市 |
| 忘记设备后又导入旧安装凭据 | 显式忘记阻止跨副本重新导入旧记录 | 独立回归验证旧记录不会恢复；不作为操作系统密钥存储安全证明 |

蓝牙在这里是城市定位信息的发现渠道，配对和控制仍通过局域网 HTTP/WebSocket；不能据此写成“完整蓝牙数据连接”或“浏览器原生 BLE 直连”。

## 运行结果与冻结范围

| 运行 | 结果 | 解释 |
|---|---|---|
| 配对完整回归 | 1184/1184 PASS | 计数来自提交内 validation.json；原始日志未随该轮提交，仅记录日志摘要哈希 |
| 配对专项回归 | 88/88 PASS | 与完整回归重叠；不能相加为独立样本 |
| 单主机完整回归 | 1189/1189 PASS | 原始日志已保存；启动时尚未加入最后两处身份 pin／忘记设备修复 |
| 最终专项回归 | 15/15 PASS | 对最终冻结源码验证上述两处修复及主机、远程注册路径；不是最终 SHA 的全量回归 |
| 单主机非回环网卡短码交换 | PASS，单次消费 | 不是跨地区实验，也不是双设备同 Wi-Fi 实验 |
| 最终提交的 GitHub CI | Gateway/Web 1189/1190；Android PASS；整轮 failure | hosted Windows，Node 24.21.0；多安装启动测试 20 秒未就绪，根因未确认 |
| Windows 蓝牙扫描 | 完成，发现 0 个 Utopia 广播 | 可证明扫描器在该主机执行，不能证明双设备发现或连接成功 |

测试计数是断言／回归用例计数，不是用户数、物理设备数或独立重复实验次数。本材料未记录足以建立 P50/P95/P99、成功率置信区间或显著性结论的重复试验。日志的整套运行耗时不是连接延迟测量。

[完整回归日志](https://github.com/zhiheng-zhang-Mera/utopia/blob/bd8925082aefda059eb9932f8065904ed3250008/evidence/raw/host-city-remote-login/full-suite.log)、[最终专项日志](https://github.com/zhiheng-zhang-Mera/utopia/blob/bd8925082aefda059eb9932f8065904ed3250008/evidence/raw/host-city-remote-login/final-focused.log)、[配对运行摘要](https://github.com/zhiheng-zhang-Mera/utopia/blob/5af0640a5b979c2830c487950f29f3da7360e1c4/evidence/raw/pairing-search/validation.json)。

## 保留的失败与负结果

1. 配对初次完整回归为 1177/1179，两个失败来自隔离目录缺少 City 解析依赖；补齐既有依赖后重跑。这是环境依赖失败，不能改写为全程一次通过。
2. [中间主机回归](https://github.com/zhiheng-zhang-Mera/utopia/blob/bd8925082aefda059eb9932f8065904ed3250008/evidence/raw/host-city-remote-login/superseded-intermediate.log)为 13/14，记录城市在 20 秒内未就绪；最终冻结回归替代它，但保留该失败，且不推断未复现的根因。
3. 蓝牙扫描零发现属于负结果，不能从“扫描未报错”推导为“BLE 配对成功”。

4. 发布证据分支触发的 [CI 37191764473](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37191764473) 已终止为 failure：Gateway/Web 1189/1190，唯一失败为多安装启动测试就绪超时；Android job 为 success。本机与托管环境结果不一致，CI 未修复；不能把本机通过扩展为跨环境稳定性或发布就绪证明。

## 论文可引用范围

可以作为有出处的工程案例描述：刷新引起的交互状态丢失可通过保留输入状态修复；主机级保留与持久城市身份约束可以在多副本启动及崩溃恢复回归中验证；定位信息与授权凭据应分离，重连应保留目标城市身份并拒绝静默切换。

这些是设计案例与回归结果。当前没有实验支持“用户连接更快”“全网连接成功率提高”“节约 CPU／能耗”“普遍跨平台有效”或“全球远程短码登录已经部署”等效果结论。六位码只对指定城市的当前会话有效，仍需目标地址可达；没有公共短码目录、自动 NAT 穿透或本次部署的公共中继。

## 未来实验所需材料

- 两台物理设备同 Wi-Fi：记录设备身份、网络拓扑、目标 cityId、成功／失败数与真实交互时间。
- 两台 BLE 设备：保留广播接收、解析、目标访问和单次交换证据；覆盖关闭蓝牙、权限拒绝与无广播。
- 两个地区的 HTTPS／互联网部署：分别测直连和中继路径，记录网络条件、TLS、重连与断网结果。
- 同一冻结提交的重复实验或受控前后对照：预先定义输入时长、刷新频率、并发启动数、等待时间、失败率和统计方法。

以上均为未来实验建议，当前状态为 NOT_RUN／NOT_MEASURED，不是已激活的工程工作书。CI、主分支接受与论文评审也应分别记录，不能由本地测试替代。
