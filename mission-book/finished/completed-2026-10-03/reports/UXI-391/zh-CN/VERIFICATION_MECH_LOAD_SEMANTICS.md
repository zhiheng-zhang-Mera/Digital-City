# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../VERIFICATION_MECH_LOAD_SEMANTICS.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# VERIFICATION — Mech：gate2五维load与partialtelemetry，以自身inputs核验

```text
FROM = Mech (review host)   GATE = 2, "five-dimensional load semantics consistent with code and tests"
TREE = 269aa969a285b78283ed6f7bd3b0cf432cfdcbd9
RESULT = PASS 20/20
```

记录释义：Mech Review，精确tree如原块，gate2 code/tests五维load语义一致，PASS20/20。

Dispatch要求非作者fixture，因此translation用 **我选边界**，pressure用 **我选数字**，pipeline用 **真实node**。

## A. 自选translation边界，9/9

```text
[PASS] 0% cpu is ACCEPTED as an observed zero, not discarded as falsy          -> {"cpu":0}
[PASS] 100% cpu is ACCEPTED (upper boundary inclusive)                        -> {"cpu":1}
[PASS] 101% is REFUSED rather than clamped or trusted                         -> null
[PASS] a negative cpu is REFUSED                                              -> null
[PASS] a STRING cpu is REFUSED (not coerced)                                  -> null
[PASS] memory with totalBytes 0 is REFUSED rather than dividing by zero       -> null
[PASS] memory with used > total is REFUSED                                    -> null
[PASS] telemetry reporting ONLY gpu yields NO vector - nothing is invented    -> null
[PASS] real-shaped telemetry yields EXACTLY cpu+memory, never zero-filled     -> {"cpu":0.5,"memory":0.25}
```

完整断言释义：cpu0%接受真实零非falsy丢弃；100%上界包含；101%、负数、string拒绝不clamp/coerce；memorytotal0拒绝非除零、used>total拒绝；仅gpu不产vector、不发明；真实形状精确cpu0.5/memory0.25、不填其他零。0/100重要，falsy会丢idle测量，包含上界区分saturated与impossible。

## B. Partialvector pressure，6/6

```text
[PASS] one observed dimension is KNOWN, because the policy minimum is 1        known=true pressure=0.9
[PASS] unobserved dimensions are NAMED rather than silently zeroed             missing=["memory","gpu","io","network"]
[PASS] the vector is marked PARTIAL                                            partial=true
[PASS] a saturated dimension BINDS: idle ones do not dilute it                 binding=cpu pressure=0.9 mean=0.220
[PASS] an EMPTY vector is UNKNOWN, not idle                                    known=false pressure=null missing=5/5
[PASS] the fleet really has FIVE dimensions                                    ["cpu","memory","gpu","io","network"]
```

完整释义：一observeddimension因minimum1为KNOWN，pressure0.9；未测memory/gpu/io/network具名不零填，标PARTIAL；saturated绑定cpu0.9、mean0.220不稀释；emptyUNKNOWN非idle，nullpressure、5/5missing；fleet确五dimensions。

Binding非averaging是实质：cpu0.9另四0.05应pressure0.9非0.22，average会schedule饱和device。

## C. 在线pipeline真实node，5/5及观察

```text
[PASS] a real node reporting real telemetry yields a load vector                {"memory":0.5715}
[PASS] it carries at least one REAL dimension and NONE the node never sends
[PASS] every dimension present came from telemetry the node actually reported
[PASS] the fleet judges it with unobserved dimensions named                     known=true partial=true
[PASS] the judgement never claims a full five-dimension reading                 observed 1 of 5

OBSERVATION: the live node's raw cpu field was {"usagePercent": null}
```

完整释义：真实telemetry生成memory0.5715vector；至少一真实dimension、无node未发送项；每项来自真实report；fleetKNOWN/PARTIAL且具名unobserved；仅1/5、不称全五。Rawcpu usagePercent null。

**Referencecpu间歇缺失**，loadFromTelemetry拒绝非coerce，降memory-only仍KNOWN因minimum1，erratum诚实行为由真实telemetry非fixture确认。

**也是作者dualhost失败机制**：Bscript cpu finite OR memory finite断言在 **cpu null** 时仅memory便过，误以alternate已ready、太早decline。

**自身首尝试纠正**：原断言livevector必须cpu/memory两者、失败，是我猜设计非承诺。Rawreading解释。现测真实保证，保留被取代版本不悄换。

## 未覆盖

Gate6原surface/UIresultreturn不覆盖；gate11POST_COMPLETION_REENTRY是step7未存在deliverable，pending非verified。

## 证据

mission-book/reports/UXI391/review-by-mech/load-semantics-by-mech.json，livevector/pressure/fivedimensions/全部assertions。
