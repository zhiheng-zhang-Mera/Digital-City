# 调度——Mech：集成RS-290树验证三harness修复，发布单一可fetch分支

> 阅读译本 / Reading translation：完整历史阅读版本；原报告为权威记录，不创建第二份任务状态，代码证据原样保留。

```text
FROM = Mech   TO = Alien + Owner
BASE = rs/RS-290-scheduling-baseline-freeze @ 6514733
BRANCH = fix/device-pilot-harness-integration @ 1dfb3ed
```

## 记录原因

三独立fix均从RS203tip44b52e2切，实际E2E跑的是RS290工作其上的**integratedtree**。各自basepass却integratedconflict无价值，此前没查、现在已查。

## 两fixbranch合入integratedhead：零conflict

```text
git merge fix/device-pilot-route-from-source     -> exit 0   (1964ca8)
git merge fix/device-pilot-process-identity      -> exit 0   (1dfb3ed)
git status --porcelain                            -> empty (no conflicts, no leftovers)
git diff --name-only 6514733                      -> exactly the 8 intended files
```

两mergeexit0、status空、diff恰8intendedfile：

```text
scripts/device-recovery-pilot.mjs   scripts/lib/process-identity.mjs   tests/process-identity.test.mjs
scripts/device-task-pilot.mjs       scripts/lib/ui-route.mjs           tests/ui-route.test.mjs
                                    tests/fixtures/ui-route/earlier-shell.xml
                                    tests/fixtures/ui-route/redesigned-shell.xml
```

八file原路径完整保留。**Mergedfullsuite989tests/987pass/2fail**；两fail是untouchedbase也复现的documentreaderCORRUPT_INPUT。新增27test（route12+identity15），重要树无regression。

## 更强核验：文件与已测修复字节相同

Integratedpass仅当passcode就是verifiedcode有意义，所以实查：

```text
git diff --stat fix/device-pilot-route-from-source HEAD -- <route-fix paths>       -> EMPTY
git diff --stat fix/device-pilot-process-identity  HEAD -- <identity-fix paths>    -> EMPTY
```

两diffempty，merge没有textchange。故所有claim原样转移：833capture，751oldno-op→751correctresolution；realidentityverified/mismatch/already-gone/invalid-pid；ENOENT复现。Integrated27/27新增pass。

## 单分支发布，免重复

fix/device-pilot-harness-integration1dfb3ed基于6514733含三fix：2220975nodegeometryroute非barelabel，73d7ce7taskpilot创建evidencedir，0c6498fstalePID不再JSON.parsecrash。Fetch即已解决mergequestion；两singlefixbranch仍可供Owner分别采用。

明确**不是merge入RS290，不claimmergedecision**；RS290持mergeauthority且这非其work。Branch是verificationartifact，让决策者有已知可merge/pass且与测量相同的树。

## Harness覆盖与仍欠一项

五E2E尝试failuremode**全是harness/hostsetup非product**：staleappcredential、stalelocale、zero-boundsroute留Devices、recordedPIDcrashidentity、missingevidencedir。原报告说明前四已有code/test修复；evidencedir无需你的pipeline预建。

仍欠且不claim：**dual-device recovery E2E未重跑**，本host无device。Integratedrecovery仍欠；已建立仅阻挡机制在provablymerge/pass树已识别修复，比gate窄，刻意如此。

语言配对 / Language pair: [原文 / Source](../DISPATCH_MECH_HARNESS_FIXES_VERIFIED_ON_INTEGRATED_TREE.md)
