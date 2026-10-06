# Preprint Profiles / 预印本发布专项设计

**Public disclosure is not peer-reviewed acceptance. / 公开记录不是同行评审录用。**

## 1. Preprints.org [S06]

**Observed instructions / 已核实:** source Word/LaTeX materials are required; LaTeX includes necessary supporting files. Manuscripts carry named authors and metadata, without another journal's branding. Submissions undergo screening, not peer review. AI assistance has disclosure requirements. The author guide discourages duplicating the same paper across servers and favors updates to an existing version. / 不应复用匿名 NIER PDF 当作完整发布包。

**Adapter behavior / 适配:** produce a named release variant, complete source archive, normalized metadata, declarations and author-consent checklist. Preserve the evidence freeze and distinguish screening/posting/version states. Show the cross-server preference conflict with Essay-Book's present default sequence for Owner decision; do not mislabel the preference as an outright ban or silently post twice.

## 2. arXiv [S16]

**Observed instructions / 已核实:** account/category eligibility can involve endorsement and moderation. TeX-generated manuscripts require their source rather than PDF-only upload; non-TeX PDF submissions follow their own rules. The submission carries an author-selected distribution license. / 有源代码构建的论文不能默认只上传 PDF。

**Adapter behavior / 适配:** branch on original authoring format; build a self-contained source bundle, verify compilation/metadata, check allowed included files and inspect the preview. Do not fabricate endorsement or category approval. Update an existing arXiv record through the proper replacement/version process rather than creating a duplicate paper. License/public exposure is an explicit author decision.

## 3. Named vs anonymous truth / 署名与匿名版本

Keep one scientific core. Named variants may restore identity and acknowledgments only after author confirmation. An anonymous submission must remove identity leaks without deleting scientifically necessary provenance: use a permitted anonymous mirror or explain bounded access, according to the target policy. Public preprints and anonymous peer review can coexist only under the target's current rules.

署名恢复与匿名处理是呈现层变换，不是新增证据。不同平台摘要可按要求调整，但必须与各自的正文和同一实验事实一致。官方外部回执是已发布状态的依据。

## 4. Distribution guard / 传播护栏

A publishing plan is not blanket permission to post to every server. Check overlap, version lineage, author consent, rights, public-data scope, target-venue preprint restrictions and costs before each action. A local correction requires tracing affected public versions and deciding the appropriate update; it does not retroactively change what was previously distributed.

初版流水线可以止于可下载/可复核的投稿包，外部发布由人工完成；没有受支持、获授权的连接器就不宣称自动发布成功。

## 中文完整说明 / Complete Chinese explanation

公开记录不等于同行评审录用。

### 1. Preprints.org

S06记录必需Word/LaTeX源，LaTeX带支持文件；署名元数据不含其他刊品牌；筛查不是同行评审；AI有披露；不鼓励同稿多服务器，倾向已有版本更新，匿名NIER PDF不是完整发布包。适配输出署名variant、完整源归档、规范metadata、声明、作者同意清单。保留证据冻结，区分筛查发布版本；跨站偏好和Essay-Book默认冲突交Owner决定，不称绝对禁止或静默双发。

### 2. arXiv

S16记录账号类别可能需背书审查；TeX生成需源，不PDF-only，非TeX PDF遵循自身规则；作者选分发许可。按原写作格式分支，完整自包含源、编译metadata、允许文件、preview检查。不造背书类别批准，已有记录按替换版本更新不重复新建。许可公开明确作者决定。

### 3. 署名匿名一致事实

保持同科学核心，作者确认后恢复身份致谢。匿名移除身份泄漏但保留科学必要来源，按目标用允许匿名镜像或有界访问说明。预印本与匿名评审并存服从当前政策。身份转换不是新证据，不同摘要仍和各正文/实验一致，公开状态需真实外部回执。

### 4. 分发护栏

计划不是全服务器发布授权。每动作查重叠、版本血统、同意权益、公开数据范围、目标限制费用。纠正要追踪受影响公开版并决定更新，不回写既已分发历史。首版可止于可下载可复核包，人工外发；无支持授权连接器不称自动成功。
