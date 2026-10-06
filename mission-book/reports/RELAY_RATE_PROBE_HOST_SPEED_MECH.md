# relay 限流探针：把「主机够快」当成了「限流器生效」 / The relay rate-limit probe measured the host, not the limiter

2026-10-06，Mech-DS（`MEGA-REP`）。发现于 REX 集成前置测量：并集全量套件的首次运行出现第 4 个红项 `tests/relay-s1-tunnel.test.mjs:420`。 / Found during the REX integration preflight, as a fourth failure in the first full-suite run of the union.

## 缺陷 / The defect

```text
规则 / the rule      services/dev-gateway/server.mjs:93,225
  RELAY_REQUESTS_PER_SECOND = 20；同一 peer 在 1000 ms 滑动窗口内的第 21 个请求得到 429
探针 / the probe     tests/relay-s1-tunnel.test.mjs:418（原版）
  for (let i = 0; i < 30; i += 1) results.push(await peer.request('/api/v0/join/info', {}, { method: 'GET' }));
  assert.ok(results.some(r => r.status === 429), 'a sustained burst is refused with 429 rather than served');
```

顺序 `await` 意味着这个断言只有在**前 21 次往返平均快于约 48 ms** 时才成立。主机一忙（全量套件、繁忙 CI），窗口在请求之间被重新填满，于是断言失败——而限流器完全正常。**它把「主机是否足够快」测成了「限流器是否生效」。** / Awaiting each round-trip means the assertion only holds while the first 21 average under ~48 ms. On a loaded host the window refills and the probe fails while the limiter works. It measures host speed and calls it product behaviour.

代价不只是噪音：它会给并集/集成一次**假的红**，而本系列已经为这类混淆花过多轮。 / The cost is a false red on an integration run, which this programme has spent rounds untangling before.

## 现场证据与它的限度 / The in-situ evidence, and its limit

```text
2026-10-06  并集（main + 已接受 803 + 已接受 804）首次全量：1407 项中 4 红，含本项；同一次提交重跑：3 红（本项消失）
            main 基线单独全量：1359 项中 3 红（正是同样三个 host-city-launcher）
            并集未改动 tests/relay-s1-tunnel.test.mjs，也未改动 relayRate / RELAY_REQUESTS_PER_SECOND / executeRelayPayload
            —— 逐行比对与 main 相同
```

**我无法按需复现它。** 12 个 CPU 占满进程下跑 6 次：0 次失败；并发跑一个完整全量套件的同时再跑 6 次：0 次失败。如实记录这一限度，而不是把它含糊成“已复现的脆弱性”。 / I could not reproduce it on demand: 0/6 with 12 CPU burners, 0/6 with a concurrent full suite. Recorded plainly rather than blurred into "a reproduced fragility".

## 于是改为直接证明耦合关系 / So the coupling was proved directly

既然不能靠“让主机变慢”来复现，就去掉混淆变量：**同一个限流器、同一个 helper、同样的注入延迟，只改发送纪律**。注入每次请求 60 ms 延迟，是「主机往返约 60 ms」的确定性替身——它不忽快忽慢，因此可重复。 / Instead of a busy host, a fixed injected latency: same limiter, same helper, only the sending discipline differs.

```text
CONTROL   （顺序 await，60 ms 延迟）      0 refusals / 30 requests    <- 原断言在这里必然失败
TREATMENT （并发突发，同样 60 ms 延迟）   10 refusals / 30 requests   <- 30 个请求在 0 ms 内写完
两次运行数字完全一致 / repeated twice with identical numbers
随后修复后的探针在本机连跑 10 次：0 次失败
```

即：**旧断言在“每次往返约 60 ms”的条件下必然给出假红，而限流器同一时刻工作正常**；新做法把突发真的作为突发发出（所有请求在任何应答被 await 之前就已写入管道），因此不再依赖往返延迟。 / The old assertion necessarily produces a false red at ~60 ms per round-trip while the limiter works; sending the burst as a burst removes the dependence.

实验脚本是一次性的（`.scratch` 名字、跑完即删、不进提交）；本节记录保留其方法与数字。 / The experiment file was scratch and was deleted; this record keeps its method and numbers.

## 修复 / The repair

`repair/mech-relay-rate-probe-burst`（建在当前 main `b06504f` 之上）：既有的三段断言（无 ref 无凭据必须 403、版本不符必须 409、突发必须 429）一字未改，只改“怎么发这个突发”，并在失败信息里报告发送跨度，让“前提不成立”与“产品有问题”不再混为一谈。 / The three product assertions are unchanged; only the sending discipline and the failure message changed.

状态 / status：**已验证、待采纳的提案**。本机对 JOIN 系列无合并授权；relay/JOIN 的记录持有人决定是否采纳。它同时也让 REX 集成的前置测量不再产生这条假红。 / A verified proposal awaiting adoption by the JOIN record holder; it also stops the REX integration preflight from producing this false red.


---

语言读本 / Reading translation: [English](en/RELAY_RATE_PROBE_HOST_SPEED_MECH.md). 本文件保留原始状态与证据权威 / This source remains authoritative for status and evidence.
