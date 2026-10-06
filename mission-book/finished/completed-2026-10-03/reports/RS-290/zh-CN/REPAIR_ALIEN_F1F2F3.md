# RS-290——Alien（Development主机）修复Mech的F1、F2、F3

> Reading translation / 阅读译本：完整历史阅读版本；原报告为权威记录，代码证据原样保留，不创建第二份状态。

```text
DEVELOPER      = Alien     REVIEWER = Mech     (different physical hosts, §3)
REVIEWED HEAD  = 2a3ae30a6dc8d76ff5b1d18a30e86e8c29dc1529   (returned for repair)
REPAIRED HEAD  = 5cc081b   EVIDENCE HEAD = 2f81296
DISPOSITION    = all three findings repaired by the development host; released back for re-review
```

MechReviewFindings/Addendum结论**DEFECTS FOUND—NOT REVIEW_COMPLETE**，将repairer交Owner并建议**Alien修**。Alien可用且行动，建议适用无需Owner新ruling。采纳Mech不selfrepair理由，不重议：reviewer写fix成coauthor，§3independence是本programme反复首要。

每repair写defect/choice/rejectedalternative/why，workbook要求logic非仅outcome。

## F1：Anti-leak由namecheck改provenancecheck

**已复现defect**：projectStatus接barestring、TERMS.includes。RS202REACHABLEDEGRADED原word规定映PRESSURE_PAUSED/RESOURCE，但DEGRADED也是termname，原样过。错误stateDEGRADED/actionsCANCEL+CHOOSE_PROVIDER，应QUEUED/CANCEL+KEEP_WAITING；仅需wait却索providerdecision，正provider_choice_required要防。

**选择provenance**，歧义就是name，namecheck无法解。现接source/wordreference，termRef(source,word)，自己mapping，词按声明vocabulary意义。三刻意后果：

- **Barestring拒**，即使像term；caller必须给来源，“忘map”不再可表达。
- Unknownvocab/unmappedword **throw**。
- **已移除参数名**providerTerms/terms/routeStage拒非ignore。Rename后silentdrop会新形式复现F1，从nothing算plausibleDTO；loudfail强于quietwrong。

Mech替代：仅Object.valuesTERM_OFoutputs不行，碰撞DEGRADED**在image内**，已verify非guess；renamecollidingterm仅修一处，仍nameguard，下vocab再触。

**全量而非单fix**：enumerate所有sourceword同时declaredterm但不同义，assertset恰[['RS-202.REACHABLE_STATES','DEGRADED','PRESSURE_PAUSED']]。未来新词撞suitefail要求reaudit。

**维修中另找到并修**：presentTerm裸table[word]可达Object.prototype，ENABLEMENTconstructor返回**function**像term。当前vocab无此词，正所以未来才暴露；现ownpropertycheck。同name能欺namehole，公开非silentdiff。

## F2：Terminaloutcome优先waitingUser

**Defect**：waitingUser?'WAITING_USER':presentState无条件优先；terminal/failed/waitingUser全true返回WAITING_USER/CANCEL+CONFIRM。Finishedfailed被呈待user，RETRY需finalFAILED被扣，最需要恢复user失去state/action。

**选择单一precedence非exception**：waitingUser折为WAITING_USERterm，presentState唯一决定，原本已terminal先term/cancelled先failed。删除第二precedencerule非加一，ordering留文档单处。

Mechthrow组合可辩但拒因“confirmationpending时taskfail”真实序列，RS203有requestConfirmation/respond/expire。Projectionthrow会failliveinput，真实outcome更好user。确认terminalfailedwaiting→FAILED/RETRY；terminalwaiting→COMPLETED/noaction；nonterminalwaiting仍WAITING_USER/CANCELCONFIRM。

## F3：STALE独立term，headerproperty现在assert

**两部分defect**：(a)测过期STALE与从未测UNKNOWN都FRESHNESS_UNKNOWN，UI不可区分，违四UNKNOWNrule、termname对STALE不实。(b)headerNO TWO DISTINCT MEANINGS MAY SHARE A PRESENTATION TERM，无全量test，仅两spotcheck，别处collapse21/21仍pass。

**(a)拆**STALE→FRESHNESS_STALE/KNOWLEDGE。拒documentcollapsealternative，因为自己的rule要求区分，记exception仍header/table矛盾。

**(b)声明collapse**。字面property表不真，假装真才藏defect：五ABSENCE_CODES故意ABSENT，**保留ABSENT/REMOVED**tombstone区别。诚实property“无未声明collapse”，INTENDED_COLLAPSES每actual及reason，像LOAD_UNMEASUREDclass已有解释。Suite**双向**全table：未声明fail，声明无actual也fail，不退化旧true清单。四declaredPROBE_OUTCOMES.SELECTABLE与ABSENCE_CODES.ABSENT/REMOVED/POLICY_EXCLUDED；最后最粗judgement，UI需why首复审。

**采纳Mechlowseverity**：test5entryclassPERMITTED等从TERM_CLASS构造、resolves_by_waitingboolean同table赋值，不能fail。“不能failtest非evidence”对passpart也适用。改独立mappingcrosscheck，drop/reorder/mismapprovider会fail，加class应驱decision。

## 验证：Repair负载真实非装饰

**Negativecontrol**：fixed/broken都pass不证。Throwaway重新引三defect，**五testfail**覆盖F1按VOCABULARY、F2terminalOUTRANKS、F3distinct/noUNDECLARED、既有CLOSEDtest独立抓STALEcollapse。PROBE_negative_control.mjs本目录。

**Suite**：contract25/25，root966/964/2，两个既有documentreaderCORRUPT_INPUT按name在untouchedbase复现非按count猜。City1984/1977/0fail/7skip；首Cannotfindyaml是freshworktreedependency，pnpm--dircityinstall--frozen-lockfile解；缺dependency/坏testsummary相同，message区分，故记录。

**Repairedhead两E2E重跑**，productchange令旧head不绑定。SuccessCOMPLETED/true/七event，AndroidWebartifact540cd0a1match，观测RUNNING/RUNNING/COMPLETED，terminal04:02:12.824Z。Recovery**3/3**，offline/restore/onlineorder、每offline stoppedPidAlivefalse。均publishedrawRS290可查。

**APK两次verify非assert**：apps/androidgradlewassembleDebugUP-TO-DATE是inputhash，diffde91f5e..HEADandroid **EMPTY**，installed7c42f423…正此headbuild；全任务未改Android。

**采纳evidence-strength建议**：旧successsummaryonlyboolean不能像rawrecovery复算；pilot现每poll/twosurface读记录，success/terminalObservedAt/booleans**从record计算**，summary反record不再表达。Reader已publishedJSON复算observedStates/success。

## E2E重跑找到harnessdefect与耗时diagnosis

Repairedrecoveryfailfalse、offlineObservedAtnull、所有twosurfaceONLINE，6514733曾3/3。

**测得root：泄漏detachedagent**。Restartspawn detachedtrue/unref，无kill，每run漏一个；**五agent同时live**，旧agent连gateway令node永久ONLINE/offline永不可满足。非product。根修：测前sweepstray、finallykill每child、不detached、evidence记sweptStrayAgents。Confirm扫[62568,20028,34916,70536]后3/3。

**保留instrument**，ambiguity耗时间：每offline记stoppedPidAlive，证明killcorrectfalse，指environment非product。无它“killfailed”和“另process服务node”同样符合record。

## 自己错误

1. **未测assertcollision9，suite拒，实际1DEGRADED。** ONLINE/UNKNOWN/DISABLEDnear不算，termsDEVICE_ONLINE/AVAILABILITY_UNKNOWN/USER_DISABLED拼不同，namecheck不会混。Mech“一collision改答案”正测量。Programme第六同failure，我从讨论shape猜number非测。
2. **Buildfail却statusbuild_exit0。** 根worktree不存在gradlew，实际apps/android；PowerShellCommandNotFound不改LASTEXITCODE0，cmdletfail非nativecode；run用旧APK。Artifacthash与c97c821/current一致，但claim会假，故另verifybuild。同先$m-eqarray误读：mechanismfail/statussuccess。
3. **Recovery差点再如此**：先猜kill无效，stoppedPidAlive反驳。先测机制（已五次记remedy）一再run得cause，非speculativepatch。

## Repair后headbinding

2a3ae30→bbccc71F1/2/3→0256fceobservations→5cc081bagentleak→2f81296evidence。Evidenceheads0256fcesuccess、5cc081bboth，finalpublishedpair均5cc081b，twopath同product。至2f81296仅evidence；从review到repair仅presentationcontract/scriptsdevicepilot，Android未动、同APK佐证。

```
REVIEWED 2a3ae30 -> REPAIRED 5cc081b   product changed, so the earlier E2E carries do NOT apply
                                       and both paths were re-run rather than carried
```

原evidencecarry不适用，productchanged所以两path重跑。

## 采用Route2，push前运行Mechgate

Request提供两F1route，预承诺Route2source/wordinternalmap消碰撞但callsignaturechange，告知后extendgate不拒合理API。

**Alien选Route2**，本节即通知。Route1DEGRADED→DEGRADED_STATE较小可过旧gate，但只一例、namebased下vocab再触；Route2去class。DTO新且未merge、无externalcaller，cost低。

**Push前原gate运行**：F1/2/3PASS后REGRESSION无法run，旧providerTerms/terms按design拒。正Mech预见，公开非改reviewinstrument，**Alien未动原PROBE_repair_verification.mjs**。

发布ALIEN_ROUTE2gate**仅callsiteadaptation**，请Mechdiff确认无别改：

```text
                                   unrepaired 2a3ae30     repaired 5cc081b
Mech's gate (unmodified)           6/9, F1/F2/F3 FAIL    F1/F2/F3 PASS, then REGRESSION throws
Alien's adapted gate               6/11, exit 1          11/11, exit 0
```

原unrepaired6/9F123fail；repairedF123pass后regressionthrow。Adapted原6/11exit1、新11/11exit0；六regression两tree均pass，正selftest有用属性。

三标记adapt：

1. F1bareword被拒会**vacuouspass**而不mapping，不能重引“不能failassert”。改reference实map/assert全部**11pairs覆盖10distinctcollidingword**。还assertabsentprovider本身violation，因为ignoreproviderRefsprojectionnone；原tree11countF1fail非pass，adapted更强。
2. Regression每term直注已不允许，inversemap一ref/term注。
3. Nofabrication两bareterm同adapt。

**精确新surface**：

```text
projectStatus({ providerRefs, termRefs, routeStageRef, terminal, failed, cancelled, waitingUser })
  providerRefs / termRefs : arrays of {source, word}   routeStageRef : one {source, word} or null
termRef(source, word)     : builds one, validating both halves
removed names             : providerTerms, terms, routeStage  -> REFUSED, not ignored
declaration table         : INTENDED_COLLAPSES
F3 note                   : Mech's gate probes INTRA_VOCABULARY_COLLAPSES ?? DECLARED_COLLAPSES, so its
                            `declared` branch reads false against this repair; the name is
                            INTENDED_COLLAPSES. F3 passes on the `split` branch either way, and the
                            adapted gate adds the reverse check (a declaration with no collapse behind it
                            is a failure) so the table cannot rot.
```

projectStatusproviderRefs/termRefsarray、routeStageRefref/null，termRef验证两半；removednames拒不ignore。DeclarationINTENDED_COLLAPSES；Mech原gate查INTRA_VOCABULARY_COLLAPSES或DECLARED_COLLAPSES，declaredfalse但split仍pass；adapt加reversecheck避免table腐。Alien另加全tableundeclaredquantifier与declaration必须actual，都是Mech标准。

## 扩duplicatekeygate找到controlplaneintegrity：报告未修

此前四次只查**编辑file**，现全missionbook发现两committedpreexistingclosedUIfile非我。逐字quote因YAML保一silentdrop另一：

```text
UI-000-视觉方向候选与审美门禁.md
  review_covers_revision_head  line 24: false      <-- and
                               line 61: true       CONTRADICTION

UI-101-Web产品壳与信息架构.md
  review_delta_verified  line 20: "Mech re-verified the post-review delta (aafff56, CI 36872799004)…"
                         line 47: "The delta's own half is correct and verified in a real browser…"
  review_delta_required  line 21: "POST-REVIEW DELTA, not covered by the completed Review…"   (string)
                         line 41: true                                                        (boolean)
  review_not_verified    line 40: "…(a) Keyboard focus order… (b) iframe embed… (c) Contrast…"
                         line 49: same opening, different (b): "…needs UI-190 to integrate UI-103's hub…"
```

UI000review_covers_revision_head24false/61true矛盾；UI101delta_verified20/47两note，delta_required21string/41boolean，not_verified40/49同开头但iframe/needsintegrate不同。

**是defect非bookkeeping**：lastvalueparser静默flipreviewflag，正reconciliation防quietwrong；UI101更坏**typechange**。

**不修是决定非遗漏**：要判自己未做phase两contradictcanonical，错会silentgatechange与原defect同invisible；归author/Owner，line/value完整报告。**不混RS290commit**，cleanrevieweddeliverable混别phaseworkbooksurgery会使diffscope不诚实。

**实际改变gate范围**：只file导致四caught两miss，现每workbookcommit前全tree查，本finding来自扩范围。

## 未claim

Reviewcomplete仍**false**，reviewhead仍Mech2a3ae30…，改它属reviewer；releasefreshReview，Alien未自审repair。E2E在Devhost跑，independence依publishedraw可Mech检查，正如其解码observations非信summary。

语言配对 / Language pair: [原文 / Source](../REPAIR_ALIEN_F1F2F3.md)
