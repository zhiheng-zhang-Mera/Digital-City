> English reading translation / 英文阅读译本. The [source document](../RELAY_RATE_PROBE_HOST_SPEED_MECH.md) remains authoritative for historical facts, status, and evidence. This reader grants no additional task, acceptance, merge, or deployment authority.

# The relay rate-limit probe measured host speed as limiter effectiveness

2026-10-06, Mech-DS (`MEGA-REP`). Found during the REX integration preflight: the first full-suite run of the union produced a fourth failure at `tests/relay-s1-tunnel.test.mjs:420`.

## The defect
```text
规则 / the rule      services/dev-gateway/server.mjs:93,225
  RELAY_REQUESTS_PER_SECOND = 20；同一 peer 在 1000 ms 滑动窗口内的第 21 个请求得到 429
探针 / the probe     tests/relay-s1-tunnel.test.mjs:418（原版）
  for (let i = 0; i < 30; i += 1) results.push(await peer.request('/api/v0/join/info', {}, { method: 'GET' }));
  assert.ok(results.some(r => r.status === 429), 'a sustained burst is refused with 429 rather than served');
```

Sequential `await` means this assertion holds only when **the first 21 round-trips average faster than approximately 48 ms**. When the host is busy (a full suite or loaded CI), the window refills between requests, so the assertion fails while the limiter remains completely normal. **It measures whether the host is fast enough and calls it whether the limiter works.**

The cost is more than noise: it produces a **false failure** for the union or integration, and this programme has already spent multiple rounds untangling this kind of confusion.

## In-situ evidence and its limit
```text
2026-10-06  并集（main + 已接受 803 + 已接受 804）首次全量：1407 项中 4 红，含本项；同一次提交重跑：3 红（本项消失）
            main 基线单独全量：1359 项中 3 红（正是同样三个 host-city-launcher）
            并集未改动 tests/relay-s1-tunnel.test.mjs，也未改动 relayRate / RELAY_REQUESTS_PER_SECOND / executeRelayPayload
            —— 逐行比对与 main 相同
```

**I could not reproduce it on demand.** Six runs with 12 CPU-saturating processes: zero failures. Another six runs alongside a complete full suite: zero failures. This limit is recorded honestly rather than blurred into “a reproduced fragility.”

## Proving the coupling directly instead
Since slowing down the host could not reproduce it, remove the confounding variable: **the same limiter, the same helper, the same injected delay, changing only the sending discipline**. Injecting a 60 ms delay for each request is a deterministic substitute for approximately 60 ms host round-trips: it does not fluctuate and is therefore reproducible.

```text
CONTROL   （顺序 await，60 ms 延迟）      0 refusals / 30 requests    <- 原断言在这里必然失败
TREATMENT （并发突发，同样 60 ms 延迟）   10 refusals / 30 requests   <- 30 个请求在 0 ms 内写完
两次运行数字完全一致 / repeated twice with identical numbers
随后修复后的探针在本机连跑 10 次：0 次失败
```

Thus, **the old assertion necessarily produces a false failure under approximately 60 ms round-trips while the limiter works normally at the same time**. The new approach actually sends a burst as a burst: all requests are written into the pipeline before any response is awaited, so it no longer depends on round-trip latency.

The experiment script was disposable (a `.scratch` name, deleted after execution, excluded from commits); this section preserves its method and numbers.

## The repair
`repair/mech-relay-rate-probe-burst` (built on current main `b06504f`): the three existing assertions are unchanged word for word—no ref and no credentials must return 403, a version mismatch must return 409, and a burst must return 429. Only how the burst is sent changes. Failure messages report the sending span, distinguishing an unmet premise from a product defect.

Status: **a verified proposal awaiting adoption**. This host has no merge authority over the JOIN series; the relay/JOIN record holder decides whether to adopt it. It also prevents the REX integration preflight from producing this false failure.
