# JOIN-502 — Observation receipt: real LAN acceptance on the development host

> Produced by the **Mech** development host on 2026-10-03 while developing `join/JOIN-502-nearby-discovery-approval`
> at head `86deda9c2990c78d683a8c3515d251022df9d040`. This is a **development-host receipt**, not an
> independent verification; `CONSTRUCTION_RULES.md` §3 requires the formal review to come from a
> different physical host, and that has not happened yet.

## Instrument

`.runtime/join502-live-check.mjs` — untracked, inside the City's own runtime directory. It starts **two
real gateways** on this host's real LAN interface with `discoveryEnabled: true`, lets real mDNS
advertisements leave and be heard back, then browses, identifies, asks, approves, collects and replays
against the real HTTP API. It is not part of `pnpm test`: hosted CI has no multicast, so a
real-discovery assertion there would be a flaky gate rather than evidence.

Invocation:

```powershell
$env:JOIN502_LAN_IP='172.31.12.151'; node .runtime/join502-live-check.mjs
```

Host facts at the time of the run: hostname `Mega-rep` (the Mech host), LAN IPv4 `172.31.12.151/16` on
interface `以太网`, Node `v24.14.0`.

## Verbatim output

```text
[live] cities-up: http://172.31.12.151:61770 and http://172.31.12.151:61773 on 172.31.12.151, discovery enabled on both
[live] browse: discovered 2 City/Cities: Utopia · Alien@http://172.31.12.151:61770#a40f0234-1ef5-402b-a981-fbb7696ca925, Utopia · Alien@http://172.31.12.151:61773#d9b8a872-ffd5-4d28-abca-bde4a4a7647d
[live] identity: peer http://172.31.12.151:61773 reported cityId d9b8a872-ffd5-4d28-abca-bde4a4a7647d
[live] gate-holds: request PENDING; exchange before approval -> HTTP 409
[live] approved: approve HTTP 200; exchange HTTP 200; credential authenticates -> HTTP 200, cityId d9b8a872-ffd5-4d28-abca-bde4a4a7647d
[live] spent: replay -> HTTP 410; final state CONSUMED
[live] secrets: requester claim or City credential present in the owner listing: false
{
  "ok": true,
  "lan": "172.31.12.151",
  "peer": "http://172.31.12.151:61773",
  "cityId": "d9b8a872-ffd5-4d28-abca-bde4a4a7647d",
  "steps": [ … the seven lines above, verbatim, as structured records … ]
}
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 76
```

A second run reproduced the same verdict with different ports and identities
(browse → `#a40f0234…` / `#d9b8a872…`, `ok: true`).

## What each line establishes, and what would falsify it

| Observation | Establishes | Falsifier that was checked |
|---|---|---|
| `browse: discovered 2 City/Cities` with two distinct endpoints and two distinct cityIds | a second process **really found** the published services by browsing multicast on the real interface — the client half of RF-003 that did not exist before | a run with `identify: false` returns rows without identities; the first version returned the short prefix and the receiver rejected the hand-off |
| `identity: peer … reported cityId d9b8a872…` | the pinned identity is the City's **own** statement, read over HTTP, not the mDNS prefix | the identity is fetched from `/api/v0/join/info`; a City that cannot answer is dropped, not guessed at |
| `gate-holds: exchange before approval -> HTTP 409` | **approval is a real gate**: an unapproved request releases nothing | the same exchange succeeds only after `approve` returns 200 |
| `approved: approve HTTP 200; exchange HTTP 200; credential authenticates -> HTTP 200, cityId d9b8a872…` | the released credential is the City's **existing** control credential and it genuinely authenticates against that City | the returned `cityId` is compared with the pinned one; the credential is used for an authenticated `GET /api/v0/city` |
| `spent: replay -> HTTP 410; final state CONSUMED` | one ask, one credential: collection is one-shot | a second exchange with the same claim is refused |
| `secrets: … false` | neither the requester's claim preimage nor the City credential appears in the approver's listing | the same sweep is asserted in `tests/join502-gateway.test.mjs` over the listing, the City snapshot, the persisted state file and the canonical event stream |

## The trailing libuv assertion — investigated, and reported rather than hidden

The assertion fires **after** the JSON verdict is printed. It appears only when **two** gateways with
mDNS publication are closed in the same process; a single City with `discoveryEnabled: true` closes
cleanly (run on the same host, same interface: `up http://172.31.12.151:63197` → `CLOSED_CLEANLY_ONE_CITY`,
no assertion). It is therefore a bonjour-service teardown race in the harness, not a defect in the join
path, and it does not change any observation above.

## Limits, stated plainly

- The second City ran on **this** host's LAN interface. The network path is real; the second **machine**
  is not, so workbook section 9's Alien + Mech topology is deferred to the phase integration.
- BLE is advertise-only in the current code and a browser cannot scan it; the UI says so.
- No independent review has re-run any of this.
