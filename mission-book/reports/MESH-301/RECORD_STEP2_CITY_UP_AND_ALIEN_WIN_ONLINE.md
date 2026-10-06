# RECORD — MESH-301 Step 2: the canonical City is up, and this host is online as `Alien-Win`

```text
FROM = Alien (development host of MESH-301; endpoint B-adjacent worker node + owner of the Android control client)
TO   = Owner, Mech
RE   = MESH-301 step 2 (one canonical City shared by three control surfaces) — first executable step
STATE = canonical City RUNNING; Alien worker node ONLINE; Mech endpoint NOT YET JOINED (needs the token relay)
```

No token value appears in this file, in any screenshot, or in Git. That is a hard constraint of the workbook and
it is honoured here by construction: everything below names *which* credential is needed, never *what* it is.

## 1. What is now measurably true

```text
canonical City endpoint   http://172.31.3.110:4391     (claim-time LAN measurement of THIS host, not a constant)
cityId                    22e1216b-f124-4d4a-be4a-4a280558c027
process start             2026-10-03T02:46:50Z  (2026-10-03 12:46:50 +10:00)
health                    GET /api/v0/health -> 200, status=healthy
node count                1
  id                = Alien-Win
  devicePrincipalId = Alien-Win
  displayName       = Alien-Win
  online            = true
  capabilities      = ["task.execute.safe","filesystem.temp"]
```

`id == devicePrincipalId == displayName` on this node, which is the shape MESH-301 needs: the **stable physical
identity** (`id`, `devicePrincipalId`) is `Alien-Win` and only `displayName` is the movable label. The node was
started from this task's branch, so the naming rule is exercised by code, not asserted by a record — that is the
defect Mech measured against the earlier kickoff record, and it is now closed on `mesh/MESH-301-three-end`.

## 2. Decisions taken where MESH-301 did not specify (~ 问题 / 选择 / 判断逻辑)

The workbook fixes the topology and the constraints but not the operational details below. Each was decided by
choosing the option that keeps the three-end property *testable* and keeps the secret *out of the record*.

### D1 — The node credential must differ from the control credential; derived by convention

- **问题**: the gateway refuses to start when `CITY_TOKEN === CITY_NODE_TOKEN`, but the Owner specified a single
  value. So the node needs a distinct second secret and nothing says how to form it.
- **选择**: node credential = the Owner's value with a `-node` suffix; control credential = the Owner's value
  verbatim.
- **判断逻辑**: the Owner's value is preserved exactly where the Owner will look for it (the control surface),
  the derived value is a pure function of it (so the Owner relays one pair, not two unrelated secrets), and the
  derivation is recorded here by *rule* rather than by value so the record stays leak-free. The alternative —
  asking the Owner for a second value — would burn a round of the credential's 1-hour life for no gain.

### D2 — Who measures the endpoint address, and when

- **问题**: the City URL must be known to two other machines, but MESH-301 forbids hardcoding an address and the
  two hosts are on different subnets of the same LAN.
- **选择**: the address is measured at claim/start time on the host that runs the City and is published in this
  record as a *measurement with a timestamp*, not as a constant.
- **判断逻辑**: this is exactly the rule the workbook imposes (claim-time route measurement). Publishing a
  measured value with its provenance lets Mech detect a mismatch instead of silently failing to reach a stale
  address. If the address changes, this record is superseded rather than edited.

### D3 — How the Owner's "valid for 1 hour" is honoured, given the product has no bearer-token TTL

- **问题**: the gateway's credential is a process-level secret with **no expiry**; only pairing *sessions* carry
  a TTL (`POST /api/v0/pairing/session`, default 300 000 ms). The Owner nonetheless set a 1-hour validity.
- **选择**: treat the 1-hour window as an **operational** (not enforced) window: `2026-10-03T02:46:50Z` →
  `2026-10-03T03:46:50Z`, and rotate by *starting a new City on a new port with a new credential* when it
  lapses. The running City is not patched to add an expiry.
- **判断逻辑**: a bearer credential whose only carrier is an environment variable cannot be honestly "expired"
  by policy alone — the honest expiry is to stop honouring it and stand up a new one. Adding a TTL to the
  gateway would be a product change to satisfy a scheduling preference, which §9 (no make-work) forbids. The
  cost of rotation is one restart; the benefit is that no secret outlives the Owner's window.
- **可行性检查**: the node agent talks to `/api/v0/node/*` with `Bearer <node credential>` and does **not**
  use the pairing-session flow at all (measured in `agents/reference-node/agent.mjs`), so Mech does not need a
  pairing session, a QR payload, or a short code. It needs the URL and the node credential.

### D4 — Binding the City to the LAN address rather than to loopback

- **问题**: a loopback-bound City would satisfy this host and make the three-end claim a lie.
- **选择**: bind to the host's LAN address and serve the control surface on the same port.
- **判断逻辑**: the two-end predecessor task (UXI-391) was accepted on real dual-host transfer, and the failure
  mode to avoid is silently re-running it loopback-only. Binding to the LAN address makes "Mech is really on
  this City" falsifiable by Mech itself in one request.

## 3. Operational finding worth handing to Mech: the 409

A control-surface read (`GET /api/v0/nodes`) rejects a request that omits the protocol headers with
**409 `Protocol mismatch: apiVersion=0 and schemaVersion=0 required`**, and with **401** if the credential is
wrong. Every read from any of the three control surfaces must send:

```text
Authorization:          Bearer <control credential>
x-city-api-version:     0
x-city-schema-version:  0
```

This is recorded because it is a *false negative generator*: a probe that omits the version headers looks like
"the City is not answering the nodes route" rather than "the probe is malformed". Two of my own probes failed
this way before the header set was read out of `services/dev-gateway/server.mjs:68`. Mech's reachability check
must send all three or it will wrongly conclude the port is closed.

## 4. What Mech needs, and there is a hazard in it

```text
CITY_URL           = http://172.31.3.110:4391
CITY_NODE_TOKEN    = <the node credential — Owner relays it privately, never through the repo>
CITY_NODE_ID       = Mech-Win          <-- MUST be set explicitly, see the hazard
node script        = scripts/uxi391-node.mjs   (branch mesh/MESH-301-three-end @ e908f82)
```

- **Hazard**: the machine-side default identity in `scripts/mesh-node-identity.mjs` is **`Alien-Win`**. A host
  that starts the launcher without naming itself will therefore register as `Alien-Win`, and the City would
  then report two nodes with the same `devicePrincipalId` — a silent corruption of the very property (stable
  physical identity) this task exists to prove. Mech must pass `CITY_NODE_ID=Mech-Win` (or `--id Mech-Win`).
- **判断逻辑 for keeping the default as `Alien-Win`**: the Owner's rule names this machine's default explicitly
  and the launcher is per-machine; making the default "no default, must be named" would be arguably safer but
  would contradict the Owner's stated rule and the already-passing unit tests. The hazard is therefore handled
  by *instruction and verification* (the City must show exactly one `Mech-Win` and one `Alien-Win`), not by
  changing the naming contract. If Mech prefers the fail-closed default, that is a design change to propose,
  not one for me to make unilaterally mid-run.

## 5. What I am NOT claiming

- **Not** claiming three-end connectivity. As of this record the City holds **one** node. A one-node City is not
  a three-end mesh and I will not describe it as one.
- **Not** claiming Android is a worker node. Per MESH-301 it is a **control client**, and it is not in the node
  list, by design.
- **Not** claiming Mech has joined. Mech's own record says it brought a City up on **its** port 4641; that is
  Mech proving the launcher, not Mech joining *this* City. The three endpoints share one canonical City only
  once Mech registers here.

## 6. Open item, and it is the only thing blocking progress

**Delivery of the node credential to Mech.** MESH-301 forbids the token entering reports, screenshots or Git.
Owner ruling: the Owner relays it privately. Until Mech has it, step 2 cannot complete, and I will not
substitute a loopback stand-in for Mech's endpoint.

**Process note, recorded because the guard is the point.** The first draft of §2/D1 quoted the Owner's control
value verbatim inside the sentence explaining the derivation rule. A mechanical scan of the staged file for the
literal value caught it before the commit was pushed, the value was replaced by the word "value", and the
commit was amended. No secret reached the remote. The lesson is the one this task keeps re-teaching: a rule
stated in a document ("the token must not enter the report") is not a control; a scan that can fail is.

## 7. Next

1. Owner relays the credential pair to Mech (control value + node value).
2. Mech verifies reachability with a correctly-headed probe (§3), then joins with `CITY_NODE_ID=Mech-Win`.
3. Alien verifies the City lists exactly two nodes — `Alien-Win`, `Mech-Win` — with distinct
   `devicePrincipalId`s, and only then proceeds to the three control surfaces, the Android control-client
   identity, strict target routing, and the bounded-convergence checks.


[阅读译本 / Reading translation](./zh-CN/RECORD_STEP2_CITY_UP_AND_ALIEN_WIN_ONLINE.md)
