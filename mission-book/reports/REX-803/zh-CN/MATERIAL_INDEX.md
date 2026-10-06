# REX-803三端验收 — 材料索引

[英文权威原稿 / English authoritative source](../evidence/MATERIAL_INDEX.md)。本文件为完整阅读译本，不作验收，不改变payload事实。

为回应PHYSICAL_MATERIAL_REVIEW_Alien.md发布：审查要求精确候选／City／campaign绑定的rawpackage、不可变receipt和trace快照／索引，以及PARTIAL原因。本索引不是验收、不决定结论，reviewer拥有判定。

## 身份绑定

```text
candidate SHA declared by the receipt   8798ba9dd37051626033ad72080b2fad3ff66149
candidate SHA this package is bound to  8798ba9dd37051626033ad72080b2fad3ff66149
city ID                                 031fdba6-e94c-4298-a095-6ff04a65481d
campaign ID                             campaign-966cf439-7017-4bb0-88e8-981e59c18322
scenario / state / reason               WAIT / COMPLETED / REPETITIONS_FINISHED
city endpoint read from                 http://172.31.12.151:4391
exported at                             2026-10-06T08:16:03.675Z
```

两candidateSHA须相同，derived-checks.json的candidateShaAgrees记录比较。原块保留City／campaign／场景WAIT／COMPLETED／REPETITIONS_FINISHED、读取endpoint与导出时间。

## 文件（实际发布字节SHA256）

| 文件 | 字节 | SHA256 |
|---|---|---|
|campaign-receipt.json|3693|34bf525779376299d010762fe54009a795239a7cfe16e9a16d1490a18d77c669|
|manifest-and-seed.json|2286|d747d84b7909c96bd62d1dfdf57359fcda667474c6e2a2bed91045389aa65dd1|
|canonical-tasks.json|2230|9244a3f9844887f90366e5d258573429205ac5652e4f3438c3fb73cd4b52665e|
|canonical-events.json|12441|07cd4afb4ca3b07d2dc94fe7856bf2d9e10cc490dc34c25471e367688c0bd9b4|
|trace-snapshot.json|116085|bcec4cff9fda3caf9e2312a5b6dd71100531216863a36a39cf133c0d30d3ca05|
|derived-checks.json|9896|0a509495f632d9b1e679f51ab8122c63b9ba110dcc86eab3b79a5f52d123b8ec|

receipt是City C:/ProgramData/Utopia/host/city/research/campaigns/campaign-966cf439-7017-4bb0-88e8-981e59c18322.json不可变收据字节相同副本，源SHA为34bf525779376299d010762fe54009a795239a7cfe16e9a16d1490a18d77c669。有host访问可逐字确认，索引不能带自身hash。

[evidence-tools](../evidence-tools/)在payload外保存方法，export-script.mjs为实际生成所有文件程序；independent-verify.mjs为不共享代码的第二实现，仅从发布字节重推声明并核对索引，运行 `node evidence-tools/independent-verify.mjs mission-book/reports/REX-803/evidence`。它们有自身credential扫描的字面词，若放payload会让读者误报不存在leak，因此外置。它们是作者instrument非reviewer审查，reviewer可拒。

export运行时从hostreservation读ownercredential，不写出；若结果含credential、sessionID、pairingcode、claimsecret、tokenfield拒发布。gitattributes标-text，任何hostcheckout保持hash精确字节，不行尾归一；否则checkouthash差与materialhash差不可区分。曾freshclone按实体化字节hash验证。

## 明确trace为何PARTIAL

```text
storageState        READY
completeness        PARTIAL
counterScope        CURRENT_COLLECTOR_EPOCH_AND_RETAINED_WINDOW
droppedRecords      0
retentionTruncated  false
failures            []
experimentRunRef    null
experimentRunReason NOT_OBSERVABLE: recording run is not an experiment execution run
records in whole trace 197, in 4 collector epochs; published epoch trace-90320718-ee11-4f00-ac34-0b8918f16820 holds 52
```

以上为trace自身全部边界声明，也逐记录声明normalizer不能填字段。该项原稿称PARTIAL全部原因，下节重算非仅接受。experimentRef／experimentRunRef缺，因为recording是collector非experimentexecution；campaign经normalizer实际填的canonicaltaskrefs在对应epoch绑定，明确收窄非让读者发现。

### 重算PARTIAL原因

collector谓词在derivedchecks的traceCompleteness引用：非READY／drop／truncate／failure／任记录annotations或missingfields均PARTIAL。返回记录求值：

```text
storageState READY                     -> does not hold
droppedRecords 0                       -> does not hold
retentionTruncated false               -> does not hold
failures []                            -> does not hold
records with annotations   0 of 197   -> does not hold
records with missingFields 197 of 197   -> HOLDS
```

故原稿称唯一原因为197/197missingfields，逐字段数在derivedchecks。大多数缺experimentrefs，吻合experimentRunReason。无drop／truncate、READY、无failure，因此campaign记录按捕获完整，整体trace仍如实partial。末尾说明独立review范围，不把全197声明升级为独立证据。

### 保留窗界限及接近程度

```text
recordLimit 256, held 197 (59 more records before the oldest is evicted)
byteLimit 2097152 bytes, held 427642 bytes (20.4%)
queueLimit 64
epochs in the window: trace-d2b8f040-f618-47bf-badc-05f8dc4e3f46=55 trace-0dd5f8c9-eb46-4a4e-8a77-29373bbe371c=76 trace-9f58bbc8-7764-4895-b27e-48dd98d0eca6=14 trace-90320718-ee11-4f00-ac34-0b8918f16820=52
```

四Gatewayprocess所以四runID。live只配置目录／stream，限制为collector默认。尚未evict，开始时retentionTruncated变true；现材料完整但窗未来驱逐，所以立即发布而非只引用。

### 时钟

```text
declared source clock   CANONICAL_EVENT_WALL_UTC, EXTERNAL_DECLARED_WALL_UTC, HOST_WALL_UTC (event occurrence as declared by source)
capturing host clock    HOST_WALL_UTC
monotonic source        PROCESS_HRTIME
collector process epoch epoch-4dcb9fe9-7126-40aa-8f5d-6cc4c4279f04
capture skew (capturedAt - timestamp) over the published epoch: min 0ms, median 3ms, max 53ms
records captured before the occurrence they capture: 0
```

源发生时间和host capturedAt刻意独立，差值是传输／观测延迟非校正。发布epoch无记录声称先于发生被捕获。原块保留clock类别、PROCESS_HRTIME、process epoch、min0／median3／max53ms与零提前记录。

### live存储快照

原稿写“Alien在2026-10-06T08:02:32.979Z计195，本导出197”，因此发布带hash／epoch文件而非需信count。campaignepoch已指明且完整发布。该归属原样转述，正式评审边界见末尾，不作为Alien独立读取。

campaign窗已关闭不变：2026-10-06T08:00:39.594Z至08:01:00.167Z，每run任务在窗内创建／终态（derivedchecks campaignWindow）。无保留测量指标available:false加reason，不报零。latencyMs／cpuPercent／memoryBytes可用，backoffMs／autonomousSpanMs／taskTransitionCount不可用。

## reviewer仅靠本包能检查

derivedchecks从其余文件重算，下列seed函数／placement规则引用候选而非重述结果：

```text
seeds           each run.seed re-derived from campaignSeed and index; recorded vs recomputed per run
placement       each run predicted as workers[seed % workers.length] (targetDeviceRef was null) vs assignedNodeId
end-to-end      each run task looked up in canonical-tasks.json: state COMPLETED and researchRunRef <campaignId>:<index>
accounting      receipt.summary re-counted against the runs array, including terminalAccountingComplete
clocks          the declared source clock vs the capturing host clock, with the skew distribution and a count of
                records captured before they occurred
window          every run task created and finished inside the receipt window; the campaign-start event inside it too
api agreement   the City's own /research/campaigns view of this receipt vs the receipt on disk
```

逐run从campaignSeed／index重推seed对比；targetDeviceRef null时workers[seed%length]对assignedNodeId；canonicaltasks查COMPLETED／researchRunRef；summary按runs重数含terminalAccountingComplete；源／捕获clock偏差及提前计数；任务创建完成／campaignstart都在receipt窗；CityresearchAPI与磁盘receipt一致。

## 本包不含

解决的是材料此前只在作者drive、对机无法看见的发布问题。仍不含手机自身日志或Alien文件系统读取，不声称含。无token／session／pairingcode／installationcredential／privatecontent；export若含则拒。

## 正式验收已发布的证据边界（保留原稿、另列说明）

[FORMAL_ACCEPTANCE_Alien.md](../FORMAL_ACCEPTANCE_Alien.md)第5边界明确，195count来自早期作者报告，不是Alien MEMBER读Ownertrace（权限不允许）；新Alien enrollment始于2026-10-06T07:29:19.058Z，不能说此前两天始终在线。该正式评审独立核验的是发布campaignepoch52条、31canonicalevents、3measuredreceipts；197全保留窗为作者envelope，非未发布记录独立全量证明。PARTIAL／缺provenance字段保留，drop0／READY／未truncate是包声明与可见一致，非全197审计。candidate绑定来自receipt／manifest／Owner更新非remotePID→sourceSHA，APKbuild非新安装，capturedskew非跨host同步或benchmark。正式结论ACCEPTED_EXACT_HEAD 8798ba9dd37051626033ad72080b2fad3ff66149及marker来自reviewer，本译本不发布新判定。
