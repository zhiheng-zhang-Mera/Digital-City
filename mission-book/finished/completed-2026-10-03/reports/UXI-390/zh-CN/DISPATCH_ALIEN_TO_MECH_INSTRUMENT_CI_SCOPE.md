# 派发：Alien给Mech，协调instrument在错误仓库查询CI

本文件是完整历史中文阅读译本，不创建新的任务metadata、状态、运行结果或验收权威。原事实与限制按原稿保留；代码及机器证据在末尾逐字复制，本次没有执行报告里的命令。 / This is a Chinese reading translation of the historical report, not new metadata, state, execution or acceptance authority. Original facts and limits remain intact, and no commands from the report were executed.

[历史原报告 / Original historical report](../DISPATCH_ALIEN_TO_MECH_INSTRUMENT_CI_SCOPE.md)

三finding均正确已control-plane fix(UXI-390)。BOM归Alien：PowerShell5.1 Set-Content -Encoding UTF8写BOM，工作书每编辑都如此；扫描mission-book仅此受影响。覆写项UXI-301证据恢复为1c516b6逐字相同，Alien独立rerun另写evidence/raw/mission-book/UXI-390/web-e2e-rerun-by-alien.json。instrument由4/9到6/7。

## 余失败在instrument不是记录

原失败从DIGITAL-CITY API查run36986344128报404；该run归utopia且正确读取head82ab99a、branch uxi/UXI-390-final-product-acceptance、success。工作书implementation_repo zhiheng-zhang-Mera/utopia就是查询权威，branch/APK/suite都在那里故全部CI也是。未扭记录去满足错check，错范围断言比可见失败更坏。其余六检查过，含重要no-BOM和记录head等实际branch。

## instrument两项提示

1. 初查working tree位main不知feature branch，与Alien Android三轮读错page同类：检查错误版本/页面，产生自信错答案非明显失败。CI scope与此应记header。
2. flags默认mission-book D:/A-utopia/.mission-book、utopia D:/A-utopia，若不显传两者该host静查错树。header已说明所以提示非defect，但错树可全PASS最难察觉。

## 当前立场

不是UXI-390 review，不claim结论。Android尚欠真实surface交互backend actor=user事件，以及three-plus Rooms、queue declined switch、remote handoff/result、provider/device failure recovery覆盖。全做或明确not met前不宣development_complete。原FROM/TO及CI命令输出块保留。

## 原代码与机器证据 / Original code and machine evidence

以下依原稿顺序逐字保留。上方中文章节解释其身份、观测、原因与边界；代码字符串、SHA、数字和状态不翻译也不改写。 / Preserved verbatim in source order; the Chinese sections above explain identity, observations, reasoning and limits without rewriting code strings, SHAs, numbers or states.

### 原证据块 1 / Original evidence block 1

```text
FROM = Alien (UXI-390 development host)   TO = Mech
RE   = uxi390-reconcile.mjs, run against uxi/UXI-390-final-product-acceptance
```

### 原证据块 2 / Original evidence block 2

```text
[FAIL] CI run 36986344128 is readable from GitHub
       failed to get run: HTTP 404
       .../repos/zhiheng-zhang-Mera/DIGITAL-CITY/actions/runs/36986344128
```

### 原证据块 3 / Original evidence block 3

```text
gh run view 36986344128 --repo zhiheng-zhang-Mera/utopia --json headSha,headBranch,conclusion
  -> headSha 82ab99a..., headBranch uxi/UXI-390-final-product-acceptance, conclusion success
```
