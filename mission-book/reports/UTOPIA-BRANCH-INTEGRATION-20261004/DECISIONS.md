# Alien-codex 云端分支整合记录

角色：Alien-codex。Owner授权：先验证、旧到新合并，保存可追踪SHA后归档历史分支，再领取施工。

PR10（48cbc21376007c5461e8e456a898c3f788f0fa77）全部精确HEAD检查成功，合并为699f7c178b630b6ef447e755ceeb6699f1223d6b；该合并HEAD CI37203077196仍运行，等待其终态后推进PR11。PR11已改main基线，先前精确实现HEAD be6227ec49d4dbcd83a595d7b265766af2083421的检查均成功。

选择：使用merge commit保留历史祖先，不squash已记录的基准SHA；使用不可变归档tag与分支→full SHA索引后删除已整合云端分支；本地工作区保留。尚未包含的分支先审计，不凭名称直接删除。

发现：JOIN-503评审权限修复及测试已经包含当前实现，无需覆盖server；JOIN-501、JOIN-502独立探针需要测试兼容性核验；device-pilot三个旧修复有未整合的测试工具；MESH评审和UI候选包含历史证据/方向，不应直接覆盖最终产品。

环境问题：新Digital-City长路径工作区创建失败，改短路径D:/DC-Alien并启用Git core.longpaths后成功；原工作区未删除。当前Digital基线2574fa7，仅用于扫描，领取前必须再fetch最新main。

施工候选：CEX-701/704、WBC-601、REX-801/802等READY。尚未领取，待云端整合阶段完成后按最新frontmatter及exact ancestry重新决定。

## 合并与历史工具审计

PR10合并后CI37203077196 success。PR11合并为612c344f9f2b06a67b2645b4662d97750dd7c44e，其merged-main CI37203397283 success。31个历史分支均保存archive/2026-10-04/<原分支>云端tag；25个已整合或纯历史分支已校验tag SHA并条件式移除云端head，本地工作区不删除。具体full SHA及分类见ARCHIVE_INDEX.json。

UI000候选属于最终UI之前的方向证据，不回滚当前产品；MESH两条评审/证据分支含大体积历史采样，只归档，不复制进当前产品树；JOIN503权限修复和测试已存在当前main，不重复覆盖。

PR12整合旧pilot工具、JOIN501/502独立探针及UXI301错误前提修正规程。两个pilot冲突取union：保留当前观察序列与strayAgent计数，接入进程身份/界面路由修复。技术复核发现3项真实问题：selector未导出；weak/unavailable进程身份仍允许kill；重连探针未实际关闭socket。分别修复，保留红绿记录于本机Utopia/.runtime/history-audit；新route回归曾错误假设数字坐标，按既有ADB字符串contract修正，该失败不删除。最后focused35/35通过，独立本机技术复核无剩余阻塞；这不是跨物理主机Formal Review。

UXI301追加是历史FAIL/ERROR与方法修正，不宣称当前handoff成功；固定fixture状态和时间代理指标的局限保留。精确最终PR12流水线等待中，终态后再合并并重验main。

PR12实现0a5e9ba53772a1b01897c2edf34de3840de7c629 push CI37203861869终态success：Gateway/Web1242/1242；Rooms69/69；City1970通过/14跳过/0失败；Android及文档PASS。PR CI仍等待。补扫发现integration/join-502-nearby也已包含，追加其archive标签并按原SHA移除；当前共32个历史标签、26个历史head移除。

## 施工前阶段结果

PR12 push/PR CI37203861869/37203864170均success，已合并为40e18db4a6cf5bba1490181a473bc62e681edb8a。32个原历史分支+本次integration分支都已保存云端tag/full SHA索引并条件式移除；云端head仅main。merged-main CI37204279336排队/运行中，仍需核验终态，不将candidate CI替代它。

按常驻规则§4 no-idle，候选精确HEAD已绿且整合/归档已完成后，在保持merged-main CI观察的同时进入合法施工领取。选择CEX-701：承接已接受设备身份后端、修复恢复/冲突信息丢失，直接服务刚完成的多成员使用路径；不需要付费provider或新的canonical registry。WBC/REX等其他READY任务保持未占用。领取前再fetch两仓库并验证工作书祖先/依赖/claim。

## 合并后失败与恢复

40e18db4a6cf5bba1490181a473bc62e681edb8a的merged-main CI37204279336首次1241/1242，Windows CIM scan超过30s；同SHA attempt2终态success，负面日志保留Utopia/.runtime/evidence/mission-book/CEX-701/merged-main-ci-failure.log。另行PR13修复超时后重试一次完整进程/端口观察、持续/非超时错误仍拒绝启动，review发现混合错误掩盖后补修复与测试，7/7红绿检查。精确HEAD3bab6bdc78c18467645f3fb88272dab7a86f8a0d的push/PR CI均success；合并为0e9bea3ce739b979e582a428af8fb233045a5e75，后续merged-main仍待终态。CEX701已显式union此accepted修复，不修改原claim baseline。
