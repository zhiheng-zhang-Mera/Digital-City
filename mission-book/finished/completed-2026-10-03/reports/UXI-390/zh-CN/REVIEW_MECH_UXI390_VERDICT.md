# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../REVIEW_MECH_UXI390_VERDICT.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# REVIEW — Mech审UXI390，head149a4c14b596b92f04fab6269eca1dcb7727303f

```text
REVIEW HOST   = Mech        (section 3: Alien developed this task and cannot review it)
REVIEWED HEAD = 149a4c14b596b92f04fab6269eca1dcb7727303f   (recorded head == origin branch tip)
VERDICT       = REVIEW_COMPLETE - PASS WITH REQUIRED REPAIRS
```

## §7领取前核对，结果干净

13/13。Recorded==ls-remote实测origin tip非workbook自称；CI36998342105精确head/branch completedSUCCESS；RS290contract与origin/main1a5bc0e字节一致；11evidencefiles在.runtime外可打开；执行controlcheckout与originmain最新。

**领取前须修自身tool两bugs，坏tool的clean无价值**：选development_ci首run非head绑定者；读localcheckout无freshness，对origin已取代workbook自信报10/12。均记录。

## 逐gate：每MET是我的测量非作者复述

**1旧功能可达—MET**。Root1017tests/1015pass/2fail。两documentreader旧fail我 **在未触baseline1a5bc0e各重跑** 同fail，不目信旧有；total非regressioncheck。

**2默认非console/dashboard语言—MET**。WebE2E无rawtoken；Android六tabs全部50strings搜22contracttokens，**零**。两面用户语言解释unavailable。

**3 scheduler实际工作—PARTLY MET，与作者记录相同**。Adapter/projection/两面/choice往返在head端到端；Web关键非render，是UIchoice **实际到backend**，task记noderef/time。Remotehandoff **NOT MET**，OwnerOPTION1延期，正确理由City无五维load、未测load有意無alternate资格。依handoff **不重争可达性**，此前16轮含我撤回overclaim。

**4真实dualdevice E2E—MET，自产证据**。原两不可见facts是作者Android及devicecount，现独立。Web真实gateway/node/UI10/10；Android首独立360dpemulator，用户语言、22scan零、Cancelaccentlive/Choosegrey在 **pixels**，8ab8225/cd298c3修复上屏。两distinct devices mech-node-a/b，6tasks全COMPLETED、两者均executor。Main.mjs不传id，两copies注册一device，须显式不同ids。

**5三面视觉一致—MET WITH REQUIRED REPAIRS C1/C2**。Rooms5/5、10rooms、3open各要求surfacechange、零errors；同executorloss-aftercreate状态，Web1440/Android360比header/state/body/providerreason/live-disabled一致。两分歧属 **本task**，必修如下。

**6Ownervisual—MET，Owner自身ruling**。Step5package通过未要求改，不属我评分，记录Owner。

**7mainCI—按设计NOT MET**。Review/visual双gate前故意不merge，merge_authority true，预只读cleanfastforward。

**8marker UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED—按设计NOT MET**，不能早于6/7。

## 必修

**C1同disclosure不同名，Androidliteral**：

```text
Web     apps/web/i18n/en.js:55   "scheduler.advanced.summary": "Technical detail"      -> "Technical detail"
Android SchedulerPanel.kt:167    TechnicalDetails(rows, title = "Scheduling detail")  -> "SCHEDULING DETAIL"
```

Web Technical detail、Android Scheduling detail，header规则同语义 **同words**，实际不一致，唯Web可translate。

**C2disabled choice Web解释、Android不解释**：Webi18n59 Choose another service·nothing available to switch to，Androidgreylabel无reason。Provider上一行有reason，故copy分歧非信息loss，但同语义不同render，disabled说明why正是本task数轮pattern。

两项低成本、**UXI301/390我 authored code**，不改RS290contract。**我未应用**，reviewer改artifact成为coauthor，programme曾Alien拒改我workbook裁定如此；移head又破刚绑定CI。作者应用或Ownerwaive，我后confirm。

## 记录但不归本task责任

- **C3**360dprawid四行碰state，layout kt86-88无constraint Row；显示rawid **冻结baseline**1a5bc0e惯例，reviewer有权加narrowcoverage。
- **V3**三localisation：WebEnglish、AndroidEnglish+shared冻结中文展开/收起、RoomsChinesechrome/bilingualnav/Englishcontent。同literal在Rooms一致、Android突兀，属 **UI190/UI103已exactbytesfrozen/reviewed**，本task内修需拆冻结工作；交Ownergate5观察。
- **UXI301review漏finding**：C1/C2在Alien通过artifact已存在未抓；不扰UXI301verdict，其gate关handoff，但reviewstandard本应含跨面samewords。

## 边界，防过度解读

- Android **360dpemulator非Alien真机**，硬件含Chinese locale行为仍作者证据，我不确认/反驳。
- **未独立重driveAndroidfailure/recovery40f9665**，唯一namedproperty无自身measurement，不能由其余review暗示覆盖。
- 原文边界段称items6/7/8not-yet非MET，我未移动；此历史措辞与前段Ownergate6MET一并保留，不自行更正。
- Reconcile是claim前提非verdict，repairs零，reviewhead即交付head。

## 证据

mission-book/reports/UXI390/mech-review/android-sweep.json六tabs/每string/22search空；android-panel-texts.json、android-panel-devices-360dp.png（sha91bf81aa0d7d…）；**错页首capture** android-devices-360dp.png保留不隐藏自身fault；rooms-journey.json、rooms-hub-mech-1440x900.png（sha9de7558c221d…）、dual-device-mech.json；加EVIDENCE_MECH_web-e2e_at_149a4c1.json及at_cd298c3.json。
