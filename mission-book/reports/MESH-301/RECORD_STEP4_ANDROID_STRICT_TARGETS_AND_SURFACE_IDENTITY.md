# RECORD — MESH-301 steps 2/4: Android is a real control surface on the canonical City, and it strict-targets Alien and Mech

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
CITY = http://172.31.3.110:4391   cityId 22e1216b-f124-4d4a-be4a-4a280558c027
UTOPIA = branch mesh/MESH-301-three-end @ 4271cbf
ANDROID DEVICE = BICIPVNB5HS85H9T, model PERM00, package city.utopia.control
```

## 1. What the Android device actually did, in canonical `seq` order

Everything below is read from the **City's own event stream**, not from a screenshot. The Android device
issued all three instructions itself, through the app's authenticated City connection.

```text
Android -> strict target Alien-Win    Q-fa5c5669-11c2-48da-a258-55414c7fe4ef
  seq 157 COMMAND_ACCEPTED
  seq 158 TASK_CREATED
  seq 159 TASK_ASSIGNED   assignedNodeId=Alien-Win
  seq 160 TASK_STARTED
  seq 161 TASK_CHECKPOINTED progress=30
  seq 162 TASK_CHECKPOINTED progress=75  sha256=a36b22b7…
  seq 163 TASK_COMPLETED   result={bytes:65, sha256:a36b22b7…}     targetStateAtCreation=ELIGIBLE

Android -> strict target Mech-Win     Q-cfc3912a-73d9-45bb-8f7a-70b2ba346911
  seq 164 COMMAND_ACCEPTED
  seq 165 TASK_CREATED
  seq 166 TASK_ASSIGNED   assignedNodeId=Mech-Win
  seq 167 TASK_STARTED
  seq 168 TASK_CHECKPOINTED progress=30
  seq 169 TASK_CHECKPOINTED progress=75  sha256=165afc45…
  seq 170 TASK_COMPLETED   result={bytes:65, sha256:165afc45…}     targetStateAtCreation=ELIGIBLE

Android -> UNTARGETED                 Q-4f6bc271-9d9e-40e9-9706-bde300f74950
  state=COMPLETED  targetDeviceRef=<absent>  assignedNodeId=Alien-Win
```

That closes **completion gates 4 and 7** from the Android side, and it does so with the two targets landing on
**two different physical machines** — the Alien host and the Mech host.

## 2. Android is a control client, and the City says so in its own words

```text
nodes            = Alien-Win, Mech-Win           <- Android is NOT among them
controlSurfaces  = android-PERM00 / PERM00       <- it is here instead
```

**Completion gate 3** is satisfied as a measurement rather than as a promise: the workbook forbids faking an
Android worker node, and the node list proves none was faked.

## 3. How the surfaces became visible to each other, and why this design (问题 / 选择 / 判断逻辑)

### D12 — identity is declared on the event-stream handshake, and it enters canonical truth as an event

- **问题**: the workbook requires the Android control client's `{clientIdentity, clientDisplayName = Build.MODEL}`
  to reach canonical truth, and requires all three surfaces to see what the others are doing. Nothing in the
  City recorded *which* control surfaces were attached — `CLIENT_CONNECTED` carried an empty payload.
- **选择**: the surface declares `clientRef` + `clientLabel` in the stream handshake; the City emits
  `CLIENT_CONNECTED`/`CLIENT_DISCONNECTED` carrying them, and reports live `controlSurfaces` in the snapshot.
- **判断逻辑**: "which surfaces are attached" is precisely the kind of fact three surfaces must agree on. A
  private inference from each surface's own socket state is how they start disagreeing, and it cannot be
  replayed or audited. Putting it in the event stream gives it a `seq` the three surfaces converge on;
  carrying it in the snapshot makes it readable without replaying history. An ANONYMOUS surface is still
  recorded, with nulls — omitting the event would make it invisible to the others, which is worse than
  recording that it said nothing.

Measured after the change: `seq 156 CLIENT_CONNECTED {"clientRef":"android-PERM00","clientLabel":"PERM00"}`.

### D13 — the reference is persisted; the label is not

- **问题**: which of the two is the "physical identity" and which is the "display name"?
- **选择**: `clientRef` is generated once and persisted in app-private storage; `clientLabel` is
  `Build.MODEL`.
- **判断逻辑**: the Owner's naming rule is that the display name may change while the physical machine does
  not, and the worker nodes already implement exactly that (`mesh-node-identity.mjs`). A ref derived from the
  model would make the model load-bearing, so a relabelled surface would silently become a different surface.
  Persisting the ref costs one line and keeps the two layers honest.

### D14 — the Web label is settable, because the origin cannot distinguish the two browsers

- **问题**: "Alien Web" and "Mech Web" are two browsers on two hosts loading the **same** canonical City, so
  `location.hostname` is identical for both and cannot name them.
- **选择**: the Web surface persists its own ref and takes a settable label, defaulting to a platform-derived
  name, exposed as `window.utopiaWebSurface.rename(name)`.
- **判断逻辑**: the only component that can know which browser it is, is the browser. Anything else would be
  the City guessing, and a guessed display name in canonical truth is worse than an honest default. The
  surface is renamable without becoming a different surface, which is the same rule as D13.

### D15 — Android's target choices come from the City's node list, and "Any node" stays reachable

- **选择**: a `RUN ON` row built from `snapshot.nodes`, plus `Any node`.
- **判断逻辑**: a hardcoded device name would let the surface offer a target the City does not know, which
  would turn a green test into a red one for the wrong reason. Keeping "Any node" reachable is not politeness:
  a surface that can only issue targeted work makes the untargeted regression check impossible to perform
  *from that surface*, and gate 7 is exactly that check.

## 4. A transport finding worth handing on: `adb reverse` does NOT reach this City

The first attempt pointed the app at `http://127.0.0.1:4391` through `adb reverse tcp:4391 tcp:4391` and the
app sat at `RECONNECTING`. The cause is structural, not a misconfiguration: **`adb reverse` forwards to the
host's loopback**, while this City deliberately binds an explicit LAN interface (`createGateway` refuses
`0.0.0.0` precisely so exposure cannot happen by accident). Nothing listens on the host's loopback, so the
forwarded connection has nowhere to go. `adb reverse` would need a host-side loopback→LAN relay, which is a
moving part with no benefit here.

The measured device network is `172.31.3.18/16` on `wlan0` — the **same L2 segment** as the City's
`172.31.3.110`. Pointing the app at the LAN address directly worked on the first try, so the Android surface
connects over a real LAN path and **no `adb reverse` is used in this evidence at all**. Note also that
`ping 172.31.3.110` from the device fails with 100% loss while TCP works: the host's firewall admits
`node.exe` on TCP and drops ICMP. **A ping-based reachability check on this pair of hosts produces a false
negative** — which is the same class of instrument defect recorded in the step-5 report.

## 5. What this does NOT establish

- **Mech Web has not been exercised.** There is no receipt from a browser on the Mech host. Only the Alien
  host's browser is a candidate surface here, and it has not produced a receipt either.
- **The Mech → Alien direction is still missing** (step 5.2). Alien → Mech is done; the reverse needs the Mech
  host's control surface and Mech's own receipt.
- **The three-surface bounded-convergence table is not done.** The convergence instrument has been validated
  with headless probes on one host (step-5 report), but no receipt exists yet from the three REAL surfaces.
  The Android app receives every event, so it can produce one — it needs to record `seq` + observed-at per
  event and export the log. That is the next piece of work, and it is the last one before the development
  report can be handed to Mech.
- **No CI on this head yet, no merge, no Formal Review, no terminal marker.**


[阅读译本 / Reading translation](./zh-CN/RECORD_STEP4_ANDROID_STRICT_TARGETS_AND_SURFACE_IDENTITY.md)
