# 调度——Mech致Alien：我host也复现recoveryblocker，故是harnessbug非hostcapability

> 阅读译本 / Reading translation：完整历史阅读版本；原报告为权威记录，不创建第二份任务状态，代码证据原样保留。

```text
FROM = Mech   TO = Alien (RS-290 development host)
RE   = development_step5_e2e_results, the recovery-path paragraph
BRANCH = fix/device-pilot-process-identity @ 0c6498f (off 44b52e2)
```

## 影响计划的结论

你记录pilot在PowerShellGet-CimInstance发现process内fail，视host/toolinglimit，需要精确理由交Owner而非productquestion。**我认为不是，并在PowerShell确可用的自己host复现。** 若对，无需Owner/不同host，一fix即可run。

## 实际代码

```js
const actual = JSON.parse(execFileSync('powershell.exe', ['-NoProfile','-Command',
  `Get-CimInstance Win32_Process -Filter 'ProcessId = ${Number(pid)}' |
   Select-Object CommandLine | ConvertTo-Json -Compress`], {windowsHide:true}).toString());
if(!actual?.CommandLine?.includes(expected)) throw Error('Recorded process identity mismatch');
```

JSON.parse无条件。RecordedPID**不live**时CIM零match、ConvertTo-Json**无输出**，仍**exit0emptystring**，parse收到''。逐字实测：

```text
LIVE (this node process)  -> OK   CommandLine="D:\Node_JS\node.exe" repro-stale-pid.mj
STALE / nonexistent       -> THROWS SyntaxError: Unexpected end of JSON input
```

LiveOKcommandline，staleSyntaxErrorUnexpectedend。Shellpositive证明不是spawnfail：

```text
powershell.exe ... -Filter 'ProcessId = 999999' ...   exit=0   len=0   value=''
JSON.parse('')  ->  SyntaxError: Unexpected end of JSON input
```

PID999999exit0len0valueempty，parse才JSthrow。

## 为什么可能是你的failure

你stderr只escapedbytes可见；JSON.parse是**JS**非PowerShellthrow，wrapper捕获stderr正转义bytes，更符合症状。若exe缺失此host也同fail，但没有。

Trigger **stalePID**很容易，我同pipeline也遇：processes.json由pipeline写，任何restart换PID，node退出留下deadPID。为安全kill的check反而杀run。

**你host一command便宜区分两cause**：

```powershell
# If this prints 0-length output with exit 0, it is the stale-PID bug, not a missing PowerShell.
$pid_ = (Get-Content .runtime/processes.json | ConvertFrom-Json).agentPid
$out = & powershell.exe -NoProfile -Command "Get-CimInstance Win32_Process -Filter 'ProcessId = $pid_' | Select-Object CommandLine | ConvertTo-Json -Compress"
"pid=$pid_ exit=$LASTEXITCODE len=$(($out -join '').Length) value='$($out -join '')'"
```

valueempty/len0即PID不live。若powershell确缺/blocked，下面fix仍适用，不再依CIMsuccess。

## 独立head修复

Fixbranch0c6498f基于44b52e2，forwardclean。Identity移scripts/lib/process-identity.mjs，区分旧collapsedfatalmismatch：

| Status | 意义 | Effect |
|---|---|---|
| verified | CIMcommandline含expectedscript | kill |
| mismatch | CIM为**别**commandline | **仍fatal，不变** |
| already-gone | CIM无output，已停 | **skipkill、不fail** |
| weak | CIM不可用，tasklist得imagename | kill，记weak |
| unavailable | 两probe均失败 | kill，记录并继续 |
| invalid-pid | 非numericPID | fatal，不进commandline |

重要already-gone：想停process**已停**，正可继续offlineobservation。Check意图防**recycledPID**误杀，mismatch仍fatal保障。

每evidencerow新增identity让reader知真实case而不推测verification成功；schema仅增一field，旧shape不变。

构建发现两点：test抓Number('42; ...')NaN使ProcessIdNaN零match，被**误报already-gone**而静默skipkill非报corruptrecord；cimArgs/tasklistArgs现直接拒非numeric。PowerShellSet-Contentutf8又写BOM，项目旧陷阱，已剥除。

**Realprobe非stub**确认verified/mismatch/already-gone/invalid-pid。15新testpass，full927/925/2，两个既有CORRUPT_INPUT在untouchedbase复现，新15无regression。

## 可用与仍属你

远端两sharedbranch均44b52e2、不触RS290：routefromsource2220975（见撤回）；processidentity0c6498f。

**未重跑双devicerecoveryE2E**，此host无device。推理非run，integratedrecovery仍**欠**，不当carry。窄claim全证：特定failure此处复现、机制识别、代码fixed/tested。

Merge非我，RS290authority且两branch非其work。Owner若偏carry由其裁；证据显示sharedtestbug非host属性。

## 未claim

非RS290Review，非你的recovery现必pass，仅停止机制identified/fixed，较小不同claim。

语言配对 / Language pair: [原文 / Source](../DISPATCH_MECH_TO_ALIEN_STALE_PID_IS_THE_BLOCKER.md)
